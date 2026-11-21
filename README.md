# CareConnect: Connecting Patients and Providers (P03)

**Institution**: ABES Engineering College | MCA 2nd Year  
**Skill Track**: FSD Python  
**Prepared by**: Program Manager, EdTech, HCLTech  
**Technology Stack**: Python 3.12, Django 4.2 LTS / Django REST Framework, React 18 (Vite), MySQL 8.0  

---

## 1. Project Overview
**CareConnect** is an enterprise-grade Electronic Health Record (EHR) system designed to centralize patient data, streamline clinical workflows, and enhance care coordination across outpatient, inpatient, and emergency clinical environments.

### Core Modules Implemented
1. **Patient Registration & Demographics**: Master Patient Index (MPI), UHID generation, emergency contacts, allergy repository.
2. **Clinical Documentation**: OPD/IPD encounter management, SOAP progress notes, vital signs tracking, ICD-10 diagnostic coding.
3. **Computerized Provider Order Entry (CPOE)**: Diagnostic laboratory, radiology imaging, procedural, and medication orders with priority classification (Routine, Urgent, STAT).
4. **Medication Management**: E-prescriptions with dosage/frequency, formulary drug catalog with INR pricing, and nursing Medication Administration Records (MAR).
5. **Lab and Imaging Integration**: Pathology analyzer results, reference ranges, abnormal flags (Normal, High, Low, Critical), and PACS imaging studies with radiologist impressions.
6. **Clinical Decision Support (CDS)**: Real-time safety engine checking candidate drug prescriptions against patient allergies and concurrent medications with immediate safety alerts.
7. **Patient Portal**: Self-service appointment scheduling, two-way secure messaging, and digital health records locker.
8. **Interoperability & Integration**: Standardized HL7 FHIR R4 JSON payloads for Patient, Observation, DiagnosticReport, and MedicationRequest.
9. **User Management and Access Control**: Role-based access control (Admin, Doctor, Patient, Nurse, Lab Tech) with comprehensive tamper-evident audit trails.

---

## 2. Default Access & Credentials

### Django Admin Panel
- **URL**: [http://localhost:8000/admin](http://localhost:8000/admin)
- **Username**: `admin`
- **Password**: `Admin@123`
- **Role**: Hospital System Administrator (Full privileges across all modules and audit logs)

### Business Roles (for testing & portal switching)
- **Doctor**: `doctor` (or `dr_arun_verma`) / Password: `Doctor@123`
- **Patient**: `patient` (or `patient_rohit_mehta`) / Password: `Patient@123`

---

## 3. Project Directory Structure
```
mca2-fsdpython-careconnect/
├── backend/
│   ├── api/                     # Models, Serializers, Views, Admin, URLs
│   ├── careconnect_core/        # Django settings, WSGI, URLs
│   ├── venv/                    # Virtual environment (Python 3.12)
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/          # Navbar, Sidebar
│   │   ├── views/               # Views for all 9 EHR modules
│   │   ├── services/            # Axios API client
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── database/
│   ├── schema.sql               # 3NF Normalized DDL (MySQL 8.0)
│   ├── seed_data.sql            # Realistic Indian test data & edge cases
│   └── seed_csv/                # CSV files for all 27 tables
├── docs/
│   ├── REQUIREMENTS.md          # Functional & system specifications
│   ├── API_DOCS.md              # REST API endpoint reference
│   ├── ER_DIAGRAM.md            # Entity Relationship diagram & relationships
│   ├── TEST_REPORT.md           # Test cases & edge case validation
│   ├── SPRINT_REPORT.md         # Sprint 0 to 3 Agile breakdown
│   └── WIREFRAMES.md            # UI/UX wireframes & layout maps
├── README.md
├── .gitignore
├── .env.example
└── .env
```

---

## 4. How to Run Locally

### Prerequisites
- Python 3.11 or later
- Node.js 18 LTS or later
- MySQL 8.0 Server running on port 3306

### Step 1: Database Setup (MySQL 8.0)
The database has already been created and seeded:
```bash
mysql -u root -p careconnect_db < database/schema.sql
mysql -u root -p careconnect_db < database/seed_data.sql
```

### Step 2: Start the Django Backend (Port 8000)
```bash
cd backend
# Activate virtual environment:
.\venv\Scripts\Activate.ps1
# Run migrations (already applied)
python manage.py migrate
# Start Django development server
python manage.py runserver 8000
```
Backend API will be accessible at: `http://localhost:8000/api/`  
Admin Panel at: `http://localhost:8000/admin/`

### Step 3: Start the React Frontend (Port 5173)
In a separate terminal:
```bash
cd frontend
npm run dev
```
Frontend Web Portal will be accessible at: `http://localhost:5173/`

---

## 5. Agile Sprint Schedule
- **Sprint 0 (6h)**: Repository setup, MySQL 3NF schema, skeleton backend & frontend, admin login (`v0.1.0`)
- **Sprint 1 (28h)**: Patient Registration, Clinical Documentation, CPOE (`v0.2.0`)
- **Sprint 2 (28h)**: Medication Management, Lab & Imaging, CDS Support (`v0.3.0`)
- **Sprint 3 (28h)**: Patient Portal, HL7 FHIR Interoperability, Audit Logs, Stabilization & Release (`v1.0.0`)
