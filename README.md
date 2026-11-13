# X Toolkit

**介面純淨化 · Thread 閱讀器 · 一鍵封鎖 · Emoji 修正 · 媒體下載 · Markdown 匯出**
*Clean UI · Thread reader · One-click block · Emoji fix · Media downloader · Markdown export*

一個為 **2026 年新版 X（Twitter）DOM** 重寫的全方位使用者腳本（userscript）。

**[繁體中文](#繁體中文)** · **[English](#english)**

| | |
|---|---|
| 版本 Version | `1.3.2` |
| 授權 License | [MIT](LICENSE) |
| 适用 Matches | `https://x.com/*`, `https://twitter.com/*` |
| 管理員 Manager | Tampermonkey / Violentmonkey / Greasemonkey |
| 介面語言 Languages | 9（en · zh-TW · zh-CN · ja · ko · es · fr · de · pt-BR） |

---

## 繁體中文

### 這是什麼
X Toolkit 把常用的 X/Twitter 增强整合成**單一檔案**的 Tampermonkey 腳本。所有開關可在腳本內建的「設定」面板調整，並即時切換介面語言。

### 功能
- **介面純淨化（Clean & Optimize）**：隱藏回覆／轉發／書籤／查看數／分享等互動按鈕，以及 Grok、Premium、已認證組織、廣告、側欄項目、右側趨勢欄等；可加寬貼文區、調整右欄間距。
- **Thread 閱讀器**：在貼文上加入按鈕，透過 `twitter-thread.com` 展開整串推文。
- **一鍵封鎖（Quick Block）**：一鍵完成「開更多選單 → 封鎖 → 確認」，支援多語言選單文字比對。可分別在**互動列**、**貼文右上角**、**個人主頁表頭**三個位置顯示封鎖鈕（各自獨立開關）；在自己的主頁不會顯示封鎖鈕。
- **Emoji 修正**：把舊版以 `<img>` 呈現的 Twitter emoji 換回原生 Unicode 彩繪字元。
- **媒體下載**：下載貼文的圖片／GIF／影片，圖片取原始解析度，影片透過公開 syndication 端點解析；多媒體可打包成 ZIP。
- **匯出 Markdown**：把單篇貼文或整串 thread 轉成含 front-matter 的 `.md` 檔。

### 安裝
> 安裝連結對應 `https://github.com/yesonline/x-toolkit`（分支 `main`）。

1. 先安裝任一使用者腳本管理員：[Tampermonkey](https://www.tampermonkey.net/)、[Violentmonkey](https://violentmonkey.github.io/) 或 [Greasemonkey](https://www.greasespot.net/)。
2. 點此安裝（連結以 `.user.js` 結尾，管理員會跳出安裝頁）：
   `https://raw.githubusercontent.com/yesonline/x-toolkit/main/x-toolkit.user.js`
3. 開啟 `https://x.com/` 並登入即可使用。

**手動安裝**：管理員 →「新增指令腳本」→ 貼上 `x-toolkit.user.js` 全部內容 → 儲存。

### 使用
- **工具列選單**（管理員選單）：`X Toolkit：設定`、`X Toolkit：匯出 Markdown`、`X Toolkit：重新載入功能`。
- **貼文上的按鈕**：滑鼠移到按鈕會顯示推特原生風格的黑底白字膠囊提示（0.4 秒延遲後 0.4 秒漸顯）。依設定會出現 Thread、封鎖、下載媒體、匯出 Markdown 等按鈕。
- **設定面板**：勾選功能開關、要隱藏的項目、封鎖鈕位置、版面寬度、媒體檔名格式，以及介面語言；按「儲存並重新整理」生效。

### 設定項目（一覽）
| 群組 | 可調項目 |
|---|---|
| 功能總開關 | 純淨化、Thread、封鎖、Emoji、媒體、Markdown |
| 封鎖按鈕位置 | 互動列封鎖鈕 / 貼文右上角封鎖鈕 / 個人主頁封鎖鈕（需先開「封鎖」總開關） |
| 推文按鈕 | 隱藏 回覆/轉發/喜歡/書籤/查看數/分享 |
| 側邊欄與選單 | 首頁/探索/通知/聊天/通話/歷史記錄/個人資料/書籤/社群/Grok/Premium/已認證組織/廣告/靜音通知/右側欄/懸浮聊天/創作者工作室 |
| 版面與寬度 | 更寬貼文區（px）、右側欄間距（px） |
| 媒體下載 | 檔名格式、日期格式、以書籤同步、打包 ZIP |
| 一般 | 介面語言（auto 或手動指定） |

### 媒體檔名格式
可用標記：`{userId}`、`{userName}`、`{postId}`、`{postTime}`、`{mediaType}`、`{index}`、`{ext}`。
日期格式 `{postTime}` 支援：`YYYY MM DD HH mm ss`。
預設：`{userId}-{postId}-{mediaType}{index}`、日期 `YYYYMMDD_HHmmss`。

### 權限與隱私
腳本**完全在你的瀏覽器本地執行**，不會上傳你的帳號資料。它向管理員要求的權限與會連線的網域，全部對應到明確功能：

| 權限 / 連線 | 用途 |
|---|---|
| `GM_getValue` / `GM_setValue` | 儲存設定 |
| `GM_addStyle` | 注入樣式 |
| `GM_registerMenuCommand` / `GM_unregisterMenuCommand` | 工具列選單 |
| `GM_openInTab` | 開新分頁（Thread） |
| `GM_xmlhttpRequest` | 下載媒體、解析影片、展開 thread |
| `x.com` / `twitter.com` | 腳本作用範圍 |
| `pbs.twimg.com` / `video.twimg.com` / `abs.twimg.com` | 下載圖片／影片資源 |
| `cdn.syndication.twimg.com` | 取得影片的 MP4 位址（公開 embed 端點） |
| `twitter-thread.com` | Thread 閱讀器 |
| `@require` jsDelivr 上的 `fflate` | ZIP 打包 |

> ⚠️ **注意**：「一鍵封鎖」會對你的帳號執行**真實的封鎖動作**（等同你手動封鎖）。請自行負責使用行為，並遵守 X 的服務條款。

### 相容性與維護
**同時支援新舊版 X**：x.com 目前隨機切換 2026 新版與舊版，本腳本對每項功能都並存兩套錨點（新版 `sidebar-item`／SVG sprite／`data-slot`；舊版 `data-testid="AppTabBar_*_Link"`／`sidebarColumn`／`caret`／`tweetText` 等），兩版都能作用。X 的前端改版頻繁且會移除 `data-testid`。本腳本改用較穩定的錨點（`data-engagement-action`、SVG sprite id、`[class*="sidebar-item"]`、`data-slot`、`:has()`、`[href$="/path"]`）。若某天某功能失效，多半是選擇器過期——歡迎[提出 issue](https://github.com/yesonline/x-toolkit/issues) 並附上該頁面的「另存網頁 HTML」，便於修正。

### 貢獻
請先閱讀 [CONTRIBUTING.md](CONTRIBUTING.md)（含「選擇器須以真實 DOM 驗證」「新增字串要補齊 9 種語言」等慣例）。

### 授權
[MIT](LICENSE) © 2026 YesOnline

### 免責聲明
本專案為**非官方**社群腳本，與 X Corp. 無任何隸屬關係。依「現狀」提供，不作任何保證；使用於你自身風險自負。

---

## English

### What is this
X Toolkit bundles the most useful X/Twitter enhancements into a **single-file** Tampermonkey userscript. 
Every switch lives in a built-in Settings panel, and the interface language can be changed on the fly.

### Features
- **Clean & Optimize**: hide reply / repost / bookmark / view-count / share buttons,
  plus Grok, Premium, Verified Orgs, ads, individual sidebar items and the right
  trends column; widen the post area and tune right-column spacing.
- **Thread Reader**: adds a button to a post that unrolls the whole thread via
  `twitter-thread.com`.
- **Quick Block**: one click auto-completes “open More → Block → Confirm”, with
  multi-language menu-text matching. The block button can be shown independently in
  the **actions row**, the **top-right of a post**, and the **profile header** (each
  with its own switch); it never appears on your own profile.
- **Emoji Fix**: converts the legacy `<img>`-rendered Twitter emoji back into
  native colour Unicode glyphs.
- **Media Downloader**: downloads a post’s images / GIFs / videos at original
  resolution (videos resolved through the public syndication endpoint); multiple
  media can be bundled into a ZIP.
- **Export Markdown**: converts a single post or a whole thread into a `.md`
  file with front-matter.

### Installation
> The install link points to `https://github.com/yesonline/x-toolkit` (branch `main`).

1. Install a userscript manager: [Tampermonkey](https://www.tampermonkey.net/),
   [Violentmonkey](https://violentmonkey.github.io/) or [Greasemonkey](https://www.greasespot.net/).
2. Install from this link (it ends in `.user.js`, so the manager shows an install page):
   `https://raw.githubusercontent.com/yesonline/x-toolkit/main/x-toolkit.user.js`
3. Open `https://x.com/` and sign in.

**Manual install**: manager → “Create new script” → paste the whole contents of
`x-toolkit.user.js` → save.

### Usage
- **Toolbar menu** (from the manager): `X Toolkit: Settings`, `X Toolkit: Export
  Markdown`, `X Toolkit: Reload features`.
- **Buttons on posts**: hovering a button shows a Twitter-native black-on-white
  capsule tooltip (0.4s delay, then a 0.4s fade-in). Depending on settings you’ll
  see Thread, Block, Download media and Export Markdown buttons.
- **Settings panel**: toggle features, pick what to hide, choose block-button
  placements, set layout width, media filename format and interface language;
  press “Save & Refresh” to apply.

### Settings overview
| Group | Options |
|---|---|
| Feature switches | Clean, Thread, Block, Emoji, Media, Markdown |
| Block buttons | actions-row block / post top-right block / profile block (require the Block master switch) |
| Tweet buttons | Hide reply / repost / like / bookmark / views / share |
| Sidebar & menu | Home / Explore / Notifications / Chat / Calls / History / Profile / Bookmarks / Communities / Grok / Premium / Verified Orgs / Ads / Muted notices / Right column / Floating chat / Creator Studio |
| Layout & width | Wider post area (px), right-column spacing (px) |
| Media downloader | Filename format, date format, sync via bookmarks, bundle ZIP |
| General | Interface language (auto or explicit) |

### Media filename format
Tokens: `{userId}`, `{userName}`, `{postId}`, `{postTime}`, `{mediaType}`,
`{index}`, `{ext}`. The `{postTime}` date supports `YYYY MM DD HH mm ss`.
Defaults: `{userId}-{postId}-{mediaType}{index}` and `YYYYMMDD_HHmmss`.

### Permissions & privacy
The script runs **entirely in your browser** and never uploads your account data.
Every permission / domain it requests maps to a concrete feature:

| Permission / domain | Purpose |
|---|---|
| `GM_getValue` / `GM_setValue` | Persist settings |
| `GM_addStyle` | Inject styles |
| `GM_registerMenuCommand` / `GM_unregisterMenuCommand` | Toolbar menu |
| `GM_openInTab` | Open a new tab (Thread) |
| `GM_xmlhttpRequest` | Download media, resolve video, unroll threads |
| `x.com` / `twitter.com` | Where the script runs |
| `pbs.twimg.com` / `video.twimg.com` / `abs.twimg.com` | Image / video assets |
| `cdn.syndication.twimg.com` | Get MP4 URLs for videos (public embed endpoint) |
| `twitter-thread.com` | Thread reader |
| `@require` `fflate` from jsDelivr | ZIP bundling |

> ⚠️ **Note**: “Quick Block” performs a **real block action** on your account
> (equivalent to blocking by hand). Use responsibly and comply with X’s Terms of
> Service.

### Compatibility & maintenance
**Works on both X versions**: x.com currently A/B-serves the 2026 redesign and the
older build. Every feature carries anchors for both (new: `sidebar-item` / SVG
sprite / `data-slot`; old: `data-testid="AppTabBar_*_Link"`, `sidebarColumn`,
`caret`, `tweetText`, …), so it functions on either. X’s front-end changes often and removes `data-testid`. This toolkit relies on more
stable anchors instead (`data-engagement-action`, SVG sprite ids,
`[class*="sidebar-item"]`, `data-slot`, `:has()`, `[href$="/path"]`). If something
stops working one day, a selector has most likely gone stale — please
[open an issue](https://github.com/yesonline/x-toolkit/issues) with a “Save Page
As → HTML only” copy of the broken page so it can be fixed.

### Contributing
Read [CONTRIBUTING.md](CONTRIBUTING.md) first (house rules such as “verify
selectors against a real saved DOM” and “add new strings to all 9 languages”).

### License
[MIT](LICENSE) © 2026 YesOnline

### Disclaimer
This is an **unofficial** community script and is not affiliated with, endorsed by,
or sponsored by X Corp. It is provided “as is”, without warranty; use at your own
risk.
