from django.contrib import admin
from .models import (
    Role, CCUser, StaffProfile, Patient, EmergencyContact, PatientAllergy,
    ClinicalEncounter, VitalSign, ClinicalDiagnosis, CPOEOrder, CPOEOrderItem,
    MedicationCatalog, Prescription, PrescriptionItem, MedicationAdministration,
    LabTestCatalog, LabOrder, LabResult, ImagingStudy, ImagingReport,
    CDSRule, CDSAlert, Appointment, PortalMessage, PatientHealthDocument,
    FHIRResource, SystemAuditLog
)

@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ('id', 'role_code', 'role_name', 'description')
    search_fields = ('role_code', 'role_name')

@admin.register(CCUser)
class CCUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email', 'first_name', 'last_name', 'role', 'phone_number', 'is_active')
    list_filter = ('role', 'is_active')
    search_fields = ('username', 'email', 'first_name', 'last_name')

@admin.register(StaffProfile)
class StaffProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'department', 'specialization', 'license_number', 'consultation_fee_inr')
    list_filter = ('department', 'specialization')
    search_fields = ('license_number', 'specialization', 'user__first_name', 'user__last_name')

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('uhid', 'first_name', 'last_name', 'gender', 'date_of_birth', 'blood_group', 'phone', 'city', 'state')
    list_filter = ('gender', 'blood_group', 'state')
    search_fields = ('uhid', 'first_name', 'last_name', 'phone', 'email', 'aadhaar_number')

@admin.register(EmergencyContact)
class EmergencyContactAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient', 'contact_name', 'relationship', 'phone_number', 'is_primary')
    search_fields = ('contact_name', 'phone_number', 'patient__uhid')

@admin.register(PatientAllergy)
class PatientAllergyAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient', 'allergen_name', 'allergen_type', 'severity', 'status', 'recorded_date')
    list_filter = ('allergen_type', 'severity', 'status')
    search_fields = ('allergen_name', 'patient__uhid')

@admin.register(ClinicalEncounter)
class ClinicalEncounterAdmin(admin.ModelAdmin):
    list_display = ('encounter_number', 'patient', 'provider', 'encounter_type', 'encounter_date', 'status')
    list_filter = ('encounter_type', 'status')
    search_fields = ('encounter_number', 'patient__uhid', 'patient__first_name', 'patient__last_name')

@admin.register(VitalSign)
class VitalSignAdmin(admin.ModelAdmin):
    list_display = ('id', 'encounter', 'patient', 'systolic_bp', 'diastolic_bp', 'heart_rate', 'temperature_f', 'oxygen_saturation', 'bmi', 'recorded_at')
    search_fields = ('patient__uhid',)

@admin.register(ClinicalDiagnosis)
class ClinicalDiagnosisAdmin(admin.ModelAdmin):
    list_display = ('id', 'encounter', 'patient', 'icd10_code', 'diagnosis_name', 'diagnosis_type', 'status')
    list_filter = ('diagnosis_type', 'status')
    search_fields = ('icd10_code', 'diagnosis_name', 'patient__uhid')

@admin.register(CPOEOrder)
class CPOEOrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'patient', 'provider', 'order_type', 'priority', 'order_status', 'order_date')
    list_filter = ('order_type', 'priority', 'order_status')
    search_fields = ('order_number', 'patient__uhid')

@admin.register(CPOEOrderItem)
class CPOEOrderItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'order', 'item_code', 'item_name', 'status')
    list_filter = ('status',)
    search_fields = ('item_code', 'item_name', 'order__order_number')

@admin.register(MedicationCatalog)
class MedicationCatalogAdmin(admin.ModelAdmin):
    list_display = ('drug_code', 'brand_name', 'generic_name', 'dosage_form', 'strength', 'route', 'unit_price_inr', 'is_active')
    list_filter = ('dosage_form', 'is_active')
    search_fields = ('drug_code', 'brand_name', 'generic_name')

@admin.register(Prescription)
class PrescriptionAdmin(admin.ModelAdmin):
    list_display = ('prescription_number', 'patient', 'doctor', 'prescription_date', 'status')
    list_filter = ('status',)
    search_fields = ('prescription_number', 'patient__uhid')

@admin.register(PrescriptionItem)
class PrescriptionItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'prescription', 'medication', 'dosage', 'frequency', 'duration_days', 'quantity')
    search_fields = ('prescription__prescription_number', 'medication__brand_name')

@admin.register(MedicationAdministration)
class MedicationAdministrationAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient', 'administered_by', 'dose_given', 'status', 'administered_time')
    list_filter = ('status',)
    search_fields = ('patient__uhid',)

@admin.register(LabTestCatalog)
class LabTestCatalogAdmin(admin.ModelAdmin):
    list_display = ('test_code', 'test_name', 'category', 'sample_type', 'normal_range_min', 'normal_range_max', 'unit', 'price_inr')
    list_filter = ('category',)
    search_fields = ('test_code', 'test_name')

@admin.register(LabOrder)
class LabOrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient', 'test', 'ordered_by', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('patient__uhid', 'test__test_name')

@admin.register(LabResult)
class LabResultAdmin(admin.ModelAdmin):
    list_display = ('id', 'lab_order', 'test', 'measured_value', 'unit', 'flag', 'reported_at', 'verified_by')
    list_filter = ('flag',)
    search_fields = ('test__test_name', 'lab_order__patient__uhid')

@admin.register(ImagingStudy)
class ImagingStudyAdmin(admin.ModelAdmin):
    list_display = ('accession_number', 'patient', 'modality', 'body_site', 'status', 'study_date')
    list_filter = ('modality', 'status')
    search_fields = ('accession_number', 'body_site', 'patient__uhid')

@admin.register(ImagingReport)
class ImagingReportAdmin(admin.ModelAdmin):
    list_display = ('id', 'study', 'radiologist', 'reported_at')
    search_fields = ('study__accession_number',)

@admin.register(CDSRule)
class CDSRuleAdmin(admin.ModelAdmin):
    list_display = ('rule_code', 'title', 'rule_category', 'severity_level', 'is_active')
    list_filter = ('rule_category', 'severity_level', 'is_active')
    search_fields = ('rule_code', 'title')

@admin.register(CDSAlert)
class CDSAlertAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient', 'alert_title', 'severity', 'triggered_at', 'acknowledged_by')
    list_filter = ('severity',)
    search_fields = ('alert_title', 'patient__uhid')

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('appointment_number', 'patient', 'doctor', 'appointment_date', 'time_slot', 'status', 'booking_type')
    list_filter = ('status', 'booking_type')
    search_fields = ('appointment_number', 'patient__uhid', 'patient__first_name')

@admin.register(PortalMessage)
class PortalMessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'sender', 'receiver', 'patient', 'subject', 'is_read', 'sent_at')
    list_filter = ('is_read',)
    search_fields = ('subject', 'message_body')

@admin.register(PatientHealthDocument)
class PatientHealthDocumentAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient', 'title', 'document_type', 'uploaded_at')
    list_filter = ('document_type',)
    search_fields = ('title', 'patient__uhid')

@admin.register(FHIRResource)
class FHIRResourceAdmin(admin.ModelAdmin):
    list_display = ('resource_id', 'resource_type', 'fhir_version', 'last_updated')
    list_filter = ('resource_type', 'fhir_version')
    search_fields = ('resource_id', 'resource_type')

@admin.register(SystemAuditLog)
class SystemAuditLogAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'action', 'entity_name', 'entity_id', 'ip_address', 'performed_at')
    list_filter = ('action', 'entity_name')
    search_fields = ('action', 'entity_name', 'details')
