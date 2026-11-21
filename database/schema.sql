-- =====================================================================
-- CareConnect EHR Database Schema (MySQL 8.0)
-- 3NF Normalized Relational Schema for CareConnect (P03)
-- Charset: utf8mb4, Collation: utf8mb4_unicode_ci, Engine: InnoDB
-- =====================================================================

CREATE DATABASE IF NOT EXISTS `careconnect_db` 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `careconnect_db`;

-- Drop child tables first then parents
DROP TABLE IF EXISTS `system_audit_logs`;
DROP TABLE IF EXISTS `fhir_resources`;
DROP TABLE IF EXISTS `portal_messages`;
DROP TABLE IF EXISTS `patient_health_documents`;
DROP TABLE IF EXISTS `appointments`;
DROP TABLE IF EXISTS `cds_alerts`;
DROP TABLE IF EXISTS `cds_rules`;
DROP TABLE IF EXISTS `imaging_reports`;
DROP TABLE IF EXISTS `imaging_studies`;
DROP TABLE IF EXISTS `lab_results`;
DROP TABLE IF EXISTS `lab_orders`;
DROP TABLE IF EXISTS `lab_test_catalog`;
DROP TABLE IF EXISTS `medication_administrations`;
DROP TABLE IF EXISTS `prescription_items`;
DROP TABLE IF EXISTS `prescriptions`;
DROP TABLE IF EXISTS `medications_catalog`;
DROP TABLE IF EXISTS `cpoe_order_items`;
DROP TABLE IF EXISTS `cpoe_orders`;
DROP TABLE IF EXISTS `clinical_diagnoses`;
DROP TABLE IF EXISTS `vital_signs`;
DROP TABLE IF EXISTS `clinical_encounters`;
DROP TABLE IF EXISTS `patient_allergies`;
DROP TABLE IF EXISTS `emergency_contacts`;
DROP TABLE IF EXISTS `patients`;
DROP TABLE IF EXISTS `staff_profiles`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `roles`;

-- =====================================================================
-- MODULE 9: User Management and Access Control
-- =====================================================================

