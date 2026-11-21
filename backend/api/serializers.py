from rest_framework import serializers
from .models import (
    Role, CCUser, StaffProfile, Patient, EmergencyContact, PatientAllergy,
    ClinicalEncounter, VitalSign, ClinicalDiagnosis, CPOEOrder, CPOEOrderItem,
    MedicationCatalog, Prescription, PrescriptionItem, MedicationAdministration,
    LabTestCatalog, LabOrder, LabResult, ImagingStudy, ImagingReport,
    CDSRule, CDSAlert, Appointment, PortalMessage, PatientHealthDocument,
    FHIRResource, SystemAuditLog
)

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'

class StaffProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaffProfile
        fields = '__all__'

class CCUserSerializer(serializers.ModelSerializer):
    role_name = serializers.CharField(source='role.role_name', read_only=True)
    staff_profile = StaffProfileSerializer(read_only=True)

    class Meta:
        model = CCUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'role_name', 'phone_number', 'is_active', 'is_staff', 'staff_profile', 'created_at']

class EmergencyContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmergencyContact
        fields = '__all__'

class PatientAllergySerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientAllergy
        fields = '__all__'

class VitalSignSerializer(serializers.ModelSerializer):
    class Meta:
        model = VitalSign
        fields = '__all__'

class ClinicalDiagnosisSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClinicalDiagnosis
        fields = '__all__'

class PatientSerializer(serializers.ModelSerializer):
    allergies = PatientAllergySerializer(many=True, read_only=True)
    emergency_contacts = EmergencyContactSerializer(many=True, read_only=True)
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Patient
        fields = '__all__'

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"

class ClinicalEncounterSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    provider_name = serializers.SerializerMethodField()
    vitals = VitalSignSerializer(many=True, read_only=True)
    diagnoses = ClinicalDiagnosisSerializer(many=True, read_only=True)

    class Meta:
        model = ClinicalEncounter
        fields = '__all__'

    def get_patient_name(self, obj):
        return f"{obj.patient.first_name} {obj.patient.last_name} ({obj.patient.uhid})"

    def get_provider_name(self, obj):
        return f"Dr. {obj.provider.first_name} {obj.provider.last_name}"

class CPOEOrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CPOEOrderItem
        fields = '__all__'

class CPOEOrderSerializer(serializers.ModelSerializer):
    items = CPOEOrderItemSerializer(many=True, read_only=True)
    patient_name = serializers.SerializerMethodField()
    provider_name = serializers.SerializerMethodField()

    class Meta:
        model = CPOEOrder
        fields = '__all__'

    def get_patient_name(self, obj):
        return f"{obj.patient.first_name} {obj.patient.last_name}"

    def get_provider_name(self, obj):
        return f"Dr. {obj.provider.first_name} {obj.provider.last_name}"

class MedicationCatalogSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicationCatalog
        fields = '__all__'

class PrescriptionItemSerializer(serializers.ModelSerializer):
    medication_name = serializers.CharField(source='medication.brand_name', read_only=True)
    generic_name = serializers.CharField(source='medication.generic_name', read_only=True)
    strength = serializers.CharField(source='medication.strength', read_only=True)

    class Meta:
        model = PrescriptionItem
        fields = '__all__'

class PrescriptionSerializer(serializers.ModelSerializer):
    items = PrescriptionItemSerializer(many=True, read_only=True)
    patient_name = serializers.SerializerMethodField()
    doctor_name = serializers.SerializerMethodField()

    class Meta:
        model = Prescription
        fields = '__all__'

    def get_patient_name(self, obj):
        return f"{obj.patient.first_name} {obj.patient.last_name}"

    def get_doctor_name(self, obj):
        return f"Dr. {obj.doctor.first_name} {obj.doctor.last_name}"

class MedicationAdministrationSerializer(serializers.ModelSerializer):
    administered_by_name = serializers.SerializerMethodField()

    class Meta:
        model = MedicationAdministration
        fields = '__all__'

    def get_administered_by_name(self, obj):
        return f"{obj.administered_by.first_name} {obj.administered_by.last_name}"

class LabTestCatalogSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabTestCatalog
        fields = '__all__'

class LabResultSerializer(serializers.ModelSerializer):
    test_name = serializers.CharField(source='test.test_name', read_only=True)
    test_code = serializers.CharField(source='test.test_code', read_only=True)
    normal_min = serializers.DecimalField(source='test.normal_range_min', max_digits=8, decimal_places=2, read_only=True)
    normal_max = serializers.DecimalField(source='test.normal_range_max', max_digits=8, decimal_places=2, read_only=True)

    class Meta:
        model = LabResult
        fields = '__all__'

class LabOrderSerializer(serializers.ModelSerializer):
    results = LabResultSerializer(many=True, read_only=True)
    test_name = serializers.CharField(source='test.test_name', read_only=True)
    patient_name = serializers.SerializerMethodField()

    class Meta:
        model = LabOrder
        fields = '__all__'

    def get_patient_name(self, obj):
        return f"{obj.patient.first_name} {obj.patient.last_name}"

class ImagingReportSerializer(serializers.ModelSerializer):
    radiologist_name = serializers.SerializerMethodField()

    class Meta:
        model = ImagingReport
        fields = '__all__'

    def get_radiologist_name(self, obj):
        return f"Dr. {obj.radiologist.first_name} {obj.radiologist.last_name}"

class ImagingStudySerializer(serializers.ModelSerializer):
    report = ImagingReportSerializer(read_only=True)
    patient_name = serializers.SerializerMethodField()

    class Meta:
        model = ImagingStudy
        fields = '__all__'

    def get_patient_name(self, obj):
        return f"{obj.patient.first_name} {obj.patient.last_name}"

class CDSRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = CDSRule
        fields = '__all__'

class CDSAlertSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    rule_title = serializers.CharField(source='rule.title', read_only=True)

    class Meta:
        model = CDSAlert
        fields = '__all__'

    def get_patient_name(self, obj):
        return f"{obj.patient.first_name} {obj.patient.last_name}"

class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    doctor_name = serializers.SerializerMethodField()

    class Meta:
        model = Appointment
        fields = '__all__'

    def get_patient_name(self, obj):
        return f"{obj.patient.first_name} {obj.patient.last_name}"

    def get_doctor_name(self, obj):
        return f"Dr. {obj.doctor.first_name} {obj.doctor.last_name}"

class PortalMessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.SerializerMethodField()
    receiver_name = serializers.SerializerMethodField()

    class Meta:
        model = PortalMessage
        fields = '__all__'

    def get_sender_name(self, obj):
        return f"{obj.sender.first_name} {obj.sender.last_name}"

    def get_receiver_name(self, obj):
        return f"{obj.receiver.first_name} {obj.receiver.last_name}"

class PatientHealthDocumentSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()

    class Meta:
        model = PatientHealthDocument
        fields = '__all__'

    def get_patient_name(self, obj):
        return f"{obj.patient.first_name} {obj.patient.last_name}"

class FHIRResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = FHIRResource
        fields = '__all__'

class SystemAuditLogSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = SystemAuditLog
        fields = '__all__'

    def get_user_name(self, obj):
        if obj.user:
            return f"{obj.user.first_name} {obj.user.last_name} ({obj.user.username})"
        return "System"
