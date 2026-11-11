// ==UserScript==
// @name         X Toolkit (Clean • Thread • Block • Emoji • Media • Markdown)
// @homepageURL  https://github.com/yesonline/x-toolkit
// @supportURL   https://github.com/yesonline/x-toolkit/issues
// @downloadURL  https://raw.githubusercontent.com/yesonline/x-toolkit/main/x-toolkit.user.js
// @updateURL    https://raw.githubusercontent.com/yesonline/x-toolkit/main/x-toolkit.user.js
// @version      1.2
// @description  All-in-one X/Twitter toolkit rebuilt for the 2026 X DOM: cleaner UI, thread reader, one-click block, emoji fix, media downloader and Markdown export.
// @author       YesOnline
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @match        https://x.com/*
// @match        https://twitter.com/*
// @connect      x.com
// @connect      twitter.com
// @connect      pbs.twimg.com
// @connect      abs.twimg.com
// @connect      video.twimg.com
// @connect      cdn.syndication.twimg.com
// @connect      twitter-thread.com
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @run-at       document-idle
// @require       https://cdn.jsdelivr.net/npm/fflate@0.8.2/umd/index.min.js
// ==/UserScript==

// ============================================================================
// X Toolkit — i18n
// Every user-facing string lives here. The settings panel exposes a language
// picker; the choice is persisted and applied immediately (the panel re-renders
// in the new language without a page reload).
// ============================================================================
(function (global) {
  'use strict';

  const TK = global.XTK || (global.XTK = {});

  // ------------------------------------------------------------- languages
  const LANGS = {
    en: {
      settings: 'Settings', save: 'Save & Refresh', close: 'Close',
      feat: 'Features', clean: 'Clean & Optimize', thread: 'Thread Reader',
      block: 'Quick Block', emoji: 'Emoji Fix', media: 'Media Downloader', md: 'Export Markdown',
      tweetBtns: 'Tweet Buttons', sidebar: 'Sidebar & Menu', layout: 'Layout & Width',
      hideReply: 'Hide Replies', hideRetweet: 'Hide Reposts', hideBookmark: 'Hide Bookmark',
      hideViews: 'Hide View Count', hideShare: 'Hide Share', hideLike: 'Hide Likes',
      hideGrok: 'Hide Grok', hidePremiumSignUp: 'Hide Premium', hideVerifiedOrgs: 'Hide Verified Orgs',
      hideSelectors: 'Hide Subscriptions', hideExplore: 'Hide Explore', hideNotifications: 'Hide Notifications',
      hideBookmarks: 'Hide Bookmarks', hideMessages: 'Hide Messages', hideCommunities: 'Hide Communities',
      hideCalls: 'Hide Calls', hideHistory: 'Hide History',
      hideHome: 'Hide Home', hideChat: 'Hide Chat', hideProfile: 'Hide Profile',
      hideother: 'Hide Ads / Business', hideMutedNotices: 'Hide Muted Notices', hideRightColumn: 'Hide Right Sidebar',
      hideChatButton: 'Hide Floating Chat', hideCreatorsStudio: 'Hide Creator Studio',
      useLargerCSS: 'Wider Post Area', cssWidth: 'Width (px)', useCustomPadding: 'Right Sidebar Spacing',
      paddingWidth: 'Padding (px)', filename: 'Filename format', postTime: 'Date/time format',
      sync: 'Sync history via bookmarks', zip: 'Bundle multiple media into a ZIP',
      blockPlaces: 'Block buttons', blockBtnRow: 'Block button in actions row', blockBtnHead: 'Block button at top-right of post', blockBtnProfile: 'Block button on profile',
      language: 'Language',
      btnThread: 'Open in Thread Reader', btnBlock: 'Block', btnMedia: 'Download media', btnMarkdown: 'Export as Markdown',
      menuSettings: 'X Toolkit: Settings', menuMarkdown: 'X Toolkit: Export Markdown', menuReload: 'X Toolkit: Reload features',
      toastThreadNoId: 'Cannot detect thread id',
      toastThreadLoading: 'Loading thread…',
      toastBlockItemMissing: 'Block menu item not found',
      toastConfirmMissing: 'Confirmation dialog not found',
      toastBlocked: 'User blocked',
      toastNoPost: 'No post found on this page',
      toastMdSaved: 'Markdown saved',
      toastNoMedia: 'No media found in this post',
      toastDownloadFailed: 'Download failed',
      toastDownloaded: 'Downloaded'
    },
    'zh-TW': {
      settings: '設定', save: '儲存並重新整理', close: '關閉',
      feat: '功能', clean: '介面純淨化', thread: 'Thread 閱讀器', block: '快速封鎖',
      emoji: 'Emoji 修正', media: '媒體下載', md: '匯出 Markdown',
      tweetBtns: '推文按鈕', sidebar: '側邊欄與選單', layout: '版面與寬度',
      hideReply: '隱藏 回覆', hideRetweet: '隱藏 轉發', hideBookmark: '隱藏 書籤',
      hideViews: '隱藏 查看', hideShare: '隱藏 分享', hideLike: '隱藏 喜歡',
      hideGrok: '隱藏 Grok', hidePremiumSignUp: '隱藏 Premium', hideVerifiedOrgs: '隱藏 已認證組織',
      hideSelectors: '隱藏 訂閱', hideExplore: '隱藏 探索', hideNotifications: '隱藏 通知',
      hideBookmarks: '隱藏 書籤', hideMessages: '隱藏 訊息', hideCommunities: '隱藏 社群',
      hideCalls: '隱藏 通話', hideHistory: '隱藏 歷史記錄',
      hideHome: '隱藏 首頁', hideChat: '隱藏 聊天', hideProfile: '隱藏 個人資料',
      hideother: '隱藏 廣告/商家', hideMutedNotices: '隱藏 靜音通知', hideRightColumn: '隱藏 右側邊欄',
      hideChatButton: '隱藏 懸浮聊天', hideCreatorsStudio: '隱藏 創作者工作室',
      useLargerCSS: '更寬的貼文區', cssWidth: '寬度 (px)', useCustomPadding: '右側邊欄間距',
      paddingWidth: '間距 (px)', filename: '檔名格式', postTime: '日期格式',
      sync: '以書籤同步紀錄', zip: '多媒體打包成 ZIP',
      blockPlaces: '封鎖按鈕位置', blockBtnRow: '互動列封鎖鈕', blockBtnHead: '貼文右上角封鎖鈕', blockBtnProfile: '個人主頁封鎖鈕',
      language: '語言',
      btnThread: '用 Thread 閱讀器開啟', btnBlock: '封鎖', btnMedia: '下載媒體', btnMarkdown: '匯出為 Markdown',
      menuSettings: 'X Toolkit：設定', menuMarkdown: 'X Toolkit：匯出 Markdown', menuReload: 'X Toolkit：重新載入功能',
      toastThreadNoId: '無法偵測串文 ID',
      toastThreadLoading: '正在載入串文…',
      toastBlockItemMissing: '找不到封鎖選單項目',
      toastConfirmMissing: '找不到確認對話框',
      toastBlocked: '已封鎖使用者',
      toastNoPost: '此頁面找不到貼文',
      toastMdSaved: 'Markdown 已儲存',
      toastNoMedia: '此貼文沒有媒體',
      toastDownloadFailed: '下載失敗',
      toastDownloaded: '已下載'
    },
    'zh-CN': {
      settings: '设置', save: '保存并刷新', close: '关闭',
      feat: '功能', clean: '界面净化', thread: 'Thread 阅读器', block: '快速拉黑',
      emoji: 'Emoji 修复', media: '媒体下载', md: '导出 Markdown',
      tweetBtns: '推文按钮', sidebar: '侧边栏与菜单', layout: '布局与宽度',
      hideReply: '隐藏 回复', hideRetweet: '隐藏 转发', hideBookmark: '隐藏 书签',
      hideViews: '隐藏 查看', hideShare: '隐藏 分享', hideLike: '隐藏 喜欢',
      hideGrok: '隐藏 Grok', hidePremiumSignUp: '隐藏 Premium', hideVerifiedOrgs: '隐藏 已认证组织',
      hideSelectors: '隐藏 订阅', hideExplore: '隐藏 探索', hideNotifications: '隐藏 通知',
      hideBookmarks: '隐藏 书签', hideMessages: '隐藏 消息', hideCommunities: '隐藏 社区',
      hideCalls: '隐藏 通话', hideHistory: '隐藏 历史记录',
      hideHome: '隐藏 首页', hideChat: '隐藏 聊天', hideProfile: '隐藏 个人资料',
      hideother: '隐藏 广告/商家', hideMutedNotices: '隐藏 静音通知', hideRightColumn: '隐藏 右侧边栏',
      hideChatButton: '隐藏 悬浮聊天', hideCreatorsStudio: '隐藏 创作者工作室',
      useLargerCSS: '更宽的帖子区', cssWidth: '宽度 (px)', useCustomPadding: '右侧边栏间距',
      paddingWidth: '间距 (px)', filename: '文件名格式', postTime: '日期格式',
      sync: '通过书签同步记录', zip: '多媒体打包为 ZIP',
      blockPlaces: '封锁按钮位置', blockBtnRow: '互动列封锁钮', blockBtnHead: '帖子右上角封锁钮', blockBtnProfile: '个人主页封锁钮',
      language: '语言',
      btnThread: '用 Thread 阅读器打开', btnBlock: '拉黑', btnMedia: '下载媒体', btnMarkdown: '导出为 Markdown',
      menuSettings: 'X Toolkit：设置', menuMarkdown: 'X Toolkit：导出 Markdown', menuReload: 'X Toolkit：重新加载功能',
      toastThreadNoId: '无法检测推文 ID',
      toastThreadLoading: '正在加载推文…',
      toastBlockItemMissing: '未找到拉黑菜单项',
      toastConfirmMissing: '未找到确认对话框',
      toastBlocked: '已拉黑用户',
      toastNoPost: '此页面未找到帖子',
      toastMdSaved: 'Markdown 已保存',
      toastNoMedia: '此帖子没有媒体',
      toastDownloadFailed: '下载失败',
      toastDownloaded: '已下载'
    },
    ja: {
      settings: '設定', save: '保存して再読み込み', close: '閉じる',
      feat: '機能', clean: 'クリーンアップ', thread: 'Thread リーダー', block: 'クイックブロック',
      emoji: '絵文字修正', media: 'メディア保存', md: 'Markdown 書き出し',
      tweetBtns: 'ツイートボタン', sidebar: 'サイドバーとメニュー', layout: 'レイアウトと幅',
      hideReply: '返信を非表示', hideRetweet: 'リツイートを非表示', hideBookmark: 'ブックマークを非表示',
      hideViews: '閲覧数を非表示', hideShare: '共有を非表示', hideLike: 'いいねを非表示',
      hideGrok: 'Grokを非表示', hidePremiumSignUp: 'Premiumを非表示', hideVerifiedOrgs: '認証済み組織を非表示',
      hideSelectors: 'サブスクリプションを非表示', hideExplore: '探索を非表示', hideNotifications: '通知を非表示',
      hideBookmarks: 'ブックマークを非表示', hideMessages: 'メッセージを非表示', hideCommunities: 'コミュニティを非表示',
      hideCalls: '通話を非表示', hideHistory: '履歴を非表示',
      hideHome: 'ホームを非表示', hideChat: 'チャットを非表示', hideProfile: 'プロフィールを非表示',
      hideother: '広告/feoを非表示', hideMutedNotices: 'ミュート通知を非表示', hideRightColumn: '右サイドバーを非表示',
      hideChatButton: 'フローティングチャットを非表示', hideCreatorsStudio: 'クリエイタースタジオを非表示',
      useLargerCSS: '投稿エリアを拡大', cssWidth: '幅 (px)', useCustomPadding: '右サイドバーの間隔',
      paddingWidth: '間隔 (px)', filename: 'ファイル名形式', postTime: '日時形式',
      sync: 'ブックマークで履歴を同期', zip: '複数メディアを ZIP に',
      blockPlaces: 'ブロックボタン', blockBtnRow: 'アクション行のブロック', blockBtnHead: '投稿右上のブロック', blockBtnProfile: 'プロフィールのブロック',
      language: '言語',
      btnThread: 'Thread リーダーで開く', btnBlock: 'ブロック', btnMedia: 'メディアを保存', btnMarkdown: 'Markdown で書き出し',
      menuSettings: 'X Toolkit：設定', menuMarkdown: 'X Toolkit：Markdown 書き出し', menuReload: 'X Toolkit：機能を再読み込み',
      toastThreadNoId: 'スレッド ID を検出できません',
      toastThreadLoading: 'スレッドを読み込み中…',
      toastBlockItemMissing: 'ブロックメニュー項目が見つかりません',
      toastConfirmMissing: '確認ダイアログが見つかりません',
      toastBlocked: 'ブロックしました',
      toastNoPost: 'このページに投稿が見つかりません',
      toastMdSaved: 'Markdown を保存しました',
      toastNoMedia: 'この投稿にメディアはありません',
      toastDownloadFailed: 'ダウンロードに失敗しました',
      toastDownloaded: 'ダウンロードしました'
    },
    ko: {
      settings: '설정', save: '저장 후 새로 고침', close: '닫기',
      feat: '기능', clean: '화면 정리', thread: 'Thread 리더', block: '빠른 차단',
      emoji: '이모지 수정', media: '미디어 다운로드', md: 'Markdown 내보내기',
      tweetBtns: '트윗 버튼', sidebar: '사이드바 및 메뉴', layout: '레이아웃 및 너비',
      hideReply: '답글 숨기기', hideRetweet: '리트윗 숨기기', hideBookmark: '북마크 숨기기',
      hideViews: '조회수 숨기기', hideShare: '공유 숨기기', hideLike: '좋아요 숨기기',
      hideGrok: 'Grok 숨기기', hidePremiumSignUp: 'Premium 숨기기', hideVerifiedOrgs: '인증된 조직 숨기기',
      hideSelectors: '구독 숨기기', hideExplore: '탐색 숨기기', hideNotifications: '알림 숨기기',
      hideBookmarks: '북마크 숨기기', hideMessages: '메시지 숨기기', hideCommunities: '커뮤니티 숨기기',
      hideCalls: '통화 숨기기', hideHistory: '기록 숨기기',
      hideHome: '홈 숨기기', hideChat: '채팅 숨기기', hideProfile: '프로필 숨기기',
      hideother: '광고/비즈니스 숨기기', hideMutedNotices: '뮤트 알림 숨기기', hideRightColumn: '오른쪽 사이드바 숨기기',
      hideChatButton: '플로팅 채팅 숨기기', hideCreatorsStudio: '크리에이터 스튜디오 숨기기',
      useLargerCSS: '넓은 게시물 영역', cssWidth: '너비 (px)', useCustomPadding: '오른쪽 사이드바 간격',
      paddingWidth: '간격 (px)', filename: '파일명 형식', postTime: '날짜/시간 형식',
      sync: '북마크로 기록 동기화', zip: '여러 미디어를 ZIP으로 묶기',
      blockPlaces: '차단 버튼', blockBtnRow: '액션 줄 차단 버튼', blockBtnHead: '게시물 우상단 차단 버튼', blockBtnProfile: '프로필 차단 버튼',
      language: '언어',
      btnThread: 'Thread 리더로 열기', btnBlock: '차단', btnMedia: '미디어 다운로드', btnMarkdown: 'Markdown으로 내보내기',
      menuSettings: 'X Toolkit: 설정', menuMarkdown: 'X Toolkit: Markdown 내보내기', menuReload: 'X Toolkit: 기능 새로 고침',
      toastThreadNoId: '스레드 ID를 감지할 수 없습니다',
      toastThreadLoading: '스레드를 불러오는 중…',
      toastBlockItemMissing: '차단 메뉴 항목을 찾지 못했습니다',
      toastConfirmMissing: '확인 대화상자를 찾지 못했습니다',
      toastBlocked: '사용자를 차단했습니다',
      toastNoPost: '이 페이지에서 게시물을 찾지 못했습니다',
      toastMdSaved: 'Markdown을 저장했습니다',
      toastNoMedia: '이 게시물에 미디어가 없습니다',
      toastDownloadFailed: '다운로드 실패',
      toastDownloaded: '다운로드 완료'
    },
    es: {
      settings: 'Ajustes', save: 'Guardar y recargar', close: 'Cerrar',
      feat: 'Funciones', clean: 'Limpiar y optimizar', thread: 'Lector de hilos', block: 'Bloqueo rápido',
      emoji: 'Arreglar emojis', media: 'Descargador de medios', md: 'Exportar a Markdown',
      tweetBtns: 'Botones del tweet', sidebar: 'Barra lateral y menú', layout: 'Diseño y ancho',
      hideReply: 'Ocultar respuestas', hideRetweet: 'Ocultar reposts', hideBookmark: 'Ocultar marcadores',
      hideViews: 'Ocultar visualizaciones', hideShare: 'Ocultar compartir', hideLike: 'Ocultar me gusta',
      hideGrok: 'Ocultar Grok', hidePremiumSignUp: 'Ocultar Premium', hideVerifiedOrgs: 'Ocultar organizaciones verificadas',
      hideSelectors: 'Ocultar suscripciones', hideExplore: 'Ocultar Explorar', hideNotifications: 'Ocultar notificaciones',
      hideBookmarks: 'Ocultar marcadores', hideMessages: 'Ocultar mensajes', hideCommunities: 'Ocultar comunidades',
      hideCalls: 'Ocultar llamadas', hideHistory: 'Ocultar historial',
      hideHome: 'Ocultar inicio', hideChat: 'Ocultar chats', hideProfile: 'Ocultar perfil',
      hideother: 'Ocultar anuncios / empresas', hideMutedNotices: 'Ocultar avisos de silenciados', hideRightColumn: 'Ocultar barra derecha',
      hideChatButton: 'Ocultar chat flotante', hideCreatorsStudio: 'Ocultar Creator Studio',
      useLargerCSS: 'Área de publicaciones más ancha', cssWidth: 'Ancho (px)', useCustomPadding: 'Espaciado de la barra derecha',
      paddingWidth: 'Espaciado (px)', filename: 'Formato del nombre de archivo', postTime: 'Formato de fecha/hora',
      sync: 'Sincronizar historial con marcadores', zip: 'Agrupar varios medios en un ZIP',
      blockPlaces: 'Botones de bloqueo', blockBtnRow: 'Botón en la fila de acciones', blockBtnHead: 'Botón arriba a la derecha', blockBtnProfile: 'Botón en el perfil',
      language: 'Idioma',
      btnThread: 'Abrir en el lector de hilos', btnBlock: 'Bloquear', btnMedia: 'Descargar medio', btnMarkdown: 'Exportar como Markdown',
      menuSettings: 'X Toolkit: Ajustes', menuMarkdown: 'X Toolkit: Exportar Markdown', menuReload: 'X Toolkit: Recargar funciones',
      toastThreadNoId: 'No se pudo detectar el ID del hilo',
      toastThreadLoading: 'Cargando hilo…',
      toastBlockItemMissing: 'No se encontró el elemento de menú Bloquear',
      toastConfirmMissing: 'No se encontró el diálogo de confirmación',
      toastBlocked: 'Usuario bloqueado',
      toastNoPost: 'No se encontró ninguna publicación en esta página',
      toastMdSaved: 'Markdown guardado',
      toastNoMedia: 'No hay medios en esta publicación',
      toastDownloadFailed: 'Error en la descarga',
      toastDownloaded: 'Descargado'
    },
    fr: {
      settings: 'Paramètres', save: 'Enregistrer et recharger', close: 'Fermer',
      feat: 'Fonctions', clean: 'Nettoyer et optimiser', thread: 'Lecteur de fils', block: 'Blocage rapide',
      emoji: 'Correction des emojis', media: 'Téléchargeur de médias', md: 'Export en Markdown',
      tweetBtns: 'Boutons du tweet', sidebar: 'Barre latérale et menu', layout: 'Mise en page et largeur',
      hideReply: 'Masquer les réponses', hideRetweet: 'Masquer les repartages', hideBookmark: 'Masquer les favoris',
      hideViews: 'Masquer les vues', hideShare: 'Masquer le partage', hideLike: 'Masquer les j’aime',
      hideGrok: 'Masquer Grok', hidePremiumSignUp: 'Masquer Premium', hideVerifiedOrgs: 'Masquer les organisations vérifiées',
      hideSelectors: 'Masquer les abonnements', hideExplore: 'Masquer Explorer', hideNotifications: 'Masquer les notifications',
      hideBookmarks: 'Masquer les favoris', hideMessages: 'Masquer les messages', hideCommunities: 'Masquer les communautés',
      hideCalls: 'Masquer les appels', hideHistory: 'Masquer l’historique',
      hideHome: 'Masquer l’accueil', hideChat: 'Masquer les discussions', hideProfile: 'Masquer le profil',
      hideother: 'Masquer les pubs / entreprises', hideMutedNotices: 'Masquer les avis de comptes muets', hideRightColumn: 'Masquer la colonne de droite',
      hideChatButton: 'Masquer le chat flottant', hideCreatorsStudio: 'Masquer Creator Studio',
      useLargerCSS: 'Zone de publication plus large', cssWidth: 'Largeur (px)', useCustomPadding: 'Espacement de la colonne de droite',
      paddingWidth: 'Espacement (px)', filename: 'Format du nom de fichier', postTime: 'Format date/heure',
      sync: 'Synchroniser l’historique via les favoris', zip: 'Regrouper plusieurs médias dans un ZIP',
      blockPlaces: 'Boutons de blocage', blockBtnRow: 'Bouton dans la rangée d’actions', blockBtnHead: 'Bouton en haut à droite', blockBtnProfile: 'Bouton sur le profil',
      language: 'Langue',
      btnThread: 'Ouvrir dans le lecteur de fils', btnBlock: 'Bloquer', btnMedia: 'Télécharger le média', btnMarkdown: 'Exporter en Markdown',
      menuSettings: 'X Toolkit : Paramètres', menuMarkdown: 'X Toolkit : Export Markdown', menuReload: 'X Toolkit : Recharger les fonctions',
      toastThreadNoId: 'Impossible de détecter l’ID du fil',
      toastThreadLoading: 'Chargement du fil…',
      toastBlockItemMissing: 'Élément de menu « Bloquer » introuvable',
      toastConfirmMissing: 'Boîte de dialogue de confirmation introuvable',
      toastBlocked: 'Utilisateur bloqué',
      toastNoPost: 'Aucune publication trouvée sur cette page',
      toastMdSaved: 'Markdown enregistré',
      toastNoMedia: 'Aucun média dans cette publication',
      toastDownloadFailed: 'Échec du téléchargement',
      toastDownloaded: 'Téléchargé'
    },
    de: {
      settings: 'Einstellungen', save: 'Speichern und neu laden', close: 'Schließen',
      feat: 'Funktionen', clean: 'Aufräumen und optimieren', thread: 'Thread-Leser', block: 'Schnellblockieren',
      emoji: 'Emoji-Fix', media: 'Medien-Downloader', md: 'Markdown-Export',
      tweetBtns: 'Tweet-Schaltflächen', sidebar: 'Seitenleiste und Menü', layout: 'Layout und Breite',
      hideReply: 'Antworten ausblenden', hideRetweet: 'Reposts ausblenden', hideBookmark: 'Lesezeichen ausblenden',
      hideViews: 'Aufrufe ausblenden', hideShare: 'Teilen ausblenden', hideLike: 'Likes ausblenden',
      hideGrok: 'Grok ausblenden', hidePremiumSignUp: 'Premium ausblenden', hideVerifiedOrgs: 'Verifizierte Organisationen ausblenden',
      hideSelectors: 'Abonnements ausblenden', hideExplore: 'Entdecken ausblenden', hideNotifications: 'Mitteilungen ausblenden',
      hideBookmarks: 'Lesezeichen ausblenden', hideMessages: 'Nachrichten ausblenden', hideCommunities: 'Communities ausblenden',
      hideCalls: 'Anrufe ausblenden', hideHistory: 'Verlauf ausblenden',
      hideHome: 'Startseite ausblenden', hideChat: 'Chats ausblenden', hideProfile: 'Profil ausblenden',
      hideother: 'Anzeigen / Unternehmen ausblenden', hideMutedNotices: 'Hinweise stummer Konten ausblenden', hideRightColumn: 'Rechte Spalte ausblenden',
      hideChatButton: 'Schwebenden Chat ausblenden', hideCreatorsStudio: 'Creator Studio ausblenden',
      useLargerCSS: 'Breiterer Post-Bereich', cssWidth: 'Breite (px)', useCustomPadding: 'Abstand der rechten Spalte',
      paddingWidth: 'Abstand (px)', filename: 'Dateinamensformat', postTime: 'Datums-/Zeitformat',
      sync: 'Verlauf über Lesezeichen synchronisieren', zip: 'Mehrere Medien in ein ZIP bündeln',
      blockPlaces: 'Blockieren-Schaltflächen', blockBtnRow: 'Blockieren in Aktionsleiste', blockBtnHead: 'Blockieren oben rechts', blockBtnProfile: 'Blockieren im Profil',
      language: 'Sprache',
      btnThread: 'Im Thread-Leser öffnen', btnBlock: 'Blockieren', btnMedia: 'Medien herunterladen', btnMarkdown: 'Als Markdown exportieren',
      menuSettings: 'X Toolkit: Einstellungen', menuMarkdown: 'X Toolkit: Markdown-Export', menuReload: 'X Toolkit: Funktionen neu laden',
      toastThreadNoId: 'Thread-ID konnte nicht erkannt werden',
      toastThreadLoading: 'Thread wird geladen…',
      toastBlockItemMissing: 'Menüeintrag „Blockieren“ nicht gefunden',
      toastConfirmMissing: 'Bestätigungsdialog nicht gefunden',
      toastBlocked: 'Benutzer blockiert',
      toastNoPost: 'Kein Beitrag auf dieser Seite gefunden',
      toastMdSaved: 'Markdown gespeichert',
      toastNoMedia: 'Keine Medien in diesem Beitrag',
      toastDownloadFailed: 'Download fehlgeschlagen',
      toastDownloaded: 'Heruntergeladen'
    },
    'pt-BR': {
      settings: 'Configurações', save: 'Salvar e recarregar', close: 'Fechar',
      feat: 'Recursos', clean: 'Limpar e otimizar', thread: 'Leitor de threads', block: 'Bloqueio rápido',
      emoji: 'Correção de emojis', media: 'Baixador de mídia', md: 'Exportar Markdown',
      tweetBtns: 'Botões do tweet', sidebar: 'Barra lateral e menu', layout: 'Layout e largura',
      hideReply: 'Ocultar respostas', hideRetweet: 'Ocultar repostes', hideBookmark: 'Ocultar salvos',
      hideViews: 'Ocultar visualizações', hideShare: 'Ocultar compartilhamento', hideLike: 'Ocultar curtidas',
      hideGrok: 'Ocultar Grok', hidePremiumSignUp: 'Ocultar Premium', hideVerifiedOrgs: 'Ocultar organizações verificadas',
      hideSelectors: 'Ocultar assinaturas', hideExplore: 'Ocultar Explorar', hideNotifications: 'Ocultar notificações',
      hideBookmarks: 'Ocultar salvos', hideMessages: 'Ocultar mensagens', hideCommunities: 'Ocultar comunidades',
      hideCalls: 'Ocultar chamadas', hideHistory: 'Ocultar histórico',
      hideHome: 'Ocultar início', hideChat: 'Ocultar conversas', hideProfile: 'Ocultar perfil',
      hideother: 'Ocultar anúncios / empresas', hideMutedNotices: 'Ocultar avisos de silenciados', hideRightColumn: 'Ocultar barra direita',
      hideChatButton: 'Ocultar chat flutuante', hideCreatorsStudio: 'Ocultar Creator Studio',
      useLargerCSS: 'Área de postagens mais larga', cssWidth: 'Largura (px)', useCustomPadding: 'Espaçamento da barra direita',
      paddingWidth: 'Espaçamento (px)', filename: 'Formato do nome do arquivo', postTime: 'Formato de data/hora',
      sync: 'Sincronizar histórico por salvos', zip: 'Agrupar várias mídias em ZIP',
      blockPlaces: 'Botões de bloqueio', blockBtnRow: 'Botão na linha de ações', blockBtnHead: 'Botão no canto superior direito', blockBtnProfile: 'Botão no perfil',
      language: 'Idioma',
      btnThread: 'Abrir no leitor de threads', btnBlock: 'Bloquear', btnMedia: 'Baixar mídia', btnMarkdown: 'Exportar como Markdown',
      menuSettings: 'X Toolkit: Configurações', menuMarkdown: 'X Toolkit: Exportar Markdown', menuReload: 'X Toolkit: Recarregar recursos',
      toastThreadNoId: 'Não foi possível detectar o ID da thread',
      toastThreadLoading: 'Carregando thread…',
      toastBlockItemMissing: 'Item de menu “Bloquear” não encontrado',
      toastConfirmMissing: 'Diálogo de confirmação não encontrado',
      toastBlocked: 'Usuário bloqueado',
      toastNoPost: 'Nenhuma postagem encontrada nesta página',
      toastMdSaved: 'Markdown salvo',
      toastNoMedia: 'Nenhuma mídia nesta postagem',
      toastDownloadFailed: 'Falha no download',
      toastDownloaded: 'Baixado'
    }
  };

  // Native names — a language picker should list languages in their own
  // script, not in the currently active one.
  const LANG_NAMES = {
    en: 'English',
    'zh-TW': '繁體中文',
    'zh-CN': '简体中文',
    ja: '日本語',
    ko: '한국어',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch',
    'pt-BR': 'Português (Brasil)'
  };

  const AUTO = 'auto';

  function detect() {
    const nav = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    const keys = Object.keys(LANGS);
    // Exact match first, then a base-language match (zh-TW -> zh, en-GB -> en).
    let key = keys.find((k) => k.toLowerCase() === nav);
    if (!key) key = keys.find((k) => nav.startsWith(k.toLowerCase() + '-'));
    if (!key) {
      const base = nav.split('-')[0];
      key = keys.find((k) => k.toLowerCase().split('-')[0] === base);
    }
    return key || 'en';
  }

  function activeKey() {
    const pref = TK.settings && TK.settings.uiLang;
    if (pref && pref !== AUTO && LANGS[pref]) return pref;
    return detect();
  }

  TK.LANGS = LANGS;
  TK.LANG_NAMES = LANG_NAMES;
  TK.LANG_KEYS = [AUTO].concat(Object.keys(LANGS));

  // TK.LANG is a live view of the active language so that a language switch
  // takes effect everywhere that reads it, without rebuilding the page.
  Object.defineProperty(TK, 'LANG', {
    enumerable: true,
    get() { return LANGS[activeKey()]; }
  });

  // TK.t() resolves a key with an English fallback.
  TK.t = function (key) {
    const L = LANGS[activeKey()];
    if (L && L[key] != null) return L[key];
    const en = LANGS.en;
    if (en && en[key] != null) return en[key];
    return key;
  };

  TK.activeLang = activeKey;

  // Persist the language and notify listeners so open UI can re-render.
  TK.setLang = function (code) {
    if (!TK.settings) return;
    const next = (!code || code === AUTO || !LANGS[code]) ? AUTO : code;
    if (TK.settings.uiLang === next) return next;
    TK.settings.uiLang = next;
    TK.GM.set('uiLang', next);
    try {
      document.documentElement.setAttribute('data-xtk-lang', activeKey());
    } catch (e) { /* ignore */ }
    // Notify every registered listener (panel re-render, injected button
    // re-localization, ...).
    const listeners = TK._langListeners || [];
    listeners.slice().forEach((fn) => {
      try { fn(activeKey()); } catch (e) { /* ignore */ }
    });
    return activeKey();
  };

})(window);


