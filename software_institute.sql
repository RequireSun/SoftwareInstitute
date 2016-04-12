-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: 2016-04-12 19:02:33
-- 服务器版本： 10.1.10-MariaDB
-- PHP Version: 5.6.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

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
CREATE TABLE `category` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(20) CHARACTER SET utf8mb4 NOT NULL,
  `outline_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 表的关联 `category`:
--

--
-- 转存表中的数据 `category`
--

-- INSERT INTO `category` (`id`, `name`, `outline_id`) VALUES
-- (1, 'categoryname1', 1),
-- (4, 'categoryname1', 1);

-- --------------------------------------------------------

--
-- 表的结构 `news`
--
-- 创建时间： 2016-04-10 08:43:20
--

DROP TABLE IF EXISTS `news`;
CREATE TABLE `news` (
  `id` int(11) UNSIGNED NOT NULL,
  `category_id` int(11) UNSIGNED NOT NULL,
  `supervisor_id` int(11) UNSIGNED NOT NULL,
  `title` varchar(50) CHARACTER SET utf8mb4 NOT NULL,
  `article` varchar(4000) CHARACTER SET utf8mb4 NOT NULL,
  `update_time` datetime DEFAULT NULL,
  `page_view` int(10) UNSIGNED DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 表的关联 `news`:
--

--
-- 转存表中的数据 `news`
--

-- INSERT INTO `news` (`id`, `category_id`, `supervisor_id`, `title`, `article`, `update_time`, `page_view`) VALUES
-- (1, 1, 1, 'title1', 'article1', '2016-04-11 01:43:11', 2);

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
CREATE TABLE `outline` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(20) CHARACTER SET utf8mb4 NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 表的关联 `outline`:
--

--
-- 转存表中的数据 `outline`
--

-- INSERT INTO `outline` (`id`, `name`) VALUES
-- (1, 'outlinename1'),
-- (4, 'outlinename1');

-- --------------------------------------------------------

--
-- 表的结构 `resource`
--
-- 创建时间： 2016-04-10 08:43:20
--

DROP TABLE IF EXISTS `resource`;
CREATE TABLE `resource` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(50) CHARACTER SET utf8mb4 NOT NULL,
  `path` varchar(512) CHARACTER SET utf8mb4 NOT NULL,
  `update_time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 表的关联 `resource`:
--

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
CREATE TABLE `supervisor` (
  `id` int(10) UNSIGNED NOT NULL,
  `alias` varchar(20) CHARACTER SET utf8mb4 NOT NULL,
  `cipher` char(40) CHARACTER SET utf8mb4 NOT NULL,
  `salt` char(10) CHARACTER SET utf8mb4 NOT NULL,
  `power` int(10) UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 表的关联 `supervisor`:
--

--
-- 转存表中的数据 `supervisor`
--

-- INSERT INTO `supervisor` (`id`, `alias`, `cipher`, `salt`, `power`) VALUES
-- (3, 'admin', 'dd94709528bb1c83d08f3088d4043f4742891f4f', 'admin', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`),
  ADD KEY `outline_id` (`outline_id`) USING HASH;

--
-- Indexes for table `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_update_date` (`category_id`,`update_time`) USING BTREE;

--
-- Indexes for table `outline`
--
ALTER TABLE `outline`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `resource`
--
ALTER TABLE `resource`
  ADD PRIMARY KEY (`id`),
  ADD KEY `update_time` (`update_time`) USING HASH;

--
-- Indexes for table `supervisor`
--
ALTER TABLE `supervisor`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_alias` (`alias`) USING HASH;

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `category`
--
ALTER TABLE `category`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- 使用表AUTO_INCREMENT `news`
--
ALTER TABLE `news`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- 使用表AUTO_INCREMENT `outline`
--
ALTER TABLE `outline`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- 使用表AUTO_INCREMENT `resource`
--
ALTER TABLE `resource`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `supervisor`
--
ALTER TABLE `supervisor`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
