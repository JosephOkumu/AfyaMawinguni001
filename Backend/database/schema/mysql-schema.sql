/*M!999999\- enable the sandbox mode */ 
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;
DROP TABLE IF EXISTS `appointments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointments` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `patient_id` bigint(20) unsigned NOT NULL,
  `doctor_id` bigint(20) unsigned NOT NULL,
  `appointment_datetime` datetime NOT NULL,
  `status` enum('pending','confirmed','scheduled','completed','cancelled','rescheduled','no_show') DEFAULT 'pending',
  `type` enum('in_person','virtual') NOT NULL DEFAULT 'in_person',
  `reason_for_visit` text DEFAULT NULL,
  `symptoms` text DEFAULT NULL,
  `doctor_notes` text DEFAULT NULL,
  `prescription` text DEFAULT NULL,
  `meeting_link` varchar(255) DEFAULT NULL,
  `fee` decimal(10,2) NOT NULL,
  `is_paid` tinyint(1) NOT NULL DEFAULT 0,
  `payment_reference` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `appointments_patient_id_foreign` (`patient_id`),
  KEY `appointments_doctor_id_foreign` (`doctor_id`),
  KEY `appointments_appointment_datetime_index` (`appointment_datetime`),
  KEY `appointments_status_index` (`status`),
  KEY `appointments_payment_reference_index` (`payment_reference`),
  CONSTRAINT `appointments_doctor_id_foreign` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE CASCADE,
  CONSTRAINT `appointments_patient_id_foreign` FOREIGN KEY (`patient_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `doctors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctors` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `specialty` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `professional_summary` text DEFAULT NULL,
  `years_of_experience` varchar(255) DEFAULT NULL,
  `license_number` varchar(255) NOT NULL,
  `experience` text DEFAULT NULL,
  `consultation_fee` decimal(10,2) NOT NULL,
  `physical_consultation_fee` decimal(10,2) DEFAULT NULL,
  `online_consultation_fee` decimal(10,2) DEFAULT NULL,
  `languages` text DEFAULT NULL,
  `accepts_insurance` tinyint(1) NOT NULL DEFAULT 0,
  `consultation_modes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`consultation_modes`)),
  `availability` text DEFAULT NULL,
  `availability_schedule` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`availability_schedule`)),
  `appointment_duration_minutes` int(11) NOT NULL DEFAULT 30,
  `repeat_weekly` tinyint(1) NOT NULL DEFAULT 1,
  `is_available_for_consultation` tinyint(1) NOT NULL DEFAULT 1,
  `average_rating` int(11) NOT NULL DEFAULT 0,
  `profile_image` varchar(255) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `hospital` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `doctors_license_number_unique` (`license_number`),
  KEY `doctors_user_id_foreign` (`user_id`),
  CONSTRAINT `doctors_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `lab_appointment_tests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `lab_appointment_tests` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `lab_appointment_id` bigint(20) unsigned NOT NULL,
  `lab_test_service_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `lab_appt_test_unique` (`lab_appointment_id`,`lab_test_service_id`),
  KEY `lab_appointment_tests_lab_appointment_id_index` (`lab_appointment_id`),
  KEY `lab_appointment_tests_lab_test_service_id_index` (`lab_test_service_id`),
  CONSTRAINT `lab_appointment_tests_lab_appointment_id_foreign` FOREIGN KEY (`lab_appointment_id`) REFERENCES `lab_appointments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `lab_appointment_tests_lab_test_service_id_foreign` FOREIGN KEY (`lab_test_service_id`) REFERENCES `lab_test_services` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `lab_appointments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `lab_appointments` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `patient_id` bigint(20) unsigned NOT NULL,
  `lab_provider_id` bigint(20) unsigned NOT NULL,
  `appointment_datetime` datetime NOT NULL,
  `status` enum('scheduled','confirmed','completed','cancelled','rescheduled','in_progress') NOT NULL DEFAULT 'scheduled',
  `test_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`test_ids`)),
  `total_amount` decimal(10,2) NOT NULL,
  `is_paid` tinyint(1) NOT NULL DEFAULT 0,
  `payment_reference` varchar(255) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `results` text DEFAULT NULL,
  `lab_notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `lab_appointments_patient_id_appointment_datetime_index` (`patient_id`,`appointment_datetime`),
  KEY `lab_appointments_lab_provider_id_appointment_datetime_index` (`lab_provider_id`,`appointment_datetime`),
  KEY `lab_appointments_status_index` (`status`),
  KEY `lab_appointments_is_paid_index` (`is_paid`),
  CONSTRAINT `lab_appointments_lab_provider_id_foreign` FOREIGN KEY (`lab_provider_id`) REFERENCES `lab_providers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `lab_appointments_patient_id_foreign` FOREIGN KEY (`patient_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `lab_providers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `lab_providers` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `lab_name` varchar(255) NOT NULL,
  `license_number` varchar(255) NOT NULL,
  `website` varchar(255) DEFAULT NULL,
  `address` text NOT NULL,
  `operating_hours` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `contact_person_name` varchar(255) DEFAULT NULL,
  `contact_person_role` varchar(255) DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `certifications` text DEFAULT NULL,
  `is_available` tinyint(1) NOT NULL DEFAULT 1,
  `average_rating` decimal(3,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `lab_providers_license_number_unique` (`license_number`),
  KEY `lab_providers_user_id_foreign` (`user_id`),
  CONSTRAINT `lab_providers_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `lab_test_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `lab_test_services` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `lab_provider_id` bigint(20) unsigned NOT NULL,
  `test_name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `turnaround_time` varchar(255) DEFAULT NULL,
  `sample_type` varchar(255) DEFAULT NULL,
  `preparation_instructions` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `lab_test_services_lab_provider_id_is_active_index` (`lab_provider_id`,`is_active`),
  KEY `lab_test_services_test_name_index` (`test_name`),
  CONSTRAINT `lab_test_services_lab_provider_id_foreign` FOREIGN KEY (`lab_provider_id`) REFERENCES `lab_providers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `lab_tests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `lab_tests` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `patient_id` bigint(20) unsigned NOT NULL,
  `lab_provider_id` bigint(20) unsigned NOT NULL,
  `test_name` varchar(255) NOT NULL,
  `test_description` text DEFAULT NULL,
  `test_price` decimal(10,2) NOT NULL,
  `scheduled_datetime` datetime NOT NULL,
  `sample_collection_mode` enum('lab_visit','home_collection') NOT NULL DEFAULT 'lab_visit',
  `sample_collection_address` text DEFAULT NULL,
  `status` enum('scheduled','sample_collected','processing','completed','cancelled') NOT NULL DEFAULT 'scheduled',
  `results` text DEFAULT NULL,
  `results_available_at` datetime DEFAULT NULL,
  `doctor_referral` text DEFAULT NULL,
  `is_paid` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `lab_tests_patient_id_foreign` (`patient_id`),
  KEY `lab_tests_lab_provider_id_foreign` (`lab_provider_id`),
  KEY `lab_tests_scheduled_datetime_index` (`scheduled_datetime`),
  KEY `lab_tests_status_index` (`status`),
  CONSTRAINT `lab_tests_lab_provider_id_foreign` FOREIGN KEY (`lab_provider_id`) REFERENCES `lab_providers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `lab_tests_patient_id_foreign` FOREIGN KEY (`patient_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `medicine_order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `medicine_order_items` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint(20) unsigned NOT NULL,
  `medicine_id` bigint(20) unsigned NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `special_instructions` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `medicine_order_items_medicine_id_foreign` (`medicine_id`),
  KEY `medicine_order_items_order_id_medicine_id_index` (`order_id`,`medicine_id`),
  CONSTRAINT `medicine_order_items_medicine_id_foreign` FOREIGN KEY (`medicine_id`) REFERENCES `medicines` (`id`),
  CONSTRAINT `medicine_order_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `medicine_orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `medicine_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `medicine_orders` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `patient_id` bigint(20) unsigned NOT NULL,
  `pharmacy_id` bigint(20) unsigned NOT NULL,
  `order_number` varchar(255) NOT NULL,
  `status` enum('pending','processing','out_for_delivery','delivered','cancelled') NOT NULL DEFAULT 'pending',
  `subtotal` decimal(10,2) NOT NULL,
  `delivery_fee` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total` decimal(10,2) NOT NULL,
  `delivery_address` text NOT NULL,
  `delivery_contact_number` varchar(255) NOT NULL,
  `delivery_instructions` text DEFAULT NULL,
  `is_prescription_required` tinyint(1) NOT NULL DEFAULT 0,
  `prescription_image` varchar(255) DEFAULT NULL,
  `delivery_datetime` datetime DEFAULT NULL,
  `is_paid` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `medicine_orders_order_number_unique` (`order_number`),
  KEY `medicine_orders_patient_id_foreign` (`patient_id`),
  KEY `medicine_orders_pharmacy_id_foreign` (`pharmacy_id`),
  KEY `medicine_orders_order_number_index` (`order_number`),
  KEY `medicine_orders_status_index` (`status`),
  KEY `medicine_orders_created_at_index` (`created_at`),
  CONSTRAINT `medicine_orders_patient_id_foreign` FOREIGN KEY (`patient_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `medicine_orders_pharmacy_id_foreign` FOREIGN KEY (`pharmacy_id`) REFERENCES `pharmacies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `medicines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `medicines` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `pharmacy_id` bigint(20) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `generic_name` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `manufacturer` varchar(255) DEFAULT NULL,
  `category` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `dosage_form` varchar(255) NOT NULL,
  `strength` varchar(255) DEFAULT NULL,
  `requires_prescription` tinyint(1) NOT NULL DEFAULT 0,
  `is_available` tinyint(1) NOT NULL DEFAULT 1,
  `stock_quantity` int(11) NOT NULL DEFAULT 0,
  `image` varchar(255) DEFAULT NULL,
  `side_effects` text DEFAULT NULL,
  `contraindications` text DEFAULT NULL,
  `storage_instructions` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `medicines_pharmacy_id_foreign` (`pharmacy_id`),
  KEY `medicines_name_index` (`name`),
  KEY `medicines_category_index` (`category`),
  KEY `medicines_is_available_index` (`is_available`),
  CONSTRAINT `medicines_pharmacy_id_foreign` FOREIGN KEY (`pharmacy_id`) REFERENCES `pharmacies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `nursing_provider_unavailable_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `nursing_provider_unavailable_sessions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `nursing_provider_id` bigint(20) unsigned NOT NULL,
  `date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `np_unavailable_unique` (`nursing_provider_id`,`date`,`start_time`,`end_time`),
  KEY `np_unavail_provider_date_idx` (`nursing_provider_id`,`date`),
  KEY `np_unavail_date_idx` (`date`),
  CONSTRAINT `np_unavailable_provider_fk` FOREIGN KEY (`nursing_provider_id`) REFERENCES `nursing_providers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `nursing_providers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `nursing_providers` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `provider_name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `license_number` varchar(255) NOT NULL,
  `qualifications` text NOT NULL,
  `services_offered` text NOT NULL,
  `service_areas` text DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `base_rate_per_hour` decimal(10,2) NOT NULL,
  `is_available` tinyint(1) NOT NULL DEFAULT 1,
  `average_rating` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `appointment_duration_minutes` int(11) NOT NULL DEFAULT 30,
  `availability_schedule` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`availability_schedule`)),
  `repeat_weekly` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nursing_providers_license_number_unique` (`license_number`),
  KEY `nursing_providers_user_id_foreign` (`user_id`),
  CONSTRAINT `nursing_providers_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `nursing_service_offerings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `nursing_service_offerings` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `nursing_provider_id` bigint(20) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `location` varchar(255) NOT NULL,
  `availability` varchar(255) NOT NULL,
  `experience` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `nursing_service_offerings_nursing_provider_id_index` (`nursing_provider_id`),
  KEY `nursing_service_offerings_is_active_index` (`is_active`),
  CONSTRAINT `nursing_service_offerings_nursing_provider_id_foreign` FOREIGN KEY (`nursing_provider_id`) REFERENCES `nursing_providers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `nursing_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `nursing_services` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `patient_id` bigint(20) unsigned NOT NULL,
  `nursing_provider_id` bigint(20) unsigned NOT NULL,
  `service_name` varchar(255) NOT NULL,
  `service_description` text DEFAULT NULL,
  `service_price` decimal(10,2) NOT NULL,
  `scheduled_datetime` datetime NOT NULL,
  `end_datetime` datetime DEFAULT NULL,
  `patient_address` text NOT NULL,
  `status` enum('scheduled','confirmed','in_progress','completed','cancelled') NOT NULL DEFAULT 'scheduled',
  `care_notes` text DEFAULT NULL,
  `patient_requirements` text DEFAULT NULL,
  `medical_history` text DEFAULT NULL,
  `doctor_referral` text DEFAULT NULL,
  `is_recurring` tinyint(1) NOT NULL DEFAULT 0,
  `recurrence_pattern` varchar(255) DEFAULT NULL,
  `is_paid` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `nursing_services_patient_id_foreign` (`patient_id`),
  KEY `nursing_services_nursing_provider_id_foreign` (`nursing_provider_id`),
  KEY `nursing_services_scheduled_datetime_index` (`scheduled_datetime`),
  KEY `nursing_services_status_index` (`status`),
  CONSTRAINT `nursing_services_nursing_provider_id_foreign` FOREIGN KEY (`nursing_provider_id`) REFERENCES `nursing_providers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `nursing_services_patient_id_foreign` FOREIGN KEY (`patient_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `payment_id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned NOT NULL,
  `payable_type` varchar(255) NOT NULL,
  `payable_id` bigint(20) unsigned NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('pending','completed','failed','refunded') NOT NULL DEFAULT 'pending',
  `payment_method` enum('card','mobile_money','bank_transfer','cash') NOT NULL DEFAULT 'mobile_money',
  `transaction_reference` varchar(255) DEFAULT NULL,
  `payment_details` text DEFAULT NULL,
  `paid_at` datetime DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `payments_payment_id_unique` (`payment_id`),
  KEY `payments_user_id_foreign` (`user_id`),
  KEY `payments_payable_type_payable_id_index` (`payable_type`,`payable_id`),
  KEY `payments_payment_id_index` (`payment_id`),
  KEY `payments_status_index` (`status`),
  KEY `payments_paid_at_index` (`paid_at`),
  CONSTRAINT `payments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `pharmacies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `pharmacies` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `pharmacy_name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `license_number` varchar(255) NOT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `operating_hours` text DEFAULT NULL,
  `address` text NOT NULL,
  `city` varchar(255) NOT NULL,
  `offers_delivery` tinyint(1) NOT NULL DEFAULT 0,
  `delivery_fee` decimal(10,2) DEFAULT NULL,
  `is_available` tinyint(1) NOT NULL DEFAULT 1,
  `average_rating` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `pharmacies_license_number_unique` (`license_number`),
  KEY `pharmacies_user_id_foreign` (`user_id`),
  CONSTRAINT `pharmacies_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `patient_id` bigint(20) unsigned NOT NULL,
  `doctor_id` bigint(20) unsigned DEFAULT NULL,
  `appointment_id` bigint(20) unsigned DEFAULT NULL,
  `rating` int(10) unsigned NOT NULL,
  `review_text` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `nursing_provider_id` bigint(20) unsigned DEFAULT NULL,
  `nursing_service_id` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `reviews_appointment_id_unique` (`appointment_id`),
  KEY `reviews_patient_id_foreign` (`patient_id`),
  KEY `reviews_doctor_id_foreign` (`doctor_id`),
  KEY `reviews_nursing_provider_id_foreign` (`nursing_provider_id`),
  KEY `reviews_nursing_service_id_foreign` (`nursing_service_id`),
  CONSTRAINT `reviews_appointment_id_foreign` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_doctor_id_foreign` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_nursing_provider_id_foreign` FOREIGN KEY (`nursing_provider_id`) REFERENCES `nursing_providers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_nursing_service_id_foreign` FOREIGN KEY (`nursing_service_id`) REFERENCES `nursing_services` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_patient_id_foreign` FOREIGN KEY (`patient_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `unavailable_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `unavailable_sessions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `doctor_id` bigint(20) unsigned NOT NULL,
  `date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `unavailable_sessions_doctor_id_date_index` (`doctor_id`,`date`),
  CONSTRAINT `unavailable_sessions_doctor_id_foreign` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `user_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_profiles` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `address` text DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `postal_code` varchar(255) DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_profiles_user_id_foreign` (`user_id`),
  CONSTRAINT `user_profiles_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `user_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_types` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `display_name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `license_number` varchar(255) DEFAULT NULL,
  `national_id` varchar(255) DEFAULT NULL,
  `user_type_id` bigint(20) unsigned DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

/*M!999999\- enable the sandbox mode */ 
set autocommit=0;
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (1,'0001_01_01_000000_create_users_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (2,'0001_01_01_000001_create_cache_table',2);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (3,'0001_01_01_000002_create_jobs_table',3);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (4,'2025_05_22_175609_create_users_table',4);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (5,'2025_05_22_175610_create_user_types_table',5);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (6,'2025_05_22_175611_create_user_profiles_table',6);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (7,'2025_05_22_175629_create_doctors_table',7);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (8,'2025_05_22_175630_create_lab_providers_table',8);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (9,'2025_05_22_175630_create_nursing_providers_table',9);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (10,'2025_05_22_175631_create_pharmacies_table',10);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (11,'2025_05_22_175656_create_appointments_table',11);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (12,'2025_05_22_175657_create_lab_tests_table',12);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (13,'2025_05_22_175657_create_nursing_services_table',13);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (14,'2025_05_22_175701_create_medicines_table',14);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (15,'2025_05_22_175721_create_medicine_orders_table',15);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (16,'2025_05_22_175722_create_payments_table',16);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (17,'2025_05_22_175722_create_reviews_table',17);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (18,'2025_05_22_185528_create_medicine_order_items_table',18);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (19,'2025_05_23_054300_create_personal_access_tokens_table',19);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (20,'2025_05_23_054500_ensure_pharmacy_table',20);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (21,'2025_05_23_110000_create_user_types_table',21);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (22,'2025_05_23_110001_create_user_profiles_table',22);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (23,'2025_05_23_120000_add_verification_fields_to_users_table',23);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (24,'2025_06_28_023929_create_lab_test_services_table',24);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (25,'2025_01_07_000000_create_lab_appointments_table',25);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (26,'2025_01_07_000001_create_lab_appointment_tests_table',26);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (27,'2025_09_28_100405_add_profile_image_to_doctors_table',27);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (28,'2025_07_02_035944_add_bio_to_doctors_table',28);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (29,'2025_09_28_100910_add_location_to_doctors_table',29);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (30,'2025_07_02_050625_add_hospital_to_doctors_table',30);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (31,'2025_07_02_073843_create_nursing_service_offerings_table',31);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (32,'2025_08_30_150710_add_confirmed_status_to_nursing_services_table',32);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (33,'2025_09_02_203015_add_payment_reference_to_appointments_table',33);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (34,'2025_09_23_190309_add_location_to_nursing_providers_table',34);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (35,'2025_01_15_000000_remove_education_fields_from_doctors_table',35);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (36,'2025_09_23_192259_add_availability_settings_to_nursing_providers_table',36);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (37,'2025_09_26_213732_create_nursing_provider_unavailable_sessions_table',37);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (38,'2025_09_27_173935_add_availability_settings_to_doctors_table',38);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (39,'2025_09_27_175457_create_unavailable_sessions_table',39);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (40,'2025_05_22_210713_create_pharmacies_table',40);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (41,'2025_09_28_111229_add_missing_fields_to_doctors_table',41);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (42,'2025_09_28_113636_add_availability_schedule_to_doctors_table',42);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (44,'2025_09_28_120631_add_pending_confirmed_status_to_appointments_table',43);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (45,'2025_09_28_225459_create_reviews_table',43);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (46,'2025_09_30_173506_create_reviews_table',44);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (48,'2025_10_02_170209_add_missing_availability_columns_to_nursing_providers_table',45);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (49,'2025_10_03_002700_add_nursing_provider_id_to_reviews_table',46);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (50,'2025_01_16_000002_fix_appointment_id_nullable',47);
commit;
