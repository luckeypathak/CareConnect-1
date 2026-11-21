# CareConnect EHR - REST API Reference Documentation

**Base URL**: `http://localhost:8000/api/`  
**Authentication**: Session / Token / AllowAny (Development)  
**Format**: `application/json`

---

## 1. Dashboard & Core Analytics
### `GET /api/dashboard/stats/`
Returns aggregated hospital metrics for quick KPI cards and operational oversight.
```json
{
  "total_patients": 20,
  "total_encounters": 54,
  "active_prescriptions": 35,
  "pending_lab_orders": 6,
  "active_cds_alerts": 20,
  "upcoming_appointments": 20,
  "recent_patients": [...],
  "recent_encounters": [...],
  "recent_alerts": [...]
}
```

---

## 2. Clinical Decision Support (CDS)
### `POST /api/cds/check-interaction/`
Evaluates a candidate drug prescription against patient active allergies and concurrent medications.
**Request Body**:
```json
{
  "patient_id": 1,
  "drug_name": "Augmentin 625 Duo"
}
```
**Response**:
```json
{
  "safe": false,
  "warnings": [
    {
      "type": "ALLERGY_ALERT",
      "severity": "CRITICAL",
      "message": "Critical Allergy Conflict: Patient is severely allergic to 'Penicillin'. Prescribing 'Augmentin 625 Duo' may cause Urticaria and bronchospasm."
    }
  ]
}
```

---

## 3. Patient Registration & Demographics
- `GET /api/patients/` - List patients with pagination & `?search=` support.
- `POST /api/patients/` - Register new patient.
- `GET /api/patients/{id}/` - Detailed patient profile with allergies & emergency contacts.
- `PUT/PATCH /api/patients/{id}/` - Update demographics.
- `GET /api/patient-allergies/` - List allergen records.
- `GET /api/emergency-contacts/` - List emergency contact numbers.

---

## 4. Clinical Encounters & Notes
- `GET /api/encounters/` - List encounters (supports `?patient={id}`).
- `POST /api/encounters/` - Record new SOAP encounter.
- `GET /api/encounters/{id}/` - Retrieve full encounter with nested vitals and ICD-10 diagnoses.
- `GET /api/vital-signs/` - Vitals measurements stream.
- `GET /api/diagnoses/` - ICD-10 diagnoses list.

---

## 5. Computerized Provider Order Entry (CPOE)
- `GET /api/cpoe-orders/` - List clinical requisitions.
- `POST /api/cpoe-orders/` - Place new CPOE order (Lab, Imaging, Medication, Procedure).
- `GET /api/cpoe-orders/{id}/` - Order details with nested items.

---

## 6. Medication Management
- `GET /api/prescriptions/` - List electronic prescriptions.
- `POST /api/prescriptions/` - Issue e-prescription with items.
- `GET /api/medications/` - Formulary catalog with INR pricing.
- `GET /api/administrations/` - Nurse Medication Administration Records (MAR).

---

## 7. Laboratory & Diagnostic Imaging
- `GET /api/lab-tests/` - Catalog of laboratory tests and reference ranges.
- `GET /api/lab-orders/` - Sample collection and tracking status.
- `GET /api/lab-results/` - Analyzer measurements with flags (`NORMAL`, `HIGH`, `LOW`, `CRITICAL`).
- `GET /api/imaging-studies/` - PACS radiology studies (X-Ray, CT, MRI, Ultrasound).
- `GET /api/imaging-reports/` - Radiologist narrative impression and findings.

---

## 8. Patient Portal
- `GET /api/appointments/` - List appointments.
- `POST /api/appointments/` - Book self-service appointment.
- `GET /api/portal-messages/` - Two-way messages between patient and doctor.
- `POST /api/portal-messages/` - Send message.
- `GET /api/health-documents/` - Digital health records locker.

---

## 9. Interoperability & Audit
- `GET /api/fhir-resources/` - Standard HL7 FHIR R4 JSON payloads.
- `GET /api/audit-logs/` - Security audit trail tracking system events.
- `GET /api/users/` - User profiles.
- `GET /api/roles/` - System roles.
