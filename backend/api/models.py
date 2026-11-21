from django.db import models


# =====================================================================
# MODULE 9: User Management and Access Control
# =====================================================================

class Role(models.Model):
    role_code = models.CharField(max_length=30, unique=True)
    role_name = models.CharField(max_length=50)
    description = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'roles'
        managed = True

    def __str__(self):
        return f"{self.role_name} ({self.role_code})"


class CCUser(models.Model):
    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(max_length=100, unique=True)
    password_hash = models.CharField(max_length=255)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    role = models.ForeignKey(Role, on_delete=models.RESTRICT, db_column='role_id')
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'users'
        managed = True

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.username})"


class StaffProfile(models.Model):
    user = models.OneToOneField(CCUser, on_delete=models.CASCADE, db_column='user_id', unique=True)
    department = models.CharField(max_length=60)
    specialization = models.CharField(max_length=100)
    license_number = models.CharField(max_length=50, unique=True)
    qualification = models.CharField(max_length=100)
    experience_years = models.IntegerField(default=0)
    consultation_fee_inr = models.DecimalField(max_digits=10, decimal_places=2, default=500.00)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'staff_profiles'
        managed = True

    def __str__(self):
        return f"{self.specialization} - {self.user.first_name} {self.user.last_name}"


# =====================================================================
# MODULE 1: Patient Registration and Demographics
# =====================================================================

class Patient(models.Model):
    uhid = models.CharField(max_length=20, unique=True)
    user = models.OneToOneField(CCUser, on_delete=models.SET_NULL, null=True, blank=True, db_column='user_id')
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=10)
    blood_group = models.CharField(max_length=5, null=True, blank=True)
    marital_status = models.CharField(max_length=20, null=True, blank=True)
    aadhaar_number = models.CharField(max_length=12, unique=True, null=True, blank=True)
    phone = models.CharField(max_length=15)
    email = models.EmailField(max_length=100, null=True, blank=True)
    address_line1 = models.CharField(max_length=150)
    address_line2 = models.CharField(max_length=150, null=True, blank=True)
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    postal_code = models.CharField(max_length=10)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'patients'
        managed = True

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.uhid})"


class EmergencyContact(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, db_column='patient_id', related_name='emergency_contacts')
    contact_name = models.CharField(max_length=100)
    relationship = models.CharField(max_length=50)
    phone_number = models.CharField(max_length=15)
    is_primary = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'emergency_contacts'
        managed = True

    def __str__(self):
        return f"{self.contact_name} ({self.relationship}) - {self.patient.uhid}"


class PatientAllergy(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, db_column='patient_id', related_name='allergies')
    allergen_name = models.CharField(max_length=100)
    allergen_type = models.CharField(max_length=20)
    severity = models.CharField(max_length=20)
    reaction = models.CharField(max_length=255)
    recorded_date = models.DateField()
    status = models.CharField(max_length=20, default='ACTIVE')

    class Meta:
        db_table = 'patient_allergies'
        managed = True

    def __str__(self):
        return f"{self.allergen_name} [{self.severity}] - {self.patient.uhid}"


# =====================================================================
# MODULE 2: Clinical Documentation
# =====================================================================

class ClinicalEncounter(models.Model):
    encounter_number = models.CharField(max_length=30, unique=True)
    patient = models.ForeignKey(Patient, on_delete=models.RESTRICT, db_column='patient_id', related_name='encounters')
    provider = models.ForeignKey(CCUser, on_delete=models.RESTRICT, db_column='provider_id', related_name='provider_encounters')
    encounter_type = models.CharField(max_length=20, default='OPD')
    encounter_date = models.DateTimeField()
    chief_complaint = models.TextField()
    history_of_present_illness = models.TextField(null=True, blank=True)
    examination_findings = models.TextField(null=True, blank=True)
    assessment_plan = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=20, default='COMPLETED')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'clinical_encounters'
        managed = True

    def __str__(self):
        return f"{self.encounter_number} - {self.patient.first_name} {self.patient.last_name}"