// ============================================================================
// X Toolkit — core runtime
// Shared: settings store, resilient DOM layer, toasts, observers, menu commands.
// All selectors here were validated against the current x.com SSR output
// (see _probe/evidence.md). Legacy `data-testid` hooks are kept only as
// optional fallbacks because the current DOM does not emit them.
// ============================================================================
(function (global) {
  'use strict';

  const TK = global.XTK || (global.XTK = {});

  // ---------------------------------------------------------------- settings
  const GM = {
    get: (k, d) => (typeof GM_getValue === 'function' ? GM_getValue(k, d) : d),
    set: (k, v) => { try { GM_setValue(k, v); } catch (e) { /* ignore */ } },
    addStyle: (css) => {
      if (typeof GM_addStyle === 'function') { try { GM_addStyle(css); return; } catch (e) { /* fall through */ } }
      const s = document.createElement('style');
      s.textContent = css;
      (document.head || document.documentElement).appendChild(s);
    },
    menu: (name, fn, key) => {
      if (typeof GM_registerMenuCommand === 'function') {
        try { return GM_registerMenuCommand(name, fn, key); } catch (e) { /* ignore */ }
      }
      return null;
    }
  };
  TK.GM = GM;

  const DEFAULTS = {
    // feature master switches
    fClean: true, fThread: true, fBlock: true, fEmoji: true, fMedia: true, fMarkdown: true,
    // quick-block button placements (sub-switches; all need fBlock on)
    blockBtnRow: true, blockBtnHead: true, blockBtnProfile: true,
    // clean & optimize
    hideReply: true, hideRetweet: true, hideBookmark: true, hideViews: true, hideShare: true,
    hideLike: false, hideGrok: true, hidePremiumSignUp: true, hideVerifiedOrgs: true, hideother: true,
    hideExplore: false, hideNotifications: false, hideBookmarks: false, hideMessages: false,
    hideHome: false, hideChat: false, hideProfile: false,
    hideCommunities: false, hideCalls: false, hideHistory: false, hideMutedNotices: false, hideRightColumn: false, hideChatButton: false,
    hideCreatorsStudio: false, useLargerCSS: false, cssWidth: 680, useCustomPadding: false, paddingWidth: 20,
    // media downloader
    mdFilenameFormat: '{userId}-{postId}-{mediaType}{index}',
    mdPostTimeFormat: 'YYYYMMDD_HHmmss',
    mdSync: false,
    mdZip: true,
    // interface language: 'auto' follows the browser, otherwise a locale key
    uiLang: 'auto'
  };

  const settings = {};
  Object.keys(DEFAULTS).forEach((k) => { settings[k] = GM.get(k, DEFAULTS[k]); });
  TK.settings = settings;
  TK.DEFAULTS = DEFAULTS;

  // Language-change listeners. src/i18n.js notifies them when the user picks
  // a different interface language, so injected UI can re-localize itself.
  TK._langListeners = [];
  TK.onLangChange = function (fn) {
    if (typeof fn === 'function') TK._langListeners.push(fn);
  };

  TK.saveSettings = () => {
    Object.keys(DEFAULTS).forEach((k) => GM.set(k, settings[k]));
  };

  // ------------------------------------------------------------------ i18n
  // The language packs live in src/i18n.js (built ahead of this file).
  // TK.LANG is a live getter there, TK.t(key) resolves a string with an
  // English fallback, and TK.setLang(code) persists + notifies listeners.

  // ------------------------------------------------------------------ toast
  TK.toast = function (message, type = 'info', timeout = 1800) {
    const bg = type === 'error' ? '#f4212e' : type === 'success' ? '#00ba7c' : '#536471';
    const el = document.createElement('div');
    el.className = 'xtk-toast';
    el.textContent = message;
    el.style.cssText = 'position:fixed;top:16px;right:16px;z-index:2147483000;padding:10px 16px;' +
      'border-radius:8px;color:#fff;font:600 13px/1.3 system-ui,-apple-system,"Segoe UI",sans-serif;' +
      'background:' + bg + ';box-shadow:0 4px 14px rgba(0,0,0,.25);pointer-events:none;' +
      'max-width:320px;white-space:pre-wrap;';
    (document.body || document.documentElement).appendChild(el);
    setTimeout(() => el.remove(), timeout);
  };

  // ------------------------------------------------------- capsule tooltip
  // A single shared, Twitter-native tooltip (black pill, white text): a 0.4s
  // hover delay, then a 0.4s fade-in. It replaces the browser's native `title`
  // tooltip on every injected button while the button keeps its localized
  // `aria-label` for assistive tech. Text is resolved lazily on each hover via a
  // getter, so a language change is reflected without rebinding.
  TK.tip = (function () {
    let el = null;
    let timer = null;
    const CSS =
      '.xtk-tip{position:fixed;z-index:2147482000;background:rgba(15,20,25,.9);' +
      'color:#fff;font:400 11px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;' +
      'padding:3px 8px;border-radius:9999px;white-space:nowrap;pointer-events:none;opacity:0;' +
      'transition:opacity .4s ease;height:20px;box-sizing:border-box;display:flex;align-items:center;' +
      'justify-content:center;transform:translateX(-50%);box-shadow:none;}' +
      '.xtk-tip.xtk-tip--show{opacity:1;}';

    function ensureStyle() {
      if (document.getElementById('xtk-tip-css')) return;
      const s = document.createElement('style');
      s.id = 'xtk-tip-css';
      s.textContent = CSS;
      (document.head || document.documentElement).appendChild(s);
    }
    function ensureEl() {
      if (el && document.body.contains(el)) return el;
      el = document.createElement('div');
      el.className = 'xtk-tip';
      el.setAttribute('role', 'tooltip');
      el.setAttribute('aria-hidden', 'true');
      document.body.appendChild(el);
      return el;
    }
    function show(target, text) {
      if (timer) { clearTimeout(timer); timer = null; }
      timer = setTimeout(function () {
        timer = null;
        if (!text) return;
        const t = ensureEl();
        t.textContent = text;
        const r = target.getBoundingClientRect();
        t.style.top = (r.bottom + 2) + 'px';
        t.style.left = (r.left + r.width / 2) + 'px';
        requestAnimationFrame(function () { t.classList.add('xtk-tip--show'); });
      }, 400);
    }
    function hide() {
      if (timer) { clearTimeout(timer); timer = null; }
      if (el) el.classList.remove('xtk-tip--show');
    }
    function attach(node, textFn) {
      ensureStyle();
      const resolve = () => (typeof textFn === 'function' ? textFn() : textFn);
      node.addEventListener('mouseenter', function () { show(node, resolve()); });
      node.addEventListener('mouseleave', hide);
      node.addEventListener('click', hide);
      return node;
    }
    // Keep the pill glued to its button: hide on any scroll (capture catches
    // X's inner scrollers) or window resize.
    window.addEventListener('scroll', hide, true);
    window.addEventListener('resize', hide);
    return { attach, show, hide, ensureStyle };
  })();

  // =========================================================== DOM utilities
  // The current X front-end renders every post as <article> and exposes the
  // engagement row as div[role="group"]. Action buttons are identified by
  // aria-label and by SVG sprite references (#icon-reply, #icon-heart, ...),
  // which stay stable even when the UI language changes.
  const X = {};
  TK.X = X;

  X.ARTICLE = 'article';
  X.SPRITE = {
    reply: '#icon-reply', repost: '#icon-repost', like: '#icon-heart',
    bookmark: '#icon-bookmark', share: '#icon-share-ios', views: '#icon-bar-chart',
    more: '#icon-more-dots-hor', verified: '#icon-verified-premium-color'
  };

  // The current DOM ships stable, language-independent data attributes on the
  // engagement row (verified in the SSR output of x.com/<user>/status/<id>):
  //   <div data-engagement-action="reply|retweet|like|bookmark|share|generic">
  // These are the most reliable hooks and are preferred over aria-labels.
  X.ACTION_ATTR = {
    reply: 'reply', repost: 'retweet', like: 'like',
    bookmark: 'bookmark', share: 'share', views: 'generic'
  };

  X.spriteOf = function (el) {
    if (!el) return null;
    const use = el.querySelector && el.querySelector('use[href]');
    if (!use) return null;
    const href = use.getAttribute('href') || '';
    return href.startsWith('#') ? href : null;
  };

  X.hasSprite = function (el, sprite) {
    return X.spriteOf(el) === sprite;
  };

  // All post containers on the page.
  X.posts = function (root) {
    const scope = root || document;
    const out = [];
    const seen = new Set();
    scope.querySelectorAll('article').forEach((a) => {
      if (seen.has(a)) return;
      seen.add(a);
      // A post article always links to a /status/<id> permalink.
      if (a.querySelector('a[href*="/status/"]')) out.push(a);
    });
    return out;
  };

  // The engagement action row of a post.
  X.actionGroup = function (article) {
    if (!article) return null;
    // Preferred: the group that carries the data-engagement-action markers.
    const marked = article.querySelector('[data-engagement-action="reply"]');
    if (marked) {
      const g = marked.closest('div[role="group"]') || marked.parentElement;
      if (g) return g;
    }
    const groups = article.querySelectorAll('div[role="group"]');
    let best = null;
    groups.forEach((g) => {
      if (!best) { best = g; return; }
      // Prefer the group that actually holds the reply/repost/like controls.
      if (!best.querySelector('use[href="#icon-reply"]') &&
          (g.querySelector('use[href="#icon-reply"]') || g.querySelector('use[href="#icon-repost"]'))) {
        best = g;
      }
    });
    if (best && best.querySelector('use[href="#icon-reply"]')) return best;
    return best;
  };

  // Find an action control by sprite id, with aria-label / testid fallbacks.
  X.actionButton = function (article, kind) {
    const group = X.actionGroup(article);
    if (!group) return null;
    // Preferred: the stable data-engagement-action attribute.
    const attr = X.ACTION_ATTR[kind];
    if (attr) {
      const holder = group.querySelector('[data-engagement-action="' + attr + '"]');
      if (holder) {
        const btn = holder.querySelector('button, a') || holder;
        if (btn) return btn;
      }
    }
    const sprite = X.SPRITE[kind];
    const spriteHit = sprite ? group.querySelector('use[href="' + sprite + '"]') : null;
    if (spriteHit) {
      const btn = spriteHit.closest('button, a');
      if (btn) return btn;
    }
    const legacyTestId = { reply: 'reply', repost: 'retweet', like: 'like', bookmark: 'bookmark', share: 'share' }[kind];
    if (legacyTestId) {
      const el = group.querySelector('[data-testid="' + legacyTestId + '"]') ||
        group.querySelector('[data-testid="un' + legacyTestId + '"]');
      if (el) return el;
    }
    const labelRe = {
      reply: /(repl(y|ies)|回复|回覆|返信)/i,
      repost: /(repost|retweet|轉發|转发|リツイート)/i,
      like: /(like|喜歡|喜欢|いいね)/i,
      bookmark: /bookmark|書籤|书签|ブックマーク/i,
      share: /share|分享|共有/i,
      views: /view count|views|瀏覽|查看|閲覧/i
    }[kind];
    if (labelRe) {
      const hits = group.querySelectorAll('button, a');
      for (const h of hits) {
        const l = h.getAttribute('aria-label') || '';
        if (labelRe.test(l)) return h;
      }
    }
    return null;
  };

  // The "More" (caret) button of a post header.
  X.moreButton = function (article) {
    if (!article) return null;
    const sprite = article.querySelector('use[href="#icon-more-dots-hor"]');
    if (sprite) {
      const btn = sprite.closest('button');
      if (btn) return btn;
    }
    const aria = article.querySelector('button[aria-label="More"]');
    if (aria) return aria;
    const legacy = article.querySelector('button[data-testid="caret"]');
    if (legacy) return legacy;
    // Localized "More" labels.
    const moreRe = /^(more|更多|更多選項|更多选项|その他|-moi|mehr|mas|más|più|довольно)$/i;
    const buttons = article.querySelectorAll('button');
    for (const b of buttons) {
      const l = (b.getAttribute('aria-label') || '').trim();
      if (moreRe.test(l)) return b;
    }
    return null;
  };

  // Permalink of a post -> { id, url, handle }
  X.postInfo = function (article) {
    if (!article) return null;
    let link = null;
    const links = article.querySelectorAll('a[href*="/status/"]');
    for (const l of links) {
      const h = l.getAttribute('href') || '';
      if (/\/status\/\d+/.test(h)) { link = l; break; }
    }
    if (!link) return null;
    const href = link.getAttribute('href') || '';
    const m = href.match(/\/([^/]+)\/status\/(\d+)/);
    if (!m) return null;
    return { handle: m[1], id: m[2], url: new URL(href, location.origin).href, link };
  };

  // Display name of the author of a post.
  X.postAuthor = function (article) {
    if (!article) return { name: '', handle: '' };
    const info = X.postInfo(article);
    let name = '';
    const nameEl = article.querySelector('.text-body.font-bold') ||
      article.querySelector('[data-testid="User-Name"] div[dir="ltr"] span');
    if (nameEl) name = (nameEl.textContent || '').trim();
    let handle = '';
    if (info) handle = '@' + info.handle;
    const handleEl = article.querySelector('.text-body.font-normal span, a[href^="/"] span.text-body');
    if (!handle && handleEl) {
      const t = (handleEl.textContent || '').trim();
      if (t.startsWith('@')) handle = t;
    }
    if (!name && handle) name = handle.slice(1);
    return { name, handle };
  };

  // Timestamp of a post (ISO string when available).
  X.postTime = function (article) {
    if (!article) return '';
    const t = article.querySelector('time[datetime]');
    if (t) return t.getAttribute('datetime');
    // Current DOM: the SSR stream calls
    //   window.__xClientTextFormatters?.run(id, "formatRelativePastTimestamp",
    //     {"timestamp": 1793820210000, ...})
    // which carries the exact epoch milliseconds of the post.
    const scripts = article.querySelectorAll('script');
    for (const s of scripts) {
      const mm = s.textContent.match(/"timestamp"\s*:\s*(\d{10,})/);
      if (mm) return new Date(parseInt(mm[1], 10)).toISOString();
    }
    const info = X.postInfo(article);
    if (!info) return '';
    const script = article.querySelector('script');
    if (script) {
      const mm = script.textContent.match(/"dateCreated"\s*:\s*"([^"]+)"/) ||
        script.textContent.match(/"created_at"\s*:\s*"([^"]+)"/);
      if (mm) return new Date(mm[1]).toISOString();
    }
    return '';
  };

  // The tweet body text container (new DOM: .text-body/.text-lead).
  X.postTextEl = function (article) {
    if (!article) return null;
    // The current DOM renders the body as
    // <div class="max-w-full text-body font-normal text-primary ..." dir="auto">
    // (text-lead on the detail page) — both are matched here.
    return article.querySelector('div.text-lead.font-normal[dir="auto"]') ||
      article.querySelector('div.text-body.font-normal[dir="auto"]') ||
      article.querySelector('.text-lead.font-normal') ||
      article.querySelector('.text-body.font-normal') ||
      article.querySelector('[data-testid="tweetText"]') ||
      null;
  };

  // Elements that belong to THIS article only.
  //
  // Quoted tweets are rendered as a NESTED <article> inside the quoting
  // article. A plain querySelectorAll() therefore returns the quoted tweet's
  // media as well, which makes a post claim media it does not own (and makes
  // the quoted tweet's own media be downloaded twice). Filtering by the
  // closest <article> gives each post exactly its own media.
  X.own = function (article, selector) {
    if (!article) return [];
    const out = [];
    article.querySelectorAll(selector).forEach((el) => {
      if (el.closest('article') === article) out.push(el);
    });
    return out;
  };

  // The media id embedded in a thumbnail/poster URL, e.g.
  // https://pbs.twimg.com/amplify_video_thumb/2118106013463441409/img/xxx
  X.mediaIdOf = function (url) {
    const m = String(url || '').match(
      /\/(?:ext_tw_video_thumb|amplify_video_thumb|amplify_tw_video_thumb|tweet_video_thumb)\/([^/?]+)/);
    return m ? m[1] : null;
  };

  // Media nodes attached to a post (excluding nested/quoted articles).
  X.postMedia = function (article) {
    if (!article) return { images: [], videos: [], gifs: [] };
    const images = [], videos = [], gifs = [];
    const seenImg = new Set();
    const seenVid = new Set();

    X.own(article, 'img[src]').forEach((img) => {
      const src = img.getAttribute('src') || '';
      if (!/pbs\.twimg\.com\/(media|ext_tw_video_thumb|amplify_video_thumb|amplify_tw_video_thumb|tweet_video_thumb)\//.test(src)) return;
      if (img.closest('a[href]') && /\/status\/\d+\/(photo|video)\/\d+/.test(img.closest('a[href]').getAttribute('href') || '')) return;
      const thumb = src.match(/\/(ext_tw_video_thumb|amplify_video_thumb|amplify_tw_video_thumb|tweet_video_thumb)\//);
      if (thumb) {
        // The <video> element and its thumbnail <img> describe the SAME media,
        // so both are collapsed onto one media id.
        const key = X.mediaIdOf(src) || src;
        if (seenVid.has(key)) return;
        seenVid.add(key);
        if (thumb[1] === 'tweet_video_thumb') gifs.push(img);
        else videos.push(img);
        return;
      }
      if (seenImg.has(src)) return;
      seenImg.add(src);
      images.push(img);
    });

    X.own(article, 'video').forEach((v) => {
      const poster = v.getAttribute('poster') || '';
      const src = v.getAttribute('src') || '';
      const key = X.mediaIdOf(poster) || X.mediaIdOf(src) || poster || src;
      if (key && seenVid.has(key)) return;
      if (key) seenVid.add(key);
      if (src.includes('/tweet_video/')) gifs.push(v);
      else if (poster.includes('/ext_tw_video_thumb/') || poster.includes('/amplify_video_thumb/')) videos.push(v);
      else if (src) videos.push(v);
    });
    return { images, videos, gifs };
  };

  // Does this post own any media at all? Used to decide whether the media
  // download button should be injected in the first place.
  X.hasOwnMedia = function (article) {
    const m = X.postMedia(article);
    return m.images.length + m.videos.length + m.gifs.length > 0;
  };

  // ---------------------------------------------------------------- observers
  TK.onMutate = (fn) => {
    let queued = false;
    const run = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => { queued = false; try { fn(); } catch (e) { console.error('[XTK]', e); } });
    };
    const obs = new MutationObserver((muts) => {
      let relevant = false;
      for (const m of muts) {
        if (m.type === 'childList' && m.addedNodes.length) { relevant = true; break; }
        if (m.type === 'attributes' && /^(aria-label|src|href|poster)$/.test(m.attributeName || '')) { relevant = true; break; }
      }
      if (relevant) run();
    });
    const target = document.body || document.documentElement;
    obs.observe(target, { childList: true, subtree: true, attributes: true, attributeFilter: ['aria-label', 'src', 'href', 'poster'] });
    return obs;
  };

  // SPA navigation hook.
  TK.onNavigate = (fn) => {
    let last = location.href;
    const check = () => {
      if (location.href !== last) { last = location.href; try { fn(); } catch (e) { console.error('[XTK]', e); } }
    };
    ['pushState', 'replaceState'].forEach((m) => {
      const orig = history[m];
      history[m] = function () { const r = orig.apply(this, arguments); setTimeout(check, 0); return r; };
    });
    window.addEventListener('popstate', check);
    window.addEventListener('hashchange', check);
    setInterval(check, 1000);
  };

  // Wait for an element that satisfies a predicate.
  TK.waitFor = function (predicate, { timeout = 4000, interval = 120 } = {}) {
    return new Promise((resolve, reject) => {
      const t0 = Date.now();
      const tick = () => {
        let el = null;
        try { el = predicate(); } catch (e) { /* ignore */ }
        if (el) return resolve(el);
        if (Date.now() - t0 > timeout) return reject(new Error('waitFor timeout'));
        setTimeout(tick, interval);
      };
      tick();
    });
  };

  // Click a real user-ish element so React / Base UI handlers fire. Base UI menus
  // (which X uses) often key off pointer events, so dispatch the full
  // pointer -> mouse -> click sequence, not just mouse events.
  TK.realClick = function (el) {
    if (!el) return false;
    try {
      const opts = { bubbles: true, cancelable: true, view: window };
      if (typeof PointerEvent === 'function') {
        const p = (type, extra) => el.dispatchEvent(new PointerEvent(type, Object.assign({ pointerId: 1, pointerType: 'mouse', isPrimary: true, button: 0 }, opts, extra || {})));
        p('pointerover'); p('pointerenter'); p('pointerdown'); p('pointerup'); p('pointerout');
      }
      el.dispatchEvent(new MouseEvent('mouseover', opts));
      el.dispatchEvent(new MouseEvent('mousedown', opts));
      el.dispatchEvent(new MouseEvent('mouseup', opts));
      el.click();
      return true;
    } catch (e) {
      try { el.click(); return true; } catch (e2) { return false; }
    }
  };

  // ------------------------------------------------------------- menu labels
  // Menu item labels are localized, so every text match carries a
  // multi-language list of alternatives.
  TK.LABELS = {
    // Language-independent text matching for the destructive "Block" flow.
    // Covers the toolkit's UI languages: en, zh-TW, zh-CN, ja, ko, es, fr, de,
    // pt-BR. pt-BR shares the verb "Bloquear" with es, so one pattern covers
    // both. ru/it are kept as extra coverage for other locales.
    block: [
      /^block\s*@/i,            // en
      /^封鎖\s*@/,               // zh-TW
      /^拉黑\s*@/,               // zh-CN
      /^ブロック\s*@/,           // ja
      /^차단\s*@/,               // ko
      /^bloquear\s*@/i,         // es / pt-BR
      /^bloqu(?:er|ez)\s*@/i,   // fr
      /^blockieren\s*@/i,       // de
      /^блокировать\s*@/i,      // ru (extra)
      /^bloccare\s*@/i          // it (extra)
    ],
    unblock: [
      /^unblock\s*@/i,
      /^解除封鎖\s*@/,
      /^取消拉黑\s*@/,
      /^ブロック解除\s*@/,
      /^차단\s*해제\s*@/,        // ko
      /^débloqu(?:er|ez)\s*@/i,  // fr
      /^desbloquear\s*@/i        // es / pt-BR
    ],
    confirmBlock: [
      /^block$/i,
      /^封鎖$/,                  // zh-TW
      /^拉黑$/,                  // zh-CN
      /^ブロック$/,              // ja
      /^차단$/,                  // ko
      /^bloquear$/i,            // es / pt-BR
      /^bloqu(?:er|ez)$/i,      // fr
      /^blockieren$/i,          // de
      /^блокировать$/i,         // ru (extra)
      /^bloccare$/i             // it (extra)
    ]
  };

  TK.matchesLabel = function (text, kind) {
    const list = TK.LABELS[kind] || [];
    const t = (text || '').trim();
    return list.some((re) => re.test(t));
  };

  TK.findMenuItem = function (kind) {
    // Base UI menus render role="menuitem"; older builds used testids.
    const candidates = document.querySelectorAll(
      '[role="menuitem"], [role="menuitemradio"], [role="menuitemcheckbox"], [data-testid="Dropdown"], li[role="none"] button, [role="dialog"] button'
    );
    for (const el of candidates) {
      const t = (el.textContent || '').trim();
      if (!t) continue;
      if (TK.matchesLabel(t, kind)) return el;
    }
    // Generic scan of every visible button as a last resort.
    const buttons = document.querySelectorAll('button');
    for (const b of buttons) {
      const t = (b.textContent || '').trim();
      if (t && TK.matchesLabel(t, kind)) return b;
    }
    return null;
  };

  TK.findConfirmButton = function (kind) {
    const dialogs = document.querySelectorAll('[role="alertdialog"], [role="dialog"], [role="menu"]');
    for (const d of dialogs) {
      const buttons = d.querySelectorAll('button');
      for (const b of buttons) {
        const t = (b.textContent || '').trim();
        if (t && TK.matchesLabel(t, kind)) return b;
      }
    }
    const legacy = document.querySelector('button[data-testid="confirmationSheetConfirm"]');
    if (legacy) return legacy;
    return null;
  };

})(window);


