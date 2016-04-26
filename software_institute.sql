--
-- Database: `software_institute`
--
CREATE DATABASE IF NOT EXISTS `software_institute` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `software_institute`;

-- --------------------------------------------------------

--
-- 表的结构 `category`
--
-- 创建时间： 2016-04-10 08:43:20
--

DROP TABLE IF EXISTS `category`;
CREATE TABLE IF NOT EXISTS `category` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(20) CHARACTER SET utf8mb4 NOT NULL,
  `outline_id` int(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `outline_id` (`outline_id`) USING HASH
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `category`
--

-- INSERT INTO `category` (`id`, `name`, `outline_id`) VALUES
-- (1, 'categoryname1', 1),
-- (2, 'categoryname123', 4),
-- (5, 'ccname2', 1),
-- (6, 'haha', 4);

-- --------------------------------------------------------

--
-- 表的结构 `comment`
--
-- 创建时间： 2016-04-23 00:56:07
--

DROP TABLE IF EXISTS `comment`;
CREATE TABLE IF NOT EXISTS `comment` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `news_id` int(10) UNSIGNED NOT NULL DEFAULT '0',
  `supervisor_id` int(10) UNSIGNED NOT NULL DEFAULT '0',
  `content` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `update_time` datetime DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `comment`
--

-- INSERT INTO `comment` (`id`, `news_id`, `supervisor_id`, `content`, `update_time`, `deleted`) VALUES
-- (1, 1, 2, '3', NULL, NULL),
-- (2, 1, 1, '1', NULL, NULL),
-- (3, 4, 2, 'zhibolong', '2016-04-23 09:00:38', 0);

--
-- 触发器 `comment`
--
DROP TRIGGER IF EXISTS `comment_insert`;
DELIMITER $$
CREATE TRIGGER `comment_insert` BEFORE INSERT ON `comment` FOR EACH ROW BEGIN
SET NEW.update_time = NOW();
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `comment_update`;
DELIMITER $$
CREATE TRIGGER `comment_update` BEFORE UPDATE ON `comment` FOR EACH ROW BEGIN
SET NEW.update_time = NOW();
END
$$
DELIMITER ;

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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `news`
--

-- INSERT INTO `news` (`id`, `category_id`, `supervisor_id`, `title`, `article`, `update_time`, `page_view`, `deleted`) VALUES
-- (1, 1, 1, 'title1', 'article1', '2016-04-15 00:32:39', 16, 0),
-- (2, 4, 3, 'title22222', 'article2', '2016-04-14 02:08:33', 0, 0),
-- (3, 4, 3, '333123231', '1123132', '2016-04-14 01:44:58', 0, 0),
-- (4, 4, 3, '333123231', '66666632', '2016-04-15 00:34:09', 1, 1);

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
SET NEW.update_time = NOW();
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `outline`
--

-- INSERT INTO `outline` (`id`, `name`) VALUES
-- (1, 'outlinename1'),
-- (4, 'fuck');

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `supervisor`
--

-- INSERT INTO `supervisor` (`id`, `alias`, `cipher`, `salt`, `power`) VALUES
-- (3, 'admin', 'dd94709528bb1c83d08f3088d4043f4742891f4f', 'admin', 1);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
