-- MySQL dump 10.13  Distrib 8.0.16, for Win64 (x86_64)
--
-- Host: localhost    Database: gartic
-- ------------------------------------------------------
-- Server version	8.0.16

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8mb4 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `animals`
--

DROP TABLE IF EXISTS `animals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `animals` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `animals`
--

LOCK TABLES `animals` WRITE;
/*!40000 ALTER TABLE `animals` DISABLE KEYS */;
INSERT INTO `animals` VALUES (1,'蝙蝠'),(2,'老鼠'),(3,'刺蝟'),(4,'石虎'),(5,'食蟻獸'),(6,'穿山甲'),(7,'水豚'),(8,'狐狸'),(9,'水母'),(10,'烏賊'),(11,'貓頭鷹'),(12,'眼鏡蛇'),(13,'鴨嘴獸'),(14,'無尾熊'),(15,'河馬'),(16,'海豹'),(17,'北極熊'),(18,'疣豬'),(19,'狐獴'),(20,'獅子'),(21,'袋鼠'),(22,'駱駝'),(23,'海膽'),(24,'海鷗'),(25,'烏鴉'),(26,'羊駝'),(27,'彈塗魚'),(28,'招潮蟹'),(29,'海葵'),(30,'翻車魚'),(31,'河豚'),(32,'鯨魚'),(33,'鯊魚'),(34,'小丑魚'),(35,'鱷魚'),(36,'龍蝦'),(37,'魟魚'),(38,'青蛙'),(39,'燈籠魚'),(40,'台灣黑熊');
/*!40000 ALTER TABLE `animals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `appworksschool2019summer`
--

DROP TABLE IF EXISTS `appworksschool2019summer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `appworksschool2019summer` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appworksschool2019summer`
--

LOCK TABLES `appworksschool2019summer` WRITE;
/*!40000 ALTER TABLE `appworksschool2019summer` DISABLE KEYS */;
INSERT INTO `appworksschool2019summer` VALUES (1,'農場'),(2,'地圖'),(3,'藥妝店'),(4,'水電工'),(5,'老師'),(6,'學校'),(7,'賽車'),(8,'防彈少年團'),(9,'演唱會'),(10,'股票'),(11,'駱駝'),(12,'鋼琴'),(13,'麻糬'),(14,'眼睛'),(15,'食譜'),(16,'貓'),(17,'狗'),(18,'躲避球'),(19,'吉他'),(20,'花市'),(21,'腳踏車'),(22,'旅行'),(23,'波賽頓'),(24,'動物醫院'),(25,'做家事'),(26,'移動餐車'),(27,'拼貼'),(28,'籃球'),(29,'獸醫');
/*!40000 ALTER TABLE `appworksschool2019summer` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-10-30 17:20:14