// ============================================================================
// Settings panel — a floating dialog with all switches.
// ============================================================================
(function (TK) {
  'use strict';

  const CSS = `
.xtk-panel-backdrop {
  position:fixed; inset:0; z-index:2147483001; background:rgba(0,0,0,.45);
  display:flex; align-items:center; justify-content:center; padding:16px;
  font-family:system-ui,-apple-system,"Segoe UI",sans-serif;
}
.xtk-panel {
  background:#fff; color:#0f1419; border-radius:16px; width:min(520px,100%);
  max-height:86vh; overflow:auto; box-shadow:0 20px 60px rgba(0,0,0,.35);
  padding:20px 22px 18px;
}
@media (prefers-color-scheme: dark) {
  .xtk-panel { background:#15202b; color:#eff3f4; }
  .xtk-panel input[type=text], .xtk-panel input[type=number] {
    background:#253341; color:#eff3f4; border-color:#38444d;
  }
  .xtk-panel fieldset { border-color:#38444d; }
}
.xtk-panel h2 { margin:0 0 4px; font-size:17px; }
.xtk-panel h3 { margin:16px 0 6px; font-size:13px; text-transform:uppercase;
  letter-spacing:.06em; opacity:.6; }
.xtk-panel fieldset { border:1px solid #e1e8ed; border-radius:12px; margin:0 0 4px; padding:10px 12px 12px; }
.xtk-panel label { display:flex; align-items:center; gap:8px; padding:4px 0; font-size:14px; cursor:pointer; }
.xtk-panel label input[type=checkbox] { width:16px; height:16px; accent-color:#1d9bf0; }
.xtk-panel .row { display:flex; align-items:center; gap:8px; padding:4px 0; font-size:14px; }
.xtk-panel .row span { flex:1; }
.xtk-panel select {
  flex:1; min-width:0; padding:5px 8px; border:1px solid #cfd9de; border-radius:8px;
  font:13px/1.3 system-ui,-apple-system,"Segoe UI",sans-serif; background:#fff; color:#0f1419;
}
@media (prefers-color-scheme: dark) {
  .xtk-panel select { background:#253341; color:#eff3f4; border-color:#38444d; }
}
.xtk-panel input[type=text], .xtk-panel input[type=number] {
  flex:1; min-width:0; padding:5px 8px; border:1px solid #cfd9de; border-radius:8px;
  font:13px/1.3 ui-monospace,SFMono-Regular,Menlo,monospace; background:#fff; color:#0f1419;
}
.xtk-panel .actions { display:flex; gap:8px; justify-content:flex-end; margin-top:16px; }
.xtk-panel button {
  border-radius:9999px; padding:8px 18px; font:600 14px/1 system-ui,sans-serif;
  cursor:pointer; border:1px solid transparent;
}
.xtk-panel button.primary { background:#1d9bf0; color:#fff; }
.xtk-panel button.ghost { background:transparent; border-color:#cfd9de; color:inherit; }
`;

  const CHECKS = [
    { group: 'tweetBtns', items: ['hideReply', 'hideRetweet', 'hideLike', 'hideBookmark', 'hideViews', 'hideShare'] },
    { group: 'sidebar', items: ['hideHome', 'hideExplore', 'hideNotifications', 'hideChat', 'hideCalls', 'hideGrok', 'hideHistory', 'hideCreatorsStudio', 'hidePremiumSignUp', 'hideProfile', 'hideBookmarks', 'hideCommunities', 'hideVerifiedOrgs', 'hideother', 'hideMutedNotices', 'hideRightColumn', 'hideChatButton'] },
    { group: 'layout', items: ['useLargerCSS', 'useCustomPadding'] }
  ];

  const FEATURES = [
    { key: 'fClean', label: 'clean' },
    { key: 'fThread', label: 'thread' },
    { key: 'fBlock', label: 'block' },
    { key: 'fEmoji', label: 'emoji' },
    { key: 'fMedia', label: 'media' },
    { key: 'fMarkdown', label: 'md' }
  ];

  function buildPanel() {
    const L = TK.LANG;
    const S = TK.settings;
    const backdrop = document.createElement('div');
    backdrop.className = 'xtk-panel-backdrop';

    const panel = document.createElement('div');
    panel.className = 'xtk-panel';

    const h = document.createElement('h2');
    h.textContent = 'X Toolkit — ' + L.settings;
    panel.appendChild(h);

    // language picker -----------------------------------------------------
    const ls = document.createElement('fieldset');
    const lh = document.createElement('h3');
    lh.textContent = L.language;
    ls.appendChild(lh);
    const lrow = document.createElement('div');
    lrow.className = 'row';
    const lspan = document.createElement('span');
    lspan.textContent = L.language;
    const lsel = document.createElement('select');
    lsel.className = 'xtk-select';
    TK.LANG_KEYS.forEach((code) => {
      const opt = document.createElement('option');
      opt.value = code;
      opt.textContent = code === 'auto'
        ? (navigator.language || 'en') + ' (auto)'
        : (TK.LANG_NAMES[code] || code);
      lsel.appendChild(opt);
    });
    lsel.value = S.uiLang || 'auto';
    lsel.addEventListener('change', () => {
      TK.setLang(lsel.value);
      // Re-render in place so the whole panel follows the new language.
      TK.panel.open();
    });
    lrow.appendChild(lspan);
    lrow.appendChild(lsel);
    ls.appendChild(lrow);
    panel.appendChild(ls);

    // features
    const fs = document.createElement('fieldset');
    const fh = document.createElement('h3');
    fh.textContent = L.feat;
    fs.appendChild(fh);
    FEATURES.forEach((f) => {
      const l = document.createElement('label');
      const i = document.createElement('input');
      i.type = 'checkbox';
      i.checked = !!S[f.key];
      i.addEventListener('change', () => { S[f.key] = i.checked; });
      l.appendChild(i);
      const t = document.createElement('span');
      t.textContent = L[f.label];
      l.appendChild(t);
      fs.appendChild(l);
    });
    panel.appendChild(fs);

    // block button placements (sub-switches under the Quick Block feature)
    const bs = document.createElement('fieldset');
    const bh = document.createElement('h3');
    bh.textContent = L.blockPlaces;
    bs.appendChild(bh);
    ['blockBtnRow', 'blockBtnHead', 'blockBtnProfile'].forEach((key) => {
      const l = document.createElement('label');
      const i = document.createElement('input');
      i.type = 'checkbox';
      i.checked = !!S[key];
      i.addEventListener('change', () => { S[key] = i.checked; });
      l.appendChild(i);
      const t = document.createElement('span');
      t.textContent = L[key] || key;
      l.appendChild(t);
      bs.appendChild(l);
    });
    panel.appendChild(bs);

    // clean options
    const cs = document.createElement('fieldset');
    const ch = document.createElement('h3');
    ch.textContent = L.clean;
    cs.appendChild(ch);
    CHECKS.forEach((g) => {
      const gl = document.createElement('div');
      gl.style.fontWeight = '600';
      gl.style.fontSize = '13px';
      gl.style.marginTop = '8px';
      gl.textContent = L[g.group];
      cs.appendChild(gl);
      g.items.forEach((key) => {
        const l = document.createElement('label');
        const i = document.createElement('input');
        i.type = 'checkbox';
        i.checked = !!S[key];
        i.addEventListener('change', () => { S[key] = i.checked; });
        l.appendChild(i);
        const t = document.createElement('span');
        t.textContent = L[key] || key;
        l.appendChild(t);
        cs.appendChild(l);
      });
    });

    // numeric inputs
    const numRow = (key, labelKey) => {
      const row = document.createElement('div');
      row.className = 'row';
      const s = document.createElement('span');
      s.textContent = L[labelKey];
      const i = document.createElement('input');
      i.type = 'number';
      i.value = S[key];
      i.addEventListener('change', () => { S[key] = parseInt(i.value, 10) || 0; });
      row.appendChild(s);
      row.appendChild(i);
      cs.appendChild(row);
    };
    numRow('cssWidth', 'cssWidth');
    numRow('paddingWidth', 'paddingWidth');
    panel.appendChild(cs);

    // media options
    const ms = document.createElement('fieldset');
    const mh = document.createElement('h3');
    mh.textContent = L.media;
    ms.appendChild(mh);
    const txtRow = (key, labelKey) => {
      const row = document.createElement('div');
      row.className = 'row';
      const s = document.createElement('span');
      s.textContent = L[labelKey];
      const i = document.createElement('input');
      i.type = 'text';
      i.value = S[key];
      i.addEventListener('change', () => { S[key] = i.value; });
      row.appendChild(s);
      row.appendChild(i);
      ms.appendChild(row);
    };
    txtRow('mdFilenameFormat', 'filename');
    txtRow('mdPostTimeFormat', 'postTime');
    [['mdZip', 'zip'], ['mdSync', 'sync']].forEach(([key, labelKey]) => {
      const l = document.createElement('label');
      const i = document.createElement('input');
      i.type = 'checkbox';
      i.checked = !!S[key];
      i.addEventListener('change', () => { S[key] = i.checked; });
      l.appendChild(i);
      const t = document.createElement('span');
      t.textContent = L[labelKey];
      l.appendChild(t);
      ms.appendChild(l);
    });
    panel.appendChild(ms);

    // actions
    const acts = document.createElement('div');
    acts.className = 'actions';
    const closeBtn = document.createElement('button');
    closeBtn.className = 'ghost';
    closeBtn.textContent = L.close;
    closeBtn.addEventListener('click', () => backdrop.remove());
    const saveBtn = document.createElement('button');
    saveBtn.className = 'primary';
    saveBtn.textContent = L.save;
    saveBtn.addEventListener('click', () => {
      TK.saveSettings();
      backdrop.remove();
      location.reload();
    });
    acts.appendChild(closeBtn);
    acts.appendChild(saveBtn);
    panel.appendChild(acts);

    backdrop.appendChild(panel);
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) backdrop.remove(); });
    return backdrop;
  }

  TK.panel = {
    open() {
      const old = document.querySelector('.xtk-panel-backdrop');
      if (old) old.remove();
      if (!document.getElementById('xtk-panel-css')) {
        const s = document.createElement('style');
        s.id = 'xtk-panel-css';
        s.textContent = CSS;
        (document.head || document.documentElement).appendChild(s);
      }
      document.body.appendChild(buildPanel());
    }
  };

  // When the language changes from outside the panel (menu command, another
  // tab), rebuild the panel so it is never left half-translated.
  TK.onLangChange(function () {
    const open = document.querySelector('.xtk-panel-backdrop');
    if (open) TK.panel.open();
  });
})(window.XTK);


