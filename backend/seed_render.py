"""
Post-migration data seeding for CareConnect EHR on Render/PostgreSQL.
Run this after: python manage.py migrate
Usage: python manage.py shell < seed_render.py
"""
import os, sys, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careconnect_core.settings')

# This runs inside manage.py shell, so django is already set up
from api.models import Role

if Role.objects.exists():
    print("Data already seeded. Skipping.")
    sys.exit(0)

print("Seeding CareConnect database...")

# 1. Roles
from api.models import Role, CCUser, StaffProfile, MedicationCatalog, LabTestCatalog, CDSRule, Patient, EmergencyContact, PatientAllergy
from decimal import Decimal
from datetime import date, datetime, timezone

roles_data = [
    dict(id=1, role_code='ADMIN',    role_name='Hospital System Administrator', description='Full privileges across all modules and audit logs'),
    dict(id=2, role_code='DOCTOR',   role_name='Licensed Medical Practitioner', description='Clinical documentation, CPOE orders, prescriptions, CDS alerts'),
    dict(id=3, role_code='PATIENT',  role_name='Registered Patient',            description='Access to patient portal, personal records, messaging, appointments'),
    dict(id=4, role_code='NURSE',    role_name='Clinical Registered Nurse',     description='Vital signs entry, medication administration, triage documentation'),
    dict(id=5, role_code='LAB_TECH', role_name='Laboratory & Imaging Specialist', description='Lab test results entry, imaging study coordination'),
]
for r in roles_data:
    Role.objects.get_or_create(id=r['id'], defaults=r)
print(f"  Roles: {Role.objects.count()}")

# 2. Users
users_data = [
    dict(id=1,  username='admin',               email='admin@careconnect.in',       password_hash='pbkdf2_sha256$600000$CareConnectSalt$N8m87V6lZpQvN4hXwBq1Y+vX8iE=', first_name='Rajesh',   last_name='Sharma',   role_id=1, phone_number='+91-9810112233', is_active=True, is_staff=True),
    dict(id=2,  username='dr_arun_verma',        email='arun.verma@careconnect.in',  password_hash='pbkdf2_sha256$600000$CareConnectSalt$DocArunHashVal1234567890=',      first_name='Arun',     last_name='Verma',    role_id=2, phone_number='+91-9820223344', is_active=True, is_staff=False),
    dict(id=3,  username='dr_priya_nair',        email='priya.nair@careconnect.in',  password_hash='pbkdf2_sha256$600000$CareConnectSalt$DocPriyaHashVal123456789=',      first_name='Priya',    last_name='Nair',     role_id=2, phone_number='+91-9830334455', is_active=True, is_staff=False),
    dict(id=4,  username='dr_vikram_patel',      email='vikram.patel@careconnect.in',password_hash='pbkdf2_sha256$600000$CareConnectSalt$DocVikramHashVal12345678=',      first_name='Vikram',   last_name='Patel',    role_id=2, phone_number='+91-9840445566', is_active=True, is_staff=False),
    dict(id=5,  username='dr_sneha_kulkarni',    email='sneha.k@careconnect.in',     password_hash='pbkdf2_sha256$600000$CareConnectSalt$DocSnehaHashVal123456789=',      first_name='Sneha',    last_name='Kulkarni', role_id=2, phone_number='+91-9850556677', is_active=True, is_staff=False),
    dict(id=6,  username='dr_mohammed_tariq',    email='m.tariq@careconnect.in',     password_hash='pbkdf2_sha256$600000$CareConnectSalt$DocTariqHashVal123456789=',      first_name='Mohammed', last_name='Tariq',    role_id=2, phone_number='+91-9860667788', is_active=True, is_staff=False),
    dict(id=7,  username='dr_ananya_sen',        email='ananya.sen@careconnect.in',  password_hash='pbkdf2_sha256$600000$CareConnectSalt$DocAnanyaHashVal12345678=',      first_name='Ananya',   last_name='Sen',      role_id=2, phone_number='+91-9870778899', is_active=True, is_staff=False),
    dict(id=8,  username='nurse_sunita_devi',    email='sunita.devi@careconnect.in', password_hash='pbkdf2_sha256$600000$CareConnectSalt$NurseSunitaHashVal123456=',      first_name='Sunita',   last_name='Devi',     role_id=4, phone_number='+91-9880889900', is_active=True, is_staff=False),
    dict(id=9,  username='nurse_deepak_rawat',   email='deepak.rawat@careconnect.in',password_hash='pbkdf2_sha256$600000$CareConnectSalt$NurseDeepakHashVal123456=',      first_name='Deepak',   last_name='Rawat',    role_id=4, phone_number='+91-9890990011', is_active=True, is_staff=False),
    dict(id=10, username='labtech_manish_gupta', email='manish.gupta@careconnect.in',password_hash='pbkdf2_sha256$600000$CareConnectSalt$LabManishHashVal12345678=',      first_name='Manish',   last_name='Gupta',    role_id=5, phone_number='+91-9900112233', is_active=True, is_staff=False),
    dict(id=11, username='patient_rohit_mehta',  email='rohit.mehta@gmail.com',      password_hash='pbkdf2_sha256$600000$CareConnectSalt$PatientRohitHashVal123456=',     first_name='Rohit',    last_name='Mehta',    role_id=3, phone_number='+91-9911223344', is_active=True, is_staff=False),
    dict(id=12, username='patient_kavita_singh', email='kavita.singh@yahoo.com',     password_hash='pbkdf2_sha256$600000$CareConnectSalt$PatientKavitaHashVal12345=',     first_name='Kavita',   last_name='Singh',    role_id=3, phone_number='+91-9922334455', is_active=True, is_staff=False),
    dict(id=13, username='patient_amitabh_joshi',email='amitabh.j@outlook.com',      password_hash='pbkdf2_sha256$600000$CareConnectSalt$PatientAmitabhHashVal1234=',     first_name='Amitabh',  last_name='Joshi',    role_id=3, phone_number='+91-9933445566', is_active=True, is_staff=False),
    dict(id=14, username='patient_meera_iyer',   email='meera.iyer@rediffmail.com',  password_hash='pbkdf2_sha256$600000$CareConnectSalt$PatientMeeraHashVal123456=',     first_name='Meera',    last_name='Iyer',     role_id=3, phone_number='+91-9944556677', is_active=True, is_staff=False),
    dict(id=15, username='patient_suresh_reddy', email='suresh.reddy@gmail.com',     password_hash='pbkdf2_sha256$600000$CareConnectSalt$PatientSureshHashVal12345=',     first_name='Suresh',   last_name='Reddy',    role_id=3, phone_number='+91-9955667788', is_active=True, is_staff=False),
    dict(id=16, username='dr_arun_verma_jr',     email='arun.verma.jr@careconnect.in',password_hash='pbkdf2_sha256$600000$CareConnectSalt$DocArunJrHashVal12345678=',     first_name='Arun',     last_name='Verma',    role_id=2, phone_number='+91-9820223399', is_active=True, is_staff=False),
]
for u in users_data:
    CCUser.objects.get_or_create(id=u['id'], defaults=u)
