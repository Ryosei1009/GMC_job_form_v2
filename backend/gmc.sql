-- MySQL dump 10.13  Distrib 5.7.44, for Win64 (x86_64)
--
-- Host: localhost    Database: gmc
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.28-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jobs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `job_id` varchar(31) NOT NULL,
  `name` varchar(31) NOT NULL,
  `created_at` varchar(13) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
INSERT INTO `jobs` VALUES (1,'admin','市役所','1731912211987'),(3,'comic','カードショップ','1731912478948'),(4,'tarotist','魔法少女','1731912494712'),(5,'vert_voile','Vert Voile','1731912541051'),(6,'libera','LIBERA','1731912554009'),(7,'hi_way','Hi_way','1731912560475'),(8,'bookcafe','BookCafe','1731912569787'),(9,'studio','CRiMeRØSE studio','1731912578768'),(10,'brand','BABY\'S BREATH','1731912621155'),(11,'vehiclesale','中古車販売','1731912632558'),(12,'korean_food','ポチャ屋','1731912650102'),(13,'harowa','案内所','1731912663547'),(14,'flour','花屋','1731912671738'),(15,'barfalcon','Bar Falcon','1731912682074'),(16,'ramen','ラーメン屋','1731912689824'),(17,'harem','ネイルサロン','1731912707366'),(18,'burgershot','バーガー屋','1731912714456'),(19,'irishpub','Bar Irish','1731912721737'),(20,'cigar','タバコ屋','1731912734152'),(21,'uwu','猫カフェ','1731912739708'),(22,'pirate','パイレーツ・オブ・カフェテリアン','1731912746507'),(23,'police','警察','1731912762418'),(24,'ambulance','救急隊','1731912773584'),(25,'taxi','タクシー会社','1731912786302'),(26,'cardealer','自動車ディーラー','1731912798663'),(27,'mechanic','メカニック','1731912806244'),(28,'reporter','記者','1731912821889'),(29,'','','1731917604782');
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `material`
--

DROP TABLE IF EXISTS `material`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `material` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `material_id` varchar(31) NOT NULL,
  `name` varchar(31) NOT NULL,
  `image` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `material`
--