// ============================================================================
// Feature: Clean & Optimize
// Removes engagement buttons, upsells and other chrome from the new X DOM.
// The current DOM exposes stable `data-engagement-action` hooks; aria-label
// and SVG sprite ids are kept as fallbacks for older/other layouts.
// ============================================================================
(function (TK) {
  'use strict';

  const S = TK.settings;

  // --- element selectors for each removable action -------------------------
  // Each entry: [primary selectors, fallback selectors]
  const ACTION = {
    reply: ['[data-engagement-action="reply"]'],
    retweet: ['[data-engagement-action="retweet"]'],
    like: ['[data-engagement-action="like"]'],
    bookmark: ['[data-engagement-action="bookmark"]'],
    share: ['[data-engagement-action="share"]'],
    // View count is an <a href=".../analytics"> carrying the #icon-bar-chart
    // sprite (its aria-label "查看統計"/"View analytics" is localized). The
    // data-engagement-action="generic" marker is NOT reliably on it (only 1 of N
    // posts in the saved DOM), so key off the language-independent href suffix and
    // the sprite instead.
    generic: [
      'a[href$="/analytics"]',
      'a.x-engagement-button:has(use[href="#icon-bar-chart"])',
      '[data-engagement-action="generic"]'
    ]
  };

  // Legacy (pre-2026) fallbacks kept for older cached pages / other clients.
  const LEGACY = {
    reply: ['[data-testid="reply"]'],
    retweet: ['[data-testid="retweet"]', '[data-testid="unretweet"]'],
    like: ['[data-testid="like"]', '[data-testid="unlike"]'],
    bookmark: ['[data-testid="bookmark"]', '[data-testid="removeBookmark"]'],
    share: ['[data-testid="share"]'],
    generic: ['[data-testid="tweet-detail-metric-view"]']
  };

  // 2026 X redesign: the left rail is <nav aria-label="主要"> whose destinations
  // are <a class="group/sidebar-item ..." href="https://x.com/...">. The hrefs are
  // absolute now, so exact `a[href="/explore"]` no longer matches; the stable,
  // language-independent hook is the `sidebar-item` class token plus an ends-with
  // href. Legacy selectors are kept as fallbacks for older/cached pages.
  const UPSELL = [
    'a[class*="sidebar-item"][href*="/i/premium_sign_up"]',
    '[data-testid="premium-signup-tab"]',
    'a[href*="/i/premium_sign_up"]',
    'a[href*="/i/premium_sign_up_flow"]',
    'button[aria-label*="Premium"]',
    'a[aria-label*="Premium"]',
    'a[href*="/i/verified-orgs-signup"]',
    '[data-icon="icon-verified-orgs"]'
  ];

  const GROK = [
    'a[class*="sidebar-item"][href$="/i/grok"]',
    'a[href*="/i/grok"]',
    'button[aria-label="Grok"]',
    '[data-icon="icon-logo-grok"]',
    // 2026 redesign: a floating Grok launcher lives in the bottom-right dock
    // (<div data-slot="xds-dock"> -> <div data-slot="xds-dock-window">). Hide the
    // whole window so no empty 55px pill is left behind. :has() keys off the
    // language-independent icon, so it never touches the sidebar Grok item.
    'div[data-slot="xds-dock-window"]:has([data-icon="icon-logo-grok"])',
    // older X build: Grok side-drawer launcher
    '[data-testid="GrokDrawer"]'
  ];

  // Left-rail destinations. Each entry lists BOTH the 2026 anchors
  // ([class*="sidebar-item"] + ends-with href) AND the older pre-2026 build's
  // data-testid="AppTabBar_*_Link" hooks, so hiding works on either version
  // (x.com is currently A/B-serving both).
  const NAV = {
    hideExplore: [
      'a[class*="sidebar-item"][href$="/explore"]',
      'a[class*="sidebar-item"][href$="/search"]',
      'nav a[href$="/explore"]',
      'a[href="/explore"]', 'a[href="/search"]',
      '[data-testid="AppTabBar_Explore_Link"]'
    ],
    hideNotifications: [
      'a[class*="sidebar-item"][href$="/notifications"]',
      'nav a[href$="/notifications"]',
      'a[href="/notifications"]',
      '[data-testid="AppTabBar_Notifications_Link"]'
    ],
    hideBookmarks: [
      'a[class*="sidebar-item"][href$="/i/bookmarks"]',
      'a[href="/i/bookmarks"]', 'a[href="/bookmarks"]',
      '[data-testid="AppTabBar_Bookmarks_Link"]'
    ],
    // X merged "Messages" into "Chat" (/i/chat) in 2026; the older build labels the
    // same slot AppTabBar_DirectMessage_Link.
    hideMessages: [
      'a[class*="sidebar-item"][href$="/i/chat"]',
      'a[class*="sidebar-item"][href$="/messages"]',
      'a[href="/i/messages"]', 'a[href="/messages"]',
      '[data-testid="AppTabBar_DirectMessage_Link"]'
    ],
    hideCommunities: [
      'a[class*="sidebar-item"][href$="/communities"]',
      'a[class*="sidebar-item"][href$="/i/communities"]',
      'a[href="/i/communities"]', 'a[href="/communities"]',
      '[data-testid="AppTabBar_Communities_Link"]'
    ],
    // 2026 redesign added these left-rail destinations.
    hideCalls: [
      'a[class*="sidebar-item"][href$="/i/calls"]',
      'nav a[href$="/i/calls"]',
      '[data-testid="AppTabBar_Calls_Link"]'
    ],
    hideHistory: [
      'a[class*="sidebar-item"][href$="/i/history"]',
      'nav a[href$="/i/history"]',
      '[data-testid="AppTabBar_History_Link"]'
    ],
    hideHome: [
      'a[class*="sidebar-item"][href$="/home"]',
      'nav a[href$="/home"]',
      '[data-testid="AppTabBar_Home_Link"]'
    ],
    hideChat: [
      'a[class*="sidebar-item"][href$="/i/chat"]',
      'nav a[href$="/i/chat"]',
      '[data-testid="AppTabBar_DirectMessage_Link"]'
    ],
    // Profile has no stable attribute on the 2026 build — its href is the
    // signed-in handle and its id is a random token — so it is found structurally
    // (the one sidebar-item whose href is not a known route). The older build does
    // expose AppTabBar_Profile_Link, which is listed first.
    hideProfile: [
      '[data-testid="AppTabBar_Profile_Link"]',
      'a[class*="sidebar-item"]' +
      ':not([href$="/home"]):not([href$="/explore"]):not([href$="/search"])' +
      ':not([href$="/notifications"]):not([href$="/i/chat"]):not([href$="/i/calls"])' +
      ':not([href$="/i/grok"]):not([href$="/i/history"]):not([href*="/creators/studio"])' +
      ':not([href*="/premium_sign_up"]):not([href$="/i/bookmarks"]):not([href$="/communities"])' +
      ':not([href$="/i/communities"]):not([href$="/compose/post"])'
    ]
  };

  const CHROME = {
    hideGrok: GROK,
    hidePremiumSignUp: UPSELL,
    hideVerifiedOrgs: ['a[href*="verified-orgs-signup"]', '[data-icon="icon-verified-orgs"]'],
    hideother: ['a[href*="/i/ads"]', 'a[href*="ads.twitter.com"]', 'a[href*="ads.x.com"]'],
    hideMutedNotices: ['[data-testid="mutedNotification"]'],
    // 2026: right column is the <aside> after <main>. Older build: it is
    // <div data-testid="sidebarColumn"> inside <main> (not an aside).
    hideRightColumn: ['main ~ aside', 'aside', '[data-testid="sidebarColumn"]'],
    // 2026: floating Chat launcher in the bottom-right dock (scoped via :has()).
    // Older build: the DM / chat drawer testids below.
    hideChatButton: [
      'div[data-slot="xds-dock-window"]:has([data-icon="icon-chat"])',
      '[data-testid="chat-button"]', '[data-testid="DMDrawer"]',
      '[data-testid="chat-drawer-root"]', '[data-testid="chat-drawer-main"]'
    ],
    hideCreatorsStudio: [
      'a[class*="sidebar-item"][href*="/creators/studio"]',
      'a[href*="/i/creators_"]', 'a[href*="studio.twitter.com"]'
    ]
  };

  function hideStyle() {
    const css = [];

    const map = {
      hideReply: 'reply',
      hideRetweet: 'retweet',
      hideLike: 'like',
      hideBookmark: 'bookmark',
      hideShare: 'share',
      hideViews: 'generic'
    };
    Object.keys(map).forEach((setting) => {
      if (!S[setting]) return;
      const sel = ACTION[map[setting]].concat(LEGACY[map[setting]]).join(', ');
      css.push(sel + ' { display: none !important; }');
    });

    Object.keys(CHROME).forEach((setting) => {
      if (!S[setting]) return;
      css.push(CHROME[setting].join(', ') + ' { display: none !important; }');
    });

    Object.keys(NAV).forEach((setting) => {
      if (!S[setting]) return;
      css.push(NAV[setting].join(', ') + ' { display: none !important; }');
    });

    if (S.useLargerCSS) {
      const w = Math.max(320, parseInt(S.cssWidth, 10) || 680);
      // The new DOM constrains the timeline column with utility classes and a
      // custom property; override both.
      css.push(':root { --x-timeline-max-width: ' + w + 'px !important; }');
      css.push('main, main > div { max-width: ' + w + 'px !important; }');
      css.push('main [class*="max-w-[var(--x-timeline-max-width"] { max-width: ' + w + 'px !important; }');
      css.push('main [class*="max-w-[602px]"] { max-width: ' + w + 'px !important; }');
    }

    if (S.useCustomPadding) {
      const p = Math.max(0, parseInt(S.paddingWidth, 10) || 0);
      css.push('aside { margin-right: ' + p + 'px !important; }');
    }

    return css.join('\n');
  }

  TK.clean = {
    id: 'clean',
    apply() {
      const id = 'xtk-clean-style';
      let el = document.getElementById(id);
      if (!el) {
        el = document.createElement('style');
        el.id = id;
        (document.head || document.documentElement).appendChild(el);
      }
      el.textContent = hideStyle();
    }
  };
})(window.XTK);