print(f"  Users: {CCUser.objects.count()}")

# 3. Patients (linked to users 11-15)
patients_data = [
    dict(id=1,  user_id=11, date_of_birth=date(1988, 5, 14), gender='M', blood_group='B+', address='22, Sector 15, Noida, UP', city='Noida',      state='Uttar Pradesh', pincode='201301', aadhar_number='2345-6789-0123', insurance_provider='Star Health',      insurance_policy_no='SH-DEL-2023-00456', registration_date=date(2024, 1, 10)),
    dict(id=2,  user_id=12, date_of_birth=date(1975, 11, 23), gender='F', blood_group='A+', address='7, MG Road, Lajpat Nagar, Delhi', city='Delhi', state='Delhi', pincode='110024', aadhar_number='3456-7890-1234', insurance_provider='HDFC Ergo', insurance_policy_no='HE-DEL-2022-00789', registration_date=date(2024, 1, 15)),
    dict(id=3,  user_id=13, date_of_birth=date(1963, 8, 7), gender='M', blood_group='O-', address='45, Shastri Nagar, Jaipur, RJ', city='Jaipur', state='Rajasthan', pincode='302016', aadhar_number='4567-8901-2345', insurance_provider='Bajaj Allianz', insurance_policy_no='BA-RJ-2021-01234', registration_date=date(2024, 2, 1)),
    dict(id=4,  user_id=14, date_of_birth=date(1991, 3, 29), gender='F', blood_group='AB+', address='12, Anna Nagar, Chennai, TN', city='Chennai', state='Tamil Nadu', pincode='600040', aadhar_number='5678-9012-3456', insurance_provider='Tata AIG', insurance_policy_no='TA-TN-2023-02345', registration_date=date(2024, 2, 10)),
    dict(id=5,  user_id=15, date_of_birth=date(1956, 12, 1), gender='M', blood_group='B-', address='78, Film Nagar, Hyderabad, TS', city='Hyderabad', state='Telangana', pincode='500033', aadhar_number='6789-0123-4567', insurance_provider='New India Assurance', insurance_policy_no='NIA-TS-2020-03456', registration_date=date(2024, 3, 5)),
]
for p in patients_data:
    Patient.objects.get_or_create(id=p['id'], defaults=p)
print(f"  Patients: {Patient.objects.count()}")