class VitalSign(models.Model):
    encounter = models.ForeignKey(ClinicalEncounter, on_delete=models.CASCADE, db_column='encounter_id', related_name='vitals')
    patient = models.ForeignKey(Patient, on_delete=models.RESTRICT, db_column='patient_id')
    systolic_bp = models.IntegerField(null=True, blank=True)
    diastolic_bp = models.IntegerField(null=True, blank=True)
    heart_rate = models.IntegerField(null=True, blank=True)
    respiratory_rate = models.IntegerField(null=True, blank=True)
    temperature_f = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True)
    oxygen_saturation = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True)
    height_cm = models.DecimalField(max_digits=5, decimal_places=1, null=True, blank=True)
    weight_kg = models.DecimalField(max_digits=5, decimal_places=1, null=True, blank=True)
    bmi = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True)
    recorded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'vital_signs'
        managed = True

    def __str__(self):
        return f"Vitals BP: {self.systolic_bp}/{self.diastolic_bp} - Enc #{self.encounter_id}"


class ClinicalDiagnosis(models.Model):
    encounter = models.ForeignKey(ClinicalEncounter, on_delete=models.CASCADE, db_column='encounter_id', related_name='diagnoses')
    patient = models.ForeignKey(Patient, on_delete=models.RESTRICT, db_column='patient_id')
    icd10_code = models.CharField(max_length=15)
    diagnosis_name = models.CharField(max_length=200)
    diagnosis_type = models.CharField(max_length=20, default='PRIMARY')
    onset_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, default='ACTIVE')
    notes = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = 'clinical_diagnoses'
        managed = True

    def __str__(self):
        return f"{self.icd10_code}: {self.diagnosis_name}"


# =====================================================================
# MODULE 3: Computerized Provider Order Entry (CPOE)
# =====================================================================

class CPOEOrder(models.Model):
    order_number = models.CharField(max_length=30, unique=True)
    patient = models.ForeignKey(Patient, on_delete=models.RESTRICT, db_column='patient_id', related_name='cpoe_orders')
    provider = models.ForeignKey(CCUser, on_delete=models.RESTRICT, db_column='provider_id')
    encounter = models.ForeignKey(ClinicalEncounter, on_delete=models.CASCADE, db_column='encounter_id')
    order_type = models.CharField(max_length=20)
    priority = models.CharField(max_length=20, default='ROUTINE')
    order_date = models.DateTimeField(auto_now_add=True)
    clinical_indication = models.TextField()
    order_status = models.CharField(max_length=20, default='PLACED')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'cpoe_orders'
        managed = True

    def __str__(self):
        return f"{self.order_number} [{self.order_type}] - {self.patient.first_name}"


class CPOEOrderItem(models.Model):
    order = models.ForeignKey(CPOEOrder, on_delete=models.CASCADE, db_column='order_id', related_name='items')
    item_code = models.CharField(max_length=30)
    item_name = models.CharField(max_length=150)
    instructions = models.CharField(max_length=255, null=True, blank=True)
    status = models.CharField(max_length=20, default='PENDING')

    class Meta:
        db_table = 'cpoe_order_items'
        managed = True

    def __str__(self):
        return f"{self.item_name} ({self.status})"


# =====================================================================
# MODULE 4: Medication Management
# =====================================================================

class MedicationCatalog(models.Model):
    drug_code = models.CharField(max_length=30, unique=True)
    brand_name = models.CharField(max_length=100)
    generic_name = models.CharField(max_length=100)
    dosage_form = models.CharField(max_length=50)
    strength = models.CharField(max_length=50)
    route = models.CharField(max_length=30)
    manufacturer = models.CharField(max_length=100)
    unit_price_inr = models.DecimalField(max_digits=8, decimal_places=2, default=10.00)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'medications_catalog'
        managed = True

    def __str__(self):
        return f"{self.brand_name} ({self.generic_name} {self.strength})"


class Prescription(models.Model):
    prescription_number = models.CharField(max_length=30, unique=True)
    patient = models.ForeignKey(Patient, on_delete=models.RESTRICT, db_column='patient_id', related_name='prescriptions')
    doctor = models.ForeignKey(CCUser, on_delete=models.RESTRICT, db_column='doctor_id')
    encounter = models.ForeignKey(ClinicalEncounter, on_delete=models.CASCADE, db_column='encounter_id')
    prescription_date = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=20, default='ACTIVE')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'prescriptions'
        managed = True

    def __str__(self):
        return f"{self.prescription_number} - {self.patient.first_name} {self.patient.last_name}"


class PrescriptionItem(models.Model):
    prescription = models.ForeignKey(Prescription, on_delete=models.CASCADE, db_column='prescription_id', related_name='items')
    medication = models.ForeignKey(MedicationCatalog, on_delete=models.RESTRICT, db_column='medication_id')
    dosage = models.CharField(max_length=50)
    frequency = models.CharField(max_length=50)
    duration_days = models.IntegerField()
    instructions = models.CharField(max_length=255, null=True, blank=True)
    quantity = models.IntegerField()
    refills_allowed = models.IntegerField(default=0)

    class Meta:
        db_table = 'prescription_items'
        managed = True

    def __str__(self):
        return f"{self.medication.brand_name} - {self.frequency} x {self.duration_days}d"


