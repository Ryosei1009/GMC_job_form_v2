# v2 素材システム仕様書

## 概要

v2では独立したmaterialテーブルを使用せず、new_itemテーブル内で素材管理を行います。

## 変更点

### v1からv2への移行
- **v1**: 独立した`material`テーブルを使用
- **v2**: `new_item`テーブルで統合管理

### 素材の定義
v2での素材の条件:
1. `is_material = 1` (素材フラグ)
2. `add_status = 'add'` (承認済みステータス)

## API仕様

### 素材リスト取得
**エンドポイント**: `GET /new_item_v2/get/material`

**レスポンス形式**:
```json
[
  {
    "id": 1,
    "material_id": "wood_plank",
    "name": "木材",
    "description": "建築用の基本素材",
    "image": "images/items/wood_plank.png",
    "created_at": "1699000000000"
  }
]
```

**SQLクエリ**:
```sql
SELECT
    id,
    item_id as material_id,
    name,
    description,
    CONCAT('images/items/', item_id, '.png') as image,
    created_at
FROM new_item
WHERE is_material = 1 AND add_status = 'add'
ORDER BY name ASC
```

## データベース構造

### new_itemテーブルでの素材管理
```sql
CREATE TABLE `new_item` (
  -- 基本情報
  `item_id` varchar(20) NOT NULL,
  `name` varchar(30) NOT NULL,
  `description` varchar(60) DEFAULT NULL,

  -- 素材関連
  `is_material` tinyint(1) NOT NULL DEFAULT 0,

  -- ステータス管理
  `add_status` varchar(7) NOT NULL DEFAULT 'none',

  -- その他のフィールド...
);
```

## フロントエンド対応

### 素材選択コンポーネント
- `FormV2.js`のComboboxコンポーネントで使用
- `material_id`と`name`を使用して選択
- 画像パスは自動生成: `images/items/{item_id}.png`

### 表示ロジック
- `EachItem.js`の`checkMaterialName`関数で素材名を表示
- `material_id`での検索に対応済み

## 画像ファイル管理

### 画像パス規則
- **基本画像**: `images/items/{item_id}.png`
- **表示画像**: `images/gmc2/utilsystem/{item_id}_display.png`
- **音楽ファイル**: `images/gmc2/utilsystem/{item_id}_audio.mp3`

## 素材の追加プロセス

1. **素材アイテムの申請**
   - 新商品申請フォームで`is_material = 1`を設定
   - 通常のアイテム申請プロセスを実行

2. **承認プロセス**
   - 管理者による審査
   - `add_status`を'add'に変更

3. **素材として利用可能**
   - 承認後、他のアイテムのクラフト素材として選択可能
   - 素材リストに自動的に表示

## 利点

1. **データ統一**: 単一テーブルでアイテムと素材を管理
2. **審査統一**: 通常アイテムと同じ審査プロセス
3. **メンテナンス性**: テーブル構造の簡素化
4. **拡張性**: 新機能追加時の影響範囲最小化

## 注意事項

- 既存のmaterialテーブルは使用しない
- v1との互換性は保持（移行期間中）
- 素材として使用するアイテムは必ず`is_material = 1`と`add_status = 'add'`が必要