# 4. Medications Catalog
meds = [
    dict(id=1,  drug_code='DRUG-001', brand_name='Paracip 650',         generic_name='Paracetamol',                   dosage_form='Tablet', strength='650mg',        route_of_admin='Oral',   manufacturer='Cipla Ltd.',               unit_price=Decimal('25.50'),  is_active=True),
    dict(id=2,  drug_code='DRUG-002', brand_name='Augmentin 625 Duo',   generic_name='Amoxicillin + Clavulanic Acid', dosage_form='Tablet', strength='625mg',        route_of_admin='Oral',   manufacturer='GlaxoSmithKline',           unit_price=Decimal('185.00'), is_active=True),
    dict(id=3,  drug_code='DRUG-003', brand_name='Glycomet GP 1',       generic_name='Metformin + Glimepiride',       dosage_form='Tablet', strength='500mg+1mg',    route_of_admin='Oral',   manufacturer='USV Private Ltd',          unit_price=Decimal('110.00'), is_active=True),
    dict(id=4,  drug_code='DRUG-004', brand_name='Telma 40',            generic_name='Telmisartan',                   dosage_form='Tablet', strength='40mg',         route_of_admin='Oral',   manufacturer='Glenmark Pharmaceuticals', unit_price=Decimal('145.00'), is_active=True),
    dict(id=5,  drug_code='DRUG-005', brand_name='Ecosprin 75',         generic_name='Aspirin',                       dosage_form='Tablet', strength='75mg',         route_of_admin='Oral',   manufacturer='USV Private Ltd',          unit_price=Decimal('22.00'),  is_active=True),
    dict(id=6,  drug_code='DRUG-006', brand_name='Pantocid 40',         generic_name='Pantoprazole',                  dosage_form='Tablet', strength='40mg',         route_of_admin='Oral',   manufacturer='Sun Pharma',               unit_price=Decimal('78.50'),  is_active=True),
    dict(id=7,  drug_code='DRUG-007', brand_name='Atorvastatin 20',     generic_name='Atorvastatin',                  dosage_form='Tablet', strength='20mg',         route_of_admin='Oral',   manufacturer='Cipla Ltd.',               unit_price=Decimal('95.00'),  is_active=True),
    dict(id=8,  drug_code='DRUG-008', brand_name='Ceftriaxone 1g Inj',  generic_name='Ceftriaxone Sodium',            dosage_form='Injection', strength='1g/vial',   route_of_admin='IV',     manufacturer='Pfizer India',             unit_price=Decimal('320.00'), is_active=True),
    dict(id=9,  drug_code='DRUG-009', brand_name='Insulin Glargine',    generic_name='Insulin Glargine',              dosage_form='Injection', strength='100IU/mL',  route_of_admin='SC',     manufacturer='Sanofi India',             unit_price=Decimal('860.00'), is_active=True),
    dict(id=10, drug_code='DRUG-010', brand_name='Montek LC',           generic_name='Montelukast + Levocetirizine',  dosage_form='Tablet', strength='10mg+5mg',     route_of_admin='Oral',   manufacturer='Sun Pharma',               unit_price=Decimal('135.00'), is_active=True),
]
for m in meds:
    MedicationCatalog.objects.get_or_create(id=m['id'], defaults=m)
print(f"  Medications: {MedicationCatalog.objects.count()}")

# 5. CDS Rules
rules = [
    dict(id=1, rule_code='CDS-001', rule_name='Penicillin Allergy Conflict', description='Alert when Amoxicillin prescribed to patient with Penicillin allergy', trigger_condition='DRUG_ALLERGY', severity='HIGH', is_active=True),
    dict(id=2, rule_code='CDS-002', rule_name='Aspirin + Anticoagulant Interaction', description='Flag concurrent use of Aspirin and Warfarin - bleeding risk', trigger_condition='DRUG_INTERACTION', severity='HIGH', is_active=True),
    dict(id=3, rule_code='CDS-003', rule_name='Diabetes HbA1c Monitoring', description='Recommend HbA1c lab test if diabetic patient not tested in 90 days', trigger_condition='PREVENTIVE_CARE', severity='MEDIUM', is_active=True),
    dict(id=4, rule_code='CDS-004', rule_name='Hypertension BP Monitoring', description='Alert if BP > 140/90 and no antihypertensive prescribed', trigger_condition='VITAL_ALERT', severity='MEDIUM', is_active=True),
    dict(id=5, rule_code='CDS-005', rule_name='Duplicate Medication Order', description='Prevent two active orders of same drug class (e.g., double PPI)', trigger_condition='DUPLICATE_ORDER', severity='LOW', is_active=True),
]
for r in rules:
    CDSRule.objects.get_or_create(id=r['id'], defaults=r)
print(f"  CDS Rules: {CDSRule.objects.count()}")

print("\nSeeding complete!")