class MedicationAdministration(models.Model):
    prescription_item = models.ForeignKey(PrescriptionItem, on_delete=models.CASCADE, db_column='prescription_item_id')
    patient = models.ForeignKey(Patient, on_delete=models.RESTRICT, db_column='patient_id')
    administered_by = models.ForeignKey(CCUser, on_delete=models.RESTRICT, db_column='administered_by')
    administered_time = models.DateTimeField(auto_now_add=True)
    dose_given = models.CharField(max_length=50)
    status = models.CharField(max_length=20, default='GIVEN')
    remarks = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = 'medication_administrations'
        managed = True

    def __str__(self):
        return f"Dose {self.dose_given} ({self.status}) to {self.patient.first_name}"


# =====================================================================
# MODULE 5: Lab and Imaging Integration
# =====================================================================

class LabTestCatalog(models.Model):
    test_code = models.CharField(max_length=30, unique=True)
    test_name = models.CharField(max_length=150)
    category = models.CharField(max_length=60)
    sample_type = models.CharField(max_length=50)
    normal_range_min = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    normal_range_max = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    unit = models.CharField(max_length=20, null=True, blank=True)
    price_inr = models.DecimalField(max_digits=8, decimal_places=2, default=300.00)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'lab_test_catalog'
        managed = True

    def __str__(self):
        return f"{self.test_name} ({self.category})"


class LabOrder(models.Model):
    order_item = models.ForeignKey(CPOEOrderItem, on_delete=models.SET_NULL, null=True, blank=True, db_column='order_item_id')
    patient = models.ForeignKey(Patient, on_delete=models.RESTRICT, db_column='patient_id', related_name='lab_orders')
    test = models.ForeignKey(LabTestCatalog, on_delete=models.RESTRICT, db_column='test_id')
    ordered_by = models.ForeignKey(CCUser, on_delete=models.RESTRICT, db_column='ordered_by')
    collected_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=30, default='ORDERED')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'lab_orders'
        managed = True

    def __str__(self):
        return f"Lab #{self.id}: {self.test.test_name} - {self.patient.uhid}"


class LabResult(models.Model):
    lab_order = models.ForeignKey(LabOrder, on_delete=models.CASCADE, db_column='lab_order_id', related_name='results')
    test = models.ForeignKey(LabTestCatalog, on_delete=models.RESTRICT, db_column='test_id')
    measured_value = models.CharField(max_length=50)
    unit = models.CharField(max_length=20, null=True, blank=True)
    flag = models.CharField(max_length=20, default='NORMAL')
    technician_notes = models.TextField(null=True, blank=True)
    reported_at = models.DateTimeField(auto_now_add=True)
    verified_by = models.ForeignKey(CCUser, on_delete=models.RESTRICT, db_column='verified_by')

    class Meta:
        db_table = 'lab_results'
        managed = True

    def __str__(self):
        return f"{self.test.test_name}: {self.measured_value} {self.unit} [{self.flag}]"


class ImagingStudy(models.Model):
    order_item = models.ForeignKey(CPOEOrderItem, on_delete=models.SET_NULL, null=True, blank=True, db_column='order_item_id')
    patient = models.ForeignKey(Patient, on_delete=models.RESTRICT, db_column='patient_id', related_name='imaging_studies')
    modality = models.CharField(max_length=20)
    body_site = models.CharField(max_length=100)
    study_date = models.DateTimeField(auto_now_add=True)
    accession_number = models.CharField(max_length=50, unique=True)
    dicom_link = models.CharField(max_length=255, null=True, blank=True)
    status = models.CharField(max_length=20, default='COMPLETED')

    class Meta:
        db_table = 'imaging_studies'
        managed = True

    def __str__(self):
        return f"{self.modality} - {self.body_site} ({self.accession_number})"


class ImagingReport(models.Model):
    study = models.OneToOneField(ImagingStudy, on_delete=models.CASCADE, db_column='study_id', related_name='report')
    radiologist = models.ForeignKey(CCUser, on_delete=models.RESTRICT, db_column='radiologist_id')
    findings = models.TextField()
    impression = models.TextField()
    reported_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'imaging_reports'
        managed = True

    def __str__(self):
        return f"Report for {self.study.accession_number}"