// ============================================================================
// Feature: Emoji Fix
// The current X front-end renders emoji as native Unicode text, so the
// replacement is rarely needed. Older builds (and some surfaces such as
// DMs, community posts or cached pages) still emit <img> elements pointing at
// /emoji/v2/svg/<codepoints>.svg, so that path is kept working.
// ============================================================================
(function (TK) {
  'use strict';

  function extractEmojiFromUrl(src) {
    if (!src) return null;
    const m = src.match(/\/emoji\/v2\/svg\/([0-9a-f-]+)\.svg/i);
    if (!m) return null;
    const parts = m[1].split('-').filter(Boolean);
    if (!parts.length) return null;
    let out = '';
    try {
      out = String.fromCodePoint(...parts.map((p) => parseInt(p, 16)));
    } catch (e) {
      return null;
    }
    // Single code point without an explicit variation selector -> add FE0F so
    // it renders in color instead of as a monochrome glyph.
    if (parts.length === 1 && !/fe0f/i.test(m[1])) out += '\uFE0F';
    return out;
  }

  function replace(img) {
    if (!img || img.dataset.xtkEmoji === '1') return;
    const src = img.getAttribute('src') || '';
    const emoji = extractEmojiFromUrl(src);
    if (!emoji) return;
    const span = document.createElement('span');
    span.textContent = emoji;
    span.className = img.className || '';
    span.style.fontSize = 'inherit';
    span.style.lineHeight = 'inherit';
    span.style.verticalAlign = 'baseline';
    span.title = img.getAttribute('title') || img.getAttribute('alt') || '';
    span.dataset.xtkEmoji = '1';
    span.dataset.xtkEmojiOriginal = emoji;
    img.replaceWith(span);
  }

  function scan(root) {
    const scope = root || document;
    let imgs;
    try { imgs = scope.querySelectorAll('img[src*="/emoji/v2/svg/"]'); } catch (e) { return; }
    imgs.forEach(replace);
  }

  TK.emoji = {
    id: 'emoji',
    apply() { scan(document); }
  };
})(window.XTK);