CREATE TABLE `roles` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `role_code` VARCHAR(30) NOT NULL UNIQUE,
    `role_name` VARCHAR(50) NOT NULL,
    `description` VARCHAR(255) NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `first_name` VARCHAR(50) NOT NULL,
    `last_name` VARCHAR(50) NOT NULL,
    `role_id` INT NOT NULL,
    `phone_number` VARCHAR(15) NULL,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `is_staff` TINYINT(1) NOT NULL DEFAULT 0,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT,
    INDEX `idx_users_role_id` (`role_id`),
    INDEX `idx_users_email` (`email`),
    INDEX `idx_users_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `staff_profiles` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL UNIQUE,
    `department` VARCHAR(60) NOT NULL,
    `specialization` VARCHAR(100) NOT NULL,
    `license_number` VARCHAR(50) NOT NULL UNIQUE,
    `qualification` VARCHAR(100) NOT NULL,
    `experience_years` INT NOT NULL DEFAULT 0,
    `consultation_fee_inr` DECIMAL(10,2) NOT NULL DEFAULT 500.00,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_staff_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    INDEX `idx_staff_dept` (`department`),
    INDEX `idx_staff_spec` (`specialization`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- MODULE 1: Patient Registration and Demographics
-- =====================================================================

CREATE TABLE `patients` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `uhid` VARCHAR(20) NOT NULL UNIQUE, -- Unique Health Identifier
    `user_id` INT NULL UNIQUE,           -- Linked portal user if patient has portal account
    `first_name` VARCHAR(50) NOT NULL,
    `last_name` VARCHAR(50) NOT NULL,
    `date_of_birth` DATE NOT NULL,
    `gender` ENUM('MALE', 'FEMALE', 'OTHER') NOT NULL,
    `blood_group` VARCHAR(5) NULL,
    `marital_status` ENUM('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED') NULL,
    `aadhaar_number` VARCHAR(12) NULL UNIQUE,
    `phone` VARCHAR(15) NOT NULL,
    `email` VARCHAR(100) NULL,
    `address_line1` VARCHAR(150) NOT NULL,
    `address_line2` VARCHAR(150) NULL,
    `city` VARCHAR(50) NOT NULL,
    `state` VARCHAR(50) NOT NULL,
    `postal_code` VARCHAR(10) NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_patient_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
    INDEX `idx_patients_uhid` (`uhid`),
    INDEX `idx_patients_phone` (`phone`),
    INDEX `idx_patients_name` (`first_name`, `last_name`),
    INDEX `idx_patients_city` (`city`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `emergency_contacts` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `patient_id` INT NOT NULL,
    `contact_name` VARCHAR(100) NOT NULL,
    `relationship` VARCHAR(50) NOT NULL,
    `phone_number` VARCHAR(15) NOT NULL,
    `is_primary` TINYINT(1) NOT NULL DEFAULT 1,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_emergency_patient` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE,
    INDEX `idx_emergency_patient_id` (`patient_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `patient_allergies` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `patient_id` INT NOT NULL,
    `allergen_name` VARCHAR(100) NOT NULL,
    `allergen_type` ENUM('DRUG', 'FOOD', 'ENVIRONMENTAL', 'OTHER') NOT NULL,
    `severity` ENUM('MILD', 'MODERATE', 'SEVERE') NOT NULL,
    `reaction` VARCHAR(255) NOT NULL,
    `recorded_date` DATE NOT NULL,
    `status` ENUM('ACTIVE', 'RESOLVED') NOT NULL DEFAULT 'ACTIVE',
    CONSTRAINT `fk_allergies_patient` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE,
    INDEX `idx_allergies_patient_id` (`patient_id`),
    INDEX `idx_allergies_allergen` (`allergen_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- MODULE 2: Clinical Documentation
-- =====================================================================

CREATE TABLE `clinical_encounters` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `encounter_number` VARCHAR(30) NOT NULL UNIQUE,
    `patient_id` INT NOT NULL,
    `provider_id` INT NOT NULL, -- User with doctor role
    `encounter_type` ENUM('OPD', 'IPD', 'EMERGENCY', 'TELECONSULT') NOT NULL DEFAULT 'OPD',
    `encounter_date` DATETIME NOT NULL,
    `chief_complaint` TEXT NOT NULL,
    `history_of_present_illness` TEXT NULL,
    `examination_findings` TEXT NULL,
    `assessment_plan` TEXT NULL,
    `status` ENUM('IN_PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'COMPLETED',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_encounter_patient` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_encounter_provider` FOREIGN KEY (`provider_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
    INDEX `idx_enc_patient_id` (`patient_id`),
    INDEX `idx_enc_provider_id` (`provider_id`),
    INDEX `idx_enc_date` (`encounter_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `vital_signs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `encounter_id` INT NOT NULL,
    `patient_id` INT NOT NULL,
    `systolic_bp` INT NULL,        -- mmHg (e.g. 120)
    `diastolic_bp` INT NULL,       -- mmHg (e.g. 80)
    `heart_rate` INT NULL,         -- bpm
    `respiratory_rate` INT NULL,   -- breaths/min
    `temperature_f` DECIMAL(4,1) NULL, -- Fahrenheit
    `oxygen_saturation` DECIMAL(4,1) NULL, -- SpO2 %
    `height_cm` DECIMAL(5,1) NULL,
    `weight_kg` DECIMAL(5,1) NULL,
    `bmi` DECIMAL(4,1) NULL,
    `recorded_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_vitals_encounter` FOREIGN KEY (`encounter_id`) REFERENCES `clinical_encounters` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_vitals_patient` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE RESTRICT,
    INDEX `idx_vitals_encounter_id` (`encounter_id`),
    INDEX `idx_vitals_patient_id` (`patient_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `clinical_diagnoses` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `encounter_id` INT NOT NULL,
    `patient_id` INT NOT NULL,
    `icd10_code` VARCHAR(15) NOT NULL,
    `diagnosis_name` VARCHAR(200) NOT NULL,
    `diagnosis_type` ENUM('PRIMARY', 'SECONDARY') NOT NULL DEFAULT 'PRIMARY',
    `onset_date` DATE NULL,
    `status` ENUM('ACTIVE', 'CHRONIC', 'RESOLVED') NOT NULL DEFAULT 'ACTIVE',
    `notes` VARCHAR(255) NULL,
    CONSTRAINT `fk_diagnosis_encounter` FOREIGN KEY (`encounter_id`) REFERENCES `clinical_encounters` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_diagnosis_patient` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE RESTRICT,
    INDEX `idx_diag_encounter_id` (`encounter_id`),
    INDEX `idx_diag_patient_id` (`patient_id`),
    INDEX `idx_diag_icd10` (`icd10_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- MODULE 3: Computerized Provider Order Entry (CPOE)
-- =====================================================================

CREATE TABLE `cpoe_orders` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `order_number` VARCHAR(30) NOT NULL UNIQUE,
    `patient_id` INT NOT NULL,
    `provider_id` INT NOT NULL,
    `encounter_id` INT NOT NULL,
    `order_type` ENUM('LAB', 'IMAGING', 'MEDICATION', 'PROCEDURE') NOT NULL,
    `priority` ENUM('ROUTINE', 'URGENT', 'STAT') NOT NULL DEFAULT 'ROUTINE',
    `order_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `clinical_indication` TEXT NOT NULL,
    `order_status` ENUM('PLACED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PLACED',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_cpoe_patient` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_cpoe_provider` FOREIGN KEY (`provider_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_cpoe_encounter` FOREIGN KEY (`encounter_id`) REFERENCES `clinical_encounters` (`id`) ON DELETE CASCADE,
    INDEX `idx_cpoe_patient_id` (`patient_id`),
    INDEX `idx_cpoe_provider_id` (`provider_id`),
    INDEX `idx_cpoe_status` (`order_status`),
    INDEX `idx_cpoe_date` (`order_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `cpoe_order_items` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `order_id` INT NOT NULL,
    `item_code` VARCHAR(30) NOT NULL,
    `item_name` VARCHAR(150) NOT NULL,
    `instructions` VARCHAR(255) NULL,
    `status` ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    CONSTRAINT `fk_order_item_order` FOREIGN KEY (`order_id`) REFERENCES `cpoe_orders` (`id`) ON DELETE CASCADE,
    INDEX `idx_order_item_order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- MODULE 4: Medication Management
-- =====================================================================

CREATE TABLE `medications_catalog` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `drug_code` VARCHAR(30) NOT NULL UNIQUE,
    `brand_name` VARCHAR(100) NOT NULL,
    `generic_name` VARCHAR(100) NOT NULL,
    `dosage_form` VARCHAR(50) NOT NULL, -- Tablet, Capsule, Syrup, Injection
    `strength` VARCHAR(50) NOT NULL,     -- 500mg, 10mg/ml
    `route` VARCHAR(30) NOT NULL,        -- Oral, IV, IM, Topical
    `manufacturer` VARCHAR(100) NOT NULL,
    `unit_price_inr` DECIMAL(8,2) NOT NULL DEFAULT 10.00,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    INDEX `idx_med_generic` (`generic_name`),
    INDEX `idx_med_brand` (`brand_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `prescriptions` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `prescription_number` VARCHAR(30) NOT NULL UNIQUE,
    `patient_id` INT NOT NULL,
    `doctor_id` INT NOT NULL,
    `encounter_id` INT NOT NULL,
    `prescription_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `notes` TEXT NULL,
    `status` ENUM('ACTIVE', 'DISCONTINUED', 'COMPLETED') NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_rx_patient` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_rx_doctor` FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_rx_encounter` FOREIGN KEY (`encounter_id`) REFERENCES `clinical_encounters` (`id`) ON DELETE CASCADE,
    INDEX `idx_rx_patient_id` (`patient_id`),
    INDEX `idx_rx_doctor_id` (`doctor_id`),
    INDEX `idx_rx_date` (`prescription_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `prescription_items` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `prescription_id` INT NOT NULL,
    `medication_id` INT NOT NULL,
    `dosage` VARCHAR(50) NOT NULL,
    `frequency` VARCHAR(50) NOT NULL,      -- e.g. 1-0-1 (BID) After Food
    `duration_days` INT NOT NULL,
    `instructions` VARCHAR(255) NULL,
    `quantity` INT NOT NULL,
    `refills_allowed` INT NOT NULL DEFAULT 0,
    CONSTRAINT `fk_rx_item_prescription` FOREIGN KEY (`prescription_id`) REFERENCES `prescriptions` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_rx_item_medication` FOREIGN KEY (`medication_id`) REFERENCES `medications_catalog` (`id`) ON DELETE RESTRICT,
    INDEX `idx_rx_item_rx_id` (`prescription_id`),
    INDEX `idx_rx_item_med_id` (`medication_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `medication_administrations` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `prescription_item_id` INT NOT NULL,
    `patient_id` INT NOT NULL,
    `administered_by` INT NOT NULL, -- User with nurse/doctor role
    `administered_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `dose_given` VARCHAR(50) NOT NULL,
    `status` ENUM('GIVEN', 'REFUSED', 'MISSED', 'HELD') NOT NULL DEFAULT 'GIVEN',
    `remarks` VARCHAR(255) NULL,
    CONSTRAINT `fk_medadmin_item` FOREIGN KEY (`prescription_item_id`) REFERENCES `prescription_items` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_medadmin_patient` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_medadmin_user` FOREIGN KEY (`administered_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
    INDEX `idx_medadmin_patient` (`patient_id`),
    INDEX `idx_medadmin_time` (`administered_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- MODULE 5: Lab and Imaging Integration
-- =====================================================================

CREATE TABLE `lab_test_catalog` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `test_code` VARCHAR(30) NOT NULL UNIQUE,
    `test_name` VARCHAR(150) NOT NULL,
    `category` VARCHAR(60) NOT NULL, -- Hematology, Biochemistry, Microbiology, Serology
    `sample_type` VARCHAR(50) NOT NULL, -- Whole Blood, Serum, Urine
    `normal_range_min` DECIMAL(8,2) NULL,
    `normal_range_max` DECIMAL(8,2) NULL,
    `unit` VARCHAR(20) NULL,
    `price_inr` DECIMAL(8,2) NOT NULL DEFAULT 300.00,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    INDEX `idx_lab_cat` (`category`),
    INDEX `idx_lab_name` (`test_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `lab_orders` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `order_item_id` INT NULL,
    `patient_id` INT NOT NULL,
    `test_id` INT NOT NULL,
    `ordered_by` INT NOT NULL,
    `collected_at` DATETIME NULL,
    `status` ENUM('ORDERED', 'SAMPLE_COLLECTED', 'IN_ANALYSIS', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'ORDERED',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_laborder_item` FOREIGN KEY (`order_item_id`) REFERENCES `cpoe_order_items` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_laborder_patient` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_laborder_test` FOREIGN KEY (`test_id`) REFERENCES `lab_test_catalog` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_laborder_ordered_by` FOREIGN KEY (`ordered_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
    INDEX `idx_laborder_patient` (`patient_id`),
    INDEX `idx_laborder_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `lab_results` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `lab_order_id` INT NOT NULL,
    `test_id` INT NOT NULL,
    `measured_value` VARCHAR(50) NOT NULL,
    `unit` VARCHAR(20) NULL,
    `flag` ENUM('NORMAL', 'HIGH', 'LOW', 'CRITICAL') NOT NULL DEFAULT 'NORMAL',
    `technician_notes` TEXT NULL,
    `reported_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `verified_by` INT NOT NULL, -- User
    CONSTRAINT `fk_labres_order` FOREIGN KEY (`lab_order_id`) REFERENCES `lab_orders` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_labres_test` FOREIGN KEY (`test_id`) REFERENCES `lab_test_catalog` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_labres_verifier` FOREIGN KEY (`verified_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
    INDEX `idx_labres_order` (`lab_order_id`),
    INDEX `idx_labres_flag` (`flag`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `imaging_studies` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `order_item_id` INT NULL,
    `patient_id` INT NOT NULL,
    `modality` ENUM('X-RAY', 'CT', 'MRI', 'ULTRASOUND', 'ECHO') NOT NULL,
    `body_site` VARCHAR(100) NOT NULL,
    `study_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `accession_number` VARCHAR(50) NOT NULL UNIQUE,
    `dicom_link` VARCHAR(255) NULL,
    `status` ENUM('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'COMPLETED',
    CONSTRAINT `fk_imaging_order_item` FOREIGN KEY (`order_item_id`) REFERENCES `cpoe_order_items` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_imaging_patient` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE RESTRICT,
    INDEX `idx_imaging_patient` (`patient_id`),
    INDEX `idx_imaging_modality` (`modality`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `imaging_reports` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `study_id` INT NOT NULL UNIQUE,
    `radiologist_id` INT NOT NULL,
    `findings` TEXT NOT NULL,
    `impression` TEXT NOT NULL,
    `reported_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_imgrep_study` FOREIGN KEY (`study_id`) REFERENCES `imaging_studies` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_imgrep_radio` FOREIGN KEY (`radiologist_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
    INDEX `idx_imgrep_study` (`study_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- MODULE 6: Clinical Decision Support (CDS)
-- =====================================================================

CREATE TABLE `cds_rules` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `rule_code` VARCHAR(30) NOT NULL UNIQUE,
    `title` VARCHAR(100) NOT NULL,
    `rule_category` ENUM('DRUG_INTERACTION', 'ALLERGY_ALERT', 'VITAL_ALERT', 'DOSAGE_ALERT') NOT NULL,
    `description` TEXT NOT NULL,
    `severity_level` ENUM('INFO', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL,
    `criteria_json` JSON NULL,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_cds_cat` (`rule_category`),
    INDEX `idx_cds_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `cds_alerts` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `patient_id` INT NOT NULL,
    `encounter_id` INT NULL,
    `rule_id` INT NOT NULL,
    `alert_title` VARCHAR(150) NOT NULL,
    `alert_message` TEXT NOT NULL,
    `severity` ENUM('INFO', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL,
    `triggered_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `acknowledged_by` INT NULL,
    `acknowledgement_notes` VARCHAR(255) NULL,
    CONSTRAINT `fk_cds_patient` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_cds_encounter` FOREIGN KEY (`encounter_id`) REFERENCES `clinical_encounters` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_cds_rule` FOREIGN KEY (`rule_id`) REFERENCES `cds_rules` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_cds_ack_user` FOREIGN KEY (`acknowledged_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
    INDEX `idx_cds_alert_patient` (`patient_id`),
    INDEX `idx_cds_alert_severity` (`severity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- MODULE 7: Patient Portal
-- =====================================================================

CREATE TABLE `appointments` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `appointment_number` VARCHAR(30) NOT NULL UNIQUE,
    `patient_id` INT NOT NULL,
    `doctor_id` INT NOT NULL,
    `appointment_date` DATE NOT NULL,
    `time_slot` VARCHAR(20) NOT NULL,     -- e.g. "10:30 AM - 11:00 AM"
    `reason_for_visit` VARCHAR(255) NOT NULL,
    `status` ENUM('SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'SCHEDULED',
    `booking_type` ENUM('PORTAL', 'DESK', 'PHONE') NOT NULL DEFAULT 'PORTAL',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_appt_patient` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_appt_doctor` FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
    INDEX `idx_appt_patient` (`patient_id`),
    INDEX `idx_appt_doctor` (`doctor_id`),
    INDEX `idx_appt_date` (`appointment_date`),
    INDEX `idx_appt_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `portal_messages` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `sender_id` INT NOT NULL,
    `receiver_id` INT NOT NULL,
    `patient_id` INT NOT NULL,
    `subject` VARCHAR(150) NOT NULL,
    `message_body` TEXT NOT NULL,
    `is_read` TINYINT(1) NOT NULL DEFAULT 0,
    `sent_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_msg_sender` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_msg_receiver` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_msg_patient` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE RESTRICT,
    INDEX `idx_msg_sender` (`sender_id`),
    INDEX `idx_msg_receiver` (`receiver_id`),
    INDEX `idx_msg_patient` (`patient_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `patient_health_documents` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `patient_id` INT NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `document_type` ENUM('DISCHARGE_SUMMARY', 'LAB_REPORT', 'PRESCRIPTION', 'INSURANCE', 'OTHER') NOT NULL,
    `file_path` VARCHAR(255) NOT NULL,
    `notes` VARCHAR(255) NULL,
    `uploaded_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_docs_patient` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE,
    INDEX `idx_docs_patient` (`patient_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- MODULE 8: Interoperability and Integration
-- =====================================================================

CREATE TABLE `fhir_resources` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `resource_type` VARCHAR(50) NOT NULL, -- Patient, Observation, DiagnosticReport, MedicationRequest
    `resource_id` VARCHAR(50) NOT NULL UNIQUE,
    `fhir_version` VARCHAR(10) NOT NULL DEFAULT 'R4',
    `json_payload` JSON NOT NULL,
    `last_updated` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_fhir_type` (`resource_type`),
    INDEX `idx_fhir_resid` (`resource_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `system_audit_logs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NULL,
    `action` VARCHAR(50) NOT NULL,       -- CREATE, UPDATE, DELETE, VIEW, LOGIN, LOGOUT
    `entity_name` VARCHAR(50) NOT NULL,  -- Patient, Prescription, LabResult
    `entity_id` VARCHAR(50) NULL,
    `ip_address` VARCHAR(45) NULL,
    `performed_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `details` TEXT NULL,
    CONSTRAINT `fk_audit_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
    INDEX `idx_audit_user` (`user_id`),
    INDEX `idx_audit_action` (`action`),
    INDEX `idx_audit_entity` (`entity_name`),
    INDEX `idx_audit_time` (`performed_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
