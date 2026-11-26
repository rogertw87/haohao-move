# 好好運動

收藏喜歡的 YouTube 運動影片，每天挑一支跟著做；記錄今天的練習，並把提醒加到日曆。好好呼吸的姊妹站。

純 HTML / CSS / JS，不需要建置，由 GitHub Pages 發佈（main 分支的根目錄）。

## 本機預覽

```sh
python3 -m http.server 8000
# 開啟 http://localhost:8000
```

## 檔案

- `index.html` — 全部的畫面、樣式和程式：首頁、跟著做（YouTube 播放器）、完成、加入影片、提醒、雲端同步
- `sw.js` — 離線存檔（網頁和圖示）
- `manifest.webmanifest`、`icons/` — 加到手機桌面用；Android 可以從 YouTube「分享」直接加入影片

## 資料

- 影片、紀錄和提醒設定存在瀏覽器（localStorage `haohao-move`）。
- 登入 Google 後同步到使用者自己雲端硬碟的應用程式專用資料夾（`haohao-move.json`），和全球共修重聽用同一個 Google Cloud 用戶端。
- 提醒用 Google 日曆的新增活動連結（每週重複），或下載 .ics 檔加到 iPhone／其他日曆。
