from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from django.db.models import Q, Count
import json

from .models import (
    Role, CCUser, StaffProfile, Patient, EmergencyContact, PatientAllergy,
    ClinicalEncounter, VitalSign, ClinicalDiagnosis, CPOEOrder, CPOEOrderItem,
    MedicationCatalog, Prescription, PrescriptionItem, MedicationAdministration,
    LabTestCatalog, LabOrder, LabResult, ImagingStudy, ImagingReport,
    CDSRule, CDSAlert, Appointment, PortalMessage, PatientHealthDocument,
    FHIRResource, SystemAuditLog
)

from .serializers import (
    RoleSerializer, CCUserSerializer, StaffProfileSerializer,
    PatientSerializer, EmergencyContactSerializer, PatientAllergySerializer,
    ClinicalEncounterSerializer, VitalSignSerializer, ClinicalDiagnosisSerializer,
    CPOEOrderSerializer, CPOEOrderItemSerializer, MedicationCatalogSerializer,
    PrescriptionSerializer, PrescriptionItemSerializer, MedicationAdministrationSerializer,
    LabTestCatalogSerializer, LabOrderSerializer, LabResultSerializer,
    ImagingStudySerializer, ImagingReportSerializer, CDSRuleSerializer,
    CDSAlertSerializer, AppointmentSerializer, PortalMessageSerializer,
    PatientHealthDocumentSerializer, FHIRResourceSerializer, SystemAuditLogSerializer
)

# ----------------- Dashboard & Analytics -----------------
@api_view(['GET'])
def dashboard_stats(request):
    total_patients = Patient.objects.count()
    total_encounters = ClinicalEncounter.objects.count()
    active_prescriptions = Prescription.objects.filter(status='ACTIVE').count()
    pending_lab_orders = LabOrder.objects.exclude(status='COMPLETED').count()
    active_cds_alerts = CDSAlert.objects.count()
    upcoming_appointments = Appointment.objects.filter(status__in=['SCHEDULED', 'CONFIRMED']).count()
    recent_patients = PatientSerializer(Patient.objects.order_by('-id')[:5], many=True).data
    recent_encounters = ClinicalEncounterSerializer(ClinicalEncounter.objects.order_by('-id')[:5], many=True).data
    recent_alerts = CDSAlertSerializer(CDSAlert.objects.order_by('-id')[:5], many=True).data

    return Response({
        'total_patients': total_patients,
        'total_encounters': total_encounters,
        'active_prescriptions': active_prescriptions,
        'pending_lab_orders': pending_lab_orders,
        'active_cds_alerts': active_cds_alerts,
        'upcoming_appointments': upcoming_appointments,
        'recent_patients': recent_patients,
        'recent_encounters': recent_encounters,
        'recent_alerts': recent_alerts
    })

# ----------------- CDS Evaluation Engine -----------------
@api_view(['POST'])
def cds_check_interaction(request):
    """
    Evaluates medication conflict against known patient allergies and concurrent drugs
    """
    patient_id = request.data.get('patient_id')
    drug_name = request.data.get('drug_name', '')
    warnings = []

    if patient_id:
        allergies = PatientAllergy.objects.filter(patient_id=patient_id, status='ACTIVE')
        for allergy in allergies:
            if allergy.allergen_name.lower() in drug_name.lower() or ('penicillin' in allergy.allergen_name.lower() and 'augmentin' in drug_name.lower()):
                warnings.append({
                    'type': 'ALLERGY_ALERT',
                    'severity': 'CRITICAL',
                    'message': f"Critical Allergy Conflict: Patient is severely allergic to '{allergy.allergen_name}'. Prescribing '{drug_name}' may cause {allergy.reaction}."
                })

        # Check existing active prescriptions for interaction
        active_rx_items = PrescriptionItem.objects.filter(prescription__patient_id=patient_id, prescription__status='ACTIVE')
        for rx_item in active_rx_items:
            existing_med = rx_item.medication.brand_name.lower()
            if ('aspirin' in drug_name.lower() and 'clexane' in existing_med) or ('clexane' in drug_name.lower() and 'aspirin' in existing_med):
                warnings.append({
                    'type': 'DRUG_INTERACTION',
                    'severity': 'CRITICAL',
                    'message': "Severe Hemorrhage Risk: Co-prescribing Aspirin and Enoxaparin (Clexane) sharply increases major bleeding risk."
                })
            if ('ibuprofen' in drug_name.lower() and 'telma' in existing_med) or ('telma' in drug_name.lower() and 'combiflam' in existing_med):
                warnings.append({
                    'type': 'DRUG_INTERACTION',
                    'severity': 'HIGH',
                    'message': "Renal & BP Blunting Warning: NSAID + ARB combination can precipitate acute kidney injury."
                })

    return Response({
        'safe': len(warnings) == 0,
        'warnings': warnings
    })

# ----------------- User Management & Roles -----------------
class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer

class CCUserViewSet(viewsets.ModelViewSet):
    queryset = CCUser.objects.all()
    serializer_class = CCUserSerializer

    @action(detail=False, methods=['GET'])
    def doctors(self, request):
        docs = CCUser.objects.filter(role__role_code='DOCTOR')
        return Response(CCUserSerializer(docs, many=True).data)