# =====================================================================
# MODULE 6: Clinical Decision Support (CDS)
# =====================================================================

class CDSRule(models.Model):
    rule_code = models.CharField(max_length=30, unique=True)
    title = models.CharField(max_length=100)
    rule_category = models.CharField(max_length=30)
    description = models.TextField()
    severity_level = models.CharField(max_length=20)
    criteria_json = models.JSONField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'cds_rules'
        managed = True

    def __str__(self):
        return f"[{self.severity_level}] {self.title}"


class CDSAlert(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.RESTRICT, db_column='patient_id', related_name='cds_alerts')
    encounter = models.ForeignKey(ClinicalEncounter, on_delete=models.SET_NULL, null=True, blank=True, db_column='encounter_id')
    rule = models.ForeignKey(CDSRule, on_delete=models.RESTRICT, db_column='rule_id')
    alert_title = models.CharField(max_length=150)
    alert_message = models.TextField()
    severity = models.CharField(max_length=20)
    triggered_at = models.DateTimeField(auto_now_add=True)
    acknowledged_by = models.ForeignKey(CCUser, on_delete=models.SET_NULL, null=True, blank=True, db_column='acknowledged_by')
    acknowledgement_notes = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = 'cds_alerts'
        managed = True

    def __str__(self):
        return f"ALERT: {self.alert_title} [{self.severity}]"


# =====================================================================
# MODULE 7: Patient Portal
# =====================================================================

class Appointment(models.Model):
    appointment_number = models.CharField(max_length=30, unique=True)
    patient = models.ForeignKey(Patient, on_delete=models.RESTRICT, db_column='patient_id', related_name='appointments')
    doctor = models.ForeignKey(CCUser, on_delete=models.RESTRICT, db_column='doctor_id', related_name='doctor_appointments')
    appointment_date = models.DateField()
    time_slot = models.CharField(max_length=20)
    reason_for_visit = models.CharField(max_length=255)
    status = models.CharField(max_length=20, default='SCHEDULED')
    booking_type = models.CharField(max_length=20, default='PORTAL')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'appointments'
        managed = True

    def __str__(self):
        return f"{self.appointment_number} - {self.patient.first_name} on {self.appointment_date}"


class PortalMessage(models.Model):
    sender = models.ForeignKey(CCUser, on_delete=models.RESTRICT, db_column='sender_id', related_name='sent_messages')
    receiver = models.ForeignKey(CCUser, on_delete=models.RESTRICT, db_column='receiver_id', related_name='received_messages')
    patient = models.ForeignKey(Patient, on_delete=models.RESTRICT, db_column='patient_id')
    subject = models.CharField(max_length=150)
    message_body = models.TextField()
    is_read = models.BooleanField(default=False)
    sent_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'portal_messages'
        managed = True

    def __str__(self):
        return f"Msg: {self.subject} ({self.sender.first_name} -> {self.receiver.first_name})"


class PatientHealthDocument(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, db_column='patient_id', related_name='documents')
    title = models.CharField(max_length=150)
    document_type = models.CharField(max_length=30)
    file_path = models.CharField(max_length=255)
    notes = models.CharField(max_length=255, null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'patient_health_documents'
        managed = True

    def __str__(self):
        return f"{self.title} [{self.document_type}]"


# =====================================================================
# MODULE 8: Interoperability and Integration
# =====================================================================

class FHIRResource(models.Model):
    resource_type = models.CharField(max_length=50)
    resource_id = models.CharField(max_length=50, unique=True)
    fhir_version = models.CharField(max_length=10, default='R4')
    json_payload = models.JSONField()
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'fhir_resources'
        managed = True

    def __str__(self):
        return f"{self.resource_type}/{self.resource_id}"


class SystemAuditLog(models.Model):
    user = models.ForeignKey(CCUser, on_delete=models.SET_NULL, null=True, blank=True, db_column='user_id')
    action = models.CharField(max_length=50)
    entity_name = models.CharField(max_length=50)
    entity_id = models.CharField(max_length=50, null=True, blank=True)
    ip_address = models.CharField(max_length=45, null=True, blank=True)
    performed_at = models.DateTimeField(auto_now_add=True)
    details = models.TextField(null=True, blank=True)

    class Meta:
        db_table = 'system_audit_logs'
        managed = True

    def __str__(self):
        return f"{self.action} on {self.entity_name} by user #{self.user_id}"
