// Release öncesi developer/debug UI yüzeylerini tek noktadan kapatmak için.
// Build-time kapı (Faz 0): dev build'de açık, release/production build'de
// otomatik kapalı. Elle true yapma — release'e debug UI sızdırır.
export const ENABLE_DEVELOPER_DEBUG_UI = __DEV__;
