# CareConnect EHR - Functional & System Requirements

## Project: P03 | CareConnect: Connecting Patients and Providers
**Domain**: Healthcare & Pharma  
**Academic Program**: ABES Engineering College | MCA 2nd Year  
**Prepared by**: Program Manager, EdTech, HCLTech  
**Technology Stack**: Python (Django REST Framework), React 18, MySQL 8.0  

---

## 1. System Objectives
1. Centralize patient clinical records and Master Patient Index (MPI).
2. Facilitate Computerized Provider Order Entry (CPOE) for laboratory, radiology, and medication requisitions.
3. Deliver an active Clinical Decision Support (CDS) system preventing dangerous drug-drug interactions and allergen contraindications.
4. Support patient engagement through self-service appointments and secure provider messaging.
5. Maintain interoperability with national health standards via HL7 FHIR R4 JSON resources.
6. Provide role-based access control (Admin, Doctor, Patient, Nurse, Lab Tech) with comprehensive tamper-evident audit trails.

---

## 2. Module Specifications

### Module 1: Patient Registration and Demographics
- **MPI & UHID Generation**: Unique Health Identifier (UHID) assigned to each patient upon registration.
- **Demographics Capture**: Full name, DOB, gender, blood group, Aadhaar number, phone, email, multi-line residential address.
- **Emergency Contacts**: Primary and secondary contact mapping with relationship and contact numbers.
- **Allergy Tracker**: Active recording of drug, food, and environmental allergies with severity and symptom descriptions.

### Module 2: Clinical Documentation
- **Encounter Management**: Recording of Outpatient (OPD), Inpatient (IPD), Emergency, and Teleconsultation encounters.
- **SOAP Structure**: Subjective (Chief Complaint & HPI), Objective (Physical exam & Vitals), Assessment (ICD-10 coding), and Plan.
- **Vital Signs Monitoring**: Systolic/Diastolic BP, Heart Rate, Respiration Rate, Temperature (°F), Oxygen Saturation (SpO2), Height, Weight, BMI.

### Module 3: Computerized Provider Order Entry (CPOE)
- **Order Classification**: Requisition of Laboratory panels, Diagnostic Imaging, Inpatient Procedures, and Medications.
- **Priority Triage**: Order urgency categorization (Routine, Urgent, STAT) with clinical indication documentation.
- **Order Fulfillment Tracking**: Status transitions from Placed -> In Progress -> Completed.

### Module 4: Medication Management
- **E-Prescribing**: Creation of structured electronic prescriptions with drug dosage, frequency (e.g. 1-0-1 BID), duration, and instructions.
- **Formulary Catalog**: Master list of drugs with brand name, generic composition, dosage form, route, and INR pricing.
- **Medication Administration Record (MAR)**: Nursing logs of administered, missed, or refused doses with timestamping.

### Module 5: Lab and Imaging Integration
- **Diagnostic Catalog**: Master list of pathology investigations with normal reference ranges (min/max), units, and sample types.
- **Results Management**: Entry and digital sign-off of lab measurements with automatic status flags (Normal, High, Low, Critical).
- **PACS / DICOM Imaging**: Study accession tracking for X-Ray, CT, MRI, and Ultrasound with radiologist impressions.

### Module 6: Clinical Decision Support (CDS)
- **Safety Engine**: Algorithmic rules checking for lethal drug interactions (e.g. Aspirin + Enoxaparin) and beta-lactam penicillin hypersensitivity.
- **Vital Sign Triggers**: Alert generation for hypertensive emergencies (BP >= 160/100) or acute hypoxia (SpO2 < 92%).
- **Physician Acknowledgement**: Mandatory override/acknowledgement notes recorded in the EHR.

### Module 7: Patient Portal
- **Self-Service Appointments**: Online booking with doctor selection, date, and preferred time slot.
- **Secure Messaging**: Two-way HIPAA-compliant digital messaging between patients and clinical providers.
- **Health Records Vault**: Digital storage and retrieval of discharge summaries, lab reports, and prescriptions.

### Module 8 & 9: Interoperability, User Management & Audit
- **HL7 FHIR R4 Standards**: Export and inspection of standardized resources (`Patient`, `Observation`, `MedicationRequest`, `DiagnosticReport`).
- **Role-Based Access Control (RBAC)**: Fine-grained permissions for Administrators, Clinicians, Nurses, and Patients.
- **Audit Trail**: Immutable logs capturing User ID, action type (CREATE/VIEW/UPDATE), entity, IP address, and timestamp.
