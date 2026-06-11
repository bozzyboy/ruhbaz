# ============================================================
# RUHBAZ KONAGI - Tek tikla gelistirme baslatici
# ============================================================
# NE YAPAR:
#   1. Eski/asili kalmis expo/metro sureclerini ve 8081/8082'yi tutanlari kapatir
#   2. Token server'i (agent) ayri pencerede baslatir
#   3. Expo'yu HER ZAMAN sabit 8081 portunda LAN modunda baslatir
#   4. Telefonda elle yazman gereken DOGRU adresi buyuk harflerle yazar
#
# NASIL CALISTIRILIR:
#   - Bu dosyaya sag tikla -> "Run with PowerShell"
#   - veya terminalde:  powershell -ExecutionPolicy Bypass -File baslat.ps1
#
# NEDEN: "QR okumuyor / 8082'ye baglaniyor / failed to connect" hatalarinin
#   kok nedeni port kaymasi ve telefon cache'inde kalan eski port. Bu script
#   portu sabitler, eskiyi temizler, dogru adresi gosterir. Bir daha ugrasma.
# ============================================================

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
$mobileDir = Join-Path $root "mobile"
$agentDir  = Join-Path $root "agent"
$PORT = 8081

function Yaz($msg, $color = "White") { Write-Host $msg -ForegroundColor $color }

Yaz ""
Yaz "==== RUHBAZ KONAGI baslatiliyor ====" "Cyan"

# --- 1. Temizlik: eski expo/metro + 8081/8082 ---
Yaz "[1/4] Eski surecler ve portlar temizleniyor..." "Yellow"
Get-CimInstance Win32_Process -Filter "Name = 'node.exe'" -ErrorAction SilentlyContinue |
  Where-Object { $_.CommandLine -match 'expo|metro' } |
  ForEach-Object { try { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue } catch {} }
foreach ($p in 8081, 8082) {
  $line = netstat -ano | Select-String ":$p\s.*LISTENING"
  if ($line) {
    $busyPid = ($line[0].ToString().Trim() -split '\s+')[-1]
    if ($busyPid -match '^\d+$') { try { Stop-Process -Id $busyPid -Force -ErrorAction SilentlyContinue } catch {} }
  }
}
Start-Sleep -Seconds 2

# --- 2. PC'nin LAN IP'sini bul ---
$ip = (Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue |
  Where-Object { $_.IPAddress -like '192.168.*' -or $_.IPAddress -like '10.*' } |
  Select-Object -First 1).IPAddress
if (-not $ip) { $ip = "127.0.0.1" }

# --- 3. Token server'i ayri pencerede baslat ---
Yaz "[2/4] Token server (agent) baslatiliyor..." "Yellow"
$agentEnv = Join-Path $agentDir ".env"
if (-not (Test-Path $agentEnv)) {
  Yaz "  UYARI: agent/.env yok. Yorumlar calismaz. agent/.env.example'a bak." "Red"
}
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$agentDir'; `$env:HOST='0.0.0.0'; python token_server.py" -WindowStyle Normal

# --- 3b. USB takiliysa adb reverse: localhost:8081 telefonu PC'ye baglar ---
# Bu yol QR/Wi-Fi/IP'den BAGIMSIZ ve hic degismez. USB yoksa sessizce atlanir.
$usbHazir = $false
$adbPath = $null
$adbCmd = Get-Command adb -ErrorAction SilentlyContinue
if ($adbCmd) { $adbPath = $adbCmd.Source }
elseif (Test-Path "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe") { $adbPath = "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" }
if ($adbPath) {
  $devices = & $adbPath devices 2>$null | Select-String "device$"
  if ($devices) {
    & $adbPath reverse tcp:$PORT tcp:$PORT 2>$null | Out-Null
    & $adbPath reverse tcp:8080 tcp:8080 2>$null | Out-Null
    $usbHazir = $true
  }
}

# --- 4. Expo'yu SABIT 8081'de baslat ---
Yaz "[3/4] Expo dev server baslatiliyor (port $PORT, LAN)..." "Yellow"
Yaz ""
Yaz "============================================================" "Green"
Yaz "[4/4] TELEFONDA BAGLAN (QR'A GEREK YOK):" "Green"
if ($usbHazir) {
  Yaz "  USB bagli ve adb reverse ayarlandi. EN SAGLAM yol:" "White"
  Yaz "  Uygulamada 'Enter URL manually' alanina:" "White"
  Yaz ""
  Yaz "        http://localhost:${PORT}" "Cyan"
  Yaz ""
  Yaz "  (Bu yol Wi-Fi/IP degisse bile hep calisir.)" "White"
} else {
  Yaz "  1. Uygulamada 'Recently Opened' listesinde su satira DOKUN:" "White"
  Yaz ""
  Yaz "        http://${ip}:${PORT}" "Cyan"
  Yaz ""
  Yaz "  2. Listede yoksa (ilk defa) 'Enter URL manually' ile ayni adresi" "White"
  Yaz "     yaz (localhost DEGIL). Sonraki sefer listede cikar, sadece dokun." "White"
  Yaz "  -- QR tarayici Android'de takiliyorsa kullanma; dokun/yaz yeterli. --" "White"
  Yaz "  -- En saglam yol icin telefonu USB ile bagla, scripti tekrar calistir. --" "White"
  Yaz ""
  Yaz "  Telefon ve PC AYNI Wi-Fi'de olmali." "White"
}
Yaz "============================================================" "Green"
Yaz ""

Set-Location $mobileDir
npx expo start --lan --port $PORT
