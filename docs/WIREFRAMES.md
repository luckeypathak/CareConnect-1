# CareConnect EHR - UI/UX Wireframe & Screen Architecture

## Visual Architecture Overview
CareConnect utilizes a responsive dual-pane layout:
1. **Top Navigation Bar**: Brand identity, live MySQL & REST API connection badges, active role selector (Doctor, Patient, Admin), and direct button to Django Admin.
2. **Left Navigation Sidebar**: Quick access to all 9 EHR modules with live notification badges.
3. **Primary Content Stage**: Card-based responsive dashboards, data grids, modal dialogs, and interactive CDS simulators.

---

## Screen Layouts

### 1. Operations Dashboard
```
+-----------------------------------------------------------------------------------------+
| [Logo] CareConnect EHR     [MySQL 8.0: Connected]  [Role: Dr. Arun Verma v] [Admin Panel] |
+-----------------------------------------------------------------------------------------+
| [Side Nav]  | [KPI 1: Patients] [KPI 2: Encounters] [KPI 3: Active Rx] [KPI 4: CDS Alerts]  |
| 1. Patients |                                                                           |
| 2. EMR SOAP | +-----------------------------------------------------------------------+ |
| 3. CPOE     | | ⚡ Live Clinical Decision Support (CDS) Safety Checker Simulator     | |
| 4. Meds     | | [Select Patient v]  [Test Medication v]  [Run Safety Check Button]   | |
| 5. Labs     | | -> Status Alert: [CRITICAL ALLERGY] Augmentin blocked for Penicillin  | |
| 6. CDS      | +-----------------------------------------------------------------------+ |
| 7. Portal   |                                                                           |
| 8. FHIR     | +-----------------------------------+ +---------------------------------+ |
|             | | Recent Clinical Encounters Table  | | Real-time Active Alerts Feed    | |
| [Admin Pill]| +-----------------------------------+ +---------------------------------+ |
+-----------------------------------------------------------------------------------------+
```

### 2. Patient Registration & Master Index
```
+-----------------------------------------------------------------------------------------+
| [Header] Patient Registration & Demographics                 [+ Register New Patient]   |
| [Search Bar: Search by UHID, Name, Phone, or City...]                                   |
| +-------------------------------------------------------------------------------------+ |
| | UHID            | Patient Name     | Gender/DOB   | Blood | Phone         | Action  | |
| | UHID-2024-00101 | Rohit Mehta      | M / 1988     | B+    | +91-99112233  | [View]  | |
| | UHID-2024-00102 | Kavita Singh     | F / 1992     | O+    | +91-99223344  | [View]  | |
| +-------------------------------------------------------------------------------------+ |
+-----------------------------------------------------------------------------------------+
```

### 3. Patient Clinical Encounter & SOAP Notes
```
+-----------------------------------------------------------------------------------------+
| Encounter Number: ENC-2024-00001 | Patient: Rohit Mehta | Doctor: Dr. Arun Verma        |
|                                                                                         |
| (S) Subjective : Acute chest heaviness & exertional dyspnea since 3 days                |
| (O) Objective  : BP 142/88 mmHg, HR 82 bpm, SpO2 98%, Temp 98.4 F, BMI 27.2            |
| (A) Assessment : ICD-10 I20.9 (Angina Pectoris, Unspecified)                            |
| (P) Plan       : Rest, sublingual nitrate SOS, order Troponin-I and ECG                 |
+-----------------------------------------------------------------------------------------+
```