// ============================================================================
// Feature: Thread Reader
// Adds a "thread" button next to the engagement row that opens the
// third-party thread reader for the current post.
// ============================================================================
(function (TK) {
  'use strict';

  const THREAD_SVG = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" ' +
    'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M4 19.5V6.8c0-.9.7-1.6 1.6-1.6h5.4c.9 0 1.6.7 1.6 1.6v12.7"/>' +
    '<path d="M12.6 19.5V6.8c0-.9.7-1.6 1.6-1.6h5.4c.9 0 1.6.7 1.6 1.6v12.7"/></svg>';

  const CSS = `
.xtk-thread-btn {
  display:inline-flex; align-items:center; gap:4px; margin-left:8px;
  color: rgb(113,118,123); background:transparent; border:none; cursor:pointer;
  font: 600 13px/1 system-ui,-apple-system,"Segoe UI",sans-serif; padding:6px 10px;
  border-radius:9999px; transition:color .15s, background .15s;
}
.xtk-thread-btn:hover { color:#1d9bf0; background:rgba(29,155,240,.1); }
.xtk-thread-btn[data-state="busy"] { opacity:.6; pointer-events:none; }
`;

  function install() {
    if (!document.getElementById('xtk-thread-css')) {
      const s = document.createElement('style');
      s.id = 'xtk-thread-css';
      s.textContent = CSS;
      (document.head || document.documentElement).appendChild(s);
    }
  }

  // twitter-thread.com serves a "Thread Not Found" page for any tweet id it
  // has not seen yet. The thread must be materialised server-side first via
  // its unroll API; only then does /t/<id> render the thread.
  //
  // Verified: an arbitrary id returns HTTP 200 with the title
  // "Thread Not Found - Twitter Thread Reader" until
  // GET /api/unroll-thread?id=<id> has been called, after which the same URL
  // returns the real thread title.
  const API_BASE = 'https://twitter-thread.com';

  function openTab(url) {
    if (typeof GM_openInTab === 'function') {
      try { GM_openInTab(url, { active: true, insert: true }); return; } catch (e) { /* fall through */ }
    }
    window.open(url, '_blank', 'noopener');
  }

  function unrollAndOpen(id) {
    if (!id) { TK.toast(TK.t('toastThreadNoId'), 'error'); return; }
    const page = API_BASE + '/t/' + id;
    TK.toast(TK.t('toastThreadLoading'), 'info');

    let done = false;
    const open = () => { if (done) return; done = true; openTab(page); };

    if (typeof GM_xmlhttpRequest !== 'function') { open(); return; }
    try {
      GM_xmlhttpRequest({
        method: 'GET',
        url: API_BASE + '/api/unroll-thread?id=' + encodeURIComponent(id),
        headers: { 'User-Agent': 'Mozilla/5.0' },
        timeout: 15000,
        onload: () => open(),
        onerror: () => open(),
        ontimeout: () => open()
      });
    } catch (e) {
      open();
    }
    // Never let a stalled request block the tab from opening.
    setTimeout(open, 4000);
  }

  TK.thread = {
    id: 'thread',
    apply() {
      install();
      TK.X.posts().forEach((article) => {
        if (article.querySelector('.xtk-thread-btn')) return;
        const group = TK.X.actionGroup(article);
        if (!group) return;
        const info = TK.X.postInfo(article);
        if (!info) return;
        const btn = document.createElement('button');
        btn.className = 'xtk-thread-btn';
        btn.type = 'button';
        btn.setAttribute('aria-label', TK.t('btnThread'));
        btn.innerHTML = THREAD_SVG;
        TK.tip.attach(btn, () => TK.t('btnThread'));
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          btn.dataset.state = 'busy';
          unrollAndOpen(info.id);
          setTimeout(() => { delete btn.dataset.state; }, 1200);
        });
        group.appendChild(btn);
      });
    }
  };

  // Keep the injected buttons in sync with the interface language (aria-label;
  // the tooltip text is resolved live on hover, so it needs no rebinding).
  TK.onLangChange(function () {
    document.querySelectorAll('.xtk-thread-btn').forEach((b) => {
      b.setAttribute('aria-label', TK.t('btnThread'));
    });
  });
})(window.XTK);


// ============================================================================
// Feature: Quick Block Button
// One-click block from a post. The flow mirrors X's own UI:
//   1. open the post's "More" menu
//   2. click the "Block @handle" item
//   3. confirm in the destructive dialog
// Menu labels are localized, so matching is done with multi-language regexes
// plus a structural fallback (menu items whose text starts with "Block ").
// ============================================================================
(function (TK) {
  'use strict';

  const CSS = `
.xtk-block-btn {
  display:inline-flex; align-items:center; justify-content:center;
  width:30px; height:30px; margin-left:8px; padding:0;
  color: rgb(113,118,123); background:transparent; border:none; cursor:pointer;
  border-radius:9999px; transition:color .15s, background .15s, transform .1s;
}
.xtk-block-btn:hover { color:#f4212e; background:rgba(244,33,46,.12); }
.xtk-block-btn:active { transform:scale(.9); }
.xtk-block-btn[data-state="busy"] { opacity:.6; pointer-events:none; }
.xtk-block-btn[data-state="done"] { color:#00ba7c; }
.xtk-block-btn[data-state="error"] { color:#f4212e; }
`;

  // Decorative icon. The accessible name and tooltip come from the button's own
  // localized title / aria-label (refreshed on language change). A hard-coded
  // <title>Block</title> here would leak an English tooltip over the icon and
  // clash with the localized aria-label, so the graphic is hidden from AT.
  const svg = () => '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false" ' +
    'style="vertical-align:-3px">' +
    '<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.75" fill="none" ' +
    'stroke-linecap="round" stroke-linejoin="round"></circle>' +
    '<line x1="8" y1="16" x2="16" y2="8" stroke="currentColor" stroke-width="1.75" ' +
    'stroke-linecap="round" stroke-linejoin="round"></line></svg>';

  function install() {
    if (!document.getElementById('xtk-block-css')) {
      const s = document.createElement('style');
      s.id = 'xtk-block-css';
      s.textContent = CSS;
      (document.head || document.documentElement).appendChild(s);
    }
  }

  // Menu items that open a destructive confirmation.
  function findBlockMenuItem() {
    // Only consider elements that are actually on screen (X pre-renders closed
    // dropdowns with zero layout rects; clicking those does nothing).
    const visible = (el) => el && el.getClientRects().length > 0 &&
      !el.closest('[aria-hidden="true"]') && !el.closest('[hidden]');
    // Prefer a live, visible menu item that is itself the clickable control.
    const items = document.querySelectorAll(
      '[role="menuitem"], [role="menuitemradio"], [role="menuitemcheckbox"], li [role="button"], li button'
    );
    for (const el of items) {
      if (!visible(el)) continue;
      const t = (el.textContent || '').trim();
      if (t && TK.matchesLabel(t, 'block')) return el;
    }
    // Fallback: any visible element whose localized text looks like "Block @user".
    // Return its clickable ancestor so the synthetic click actually fires.
    const all = document.querySelectorAll('div, span, button, li');
    for (const el of all) {
      if (!visible(el)) continue;
      const t = (el.textContent || '').trim();
      if (t.length < 60 && TK.matchesLabel(t, 'block')) {
        return el.closest('[role="menuitem"], [role="menuitemradio"], [role="menuitemcheckbox"], button, [role="button"], a') || el;
      }
    }
    return null;
  }

  function findConfirmButton() {
    const dialog = document.querySelector('[role="alertdialog"]') ||
      document.querySelector('[role="dialog"]') ||
      document.querySelector('[data-testid="confirmationSheet"]');
    const scope = dialog || document;
    // Newer builds label the destructive button "Block @user" (with the handle)
    // and sometimes expose the name via aria-label. Inside a dialog we strip a
    // trailing "@handle" and also read aria-label so the exact-verb matcher still
    // hits. Outside a dialog we stay strict (raw text only) so a still-open
    // "Block @user" menu item is never mistaken for the confirm button.
    const norm = (s) => (s || '').replace(/\s*@[A-Za-z0-9_]+.*$/, '').trim();
    const controls = scope.querySelectorAll('button, [role="button"]');
    for (const b of controls) {
      const raw = (b.textContent || '').trim();
      const al = (b.getAttribute('aria-label') || '').trim();
      const t = dialog ? norm(raw) : raw;
      const a = dialog ? norm(al) : al;
      if ((t && TK.matchesLabel(t, 'confirmBlock')) || (a && TK.matchesLabel(a, 'confirmBlock'))) return b;
    }
    const legacy = document.querySelector('button[data-testid="confirmationSheetConfirm"]');
    if (legacy) return legacy;
    return null;
  }

  // Shared destructive flow: click a More (⋯) button, then the localized
  // "Block @user" menu item, then the confirm button. Used by post buttons and
  // the profile-header button alike.
  async function runBlockFlow(moreBtn, btn) {
    btn.dataset.state = 'busy';
    if (!moreBtn) { btn.dataset.state = 'error'; return; }
    TK.realClick(moreBtn);

    let item = null;
    try {
      item = await TK.waitFor(findBlockMenuItem, { timeout: 3000 });
    } catch (e) { item = null; }
    if (!item) { btn.dataset.state = 'error'; TK.toast(TK.t('toastBlockItemMissing'), 'error'); return; }
    TK.realClick(item);

    let confirm = null;
    try {
      confirm = await TK.waitFor(findConfirmButton, { timeout: 3000 });
    } catch (e) { confirm = null; }
    if (!confirm) { btn.dataset.state = 'error'; TK.toast(TK.t('toastConfirmMissing'), 'error'); return; }
    TK.realClick(confirm);

    btn.dataset.state = 'done';
    TK.toast(TK.t('toastBlocked'), 'success');
    setTimeout(() => { btn.dataset.state = 'default'; }, 2500);
  }

  function block(article, btn) {
    return runBlockFlow(TK.X.moreButton(article), btn);
  }

  // Profile header "More" (⋯).
  // 2026 build: a menu-trigger inside <main>, not inside a post <article>,
  // carrying the more-dots sprite (language-independent; null on the timeline).
  // Older build: the header actions live in [data-testid="userActions"] (absent on
  // older home, verified), so this fallback only fires on an older profile page.
  function profileHeaderMore() {
    const btns = document.querySelectorAll('main button[data-slot="xds-menu-trigger"]');
    for (const b of btns) {
      if (b.closest('article')) continue;
      if (!b.querySelector('use[href="#icon-more-dots-hor"]')) continue;
      return b;
    }
    const ua = document.querySelector('[data-testid="userActions"]');
    if (ua) return ua.matches('button') ? ua : (ua.querySelector('button') || ua);
    return null;
  }

  // The profile handle shown on the page (the big header avatar's alt="@handle"),
  // falling back to the first URL path segment.
  function profileHandle() {
    const imgs = document.querySelectorAll('main img[alt^="@"]');
    for (const im of imgs) {
      if (im.closest('article')) continue;
      const a = (im.getAttribute('alt') || '').trim();
      if (/^@[A-Za-z0-9_]{1,20}$/.test(a)) return a.slice(1);
    }
    const m = location.pathname.match(/^\/([A-Za-z0-9_]+)/);
    return m ? m[1] : '';
  }

  // The signed-in user's own handle, read from the sidebar "Profile" item — its
  // href is x.com/<own-handle> regardless of whose page is open. Language-
  // independent (keys off the href, not the localized "Profile" label): it is the
  // one sidebar link whose single-segment path is not a reserved route.
  function ownHandle() {
    const RESERVED = /^(home|explore|notifications|messages|bookmarks|communities|search|settings|compose|profile|hashtag|login|logout|signup|intent|share|tos|privacy|about|jobs|verified|i)$/;
    const links = document.querySelectorAll('a[class*="sidebar-item"]');
    for (const a of links) {
      const href = a.getAttribute('href') || '';
      const m = href.match(/^(?:https?:\/\/(?:x|twitter)\.com)?\/([A-Za-z0-9_]{1,20})(?:[/?#].*)?$/);
      if (m && !RESERVED.test(m[1].toLowerCase())) return m[1].toLowerCase();
    }
    return '';
  }

  TK.block = {
    id: 'block',
    apply() {
      install();
      TK.X.posts().forEach((article) => {
        const group = TK.X.actionGroup(article);
        const info = TK.X.postInfo(article);
        const author = TK.X.postAuthor(article);
        // Never offer to block yourself.
        if (author.handle && /^@?me$/i.test(author.handle.replace('@', ''))) return;

        const makeBtn = (place) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'xtk-block-btn xtk-block-btn--' + place;
          btn.dataset.state = 'default';
          btn.dataset.place = place;
          btn.setAttribute('aria-label', TK.t('btnBlock') + ' ' + (author.handle || ''));
          btn.innerHTML = svg();
          TK.tip.attach(btn, () => TK.t('btnBlock') + ' ' + (author.handle || ''));
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            block(article, btn);
          });
          if (info) btn.dataset.postId = info.id;
          if (author.handle) btn.dataset.handle = author.handle;
          return btn;
        };

        // 1) engagement row (bottom of the post) — the toolkit's original spot.
        if (TK.settings.blockBtnRow && group && !article.querySelector('.xtk-block-btn--row')) {
          group.appendChild(makeBtn('row'));
        }
        // 2) post header (top-right, just before the "More" button) — mirrors the
        //    pasted quick-block script, but anchored on the 2026 sprite-based More
        //    button instead of the removed data-testid="caret".
        const more = TK.X.moreButton(article);
        if (TK.settings.blockBtnHead && more && more.parentElement && !article.querySelector('.xtk-block-btn--head')) {
          more.parentElement.insertBefore(makeBtn('head'), more);
        }
      });

      // 3) profile header (only present on a user's profile page). Same 2026
      //    sprite-based flow as posts; no-op elsewhere because profileHeaderMore()
      //    returns null when there is no header More outside an article.
      const pmore = profileHeaderMore();
      const handle = pmore ? profileHandle() : '';
      const own = pmore ? ownHandle() : '';
      // Never offer to block yourself: on your own profile the header "More" has
      // no Block item, so hide the button entirely (compare handles, not labels).
      const isOwnProfile = !!(own && handle && own.toLowerCase() === handle.toLowerCase());
      if (TK.settings.blockBtnProfile && pmore && pmore.parentElement && !isOwnProfile && !document.querySelector('.xtk-block-btn--profile')) {
        const label = TK.t('btnBlock') + ' ' + (handle ? '@' + handle : '');
        const pbtn = document.createElement('button');
        pbtn.type = 'button';
        pbtn.className = 'xtk-block-btn xtk-block-btn--profile';
        pbtn.dataset.state = 'default';
        pbtn.dataset.place = 'profile';
        pbtn.dataset.handle = handle ? '@' + handle : '';
        pbtn.setAttribute('aria-label', label);
        pbtn.innerHTML = svg();
        TK.tip.attach(pbtn, () => TK.t('btnBlock') + ' ' + (handle ? '@' + handle : ''));
        pbtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          runBlockFlow(pmore, pbtn);
        });
        pmore.parentElement.insertBefore(pbtn, pmore);
      }
    }
  };

  // Keep the injected buttons in sync with the interface language (aria-label;
  // the tooltip text is resolved live on hover, so it needs no rebinding).
  TK.onLangChange(function () {
    document.querySelectorAll('.xtk-block-btn').forEach((b) => {
      b.setAttribute('aria-label', TK.t('btnBlock') + ' ' + (b.dataset.handle || ''));
    });
  });
})(window.XTK);


