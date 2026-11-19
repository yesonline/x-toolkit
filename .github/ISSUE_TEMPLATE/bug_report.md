---
name: Bug report / 問題回報
about: A feature stopped working, or a selector broke after an X change
title: "[Bug] "
labels: bug
assignees: []
---

<!--
Please fill in as much as you can. If a button/feature "stopped working",
it is almost always because X changed its DOM — a saved copy of the broken
page is the single most useful thing you can attach.
-->

## What broke? / 哪個功能壞了？
<!-- e.g. Clean & Optimize → Hide Explore; Quick Block; Media Downloader -->

## Describe the bug / 問題描述
A clear and concise description of what happened.

## Steps to reproduce / 重現步驟
1. Go to '...'
2. Click on '...'
3. See error / nothing happens

## Expected vs actual / 預期與實際
- Expected:
- Actual:

## Environment / 環境
- Browser + version:
- Userscript manager (Tampermonkey / Violentmonkey / Greasemonkey) + version:
- X interface language (Settings → Language):
- Script version (`@version` in the header):

## DOM evidence / DOM 證據 (very helpful)
Open the affected page, **Save Page As → "Webpage, HTML only"**, and paste the
`outerHTML` of the relevant element (e.g. one sidebar item, or a post's action
row). Redact any handles/cookies you are uncomfortable sharing.

```html
<!-- paste here -->
```

## Screenshots / 截圖

## Console errors / 主控台錯誤
```
<!-- any [XTK] errors -->
```