LOCK TABLES `material` WRITE;
/*!40000 ALTER TABLE `material` DISABLE KEYS */;
INSERT INTO `material` VALUES (1,'farming_rawsteak','お肉','images\\material\\farming_rawsteak.png'),(2,'fruit_box','フルーツ','images\\material\\fruit_box.png'),(4,'salmon','サーモン','images/newitem/salmon.png'),(5,'grapes','ぶどう','images/newitem/grapes.png'),(6,'welcome_vv','Welcome to VV','images/newitem/welcome_vv.png'),(7,'dddd','dd','images/newitem/dddd.png');
/*!40000 ALTER TABLE `material` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `new_item`
--

DROP TABLE IF EXISTS `new_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `new_item` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `item_id` varchar(31) NOT NULL,
  `name` varchar(31) NOT NULL,
  `description` varchar(63) DEFAULT NULL,
  `image` varchar(255) NOT NULL,
  `weight` varchar(4) NOT NULL,
  `is_craft` tinyint(1) NOT NULL,
  `material1` varchar(31) DEFAULT NULL,
  `material2` varchar(31) DEFAULT NULL,
  `material3` varchar(31) DEFAULT NULL,
  `is_delivery` tinyint(1) NOT NULL,
  `number` int(11) DEFAULT NULL,
  `is_effect` tinyint(1) NOT NULL,
  `effect_type` varchar(6) DEFAULT NULL,
  `effect` int(11) DEFAULT NULL,
  `item_type` varchar(7) DEFAULT NULL,
  `sale_date` varchar(13) DEFAULT NULL,
  `sale_shop` varchar(15) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `is_wholesale` tinyint(1) NOT NULL,
  `is_material` tinyint(1) NOT NULL,
  `other` text DEFAULT NULL,
  `created_at` varchar(13) NOT NULL,
  `created_by` varchar(13) NOT NULL,
  `is_cancel` tinyint(1) NOT NULL,
  `is_added` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `new_item`
--

LOCK TABLES `new_item` WRITE;
/*!40000 ALTER TABLE `new_item` DISABLE KEYS */;
INSERT INTO `new_item` VALUES (3,'green_tea','緑茶','日本の伝統的なお茶','images/newitem/green_tea.png','100',1,'farming_rawsteak','fruit_box','',0,0,1,'thirst',30,'drink','2024-11-14','市役所',50000,0,0,'追加ヨロ！','1731234759169','1',0,0),(4,'pocha_nikujaga','元カノが作った肉じゃが','懐かしい味','images/newitem/pocha_nikujaga.png','0',0,'','','',1,1,1,'hunger',30,'food','2024-11-16','魔法少女カフェ',0,1,0,'','1731491055097','1',0,0),(5,'pitisyokora','ピーチショコラシェイク','お客様を大切に思うｎとかずみがお互いにリスペクト。ピーチのフルーティーさとショコラの贅沢が出会った夢のシェイク。','images/newitem/pitisyokora.png','0',1,'fruit_box','','',0,0,1,'thirst',29,'drink','2024-11-14','バーガー屋',30000,0,0,'','1731491289179','1',0,0),(6,'choco_frappuccino','わがちゃのわがままチョコフラペチーノ','あまりの甘さに一口飲んだだけで自分に甘々になっちゃうらしい。','images/newitem/choco_frappuccino.png','0',1,'farming_rawsteak','','',0,0,1,'thirst',40,'drink','2024-11-16','海賊船カフェ',40000,0,0,'','1731491775257','1',0,0),(7,'tabako_ginkgo_biloba','Ginkgo Biloba','思い出と黄金に染まる道へ','images/newitem/tabako_ginkgo_biloba.png','0',0,'','','',1,115,1,'stress',50,'other','2024-11-16','chill smoke',1000000,0,0,'','1731492017922','1',0,0),(8,'tabako_ginkgo_biloba_box','Ginkgo Biloba BOX','思い出と黄金に染まる道へ','images/newitem/tabako_ginkgo_biloba_box.png','1',0,'','','',1,115,1,'stress',50,'other','2024-11-16','chill smoke',1000000,0,0,'','1731492616345','1',0,0),(9,'test','test','test','images/newitem/test.png','0.1',0,'','','',0,0,0,'',0,NULL,'','',0,0,0,'','1731501404947','1',0,0),(10,'flower_bara_hanataba','薔薇の花束','最後の告白','images/newitem/flower_bara_hanataba.png','-2',1,'farming_rawsteak','','',0,0,0,'',0,NULL,'2024-11-16','花屋',30000000,0,0,'','1731575911084','1',0,0),(11,'flower_special_rose','Special Rose','何度生まれ変わってもあなたを愛する','images/newitem/flower_special_rose.png','0.1',0,'farming_rawsteak','','',0,0,0,'',0,NULL,'2024-11-16','花屋',29999999,0,0,'','1731576059199','1',0,0),(12,'acrylic_mako','アクリルキーホルダー【小熊猫まこ】','「選んでくれてありがと〜❤︎ 連れ回してくれ！｣','images/newitem/acrylic_mako.png','0.1',1,'farming_rawsteak','','',0,0,0,'',0,NULL,'2024-11-16','魔法少女カフェ',500000,0,0,'','1731577081420','1',0,0),(13,'acrylic_kurumi','アクリルキーホルダー【姫宮くるみ】','「めろめろになる魔法～♡｣','images/newitem/acrylic_kurumi.png','0.1',1,'farming_rawsteak','','',0,0,0,'',0,NULL,'2024-11-16','魔法少女カフェ',500000,0,0,'','1731577127396','1',0,0),(14,'acrylic_neko','アクリルキーホルダー【猫田ねこ】','「頑張っててえらい♡｣','images/newitem/acrylic_neko.png','0.1',1,'farming_rawsteak','','',0,0,0,'',0,NULL,'2024-11-16','魔法少女カフェ',500000,0,0,'','1731577157737','1',0,0),(15,'test1','test1','test','images/newitem/test1.png','1',0,'','','',0,0,0,'',0,NULL,'','',0,0,0,'','1731582524655','1',0,0),(16,'test2','test2','test','images/newitem/test2.png','1',0,'','','',0,0,0,'',0,NULL,'','',0,0,0,'','1731582913626','1',0,0),(17,'testttt44','tesst5','test','images/newitem/testttt44.png','1',0,'','','',0,0,0,'',0,NULL,'','',0,0,0,'','1731582931612','1',0,0),(18,'test1111','test1111','test','images/newitem/test1111.png','-21',0,'','','',0,0,0,'',0,NULL,'','',0,0,0,'','1731583167389','1',0,0),(19,'test3','test','test','images/newitem/test3.png','1',1,'farming_rawsteak','','',0,0,0,'',0,NULL,'2024-11-16','市役所',11111,0,0,'','1731583716206','1',0,0),(20,'uwu_pino','アーモンドピノ','2人の名前を活かした発揮的な商品。１つのパッケージから6個の包装にできるため、仲良しの方にシェアすることが可能！！','images/newitem/uwu_pino.png','0.1',1,'farming_rawsteak','','',0,0,0,'',0,NULL,'2024-11-16','猫カフェ',90000,0,0,'','1731737126923','1',0,0),(21,'uwu_pino1','アーモンドピノ','亜門andピノのコラボ猫アイスご堪能あれ！！仲良しの方とのシェアをしよう！！','images/newitem/uwu_pino1.png','0.1',0,'','','',0,0,1,'hunger',10,'food','','',0,0,0,'','1731737184023','1',0,0),(22,'uwu_onigiri','しゃけのおにぎり','獲れたて鮭おにぎり。熊肉ではない。','images/newitem/uwu_onigiri.png','0.1',0,'','','',0,0,1,'hunger',10,'food','','',0,0,0,'','1731737750378','1',0,0),(23,'orora_sui','オーロラ水','','images/newitem/orora_sui.png','0.1',0,'','','',0,0,0,'',0,NULL,'','',0,0,0,'','1731738378386','1',0,0),(24,'oumagatoki_no_hoshi','逢魔が時の星','','images/newitem/oumagatoki_no_hoshi.png','0.1',0,'','','',0,0,0,'',0,NULL,'','',0,0,0,'','1731738418331','1',0,0),(25,'katarusisu_no_shizuku','浄化の一滴','カタルシスの雫　体力回復40%','images/newitem/katarusisu_no_shizuku.png','0.1',1,'farming_rawsteak','','',0,0,1,'hunger',0,'other','2024-11-16','聖クーヘン',70000,0,0,'','1731738540068','1',0,0),(26,'mandoragora_no_tane','マンドラゴラの種','','images/newitem/mandoragora_no_tane.png','0.1',0,'','','',0,0,0,'',0,NULL,'','',0,0,0,'','1731738586551','1',0,0),(27,'nizi_no_humoto_no_hana','虹のふもとの花','','images/newitem/nizi_no_humoto_no_hana.png','0.1',0,'','','',0,0,0,'',0,NULL,'','',0,0,0,'','1731738622577','1',0,0),(28,'sanzu_enbureisu','日輪の抱擁','サンズエンブレイス　体力回復40%','images/newitem/sanzu_enbureisu.png','0.1',1,'farming_rawsteak','','',0,0,1,'hunger',0,'other','2024-11-16','聖クーヘン',70000,0,0,'','1731738677242','1',0,0),(29,'sankutyuari_nekuta','聖域の花の蜜','サンクチュアリネクター　体力回復40%','images/newitem/sankutyuari_nekuta.png','0.1',1,'farming_rawsteak','','',0,0,1,'hunger',0,'other','2024-11-16','聖クーヘン',70000,0,0,'','1731738741178','1',0,0),(30,'mInotaurosu_no_hidume','ミノタウロスの蹄','','images/newitem/mInotaurosu_no_hidume.png','0.1',0,'','','',0,0,0,'',0,NULL,'','',0,0,0,'','1731738813825','1',0,0),(31,'hushityou_no_yodare','不死鳥のよだれ','','images/newitem/hushityou_no_yodare.png','0.1',0,'','','',0,0,0,'',0,NULL,'','',0,0,0,'','1731738871423','1',0,0),(32,'doragon_no_tamago','ドラゴンの卵','','images/newitem/doragon_no_tamago.png','0.1',0,'','','',0,0,0,'',0,NULL,'','',0,0,0,'','1731738897228','1',0,0),(33,'sukaretto','緋天の光彩','スカーレットヘヴン　体力回復60%','images/newitem/sukaretto.png','0.1',1,'farming_rawsteak','','',0,0,1,'hunger',0,'other','2024-11-16','聖クーヘン',120000,0,0,'','1731738956979','1',0,0),(34,'kumo','雲','','images/newitem/kumo.png','0.1',0,'','','',0,0,0,'',0,NULL,'','',0,0,0,'','1731738997242','1',0,0),(35,'towairaito_sutera','黄昏の聖母','トワイライトステラ　体力回復60%','images/newitem/towairaito_sutera.png','0.1',1,'farming_rawsteak','','',0,0,1,'hunger',0,'other','2024-11-16','聖クーヘン',120000,0,0,'','1731739083223','1',0,0),(36,'yunikon_no_tsuno','ユニコーンの角','','images/newitem/yunikon_no_tsuno.png','0.1',0,'','','',0,0,0,'',0,NULL,'','',0,0,0,'','1731739135077','1',0,0),(37,'dhiva_no_jattimento','歌姫の審判','ディーヴァのジャッジメント　体力回復60%','images/newitem/dhiva_no_jattimento.png','0.1',1,'farming_rawsteak','','',0,0,1,'hunger',0,'other','2024-11-16','聖クーヘン',120000,0,0,'','1731739208962','1',0,0),(38,'kirakira_no_kona','きらきらの粉','','images/newitem/kirakira_no_kona.png','0.1',0,'','','',0,0,0,'',0,NULL,'','',0,0,0,'','1731739252388','1',0,0),(39,'miturou','蜜蝋','','images/newitem/miturou.png','0.1',0,'','','',0,0,0,'',0,NULL,'','',0,0,0,'','1731739284069','1',0,0),(40,'kitou_no_candle','祈祷のキャンドル','神の御加護があらんことを','images/newitem/kitou_no_candle.png','0.1',1,'farming_rawsteak','','',0,0,1,'hunger',0,'other','2024-11-16','聖クーヘン',5000,0,0,'','1731739354951','1',0,0),(41,'gin_ingot','銀インゴット','','images/newitem/gin_ingot.png','0.1',0,'','','',0,0,0,'',0,NULL,'','',0,0,0,'','1731739427097','1',0,0),(42,'shinkousya_no_akashi','信仰者の証','クーヘン様からお告げこそが世界の真実である　バウム','images/newitem/shinkousya_no_akashi.png','0.1',1,'farming_rawsteak','','',0,0,0,'',0,NULL,'2024-11-16','聖クーヘン',2000000,0,0,'','1731739486697','1',0,0),(43,'material_test','素材','','images/newitem/material_test.png','0.1',0,'','','',0,0,0,'',0,NULL,'','',0,0,1,'','1731742542931','1',0,0),(44,'salmon','サーモン','','images/newitem/salmon.png','0.1',0,'','','',0,0,0,'',0,NULL,'','',0,0,1,'','1731747528039','2',0,0),(45,'grapes','ぶどう','','images/newitem/grapes.png','0.1',0,'','','',0,0,0,'',0,NULL,'','',0,0,1,'','1731747633621','2',0,0),(46,'welcome_vv','Welcome to VV','スモークサーモンと白ワインのマリアージュ。ようこそ、ヴェルヴォワへ！','images/newitem/welcome_vv.png','0.4',1,'salmon','grapes','',0,0,1,'hunger',5,'food','2024-10-20','Vert Voile',200000,0,0,'','1731747718085','2',0,1),(47,'dddd','dd','raw','images/newitem/dddd.png','1',1,'farming_rawsteak','','',0,0,0,'',0,NULL,'2024-11-02','321',12331,0,0,'','1731749279062','1',0,0),(48,'ss','ss','','images/newitem/ss.png','21',1,'farming_rawsteak','','',0,0,0,'',0,NULL,'2024-11-16','123',213,0,0,'','1731749314066','1',0,0),(49,'nouhin_test','納品アイテム','','images/newitem/nouhin_test.png','0.5',0,'','','',1,500,1,'hunger',50,'food','2024-11-16','市役所',40000,0,0,'','1731751540601','1',0,1),(50,'zakuro_zakuro','ザクロゥ・ザクロモクテル','甘酸っぱく、ほんのり渋い後味のノンアルコールドリンク。頑張るあなたに至福のひとときを…','images/newitem/zakuro_zakuro.png','0.1',1,'farming_rawsteak','','',0,0,1,'thirst',40,'drink','2024-11-23','海賊船カフェ',40000,0,0,'','1731933972459','1',0,0);
/*!40000 ALTER TABLE `new_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(15) NOT NULL,
  `password` text NOT NULL,
  `role` varchar(5) DEFAULT NULL,
  `job` varchar(15) DEFAULT NULL,
  `created_at` varchar(13) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Shino','$2a$08$Cqm6BNgsTzZstT8ybdVFyuKuhwcScv.FSf71y6M9XIe.JcV/OgMLe','admin','admin','1731232002083'),(2,'Shino2','$2a$08$5Fv4QCqb7vO9V6M2a0R8PuRCcvW.IeTRadbRHxgROTxqwnWA68jqq','owner','','1731747379362'),(3,'白山 しの','$2a$08$pR7jcicDpOquZY3khpzczeD6dMDV6vyiBFte5U1QsZ.VHlDhRs6Dm','null','','1731906043335');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-19 17:49:12
