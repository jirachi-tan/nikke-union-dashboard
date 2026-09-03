# NIKKE Union Dashboard

## セットアップ
```bash
npm install
npm run dev
```

## ビルド
```bash
npm run build
```

## GitHub Pages で公開
このプロジェクトは `vite.config.ts` で `base: './'` にしているため、
GitHub Pages のような静的ホスティングでも比較的そのまま動きやすい構成です。

### 画像の置き場所
以下に画像を置くと、右上ビジュアルに表示されます。

```text
public/images/union-visual.png
```

### ユニオンデータの更新
公開する基本データは `public/data` に保存します。シンクロレベルなどの時系列データは、既存の履歴を上書きせず新しい記録を追記してください。形式と更新ルールは [public/data/README.md](public/data/README.md) を参照してください。

### 公開方法の一例
```bash
npm install
npm run deploy
```

`gh-pages` パッケージを使って `dist` を公開します。