// ============================================================================
// Feature: Media Downloader
// Collects the media of a post and downloads it.
//
// Resolution order for every media item:
//   1. Images   -> the <img> src, upgraded to the original size
//                  (name=orig, format kept)
//   2. GIFs    -> https://video.twimg.com/tweet_video/<id>.mp4 (derived from the
//                  thumbnail URL, no API needed)
//   3. Videos  -> the public syndication endpoint, which returns
//                  mediaDetails[].video_info.variants[] including MP4 URLs.
//                  The old hard-coded GraphQL query id no longer works (403).
// ============================================================================
(function (TK) {
  'use strict';

  const S = TK.settings;

  const CSS = `
.xtk-dl-btn {
  display:inline-flex; align-items:center; justify-content:center;
  width:30px; height:30px; margin-left:6px; padding:0;
  color: rgb(113,118,123); background:transparent; border:none; cursor:pointer;
  border-radius:9999px; transition:color .15s, background .15s, transform .1s;
}
.xtk-dl-btn:hover { color:#1d9bf0; background:rgba(29,155,240,.12); }
.xtk-dl-btn:active { transform:scale(.9); }
.xtk-dl-btn[data-state="busy"] { opacity:.6; pointer-events:none; }
.xtk-dl-btn[data-state="done"] { color:#00ba7c; }
.xtk-dl-btn[data-state="error"] { color:#f4212e; }
`;

  const DL_SVG = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" ' +
    'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M12 3v12"/><path d="m7 11 5 5 5-5"/><path d="M4 20h16"/></svg>';

  function install() {
    if (!document.getElementById('xtk-dl-css')) {
      const s = document.createElement('style');
      s.id = 'xtk-dl-css';
      s.textContent = CSS;
      (document.head || document.documentElement).appendChild(s);
    }
  }

  // --------------------------------------------------------------- fetching
  function gmFetch(url, opts = {}) {
    return new Promise((resolve, reject) => {
      const req = {
        method: opts.method || 'GET',
        url,
        headers: opts.headers || {},
        responseType: opts.responseType || 'blob',
        timeout: opts.timeout || 20000,
        onload: (res) => {
          if (res.status >= 200 && res.status < 300) resolve(res);
          else reject(new Error('HTTP ' + res.status));
        },
        onerror: () => reject(new Error('network error')),
        ontimeout: () => reject(new Error('timeout')),
        onabort: () => reject(new Error('aborted'))
      };
      if (opts.data) req.data = opts.data;
      try {
        GM_xmlhttpRequest(req);
      } catch (e) {
        reject(e);
      }
    });
  }

  // The public syndication endpoint used by embed widgets. It needs the
  // computed token below; verified working for arbitrary tweet ids.
  function syndicationToken(id) {
    return ((Number(id) / 1e15) * Math.PI).toString(36).replace(/(0+|\.)/g, '');
  }

  async function fetchSyndication(id) {
    const url = 'https://cdn.syndication.twimg.com/tweet-result?id=' + encodeURIComponent(id) +
      '&lang=en&token=' + syndicationToken(id);
    const res = await gmFetch(url, { responseType: 'text', headers: { Accept: 'application/json' } });
    const text = typeof res.response === 'string' ? res.response : (res.responseText || '');
    return JSON.parse(text);
  }

  // ---------------------------------------------------------------- naming
  function pad(n) { return String(n).padStart(2, '0'); }

  function formatPostTime(iso, pattern) {
    const d = iso ? new Date(iso) : new Date();
    const map = {
      YYYY: d.getFullYear(),
      MM: pad(d.getMonth() + 1),
      DD: pad(d.getDate()),
      HH: pad(d.getHours()),
      mm: pad(d.getMinutes()),
      ss: pad(d.getSeconds())
    };
    return String(pattern || 'YYYYMMDD_HHmmss')
      .replace(/YYYY/g, map.YYYY).replace(/MM/g, map.MM).replace(/DD/g, map.DD)
      .replace(/HH/g, map.HH).replace(/mm/g, map.mm).replace(/ss/g, map.ss);
  }

  function sanitize(name) {
    return String(name).replace(/[<>:"/\\|?*\x00-\x1F]/g, '_').substring(0, 120) || 'file';
  }

  function buildName(ctx, typeLabel, index, ext) {
    const fmt = (S.mdFilenameFormat || '{userId}-{postId}-{mediaType}{index}')
      .replace(/\.?{ext}$/, '');
    const base = fmt
      .replace(/{userId}/g, ctx.userId || 'unknown')
      .replace(/{userName}/g, ctx.userName || 'unknown')
      .replace(/{postId}/g, ctx.postId || 'unknown')
      .replace(/{postTime}/g, ctx.postTime || '')
      .replace(/{mediaType}/g, typeLabel)
      .replace(/{index}/g, index)
      .replace(/{ext}/g, ext);
    return sanitize(base) + '.' + ext;
  }

  // --------------------------------------------------------------- media io
  function upgradeImage(src) {
    // pbs.twimg.com/media/<id>?format=webp&name=large -> .../name=orig
    let out = src;
    out = out.replace(/&name=[a-z0-9]+/i, '&name=orig');
    if (!/name=orig/i.test(out)) out += (out.includes('?') ? '&' : '?') + 'name=orig';
    return out;
  }

  function extFromUrl(url, fallback) {
    const m = url.match(/format=([a-z0-9]+)/i);
    if (m) return m[1].toLowerCase();
    const p = url.split('?')[0].match(/\.([a-z0-9]{2,4})$/i);
    return p ? p[1].toLowerCase() : (fallback || 'jpg');
  }

  function gifUrlFromThumb(src) {
    // https://pbs.twimg.com/tweet_video_thumb/<id>.jpg -> https://video.twimg.com/tweet_video/<id>.mp4
    const m = src.match(/tweet_video_thumb\/([^./?]+)/);
    if (m) return 'https://video.twimg.com/tweet_video/' + m[1] + '.mp4';
    return null;
  }

  // The tweet that a media element belongs to.
  //
  // A quoted tweet is rendered as a NESTED <article> inside the quoting post,
  // and its media lives inside that nested article. The syndication API only
  // knows the tweet that actually owns the media, so every media item has to
  // carry the id of its OWNING tweet — otherwise the lookup is made against
  // the quoting tweet, which has no mediaDetails and therefore no video.
  function ownerIdOf(el, fallbackArticle) {
    const owner = el.closest ? (el.closest('article') || fallbackArticle) : fallbackArticle;
    if (!owner) return null;
    const info = TK.X.postInfo(owner);
    return info ? info.id : null;
  }

  function collectFromDom(article) {
    const images = [], videos = [], gifs = [];
    const seenImg = new Set();
    const seenVid = new Set();

    article.querySelectorAll('img[src]').forEach((img) => {
      const src = img.getAttribute('src') || '';
      if (!/pbs\.twimg\.com\/(media|ext_tw_video_thumb|amplify_video_thumb|amplify_tw_video_thumb|tweet_video_thumb)\//.test(src)) return;
      // Skip avatars.
      if (src.includes('/profile_images/')) return;

      const thumb = src.match(/\/(ext_tw_video_thumb|amplify_video_thumb|amplify_tw_video_thumb|tweet_video_thumb)\//);
      if (thumb) {
        // The <video> element and its thumbnail <img> describe the SAME media,
        // so they are collapsed onto one media id.
        const key = TK.X.mediaIdOf(src) || src;
        if (seenVid.has(key)) return;
        seenVid.add(key);
        const ownerId = ownerIdOf(img, article);
        if (thumb[1] === 'tweet_video_thumb') {
          const g = gifUrlFromThumb(src);
          if (g) gifs.push({ url: g, typeLabel: 'gif', ext: 'mp4', ownerId: ownerId });
        } else {
          videos.push({ poster: src, typeLabel: 'video', ext: 'mp4', needApi: true, ownerId: ownerId });
        }
        return;
      }

      if (seenImg.has(src)) return;
      seenImg.add(src);
      images.push({ url: upgradeImage(src), typeLabel: 'img', ext: extFromUrl(src, 'jpg'), ownerId: ownerIdOf(img, article) });
    });

    article.querySelectorAll('video').forEach((v) => {
      const src = v.currentSrc || v.src || v.getAttribute('src') || '';
      const poster = v.getAttribute('poster') || '';
      const key = TK.X.mediaIdOf(poster) || TK.X.mediaIdOf(src) || poster || src;
      if (key && seenVid.has(key)) return;
      if (key) seenVid.add(key);
      const ownerId = ownerIdOf(v, article);
      if (/\/tweet_video\//.test(src)) {
        gifs.push({ url: src, typeLabel: 'gif', ext: 'mp4', ownerId: ownerId });
      } else if (/\/tweet_video\//.test(poster)) {
        const g = gifUrlFromThumb(poster);
        if (g) gifs.push({ url: g, typeLabel: 'gif', ext: 'mp4', ownerId: ownerId });
      } else if (src) {
        videos.push({ url: src, typeLabel: 'video', ext: extFromUrl(src, 'mp4'), ownerId: ownerId });
      } else if (poster) {
        videos.push({ poster: poster, typeLabel: 'video', ext: 'mp4', needApi: true, ownerId: ownerId });
      }
    });

    return { images, videos, gifs };
  }

  // Cache of syndication responses, keyed by tweet id.
  const synCache = new Map();

  async function syndicationFor(id) {
    if (!id) return null;
    if (synCache.has(id)) return synCache.get(id);
    let data = null;
    try { data = await fetchSyndication(id); } catch (e) { data = null; }
    synCache.set(id, data);
    return data;
  }

  async function resolveVideos(postId, videos) {
    if (!videos.length) return videos;
    const needApi = videos.some((v) => v.needApi || !v.url);
    if (!needApi) return videos;

    // Group by the tweet that OWNS the media: a quoted tweet's video must be
    // looked up under the quoted tweet's id, not the quoting post's id.
    const ownerIds = [];
    videos.forEach((v) => {
      const id = v.ownerId || postId;
      if (id && ownerIds.indexOf(id) === -1) ownerIds.push(id);
    });

    const byOwner = new Map();
    for (const id of ownerIds) {
      const data = await syndicationFor(id);
      const details = (data && data.mediaDetails) || [];
      byOwner.set(id, details.filter((d) => d.type === 'video' || d.type === 'animated_gif'));
    }

    const matchByPoster = (poster, apiVideos) => {
      if (!poster) return null;
      const id = TK.X.mediaIdOf(poster);
      if (!id) return null;
      return apiVideos.find((d) => (d.media_url_https || '').includes(id) || (d.url || '').includes(id)) || null;
    };

    const out = [];
    const usedIdx = new Map();
    for (const v of videos) {
      if (v.url && !v.needApi) { out.push(v); continue; }
      const ownerId = v.ownerId || postId;
      const apiVideos = byOwner.get(ownerId) || [];
      let d = matchByPoster(v.poster, apiVideos);
      if (!d) {
        const idx = usedIdx.get(ownerId) || 0;
        d = apiVideos[idx] || null;
        if (d) usedIdx.set(ownerId, idx + 1);
      }
      if (d && d.video_info && Array.isArray(d.video_info.variants)) {
        const variants = d.video_info.variants;
        const mp4s = variants
          .filter((x) => x && x.url && x.content_type === 'video/mp4')
          .sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));
        if (mp4s.length) {
          out.push({ url: mp4s[0].url, typeLabel: d.type === 'animated_gif' ? 'gif' : 'video', ext: 'mp4', ownerId: ownerId });
          continue;
        }
        const hls = variants.find((x) => x && x.url && x.content_type === 'application/x-mpegURL');
        if (hls) {
          out.push({ url: hls.url, typeLabel: d.type === 'animated_gif' ? 'gif' : 'video', ext: 'm3u8', ownerId: ownerId });
          continue;
        }
      }
      if (d && d.media_url_https) {
        out.push({ url: d.media_url_https, typeLabel: d.type === 'animated_gif' ? 'gif' : 'video', ext: 'mp4', ownerId: ownerId });
        continue;
      }
      out.push(Object.assign({}, v, { failed: true }));
    }
    return out;
  }

  // Normalise whatever GM_xmlhttpRequest returned into a real Blob.
  // `instanceof Blob` is unreliable across the userscript sandbox realm, so
  // the shape of the value is inspected instead.
  function toBlob(res) {
    const r = res && res.response;
    if (!r) return new Blob([]);
    if (typeof Blob !== 'undefined' && r instanceof Blob) return r;
    if (r && typeof r.arrayBuffer === 'function') return r;      // already a Blob-like
    if (r && typeof r.buffer === 'function') return r;            // ArrayBufferView
    if (typeof ArrayBuffer !== 'undefined' && r instanceof ArrayBuffer) return new Blob([r]);
    if (typeof r === 'string') return new Blob([r]);
    return new Blob([r]);
  }

  // Fetch a single item and return its blob (no download yet).
  async function fetchOne(item) {
    const res = await gmFetch(item.url, { responseType: 'blob' });
    return toBlob(res);
  }

  // Trigger the browser download for a blob.
  function saveBlob(blob, name) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 8000);
  }

  async function downloadOne(item, name) {
    const blob = await fetchOne(item);
    saveBlob(blob, name);
    return { name, blob };
  }

  async function zipFiles(files) {
    if (typeof fflate === 'undefined' || !fflate.zipSync) return false;
    // fflate wants Uint8Array payloads.
    const data = {};
    for (const f of files) {
      const buf = await f.blob.arrayBuffer();
      data[f.name] = new Uint8Array(buf);
    }
    const zipped = fflate.zipSync(data, { level: 0 });
    const blob = new Blob([zipped], { type: 'application/zip' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'x-media.zip';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    return true;
  }

  // -------------------------------------------------------- download history
  const HISTORY_KEY = 'xtk_media_history';
  function readHistory() {
    try { return new Set(JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')); }
    catch (e) { return new Set(); }
  }
  function writeHistory(set) {
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify([...set].slice(-500))); } catch (e) { /* ignore */ }
  }

  async function run(article, btn) {
    const info = TK.X.postInfo(article);
    if (!info) { btn.dataset.state = 'error'; return; }
    btn.dataset.state = 'busy';

    try {
      const collected = collectFromDom(article);
      let items = collected.images.concat(collected.gifs, collected.videos);
      const resolved = await resolveVideos(info.id, collected.videos);
      const gifList = collected.gifs;
      const videoList = resolved;
      items = collected.images.concat(gifList, videoList).filter((i) => !i.failed);

      if (!items.length) {
        TK.toast(TK.t('toastNoMedia'), 'error');
        btn.dataset.state = 'error';
        return;
      }

      const author = TK.X.postAuthor(article);
      const time = TK.X.postTime(article);
      const ctx = {
        userId: info.handle,
        userName: (author.handle || info.handle).replace(/^@/, ''),
        postId: info.id,
        postTime: formatPostTime(time, S.mdPostTimeFormat)
      };

      const counters = {};
      const files = [];
      for (const item of items) {
        const label = item.typeLabel;
        counters[label] = (counters[label] || 0) + 1;
        const name = buildName(ctx, label, counters[label], item.ext);
        try {
          const f = await downloadOne(item, name);
          files.push(f);
        } catch (e) {
          TK.toast(TK.t('toastDownloadFailed') + ': ' + name, 'error');
        }
      }

      if (files.length > 1 && S.mdZip && typeof fflate !== 'undefined') {
        try { await zipFiles(files); } catch (e) { /* individual files already saved */ }
      }

      const hist = readHistory();
      hist.add(info.id);
      writeHistory(hist);

      btn.dataset.state = 'done';
      TK.toast(TK.t('toastDownloaded') + ' ' + files.length + ' file(s)', 'success');
      setTimeout(() => { btn.dataset.state = 'default'; }, 2500);
    } catch (e) {
      console.error('[XTK media]', e);
      TK.toast(TK.t('toastDownloadFailed') + ': ' + e.message, 'error');
      btn.dataset.state = 'error';
      setTimeout(() => { btn.dataset.state = 'default'; }, 2500);
    }
  }

  TK.media = {
    id: 'media',
    gmFetch,
    syndicationToken,
    fetchSyndication,
    collect(article) { return collectFromDom(article); },
    resolveVideos(postId, videos) { return resolveVideos(postId, videos); },
    apply() {
      install();
      TK.X.posts().forEach((article) => {
        if (article.querySelector('.xtk-dl-btn')) return;
        const group = TK.X.actionGroup(article);
        if (!group) return;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'xtk-dl-btn';
        btn.dataset.state = 'default';
        btn.setAttribute('aria-label', TK.t('btnMedia'));
        btn.innerHTML = DL_SVG;
        TK.tip.attach(btn, () => TK.t('btnMedia'));
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          run(article, btn);
        });
        group.appendChild(btn);
      });
    }
  };

  // Keep the injected buttons in sync with the interface language (aria-label;
  // the tooltip text is resolved live on hover, so it needs no rebinding).
  TK.onLangChange(function () {
    document.querySelectorAll('.xtk-dl-btn').forEach((b) => {
      b.setAttribute('aria-label', TK.t('btnMedia'));
    });
  });
})(window.XTK);