class StaffProfileViewSet(viewsets.ModelViewSet):
    queryset = StaffProfile.objects.all()
    serializer_class = StaffProfileSerializer

# ----------------- Patient Registration -----------------
class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all().order_by('-id')
    serializer_class = PatientSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        search = self.request.query_params.get('search', None)
        if search:
            qs = qs.filter(
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search) |
                Q(uhid__icontains=search) |
                Q(phone__icontains=search) |
                Q(city__icontains=search)
            )
        return qs

class EmergencyContactViewSet(viewsets.ModelViewSet):
    queryset = EmergencyContact.objects.all()
    serializer_class = EmergencyContactSerializer

class PatientAllergyViewSet(viewsets.ModelViewSet):
    queryset = PatientAllergy.objects.all()
    serializer_class = PatientAllergySerializer

# ----------------- Clinical Documentation -----------------
class ClinicalEncounterViewSet(viewsets.ModelViewSet):
    queryset = ClinicalEncounter.objects.all().order_by('-id')
    serializer_class = ClinicalEncounterSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        patient_id = self.request.query_params.get('patient', None)
        if patient_id:
            qs = qs.filter(patient_id=patient_id)
        return qs

class VitalSignViewSet(viewsets.ModelViewSet):
    queryset = VitalSign.objects.all().order_by('-id')
    serializer_class = VitalSignSerializer

class ClinicalDiagnosisViewSet(viewsets.ModelViewSet):
    queryset = ClinicalDiagnosis.objects.all().order_by('-id')
    serializer_class = ClinicalDiagnosisSerializer

# ----------------- CPOE Orders -----------------
class CPOEOrderViewSet(viewsets.ModelViewSet):
    queryset = CPOEOrder.objects.all().order_by('-id')
    serializer_class = CPOEOrderSerializer

class CPOEOrderItemViewSet(viewsets.ModelViewSet):
    queryset = CPOEOrderItem.objects.all()
    serializer_class = CPOEOrderItemSerializer

# ----------------- Medication Management -----------------
class MedicationCatalogViewSet(viewsets.ModelViewSet):
    queryset = MedicationCatalog.objects.all()
    serializer_class = MedicationCatalogSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        search = self.request.query_params.get('search', None)
        if search:
            qs = qs.filter(Q(brand_name__icontains=search) | Q(generic_name__icontains=search))
        return qs

class PrescriptionViewSet(viewsets.ModelViewSet):
    queryset = Prescription.objects.all().order_by('-id')
    serializer_class = PrescriptionSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        patient_id = self.request.query_params.get('patient', None)
        if patient_id:
            qs = qs.filter(patient_id=patient_id)
        return qs

class PrescriptionItemViewSet(viewsets.ModelViewSet):
    queryset = PrescriptionItem.objects.all()
    serializer_class = PrescriptionItemSerializer

class MedicationAdministrationViewSet(viewsets.ModelViewSet):
    queryset = MedicationAdministration.objects.all().order_by('-id')
    serializer_class = MedicationAdministrationSerializer

# ----------------- Lab & Imaging -----------------
class LabTestCatalogViewSet(viewsets.ModelViewSet):
    queryset = LabTestCatalog.objects.all()
    serializer_class = LabTestCatalogSerializer

class LabOrderViewSet(viewsets.ModelViewSet):
    queryset = LabOrder.objects.all().order_by('-id')
    serializer_class = LabOrderSerializer

class LabResultViewSet(viewsets.ModelViewSet):
    queryset = LabResult.objects.all().order_by('-id')
    serializer_class = LabResultSerializer

class ImagingStudyViewSet(viewsets.ModelViewSet):
    queryset = ImagingStudy.objects.all().order_by('-id')
    serializer_class = ImagingStudySerializer

class ImagingReportViewSet(viewsets.ModelViewSet):
    queryset = ImagingReport.objects.all().order_by('-id')
    serializer_class = ImagingReportSerializer

# ----------------- CDS -----------------
class CDSRuleViewSet(viewsets.ModelViewSet):
    queryset = CDSRule.objects.all()
    serializer_class = CDSRuleSerializer

class CDSAlertViewSet(viewsets.ModelViewSet):
    queryset = CDSAlert.objects.all().order_by('-id')
    serializer_class = CDSAlertSerializer

# ----------------- Patient Portal -----------------
class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all().order_by('-id')
    serializer_class = AppointmentSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        patient_id = self.request.query_params.get('patient', None)
        if patient_id:
            qs = qs.filter(patient_id=patient_id)
        return qs

class PortalMessageViewSet(viewsets.ModelViewSet):
    queryset = PortalMessage.objects.all().order_by('-id')
    serializer_class = PortalMessageSerializer

class PatientHealthDocumentViewSet(viewsets.ModelViewSet):
    queryset = PatientHealthDocument.objects.all().order_by('-id')
    serializer_class = PatientHealthDocumentSerializer

# ----------------- Interoperability & Audit -----------------
class FHIRResourceViewSet(viewsets.ModelViewSet):
    queryset = FHIRResource.objects.all().order_by('-id')
    serializer_class = FHIRResourceSerializer

class SystemAuditLogViewSet(viewsets.ModelViewSet):
    queryset = SystemAuditLog.objects.all().order_by('-id')
    serializer_class = SystemAuditLogSerializer
