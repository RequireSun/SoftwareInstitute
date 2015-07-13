/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50543
Source Host           : localhost:3306
Source Database       : software_institute

Target Server Type    : MYSQL
Target Server Version : 50543
File Encoding         : 65001

Date: 2015-07-13 14:22:44
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for category
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) CHARACTER SET utf8mb4 NOT NULL,
  `outline_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `outline_id` (`outline_id`) USING HASH
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for news
-- ----------------------------
DROP TABLE IF EXISTS `news`;
CREATE TABLE `news` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `category_id` int(11) unsigned NOT NULL,
  `supervisor_id` int(11) unsigned NOT NULL,
  `title` varchar(50) CHARACTER SET utf8mb4 NOT NULL,
  `article` varchar(4000) CHARACTER SET utf8mb4 NOT NULL,
  `update_time` datetime DEFAULT NULL,
  `page_view` int(10) unsigned DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `category_update_date` (`category_id`,`update_time`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for outline
-- ----------------------------
DROP TABLE IF EXISTS `outline`;
CREATE TABLE `outline` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) CHARACTER SET utf8mb4 NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for resource
-- ----------------------------
DROP TABLE IF EXISTS `resource`;
CREATE TABLE `resource` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(50) CHARACTER SET utf8mb4 NOT NULL,
  `path` varchar(512) CHARACTER SET utf8mb4 NOT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `update_time` (`update_time`) USING HASH
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for supervisor
-- ----------------------------
DROP TABLE IF EXISTS `supervisor`;
CREATE TABLE `supervisor` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `alias` varchar(20) CHARACTER SET utf8mb4 NOT NULL,
  `cipher` char(40) CHARACTER SET utf8mb4 NOT NULL,
  `salt` char(10) CHARACTER SET utf8mb4 NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
DROP TRIGGER IF EXISTS `news_insert`;
DELIMITER ;;
CREATE TRIGGER `news_insert` BEFORE INSERT ON `news` FOR EACH ROW BEGIN 
SET NEW.update_time = NOW();
END
;;
DELIMITER ;
DROP TRIGGER IF EXISTS `news_update`;
DELIMITER ;;
CREATE TRIGGER `news_update` BEFORE UPDATE ON `news` FOR EACH ROW BEGIN 
SET NEW.update_time = NOW();
END
;;
DELIMITER ;
DROP TRIGGER IF EXISTS `resource_insert`;
DELIMITER ;;
CREATE TRIGGER `resource_insert` BEFORE INSERT ON `resource` FOR EACH ROW BEGIN 
SET NEW.update_time = NOW();
END
;;
DELIMITER ;
DROP TRIGGER IF EXISTS `resource_update`;
DELIMITER ;;
CREATE TRIGGER `resource_update` BEFORE UPDATE ON `resource` FOR EACH ROW BEGIN 
SET NEW.update_time = NOW();
END
;;
DELIMITER ;
