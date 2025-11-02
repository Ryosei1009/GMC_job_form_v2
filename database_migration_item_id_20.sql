-- アイテムIDフィールドを10文字から20文字に拡張するデータベース更新文
-- 実行前にデータベースのバックアップを取得してください

-- 1. new_item テーブルのitem_id フィールドを VARCHAR(20) に変更
ALTER TABLE `new_item` MODIFY COLUMN `item_id` varchar(20) NOT NULL;

-- 2. new_item テーブルの関連フィールドも VARCHAR(20) に変更
ALTER TABLE `new_item` MODIFY COLUMN `craft_material1` varchar(20) DEFAULT NULL;
ALTER TABLE `new_item` MODIFY COLUMN `craft_material2` varchar(20) DEFAULT NULL;
ALTER TABLE `new_item` MODIFY COLUMN `craft_material3` varchar(20) DEFAULT NULL;
ALTER TABLE `new_item` MODIFY COLUMN `effect_required` varchar(20) DEFAULT NULL;
ALTER TABLE `new_item` MODIFY COLUMN `give_additem` varchar(20) DEFAULT NULL;

-- 3. material テーブルのmaterial_id フィールドも VARCHAR(20) に変更（素材アイテムとの整合性のため）
ALTER TABLE `material` MODIFY COLUMN `material_id` varchar(20) NOT NULL;

-- 4. jobs テーブルのjob_id フィールドも VARCHAR(20) に変更（jobフィールドとの整合性のため）
ALTER TABLE `jobs` MODIFY COLUMN `job_id` varchar(20) NOT NULL;

-- 5. users テーブルのjob関連フィールドも VARCHAR(20) に変更
ALTER TABLE `users` MODIFY COLUMN `job` varchar(20) DEFAULT NULL;
ALTER TABLE `users` MODIFY COLUMN `subjob` varchar(20) DEFAULT NULL;

-- 実行完了後の確認クエリ
-- DESCRIBE `new_item`;
-- DESCRIBE `material`;
-- DESCRIBE `jobs`;
-- DESCRIBE `users`;

-- 変更内容の概要:
-- - new_item.item_id: varchar(10) → varchar(20)
-- - new_item.craft_material1-3: varchar(10) → varchar(20)
-- - new_item.effect_required: varchar(10) → varchar(20)
-- - new_item.give_additem: varchar(10) → varchar(20)
-- - material.material_id: varchar(10) → varchar(20)
-- - jobs.job_id: varchar(10) → varchar(20)
-- - users.job: varchar(30) → varchar(20) (一貫性のため)
-- - users.subjob: varchar(15) → varchar(20) (一貫性のため)