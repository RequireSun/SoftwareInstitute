--
-- Database: `software_institute`
--
CREATE DATABASE IF NOT EXISTS `software_institute` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `software_institute`;

-- --------------------------------------------------------

--
-- 表的结构 `category`
--
-- 创建时间： 2016-05-16 18:10:21
--

DROP TABLE IF EXISTS `category`;
CREATE TABLE IF NOT EXISTS `category` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(20) CHARACTER SET utf8mb4 NOT NULL,
  `outline_id` int(10) UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `outline_id` (`outline_id`) USING HASH
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `category`
--

-- INSERT INTO `category` (`id`, `name`, `outline_id`) VALUES
-- (1, 'categoryname1', 4),
-- (2, 'categoryname3', 1),
-- (3, '1234', 5),
-- (4, '123231', NULL),
-- (5, 'ccname2', 1),
-- (6, 'haha', 4),
-- (7, '666', 1),
-- (8, 'adfsaf', NULL);

-- --------------------------------------------------------

--
-- 表的结构 `news`
--
-- 创建时间： 2016-04-14 16:21:24
--

DROP TABLE IF EXISTS `news`;
CREATE TABLE IF NOT EXISTS `news` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `category_id` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `supervisor_id` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `title` varchar(50) CHARACTER SET utf8mb4 NOT NULL DEFAULT '',
  `article` varchar(4000) CHARACTER SET utf8mb4 NOT NULL DEFAULT '',
  `update_time` datetime DEFAULT NULL,
  `page_view` int(10) UNSIGNED DEFAULT '0',
  `deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `category_update_date` (`category_id`,`update_time`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `news`
--

-- INSERT INTO `news` (`id`, `category_id`, `supervisor_id`, `title`, `article`, `update_time`, `page_view`, `deleted`) VALUES
-- (1, 1, 1, 'title1', 'article1', '2016-05-24 03:15:22', 17, 0),
-- (2, 4, 3, 'title22222', 'article2', '2016-05-26 01:28:02', 40, 0),
-- (3, 4, 3, '333123231', '1123132', '2016-05-26 01:30:39', 44, 0),
-- (4, 4, 3, 'new title', '66666632', '2016-05-25 10:21:15', 14, 1),
-- (5, 2, 1, '啊啊啊啊啊啊啊啊啊啊啊啊', '付笛声阿斯顿发发发第三方阿斯发达的发生非', '2016-05-04 01:08:22', 0, 0),
-- (6, 2, 1, '啊啊啊啊啊啊啊啊啊啊啊啊', '付笛声阿斯顿发发发第三方阿斯发达的发生非', '2016-05-04 01:08:56', 0, 0),
-- (7, 2, 1, '啊啊啊啊啊啊啊啊啊啊啊啊', '付笛声阿斯顿发发发第三方阿斯发达的发生非', '2016-05-04 01:08:58', 0, 0),
-- (8, 2, 1, '啊啊啊啊啊啊啊啊啊啊啊啊', '付笛声阿斯顿发发发第三方阿斯发达的发生非', '2016-05-04 01:08:58', 0, 0),
-- (9, 2, 1, '啊啊啊啊啊啊啊啊啊啊啊啊', '付笛声阿斯顿发发发第三方阿斯发达的发生非', '2016-05-04 01:08:59', 0, 0),
-- (10, 2, 1, '啊啊啊啊啊啊啊啊啊啊啊啊', '付笛声阿斯顿发发发第三方阿斯发达的发生非', '2016-05-04 01:09:00', 0, 0),
-- (11, 2, 1, '啊啊啊啊啊啊啊啊啊啊啊啊', '付笛声阿斯顿发发发第三方阿斯发达的发生非', '2016-05-04 01:09:01', 0, 0),
-- (12, 2, 1, '啊啊啊啊啊啊啊啊啊啊啊啊', '付笛声阿斯顿发发发第三方阿斯发达的发生非', '2016-05-04 01:09:02', 0, 0),
-- (13, 2, 1, '啊啊啊啊啊啊啊啊啊啊啊啊', '付笛声阿斯顿发发发第三方阿斯发达的发生非', '2016-05-04 01:09:02', 0, 0),
-- (14, 2, 1, '啊啊啊啊啊啊啊啊啊啊啊啊', '付笛声阿斯顿发发发第三方阿斯发达的发生非', '2016-05-04 01:09:03', 0, 0),
-- (15, 2, 1, '啊啊啊啊啊啊啊啊啊啊啊啊', '付笛声阿斯顿发发发第三方阿斯发达的发生非', '2016-05-04 01:09:04', 0, 0),
-- (16, 2, 1, '啊啊啊啊啊啊啊啊啊啊啊啊', '付笛声阿斯顿发发发第三方阿斯发达的发生非', '2016-05-04 01:09:04', 0, 0),
-- (17, 2, 1, '啊啊啊啊啊啊啊啊啊啊啊啊', '付笛声阿斯顿发发发第三方阿斯发达的发生非', '2016-05-04 01:09:05', 0, 0),
-- (18, 2, 1, '啊啊啊啊啊啊啊啊啊啊啊啊', '付笛声阿斯顿发发发第三方阿斯发达的发生非', '2016-05-04 01:09:05', 0, 0),
-- (19, 2, 1, '啊啊啊啊啊啊啊啊啊啊啊啊', '付笛声阿斯顿发发发第三方阿斯发达的发生非', '2016-05-04 01:09:06', 0, 0),
-- (20, 2, 1, '啊啊啊啊啊啊啊啊啊啊啊啊', '付笛声阿斯顿发发发第三方阿斯发达的发生非', '2016-05-04 01:09:07', 0, 0),
-- (21, 2, 1, '啊啊啊啊啊啊啊啊啊啊啊啊', '付笛声阿斯顿发发发第三方阿斯发达的发生非', '2016-05-04 01:09:08', 0, 0),
-- (22, 2, 1, '啊啊啊啊啊啊啊啊啊啊啊啊', '付笛声阿斯顿发发发第三方阿斯发达的发生非', '2016-05-04 01:09:08', 0, 0),
-- (23, 2, 1, '啊啊啊啊啊啊啊啊啊啊啊啊', '付笛声阿斯顿发发发第三方阿斯发达的发生非', '2016-05-04 01:09:09', 0, 0),
-- (24, 2, 1, '啊啊啊啊啊啊啊啊啊啊啊啊', '付笛声阿斯顿发发发第三方阿斯发达的发生非', '2016-05-04 01:09:10', 0, 0),
-- (25, 2, 3, '啊啊啊啊啊啊啊啊啊啊啊啊1', '付笛声阿斯顿发发发第三方阿斯发达的发生非2', '2016-05-26 01:29:28', 115, 1),
-- (26, 2, 1, '啊啊啊啊啊啊啊啊啊啊啊啊', '付笛声阿斯顿发发发第三方阿斯发达的发生非', '2016-05-04 01:09:11', 0, 0),
-- (27, 2, 3, '啊啊啊啊啊啊啊啊啊啊啊啊2', '付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非付笛声阿斯顿发发发第三方阿斯发达的发生非', '2016-05-26 01:29:20', 167, 1),
-- (28, 2, 1, '啊啊啊啊啊啊啊啊啊啊啊啊', '付笛声阿斯顿发发发第三方阿斯发达的发生非', '2016-05-04 01:09:12', 0, 0),
-- (29, 5, 3, 'sda', 'asd', '2016-05-25 10:19:49', 3, 0);

--
-- 触发器 `news`
--
DROP TRIGGER IF EXISTS `news_insert`;
DELIMITER $$
CREATE TRIGGER `news_insert` BEFORE INSERT ON `news` FOR EACH ROW BEGIN 
SET NEW.update_time = NOW();
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `news_update`;
DELIMITER $$
CREATE TRIGGER `news_update` BEFORE UPDATE ON `news` FOR EACH ROW BEGIN 
  IF OLD.page_view = NEW.page_view THEN 
    SET NEW.update_time = NOW();
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- 表的结构 `outline`
--
-- 创建时间： 2016-04-10 08:43:20
--

DROP TABLE IF EXISTS `outline`;
CREATE TABLE IF NOT EXISTS `outline` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(20) CHARACTER SET utf8mb4 NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `outline`
--

-- INSERT INTO `outline` (`id`, `name`) VALUES
-- (1, 'outlinename1'),
-- (4, 'fuck'),
-- (5, '啊啊啊');

-- --------------------------------------------------------

--
-- 表的结构 `resource`
--
-- 创建时间： 2016-04-14 16:22:37
--

DROP TABLE IF EXISTS `resource`;
CREATE TABLE IF NOT EXISTS `resource` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` varchar(50) CHARACTER SET utf8mb4 NOT NULL,
  `path` varchar(512) CHARACTER SET utf8mb4 NOT NULL,
  `update_time` datetime DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `update_time` (`update_time`) USING HASH
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `resource`
--

