from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    dashboard_stats, cds_check_interaction,
    RoleViewSet, CCUserViewSet, StaffProfileViewSet,
    PatientViewSet, EmergencyContactViewSet, PatientAllergyViewSet,
    ClinicalEncounterViewSet, VitalSignViewSet, ClinicalDiagnosisViewSet,
    CPOEOrderViewSet, CPOEOrderItemViewSet,
    MedicationCatalogViewSet, PrescriptionViewSet, PrescriptionItemViewSet, MedicationAdministrationViewSet,
    LabTestCatalogViewSet, LabOrderViewSet, LabResultViewSet,
    ImagingStudyViewSet, ImagingReportViewSet,
    CDSRuleViewSet, CDSAlertViewSet,
    AppointmentViewSet, PortalMessageViewSet, PatientHealthDocumentViewSet,
    FHIRResourceViewSet, SystemAuditLogViewSet
)

router = DefaultRouter()
router.register(r'roles', RoleViewSet, basename='roles')
router.register(r'users', CCUserViewSet, basename='users')
router.register(r'staff-profiles', StaffProfileViewSet, basename='staff-profiles')
router.register(r'patients', PatientViewSet, basename='patients')
router.register(r'emergency-contacts', EmergencyContactViewSet, basename='emergency-contacts')
router.register(r'patient-allergies', PatientAllergyViewSet, basename='patient-allergies')
router.register(r'encounters', ClinicalEncounterViewSet, basename='encounters')
router.register(r'vital-signs', VitalSignViewSet, basename='vital-signs')
router.register(r'diagnoses', ClinicalDiagnosisViewSet, basename='diagnoses')
router.register(r'cpoe-orders', CPOEOrderViewSet, basename='cpoe-orders')
router.register(r'cpoe-items', CPOEOrderItemViewSet, basename='cpoe-items')
router.register(r'medications', MedicationCatalogViewSet, basename='medications')
router.register(r'prescriptions', PrescriptionViewSet, basename='prescriptions')
router.register(r'prescription-items', PrescriptionItemViewSet, basename='prescription-items')
router.register(r'administrations', MedicationAdministrationViewSet, basename='administrations')
router.register(r'lab-tests', LabTestCatalogViewSet, basename='lab-tests')
router.register(r'lab-orders', LabOrderViewSet, basename='lab-orders')
router.register(r'lab-results', LabResultViewSet, basename='lab-results')
router.register(r'imaging-studies', ImagingStudyViewSet, basename='imaging-studies')
router.register(r'imaging-reports', ImagingReportViewSet, basename='imaging-reports')
router.register(r'cds-rules', CDSRuleViewSet, basename='cds-rules')
router.register(r'cds-alerts', CDSAlertViewSet, basename='cds-alerts')
router.register(r'appointments', AppointmentViewSet, basename='appointments')
router.register(r'portal-messages', PortalMessageViewSet, basename='portal-messages')
router.register(r'health-documents', PatientHealthDocumentViewSet, basename='health-documents')
router.register(r'fhir-resources', FHIRResourceViewSet, basename='fhir-resources')
router.register(r'audit-logs', SystemAuditLogViewSet, basename='audit-logs')

urlpatterns = [
    path('dashboard/stats/', dashboard_stats, name='dashboard-stats'),
    path('cds/check-interaction/', cds_check_interaction, name='cds-check-interaction'),
    path('', include(router.urls)),
]
