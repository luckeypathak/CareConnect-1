# CareConnect EHR - Agile Sprint Delivery Report

**Project Code**: P03  
**Title**: CareConnect: Connecting Patients and Providers  
**Total Allocated Duration**: 90 hours  
**Methodology**: Agile Scrum with Git Feature Branching  

---

## Sprint 0: Foundation, Architecture & Setup (6 Hours)
- **Tag**: `v0.1.0`
- **Focus**: Repository layout, 3NF database design in MySQL 8.0, skeleton backend and frontend, superuser creation.
- **Deliverables**:
  - Normalized schema (`database/schema.sql`) covering 27 relational entities.
  - Realistic Indian sample dataset (`database/seed_data.sql` and CSV files).
  - Django project skeleton with MySQL 8.0 PyMySQL connection.
  - Superuser `admin` / `Admin@123` created in Django Auth.
  - React 18 + Vite + Bootstrap project setup.

---

## Sprint 1: Core Clinical Workflow (28 Hours)
- **Tag**: `v0.2.0`
- **Focus**: Patient Registration & Demographics, Clinical Documentation, CPOE.
- **Deliverables**:
  - **Module 1**: Patient Registration, Master Patient Index (MPI), UHID generation, emergency contacts, allergy repository.
  - **Module 2**: Clinical encounters (OPD, IPD, Emergency), SOAP notes, vital signs logging, ICD-10 diagnostic coding.
  - **Module 3**: Computerized Provider Order Entry (CPOE) with priority levels (Routine, Urgent, STAT) for Lab, Imaging, Meds, Procedures.
  - DRF ViewSets, search filters, and React clinical screens.

---

## Sprint 2: Diagnostics & Clinical Decision Support (28 Hours)
- **Tag**: `v0.3.0`
- **Focus**: Medication Management, Lab & Imaging Integration, Clinical Decision Support (CDS).
- **Deliverables**:
  - **Module 4**: Electronic Prescribing (e-Rx) with drug dosage/frequency, formulary catalog with INR pricing, and nursing MAR logs.
  - **Module 5**: Diagnostic laboratory test catalog, specimen collection tracking, test result flags (Normal, High, Low, Critical), and PACS imaging reports.
  - **Module 6**: Real-time Clinical Decision Support engine checking candidate drugs against active allergies and concurrent medications with immediate safety alerts.

---

## Sprint 3: Portal, Interoperability & Release (28 Hours)
- **Tag**: `v1.0.0`
- **Focus**: Patient Portal, HL7 FHIR Interoperability, Security Audit Logs, End-to-End Testing & Release.
- **Deliverables**:
  - **Module 7**: Self-service appointment scheduling, secure patient-provider messaging, and personal health documents locker.
  - **Module 8**: Standardized HL7 FHIR R4 JSON payloads for Patient, Observation, DiagnosticReport, and MedicationRequest.
  - **Module 9**: Role-based access control (Admin, Doctor, Patient) and tamper-evident system audit trail.
  - End-to-end integration testing and production Vite build.