-- INSERT INTO `resource` (`id`, `title`, `path`, `update_time`, `deleted`) VALUES
-- (1, 'title', 'abc', '2016-05-04 02:09:17', 0);

--
-- 触发器 `resource`
--
DROP TRIGGER IF EXISTS `resource_insert`;
DELIMITER $$
CREATE TRIGGER `resource_insert` BEFORE INSERT ON `resource` FOR EACH ROW BEGIN 
SET NEW.update_time = NOW();
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `resource_update`;
DELIMITER $$
CREATE TRIGGER `resource_update` BEFORE UPDATE ON `resource` FOR EACH ROW BEGIN 
SET NEW.update_time = NOW();
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- 表的结构 `supervisor`
--
-- 创建时间： 2016-04-12 16:58:14
--

DROP TABLE IF EXISTS `supervisor`;
CREATE TABLE IF NOT EXISTS `supervisor` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `alias` varchar(20) CHARACTER SET utf8mb4 NOT NULL,
  `cipher` char(40) CHARACTER SET utf8mb4 NOT NULL,
  `salt` char(10) CHARACTER SET utf8mb4 NOT NULL,
  `power` int(10) UNSIGNED NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_alias` (`alias`) USING HASH
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `supervisor`
--

-- INSERT INTO `supervisor` (`id`, `alias`, `cipher`, `salt`, `power`) VALUES
-- (3, 'admin', 'dd94709528bb1c83d08f3088d4043f4742891f4f', 'admin', 1),
-- (4, 'user1', 'cf7d4405661e272c141cd7b89f0ef5b367b27d2d', 'user1', 1),
-- (5, 'user2', '5f0ffc1267ffa9f87d28110d1a526438f23f5aae', 'user2', 1);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
