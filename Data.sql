-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: quanlybenxekhach
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bus`
--

DROP TABLE IF EXISTS `bus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bus` (
  `bus_id` int NOT NULL AUTO_INCREMENT,
  `bus_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bus_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_seats` int NOT NULL,
  `license_plate` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`bus_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bus`
--

LOCK TABLES `bus` WRITE;
/*!40000 ALTER TABLE `bus` DISABLE KEYS */;
INSERT INTO `bus` VALUES (1,'Xe khách 01','Giường nằm',46,'29B-12345','2024-11-19 14:53:12','2025-01-02 16:06:33','https://res.cloudinary.com/diimfetua/image/upload/v1735808792/lg51yvx2zcowzy9ibn75.webp','2024-11-19 14:53:12.404857','2024-11-25 10:29:05.653799'),(2,'Xe khách 02','Giường nằm',45,'29B-12345','2024-11-19 14:54:04','2024-11-25 10:28:04','https://res.cloudinary.com/diimfetua/image/upload/v1732505284/fpgqtdxlv8kfx6dzrwyn.png','2024-11-19 14:54:04.862677','2024-11-25 10:28:04.686692'),(4,'Xe khách 04','Giường nằm',46,'29B-12345','2024-11-22 16:26:15','2025-01-02 15:52:00','https://res.cloudinary.com/diimfetua/image/upload/v1735807919/xufzhgdvw49yqmrmsxnu.png','2024-11-22 16:26:15.238860','2024-11-22 16:26:15.238860'),(7,'Xe khách 07','Giường nằm',45,'51F-1289','2024-12-03 13:52:38','2025-01-05 16:37:40','https://res.cloudinary.com/diimfetua/image/upload/v1736069859/ogenvkbhblxemfuooeop.jpg',NULL,NULL),(8,'Xe khách 03','Giường nằm',50,'51-18958','2024-12-28 11:19:16','2024-12-28 11:19:16','https://res.cloudinary.com/diimfetua/image/upload/v1735359555/xmmgw4b4ryxmr2dtscm4.webp',NULL,NULL);
/*!40000 ALTER TABLE `bus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `cart_id` int NOT NULL AUTO_INCREMENT,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`cart_id`),
  KEY `fk_user_id` (`user_id`),
  CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (1,'2025-01-01 02:29:58','active',1),(2,'2025-01-01 11:02:35','active',7),(3,'2025-01-01 11:04:19','active',5),(4,'2025-01-04 14:42:45','active',8),(5,'2025-01-04 14:45:26','active',10),(6,'2025-01-04 14:54:47','active',11),(7,'2025-01-04 15:03:51','active',12);
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_detail`
--

DROP TABLE IF EXISTS `cart_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_detail` (
  `cart_detail_id` int NOT NULL AUTO_INCREMENT,
  `cart_id` int NOT NULL,
  `ticket_id` int NOT NULL,
  `quantity` int DEFAULT '1',
  `price` decimal(38,2) DEFAULT NULL,
  `seat_id` int DEFAULT NULL,
  PRIMARY KEY (`cart_detail_id`),
  KEY `cart_id` (`cart_id`),
  KEY `ticket_id` (`ticket_id`),
  KEY `fk_seat_id` (`seat_id`),
  CONSTRAINT `cart_detail_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`cart_id`),
  CONSTRAINT `cart_detail_ibfk_2` FOREIGN KEY (`ticket_id`) REFERENCES `ticket` (`ticket_id`),
  CONSTRAINT `fk_seat_id` FOREIGN KEY (`seat_id`) REFERENCES `seat` (`seat_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_detail`
--

LOCK TABLES `cart_detail` WRITE;
/*!40000 ALTER TABLE `cart_detail` DISABLE KEYS */;
INSERT INTO `cart_detail` VALUES (1,1,1,1,150000.00,NULL),(5,3,2,1,250000.00,NULL),(6,3,3,1,200000.00,3),(7,3,1,1,200000.00,2),(8,3,1,1,200000.00,2),(9,3,1,1,200000.00,2),(10,3,2,1,200000.00,5),(11,3,7,1,120000.00,9),(12,3,3,1,150000.00,3),(14,3,17,1,450000.00,14);
/*!40000 ALTER TABLE `cart_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer` (
  `customer_id` int NOT NULL AUTO_INCREMENT,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(6) DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `first_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updatedAt` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `drivers`
--

DROP TABLE IF EXISTS `drivers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `drivers` (
  `driverId` int NOT NULL AUTO_INCREMENT,
  `fullName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phoneNumber` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `licenseNumber` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`driverId`),
  UNIQUE KEY `licenseNumber` (`licenseNumber`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `drivers`
--

LOCK TABLES `drivers` WRITE;
/*!40000 ALTER TABLE `drivers` DISABLE KEYS */;
INSERT INTO `drivers` VALUES (1,'Nguyễn Văn A','0123456789','45649845','2024-11-25 03:49:51','2024-11-25 10:49:51','https://res.cloudinary.com/diimfetua/image/upload/v1732506590/q612el1xywtshi0hbg63.jpg'),(3,'Nguyễn Văn B','012345678','5119818181','2024-11-25 03:51:37','2024-11-25 10:53:16','https://res.cloudinary.com/diimfetua/image/upload/v1732506796/ofbgr2u17gkkdytugs3b.jpg'),(5,'Nguyễn Văn C','0123456789','4564484844','2024-11-25 03:51:59','2024-11-25 10:51:59','https://res.cloudinary.com/diimfetua/image/upload/v1732506719/jlsqqci0wpvlmprynbtr.jpg'),(6,'Nguyễn Văn D','0189595548','18948181848','2024-12-28 07:45:44','2024-12-28 14:45:44','https://res.cloudinary.com/diimfetua/image/upload/v1735371943/vlkfbxvcywwdhkqu1rij.jpg');
/*!40000 ALTER TABLE `drivers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_details`
--

DROP TABLE IF EXISTS `order_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_details` (
  `order_detail_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `ticket_id` int NOT NULL,
  `quantity` int DEFAULT '1',
  `price` decimal(38,2) DEFAULT NULL,
  PRIMARY KEY (`order_detail_id`),
  KEY `order_id` (`order_id`),
  KEY `ticket_id` (`ticket_id`),
  CONSTRAINT `order_details_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  CONSTRAINT `order_details_ibfk_2` FOREIGN KEY (`ticket_id`) REFERENCES `ticket` (`ticket_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_details`
--

LOCK TABLES `order_details` WRITE;
/*!40000 ALTER TABLE `order_details` DISABLE KEYS */;
INSERT INTO `order_details` VALUES (1,5,1,1,45000.00),(2,5,2,1,50000.00),(3,6,1,1,45000.00),(4,6,2,1,50000.00),(5,7,2,1,200000.00),(6,8,2,1,200000.00),(7,9,2,1,200000.00),(8,10,1,1,150000.00),(9,11,2,1,200000.00),(10,12,1,1,150000.00),(11,13,2,1,250000.00),(12,14,1,1,150000.00),(13,15,2,1,250000.00),(14,16,16,1,500000.00),(15,17,1,1,300000.00);
/*!40000 ALTER TABLE `order_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `orderDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total` decimal(38,2) DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  KEY `fk_user_id_ticket` (`user_id`),
  CONSTRAINT `fk_user_id_orders` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (5,'2025-01-01 02:09:41','Pending',0.00,1),(6,'2025-01-01 22:02:20','Pending',95000.00,5),(7,'2025-01-01 22:13:05','Pending',200000.00,5),(8,'2025-01-01 22:18:10','Pending',200000.00,5),(9,'2025-01-01 22:20:11','Pending',200000.00,5),(10,'2025-01-01 22:24:28','Pending',150000.00,5),(11,'2025-01-01 22:26:23','Pending',200000.00,5),(12,'2025-01-01 22:28:38','Pending',150000.00,5),(13,'2025-01-01 22:28:52','Pending',250000.00,5),(14,'2025-01-01 22:29:15','Pending',150000.00,5),(15,'2025-01-02 15:48:12','Pending',250000.00,5),(16,'2025-01-02 15:49:39','Pending',500000.00,5),(17,'2025-01-02 21:55:38','Pending',300000.00,7);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `routes`
--

DROP TABLE IF EXISTS `routes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `routes` (
  `routeId` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `startLocation` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `endLocation` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `distance` decimal(38,2) DEFAULT NULL,
  `estimatedDuration` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`routeId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `routes`
--

LOCK TABLES `routes` WRITE;
/*!40000 ALTER TABLE `routes` DISABLE KEYS */;
INSERT INTO `routes` VALUES (1,'Tuyến xe TPHCM - Đà Lạt','Thành phố Hồ Chí Minh','Đà Lạt',315.00,'6 giờ 20 phút','2024-11-25 11:24:28','2025-01-05 20:36:36'),(2,'Tuyến xe TPHCM - Nha Trang','Thành phố Hồ Chí Minh','Nha Trang',486.00,'11 giờ 30 phút','2024-11-25 14:58:17','2025-01-03 10:33:17'),(3,'Tuyến xe TPHCM - Quảng Nam','Thành phố Hồ Chí Minh','Quảng Nam',962.00,'20 giờ 10 phút','2024-11-25 15:01:42','2025-01-03 10:33:54'),(5,'Tuyến xe TPHCM - Vũng Tàu','TPHCM','Vũng Tàu',120.00,'3 giờ 15 phút','2024-12-28 15:10:08','2024-12-28 15:10:08');
/*!40000 ALTER TABLE `routes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seat`
--

DROP TABLE IF EXISTS `seat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seat` (
  `seat_id` int NOT NULL AUTO_INCREMENT,
  `bus_id` int DEFAULT NULL,
  `seat_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`seat_id`),
  KEY `bus_id` (`bus_id`),
  CONSTRAINT `seat_ibfk_1` FOREIGN KEY (`bus_id`) REFERENCES `bus` (`bus_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seat`
--

LOCK TABLES `seat` WRITE;
/*!40000 ALTER TABLE `seat` DISABLE KEYS */;
INSERT INTO `seat` VALUES (1,1,'A1 - Xe số 01','booked','2024-11-25 15:29:43','2025-01-02 16:20:21'),(2,1,'A2 -  Xe số 01','available','2024-11-25 15:30:10','2025-01-02 16:20:38'),(3,1,'A3 - Xe số 01','available','2024-11-25 15:30:14','2025-01-02 16:20:45'),(4,1,'B1 - Xe số 01','available','2024-11-25 15:30:18','2025-01-02 16:20:53'),(5,2,'A1 - Xe số 02','available','2024-11-25 15:30:21','2025-01-02 16:21:01'),(7,1,'B2 - Xe số 01','available','2024-12-24 10:49:51','2025-01-02 16:21:06'),(8,1,'B3 - Xe số 01','available','2024-12-28 15:43:56','2025-01-02 16:21:16'),(9,4,'A1 - Xe số 04','available','2025-01-02 15:16:30','2025-01-02 16:21:31'),(10,4,'B3 - Xe số 04','available','2025-01-02 15:24:17','2025-01-02 16:21:39'),(11,8,'A1 - Xe số 03','available','2025-01-02 15:31:24','2025-01-02 16:22:52'),(12,4,'A2 - Xe số 04','available','2025-01-02 15:39:37','2025-01-02 16:22:09'),(13,2,'C1 - Xe số 02','available','2025-01-02 15:42:23','2025-01-02 16:22:19'),(14,8,'A1 - Xe số 03','available','2025-01-02 15:46:08','2025-01-02 16:22:28');
/*!40000 ALTER TABLE `seat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticket`
--

DROP TABLE IF EXISTS `ticket`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ticket` (
  `ticket_id` int NOT NULL AUTO_INCREMENT,
  `trip_id` int DEFAULT NULL,
  `seat_id` int DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `booking_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`ticket_id`),
  KEY `trip_id` (`trip_id`),
  KEY `seat_id` (`seat_id`),
  KEY `FK_ticket_user` (`user_id`),
  CONSTRAINT `FK_ticket_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `ticket_ibfk_1` FOREIGN KEY (`trip_id`) REFERENCES `trip` (`trip_id`),
  CONSTRAINT `ticket_ibfk_2` FOREIGN KEY (`seat_id`) REFERENCES `seat` (`seat_id`),
  CONSTRAINT `ticket_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket`
--

LOCK TABLES `ticket` WRITE;
/*!40000 ALTER TABLE `ticket` DISABLE KEYS */;
INSERT INTO `ticket` VALUES (1,1,1,'booked','2024-11-26 14:45:40','2024-11-26 14:45:41','2025-01-02 21:55:23',7),(2,1,2,'booked','2024-11-26 14:45:58','2024-11-26 14:45:58','2025-01-02 14:34:52',5),(3,1,3,'booked','2024-11-26 14:46:25','2024-11-26 14:46:25','2025-01-02 15:29:27',5),(4,1,4,'CONFIRMED','2024-11-26 14:46:29','2024-11-26 14:46:30','2025-01-02 16:10:54',5),(5,2,1,'available','2024-12-28 20:30:51','2024-12-28 20:30:52','2025-01-02 16:10:54',1),(6,2,5,'available','2025-01-02 14:36:13','2025-01-02 14:36:14','2025-01-02 14:36:14',5),(7,3,9,'booked','2025-01-02 15:18:52','2025-01-02 15:18:53','2025-01-02 15:19:05',5),(8,3,5,'available','2025-01-02 15:22:05','2025-01-02 15:22:06','2025-01-02 16:10:54',2),(9,3,8,'available','2025-01-02 15:23:39','2025-01-02 15:23:39','2025-01-02 16:10:54',3),(10,3,8,'available','2025-01-02 15:26:07','2025-01-02 15:26:08','2025-01-02 16:10:54',3),(11,2,9,'available','2025-01-02 15:32:09','2025-01-02 15:32:09','2025-01-02 16:10:54',7),(12,2,9,'available','2025-01-02 15:34:53','2025-01-02 15:34:53','2025-01-02 16:10:54',2),(13,2,5,'available','2025-01-02 15:35:28','2025-01-02 15:35:28','2025-01-02 16:10:54',6),(14,2,9,'available','2025-01-02 15:35:53','2025-01-02 15:35:53','2025-01-02 16:10:54',6),(15,2,12,'available','2025-01-02 15:41:09','2025-01-02 15:41:10','2025-01-02 16:10:54',5),(16,2,13,'booked','2025-01-02 15:42:44','2025-01-02 15:42:45','2025-01-02 15:42:51',5),(17,4,14,'booked','2025-01-02 15:46:19','2025-01-02 15:46:19','2025-01-02 15:46:54',5);
/*!40000 ALTER TABLE `ticket` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trip`
--

DROP TABLE IF EXISTS `trip`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trip` (
  `trip_id` int NOT NULL AUTO_INCREMENT,
  `bus_id` int DEFAULT NULL,
  `departure_time` datetime NOT NULL,
  `arrival_time` datetime NOT NULL,
  `ticket_price` decimal(38,2) DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `routeId` int DEFAULT NULL,
  `tripName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `driver_id` int DEFAULT NULL,
  PRIMARY KEY (`trip_id`),
  KEY `bus_id` (`bus_id`),
  KEY `fk_route` (`routeId`),
  KEY `fk_trip_driver` (`driver_id`),
  CONSTRAINT `fk_route` FOREIGN KEY (`routeId`) REFERENCES `routes` (`routeId`),
  CONSTRAINT `fk_trip_driver` FOREIGN KEY (`driver_id`) REFERENCES `drivers` (`driverId`) ON DELETE SET NULL,
  CONSTRAINT `trip_ibfk_1` FOREIGN KEY (`bus_id`) REFERENCES `bus` (`bus_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trip`
--

LOCK TABLES `trip` WRITE;
/*!40000 ALTER TABLE `trip` DISABLE KEYS */;
INSERT INTO `trip` VALUES (1,1,'2024-12-01 08:00:00','2024-12-01 15:00:00',300000.00,'2024-11-26 14:39:08','2025-01-03 10:13:31',1,'Chuyến xe TPHCM- Đà Lạt ',1),(2,2,'2024-12-01 08:00:00','2024-12-01 20:00:00',450000.00,'2024-11-26 14:40:11','2025-01-03 10:13:31',2,'Chuyến xe TPHCM - Nha Trang',3),(3,4,'2024-12-29 10:12:00','2024-12-29 01:12:00',120000.00,'2024-12-29 10:12:42','2025-01-03 10:13:31',5,'Chuyến xe TPHCM - Vũng Tàu',5),(4,8,'2025-01-03 03:45:00','2025-01-04 03:45:00',450000.00,'2025-01-02 15:45:50','2025-01-03 10:13:31',3,'Chuyến xe TPHCM - Quảng Nam',6),(5,8,'2025-01-03 10:30:00','2025-01-03 20:30:00',450000.00,'2025-01-03 10:35:07','2025-01-03 10:35:07',2,'Chuyến xe TPHCM - Nha Trang',1);
/*!40000 ALTER TABLE `trip` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_role` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customer_id` int DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'quangnguyen','$2a$10$vwwkhBzcOhd/6oHVEN5U/O/g9CVB7eFjpZPh1hOFU1B1uoMniYoo6','ROLE_Staff','2024-11-26 10:22:16','2025-01-04 15:22:58','https://res.cloudinary.com/diimfetua/image/upload/v1735978977/momxwhqxrkblnywszo6q.jpg',NULL),(2,'letrang','$2a$10$t6nZgtlrYQGCsMdj6CyRguS7PQ/GYeUU1YxpzCrNjxkeSz4PeAs5O','ROLE_Admin','2024-11-26 10:22:44','2025-01-05 14:37:19','https://res.cloudinary.com/diimfetua/image/upload/v1736062638/usdbj2pilyvetgvdbrpa.jpg',NULL),(3,'letrang1','$2a$10$GCtSpiH2r81I8ffMR3ckVeZfK4nZvAuC6SpjsIsFWPaTCEN4GYd02','ROLE_Admin','2024-11-26 10:22:48','2025-01-01 10:12:56','https://res.cloudinary.com/diimfetua/image/upload/v1732591453/qmcks6cfzypqazprgssp.jpg',NULL),(5,'quang','$2a$10$w5S2pnY0lGU8rY5aXkQwrO3pcgDSQjFvms8fBCKvbV/.8wp.3holO','ROLE_Admin','2024-12-30 11:24:58','2024-12-30 11:24:58','https://res.cloudinary.com/diimfetua/image/upload/v1735532697/zydvkbsmxepfn4y4ymg9.jpg',NULL),(6,'letrang2','$2a$10$x08S4il5x5yS/YgPatsCI.vaDDPnAgxdc1XggH5qRDqSTFdsSogBK','ROLE_Admin','2025-01-01 10:58:38','2025-01-01 11:03:06','https://res.cloudinary.com/diimfetua/image/upload/v1735704155/kackbsprzp5fuk7mywx8.jpg',NULL),(7,'letrang3','$2a$10$i6e.WvnNBpug9y9w3cvWiuN44IBHb4b9OCFeERM.0WaMdepH6lKsW','ROLE_Customer','2025-01-01 11:02:35','2025-01-02 22:02:30','https://res.cloudinary.com/diimfetua/image/upload/v1735704155/kackbsprzp5fuk7mywx8.jpg',NULL),(8,'quang1','$2a$10$yhR/N8MATSVUyB0oeEIG9.LrB6.gwKgWN2idHTtlt63WGobAWVBfS','ROLE_Staff','2025-01-04 14:42:44','2025-01-04 14:42:44','https://res.cloudinary.com/diimfetua/image/upload/v1735976563/ymq6vu0mkjixbnv52tuv.jpg',NULL),(10,'quang2','$2a$10$XNyExK.j/zsiBjXZF1HpDOTcdyl7rmX0tk4qerFNG3QlkdIdC8aQ2','ROLE_Staff','2025-01-04 14:45:26','2025-01-04 14:45:26','https://res.cloudinary.com/diimfetua/image/upload/v1735976725/f2s47ynmcy34upqmouff.jpg',NULL),(11,'quang3','$2a$10$vYiv3KYnxzy49KpirwyCVOcij5Ahib.nRpNAOHaw93Nf2LXMwBmNq','ROLE_Customer','2025-01-04 14:54:47','2025-01-04 14:54:47','https://res.cloudinary.com/diimfetua/image/upload/v1735977286/uyml0ais6kc1u7hffimk.jpg',NULL),(12,'quang4','$2a$10$2.o/S4vhRcQhft5lUscMIuNFK7HMnP5t1iuSI11uxb8Uppxa8BSP2','ROLE_Customer','2025-01-04 15:03:51','2025-01-04 15:03:51','https://res.cloudinary.com/diimfetua/image/upload/v1735977830/ipn4lbz3ln9pwdeuhbqj.jpg',NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-11 14:51:02
