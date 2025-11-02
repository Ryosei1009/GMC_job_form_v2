-- Material テーブルが存在しない場合の作成用SQL

CREATE TABLE IF NOT EXISTS `material` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `material_id` varchar(20) NOT NULL,
  `name` varchar(30) NOT NULL,
  `description` varchar(60) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` varchar(13) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `material_id` (`material_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- サンプルデータ（必要に応じて）
INSERT INTO `material` (`material_id`, `name`, `description`, `image`, `created_at`) VALUES
('wood', '木材', '建築や製作に使用される基本的な素材', 'images/materials/wood.png', '1699000000000'),
('iron', '鉄', '金属製品の製作に必要な基本素材', 'images/materials/iron.png', '1699000001000'),
('stone', '石', '建築や工具製作に使用される素材', 'images/materials/stone.png', '1699000002000'),
('cloth', '布', '衣類や袋の製作に使用される素材', 'images/materials/cloth.png', '1699000003000'),
('leather', '革', '高品質な製品の製作に使用される素材', 'images/materials/leather.png', '1699000004000')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 実行確認用クエリ
-- SELECT * FROM material;
-- DESCRIBE material;