# Face Icon Maker アーキテクチャ設計

## 1. 設計方針

Face Icon Maker はブラウザのみで動作するクライアントサイド完結型アプリケーションとして実装する。

画像データはサーバーへ送信せず、すべての処理をユーザー端末上で実行する。

目的は以下である。

- 運営コストゼロ
- 高速なレスポンス
- プライバシー保護
- シンプルな運用

---

## 2. システム構成

```text
+----------------+
| User Browser   |
+----------------+
        |
        v
+------------------------+
| React Application      |
+------------------------+
| Upload                 |
| Face Detection         |
| Face Selection         |
| Crop Editor            |
| Canvas Rendering       |
| PNG Export             |
+------------------------+
        |
        v
+------------------------+
| Local Device Storage   |
+------------------------+
```

サーバーサイド処理は存在しない。

---

## 3. 技術スタック

### フロントエンド

- React
- TypeScript
- Vite
- Tailwind CSS

### AI・画像処理

- MediaPipe Face Detection
- HTML5 Canvas
- react-image-crop

### ホスティング

- Vercel
- Netlify
- GitHub Pages

---

## 4. コンポーネント構成

```text
src
├─ pages
├─ components
│  ├─ UploadArea
│  ├─ FaceSelector
│  ├─ CropEditor
│  ├─ IconPreview
│  └─ DownloadButton
│
├─ services
│  ├─ faceDetection
│  ├─ cropService
│  └─ exportService
│
├─ hooks
│  ├─ useFaceDetection
│  └─ useCrop
│
├─ types
│  ├─ face.ts
│  └─ crop.ts
│
└─ utils
```

---

## 5. データフロー

### Step1 画像選択

```text
ユーザー
 ↓
画像選択
 ↓
ObjectURL生成
 ↓
プレビュー表示
```

---

### Step2 顔検出

```text
画像
 ↓
MediaPipe
 ↓
顔座標取得
 ↓
Face[]生成
 ↓
画面描画
```

Faceオブジェクト

```ts
interface Face {
  id: string
  x: number
  y: number
  width: number
  height: number
}
```

---

### Step3 顔選択

```text
顔タップ
 ↓
選択状態更新
 ↓
編集画面表示
```

---

### Step4 クロップ生成

```text
顔矩形
 ↓
余白拡張
 ↓
1:1領域生成
 ↓
初期クロップ表示
```

推奨値

```text
顔矩形 × 2.2倍
```

顔だけでなく髪や輪郭も含める。

---

### Step5 PNG生成

```text
Canvas
 ↓
drawImage
 ↓
toDataURL
 ↓
ダウンロード
```

---

## 6. 状態管理

MVPではReact Stateのみ利用する。

```ts
const [image, setImage]
const [faces, setFaces]
const [selectedFace, setSelectedFace]
const [crop, setCrop]
const [shape, setShape]
```

ReduxやZustandは導入しない。

---

## 7. パフォーマンス方針

### 対象画像

推奨

```text
長辺 3000px以下
```

### 最適化

画像読込時

```text
表示用縮小画像
↓
顔検出
```

を利用する。

### 目標

| 項目 | 目標 |
|--------|--------|
| 顔検出開始 | 3秒以内 |
| 顔選択反応 | 100ms以内 |
| PNG生成 | 1秒以内 |

---

## 8. エラーハンドリング

### 顔未検出

```text
顔を検出できませんでした
```

### 対応形式外

```text
JPEGまたはPNGを選択してください
```

### メモリ不足

```text
画像サイズが大きすぎます
```

---

## 9. セキュリティ・プライバシー

### 方針

画像はサーバーへ送信しない。

### 実装

- APIサーバーなし
- DBなし
- ログ保存なし
- ユーザー登録なし

### メリット

- 個人情報保持なし
- 運営コスト削減
- 通信待ちなし

---

## 10. 将来拡張

### Phase2

```text
MediaPipe Segmentation
 ↓
背景透過
```

### Phase3

```text
WebGPU
 ↓
高速画像処理
```

### Phase4

```text
PWA対応
 ↓
インストール可能
```

---

## 11. アーキテクチャ原則

本アプリは『顔検出』と『顔選択』を中心価値とする。

画像編集機能を増やすことよりも、

集合写真 → 顔選択 → アイコン完成

を最短で実現することを優先する。