// ============================================================================
// Feature: Export Markdown
// Converts a post to Markdown and downloads it.
//
// The button is NOT a floating overlay any more: it is injected inline into the
// engagement row of every post, exactly like the "Open in Thread Reader"
// button, so it is always visible next to the tweet it belongs to.
//
// Adapted to the 2026 DOM: no data-testid, the body text lives in
// div.text-body / div.text-lead, media images in pbs.twimg.com/media/, and the
// permalink/author come from the article header.
// ============================================================================
(function (TK) {
  'use strict';

  const MD_SVG = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" ' +
    'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/>' +
    '<path d="M14 3v5h5"/><path d="M9 13h6"/><path d="M9 17h4"/></svg>';

  const CSS = `
.xtk-md-btn {
  display:inline-flex; align-items:center; justify-content:center;
  width:30px; height:30px; margin-left:8px; padding:0;
  color: rgb(113,118,123); background:transparent; border:none; cursor:pointer;
  border-radius:9999px; transition:color .15s, background .15s, transform .1s;
}
.xtk-md-btn:hover { color:#1d9bf0; background:rgba(29,155,240,.12); }
.xtk-md-btn:active { transform:scale(.9); }
.xtk-md-btn[data-state="busy"] { opacity:.6; pointer-events:none; }
.xtk-md-btn[data-state="done"] { color:#00ba7c; }
.xtk-md-btn[data-state="error"] { color:#f4212e; }
`;

  function install() {
    if (!document.getElementById('xtk-md-css')) {
      const s = document.createElement('style');
      s.id = 'xtk-md-css';
      s.textContent = CSS;
      (document.head || document.documentElement).appendChild(s);
    }
  }

  // ------------------------------------------------------------- extraction
  function isEmojiImg(img) {
    const src = img.getAttribute('src') || '';
    return src.includes('/emoji/') || /\.svg($|\?)/i.test(src);
  }

  function imgToMarkdown(img) {
    if (isEmojiImg(img)) return img.getAttribute('alt') || '';
    let src = img.getAttribute('src') || '';
    if (!src || src.startsWith('data:')) return '';
    if (src.includes('/profile_images/')) return '';
    src = src.replace(/&name=[a-z0-9]+/i, '&name=orig');
    if (!/name=orig/i.test(src)) src += (src.includes('?') ? '&' : '?') + 'name=orig';
    const alt = (img.getAttribute('alt') || '').trim() || 'image';
    return '![' + alt + '](' + src + ')';
  }

  function linkToMarkdown(a) {
    const href = a.getAttribute('href') || '';
    const text = (a.textContent || '').trim();
    if (!href) return text;
    if (href.startsWith('/') && !/\/status\/\d+/.test(href)) {
      // Internal navigation (hashtag, mention, media link) -> keep the text.
      if (href.startsWith('/hashtag/') || href.startsWith('/search')) return text;
      if (href.includes('/photo/') || href.includes('/video/')) return text;
    }
    const abs = href.startsWith('http') ? href : new URL(href, location.origin).href;
    return '[' + (text || abs) + '](' + abs + ')';
  }

  function inlineToMarkdown(node) {
    let out = '';
    node.childNodes.forEach((child) => {
      if (child.nodeType === 3) { out += child.textContent; return; }
      if (child.nodeType !== 1) return;
      const tag = child.tagName.toLowerCase();
      if (tag === 'br') { out += '\n'; return; }
      if (tag === 'img') { out += imgToMarkdown(child); return; }
      if (tag === 'a') { out += linkToMarkdown(child); return; }
      if (tag === 'span' && child.getAttribute('data-xtk-emoji') === '1') {
        out += child.textContent; return;
      }
      out += inlineToMarkdown(child);
    });
    return out;
  }

  function collectMedia(article) {
    const images = [];
    const seen = new Set();
    article.querySelectorAll('img[src]').forEach((img) => {
      const src = img.getAttribute('src') || '';
      if (!/pbs\.twimg\.com\/media\//.test(src)) return;
      if (src.includes('/profile_images/')) return;
      if (isEmojiImg(img)) return;
      if (seen.has(src)) return;
      seen.add(src);
      images.push(imgToMarkdown(img));
    });
    const videos = [];
    article.querySelectorAll('video').forEach((v) => {
      const src = v.currentSrc || v.getAttribute('src') || '';
      const poster = v.getAttribute('poster') || '';
      if (src) videos.push('[🎬 video](' + src + ')');
      else if (poster) videos.push('![video thumbnail](' + poster + ')');
    });
    return { images, videos };
  }

  function collectCards(article) {
    const cards = [];
    // New DOM: link cards are anchors pointing outside X.
    const candidates = article.querySelectorAll('a[href^="http"]');
    candidates.forEach((a) => {
      const href = a.href || '';
      if (/x\.com|twitter\.com|t\.co/.test(href)) return;
      if (a.closest('div[role="group"]')) return;
      const text = (a.textContent || '').trim();
      if (!text) return;
      cards.push('> 📎 **[' + text.split('\n')[0] + '](' + href + ')**');
    });
    // Legacy: explicit card wrappers.
    article.querySelectorAll('[data-testid="card.wrapper"], [data-testid="card.layoutLarge"]').forEach((c) => {
      const a = c.querySelector('a[href]');
      if (!a) return;
      const title = (c.querySelector('[dir="ltr"]') || {}).textContent || 'link';
      cards.push('> 📎 **[' + String(title).trim() + '](' + a.href + ')**');
    });
    return cards;
  }

  function postToMarkdown(article) {
    const info = TK.X.postInfo(article);
    const author = TK.X.postAuthor(article);
    const time = TK.X.postTime(article);
    const textEl = TK.X.postTextEl(article);
    const body = textEl ? inlineToMarkdown(textEl).trim() : '';
    const media = collectMedia(article);
    const cards = collectCards(article);

    let md = '';
    md += '---\n';
    md += 'author: "' + (author.name || author.handle || 'unknown') + '"\n';
    if (author.handle) md += 'handle: "' + author.handle + '"\n';
    if (time) md += 'date: ' + time + '\n';
    md += 'source: "X (Twitter)"\n';
    md += 'url: "' + (info ? info.url : location.href) + '"\n';
    md += '---\n\n';
    if (body) md += body + '\n\n';
    if (media.images.length) md += media.images.join('\n\n') + '\n\n';
    if (media.videos.length) md += media.videos.join('\n\n') + '\n\n';
    if (cards.length) md += cards.join('\n') + '\n\n';
    md += '---\n';
    md += '*Originally posted on X (Twitter): ' + (info ? info.url : location.href) + '*\n';
    return md;
  }

  function threadToMarkdown() {
    const posts = TK.X.posts();
    if (!posts.length) return null;
    const main = posts[0];
    const info = TK.X.postInfo(main);
    const author = TK.X.postAuthor(main);
    let md = '';
    md += '---\n';
    md += 'author: "' + (author.name || author.handle || 'unknown') + '"\n';
    if (author.handle) md += 'handle: "' + author.handle + '"\n';
    md += 'source: "X (Twitter) thread"\n';
    md += 'url: "' + (info ? info.url : location.href) + '"\n';
    md += '---\n\n';
    posts.forEach((p, i) => {
      const t = TK.X.postTextEl(p);
      const body = t ? inlineToMarkdown(t).trim() : '';
      const a = TK.X.postAuthor(p);
      md += '### ' + (i + 1) + '. ' + (a.handle || '') + '\n\n';
      if (body) md += body + '\n\n';
      const media = collectMedia(p);
      if (media.images.length) md += media.images.join('\n\n') + '\n\n';
      if (media.videos.length) md += media.videos.join('\n\n') + '\n\n';
    });
    md += '---\n';
    md += '*Originally posted on X (Twitter): ' + (info ? info.url : location.href) + '*\n';
    return md;
  }

  function download(content, filename) {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.replace(/[<>:"/\\|?*]/g, '_').substring(0, 100) + '.md';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  function currentTarget() {
    // Prefer the post that is actually open (status page), else the first post.
    const m = location.pathname.match(/\/status\/(\d+)/);
    if (m) {
      const posts = TK.X.posts();
      const hit = posts.find((p) => {
        const i = TK.X.postInfo(p);
        return i && i.id === m[1];
      });
      if (hit) return hit;
    }
    return TK.X.posts()[0] || null;
  }

  // Export one post as Markdown (downloads the .md file).
  function exportPost(article, btn) {
    if (btn) btn.dataset.state = 'busy';
    if (!article) {
      if (btn) btn.dataset.state = 'error';
      TK.toast(TK.t('toastNoPost'), 'error');
      return;
    }
    try {
      const info = TK.X.postInfo(article);
      const author = TK.X.postAuthor(article);
      const md = postToMarkdown(article);
      download(md, 'tweet-' + ((author.handle || 'unknown').replace(/^@/, '')) + '-' + (info ? info.id : 'post'));
      TK.toast(TK.t('toastMdSaved'), 'success');
      if (btn) {
        btn.dataset.state = 'done';
        setTimeout(() => { btn.dataset.state = 'default'; }, 2500);
      }
    } catch (e) {
      console.error('[XTK markdown]', e);
      TK.toast(TK.t('toastDownloadFailed') + ': ' + e.message, 'error');
      if (btn) {
        btn.dataset.state = 'error';
        setTimeout(() => { btn.dataset.state = 'default'; }, 2500);
      }
    }
  }

  TK.markdown = {
    id: 'markdown',
    apply() {
      install();
      // Remove a legacy floating button if an older build left one behind.
      const legacy = document.getElementById('xtk-md-btn');
      if (legacy) legacy.remove();

      // Inline button in the engagement row of every post, same placement as
      // the "Open in Thread Reader" button.
      TK.X.posts().forEach((article) => {
        if (article.querySelector('.xtk-md-btn')) return;
        const group = TK.X.actionGroup(article);
        if (!group) return;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'xtk-md-btn';
        btn.dataset.state = 'default';
        btn.setAttribute('aria-label', TK.t('btnMarkdown'));
        btn.innerHTML = MD_SVG;
        TK.tip.attach(btn, () => TK.t('btnMarkdown'));
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          exportPost(article, btn);
        });
        group.appendChild(btn);
      });
    },
    exportCurrent(btn) {
      exportPost(currentTarget(), btn);
    }
  };

  // Keep the injected buttons in sync with the interface language (aria-label;
  // the tooltip text is resolved live on hover, so it needs no rebinding).
  TK.onLangChange(function () {
    document.querySelectorAll('.xtk-md-btn').forEach((b) => {
      b.setAttribute('aria-label', TK.t('btnMarkdown'));
    });
  });

  // Exposed for the settings panel / tests.
  TK.markdown.toMarkdown = postToMarkdown;
  TK.markdown.threadToMarkdown = threadToMarkdown;
  TK.markdown.exportPost = exportPost;
})(window.XTK);


// ============================================================================
// X Toolkit — entry point
// Boots the enabled features and keeps them alive across SPA navigation.
// ============================================================================
(function (TK) {
  'use strict';

  const ORDER = ['clean', 'emoji', 'thread', 'block', 'media', 'markdown'];
  const SWITCH = { clean: 'fClean', emoji: 'fEmoji', thread: 'fThread', block: 'fBlock', media: 'fMedia', markdown: 'fMarkdown' };

  function runAll() {
    ORDER.forEach((name) => {
      const feat = TK[name];
      if (!feat) return;
      if (!TK.settings[SWITCH[name]]) return;
      try {
        feat.apply();
      } catch (e) {
        console.error('[XTK] feature ' + name + ' failed:', e);
      }
    });
  }

  TK.runAll = runAll;

  function registerMenus() {
    TK.GM.menu(TK.t('menuSettings'), () => TK.panel.open(), 'xtk-settings');
    TK.GM.menu(TK.t('menuMarkdown'), () => {
      if (TK.markdown) TK.markdown.exportCurrent();
    }, 'xtk-md');
    TK.GM.menu(TK.t('menuReload'), () => runAll(), 'xtk-reload');
  }

  function boot() {
    registerMenus();

    runAll();

    // React re-renders constantly; re-run on DOM changes (throttled).
    TK.onMutate(runAll);

    // SPA navigation.
    TK.onNavigate(() => {
      setTimeout(runAll, 120);
      setTimeout(runAll, 600);
    });

    // Re-register the menu commands when the interface language changes.
    TK.onLangChange(function () {
      try {
        if (typeof GM_unregisterMenuCommand === 'function') {
          ['xtk-settings', 'xtk-md', 'xtk-reload'].forEach((id) => {
            try { GM_unregisterMenuCommand(id); } catch (e) { /* ignore */ }
          });
        }
      } catch (e) { /* ignore */ }
      registerMenus();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})(window.XTK);

