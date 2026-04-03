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

### 公開方法の一例
```bash
npm install
npm run deploy
```

`gh-pages` パッケージを使って `dist` を公開します。
