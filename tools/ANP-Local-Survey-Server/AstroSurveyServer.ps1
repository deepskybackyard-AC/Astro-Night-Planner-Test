param(
    [ValidateSet('Start','Config','Preload','Status')]
    [string]$Mode = 'Start'
)

$ErrorActionPreference = 'Stop'
$AppName = 'Astro Night Planner Local Survey Server'
$ConfigDir = Join-Path $env:APPDATA 'AstroNightPlannerSurveyServer'
$ConfigFile = Join-Path $ConfigDir 'config.json'
$DefaultPort = 8765
$DefaultRoot = 'D:\AstroSurveys'
$DefaultMappings = @(
    @{ name='NSNS DR0.2 OIII/H-alpha/SII'; local='nsns/ohs8/';    remote='https://alasky.cds.unistra.fr/simg.de/simg.de_P_NSNS_DR0_2_ohs8/' },
    @{ name='NSNS DR0.2 H-alpha';          local='nsns/halpha8/'; remote='https://alasky.cds.unistra.fr/simg.de/simg.de_P_NSNS_DR0_2_halpha8/' },
    @{ name='NSNS DR0.2 OIII';             local='nsns/oiii8/';   remote='https://alasky.cds.unistra.fr/simg.de/simg.de_P_NSNS_DR0_2_oiii8/' },
    @{ name='NSNS DR0.2 SII';              local='nsns/sii8/';    remote='https://alasky.cds.unistra.fr/simg.de/simg.de_P_NSNS_DR0_2_sii8/' },
    @{ name='NSNS DR0.2 H-alpha + Kontinuum'; local='nsns/hbr8/'; remote='https://alasky.cds.unistra.fr/simg.de/simg.de_P_NSNS_DR0_2_hbr8/' },
    @{ name='NSNS DR0.2 RGB-Kontinuum';    local='nsns/rgb8/';    remote='https://alasky.cds.unistra.fr/simg.de/simg.de_P_NSNS_DR0_2_rgb8/' }
)

function Ensure-ConfigDir { if (!(Test-Path $ConfigDir)) { New-Item -ItemType Directory -Path $ConfigDir | Out-Null } }
function Save-Config($cfg) { Ensure-ConfigDir; $cfg | ConvertTo-Json -Depth 10 | Set-Content -Path $ConfigFile -Encoding UTF8 }
function Load-Config {
    if (Test-Path $ConfigFile) {
        try { return Get-Content $ConfigFile -Raw -Encoding UTF8 | ConvertFrom-Json } catch { Write-Warning "Konfiguration konnte nicht gelesen werden. Sie wird neu erstellt." }
    }
    $cfg = [pscustomobject]@{
        rootFolder = $DefaultRoot
        port = $DefaultPort
        bindAddress = '127.0.0.1'
        autoStart = $false
        mappings = $DefaultMappings
    }
    Save-Config $cfg
    return $cfg
}
function Normalize-LocalPrefix($s) { return (($s -replace '\\','/') -replace '^/+','') }
function Join-Url($a,$b) { return ($a.TrimEnd('/') + '/' + ($b -replace '^/+','')) }
function Join-LocalPath($root,$relative) {
    $safe = ($relative -replace '/', [IO.Path]::DirectorySeparatorChar) -replace '\.\.', ''
    return Join-Path $root $safe
}
function Read-Default($prompt,$default) {
    $v = Read-Host "$prompt [$default]"
    if ([string]::IsNullOrWhiteSpace($v)) { return $default }
    return $v.Trim()
}
function Set-AutoStart($enable) {
    $startup = [Environment]::GetFolderPath('Startup')
    $cmdPath = Join-Path $startup 'AstroNightPlannerSurveyServer.cmd'
    if ($enable) {
        $scriptPath = $PSCommandPath
        $content = "@echo off`r`npowershell -NoProfile -ExecutionPolicy Bypass -File `"$scriptPath`" -Mode Start`r`n"
        Set-Content -Path $cmdPath -Value $content -Encoding ASCII
        Write-Host "Autostart wurde eingerichtet: $cmdPath" -ForegroundColor Green
    } else {
        if (Test-Path $cmdPath) { Remove-Item $cmdPath -Force }
        Write-Host 'Autostart wurde deaktiviert.' -ForegroundColor Yellow
    }
}
function Configure {
    Ensure-ConfigDir
    $cfg = Load-Config
    Write-Host "`n$AppName - Konfiguration" -ForegroundColor Cyan
    Write-Host 'Dieses Programm benötigt keine Python-Installation.' -ForegroundColor Cyan
    $root = Read-Default 'Survey-Hauptordner' $cfg.rootFolder
    $portRaw = Read-Default 'Port' ([string]$cfg.port)
    $port = [int]$portRaw
    $auto = Read-Default 'Beim Windows-Start automatisch starten? (j/n)' ($(if($cfg.autoStart){'j'}else{'n'}))
    $cfg.rootFolder = $root
    $cfg.port = $port
    $cfg.bindAddress = '127.0.0.1'
    $cfg.autoStart = ($auto.ToLower().StartsWith('j') -or $auto.ToLower().StartsWith('y'))
    if (!$cfg.mappings -or $cfg.mappings.Count -eq 0) { $cfg.mappings = $DefaultMappings }
    if (!(Test-Path $cfg.rootFolder)) { New-Item -ItemType Directory -Path $cfg.rootFolder | Out-Null }
    foreach($m in $cfg.mappings) { New-Item -ItemType Directory -Force -Path (Join-LocalPath $cfg.rootFolder $m.local) | Out-Null }
    Save-Config $cfg
    Set-AutoStart $cfg.autoStart
    Write-Host "`nGespeichert: $ConfigFile" -ForegroundColor Green
    Write-Host "Lokale Survey-Basis-URL für die App: http://127.0.0.1:$($cfg.port)/" -ForegroundColor Green
    Write-Host 'Mit AstroSurveyServer_Start.cmd startet der Server per Doppelklick.' -ForegroundColor Green
}
function Guess-Remote($cfg,$requestPath) {
    $clean = Normalize-LocalPrefix $requestPath
    $best = $null
    foreach($m in $cfg.mappings) {
        $prefix = Normalize-LocalPrefix $m.local
        if ($clean.StartsWith($prefix, [StringComparison]::OrdinalIgnoreCase)) {
            if ($null -eq $best -or $prefix.Length -gt (Normalize-LocalPrefix $best.local).Length) { $best = $m }
        }
    }
    if ($null -eq $best) { return $null }
    $prefix = Normalize-LocalPrefix $best.local
    $rest = $clean.Substring($prefix.Length)
    return Join-Url $best.remote $rest
}
function Download-Remote($remote,$localFile) {
    $dir = Split-Path $localFile -Parent
    if (!(Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
    Write-Host "Download: $remote" -ForegroundColor DarkCyan
    Invoke-WebRequest -Uri $remote -OutFile $localFile -UseBasicParsing -TimeoutSec 60
    return (Test-Path $localFile)
}
function Get-ContentType($path) {
    switch ([IO.Path]::GetExtension($path).ToLowerInvariant()) {
        '.html' { 'text/html; charset=utf-8' }
        '.txt' { 'text/plain; charset=utf-8' }
        '.json' { 'application/json; charset=utf-8' }
        '.fits' { 'application/fits' }
        '.fit' { 'application/fits' }
        '.png' { 'image/png' }
        '.jpg' { 'image/jpeg' }
        '.jpeg' { 'image/jpeg' }
        '.gif' { 'image/gif' }
        default { 'application/octet-stream' }
    }
}
function Write-Text($ctx,$text,$status=200,$contentType='text/plain; charset=utf-8') {
    $bytes = [Text.Encoding]::UTF8.GetBytes($text)
    $ctx.Response.StatusCode = $status
    $ctx.Response.ContentType = $contentType
    $ctx.Response.Headers.Add('Access-Control-Allow-Origin','*')
    $ctx.Response.OutputStream.Write($bytes,0,$bytes.Length)
    $ctx.Response.Close()
}
function Serve-File($ctx,$file) {
    $bytes = [IO.File]::ReadAllBytes($file)
    $ctx.Response.StatusCode = 200
    $ctx.Response.ContentType = Get-ContentType $file
    $ctx.Response.Headers.Add('Access-Control-Allow-Origin','*')
    $ctx.Response.OutputStream.Write($bytes,0,$bytes.Length)
    $ctx.Response.Close()
}
function Serve-Directory($ctx,$dir,$urlPath) {
    $items = Get-ChildItem $dir | Sort-Object PSIsContainer,Name
    $html = "<html><head><meta charset='utf-8'><title>ANP Local Survey Server</title></head><body><h1>ANP Local Survey Server</h1><p>$urlPath</p><ul>"
    if ($urlPath -ne '/') { $html += "<li><a href='../'>..</a></li>" }
    foreach($it in $items) { $name = [Web.HttpUtility]::HtmlEncode($it.Name + $(if($it.PSIsContainer){'/'}else{''})); $href = [Uri]::EscapeDataString($it.Name) + $(if($it.PSIsContainer){'/'}else{''}); $html += "<li><a href='$href'>$name</a></li>" }
    $html += '</ul></body></html>'
    Write-Text $ctx $html 200 'text/html; charset=utf-8'
}
function Preload {
    $cfg = Load-Config
    if (!(Test-Path $cfg.rootFolder)) { New-Item -ItemType Directory -Path $cfg.rootFolder | Out-Null }
    Write-Host "`nMetadaten/Startdateien herunterladen. Umfang: properties, Moc.fits soweit vorhanden." -ForegroundColor Cyan
    $i=1
    foreach($m in $cfg.mappings) { Write-Host "$i) $($m.name) -> $($m.local)"; $i++ }
    Write-Host 'A) alle Presets'
    $sel = Read-Host 'Auswahl'
    $selected = @()
    if ($sel.ToLower() -eq 'a') { $selected = $cfg.mappings }
    else { $idx=[int]$sel-1; if($idx -ge 0 -and $idx -lt $cfg.mappings.Count){ $selected=@($cfg.mappings[$idx]) } }
    foreach($m in $selected) {
        foreach($file in @('properties','Moc.fits')) {
            $remote = Join-Url $m.remote $file
            $local = Join-LocalPath $cfg.rootFolder ((Normalize-LocalPrefix $m.local) + $file)
            try { Download-Remote $remote $local | Out-Null; Write-Host "OK: $($m.local)$file" -ForegroundColor Green } catch { Write-Host "Nicht geladen: $remote ($($_.Exception.Message))" -ForegroundColor Yellow }
        }
    }
    Write-Host "`nHinweis: Weitere HiPS-Kacheln lädt der Server automatisch nach, sobald Aladin sie anfordert." -ForegroundColor Cyan
}
function Start-Server {
    $cfg = Load-Config
    if (!(Test-Path $cfg.rootFolder)) { New-Item -ItemType Directory -Path $cfg.rootFolder | Out-Null }
    $prefix = "http://127.0.0.1:$($cfg.port)/"
    $listener = [Net.HttpListener]::new()
    $listener.Prefixes.Add($prefix)
    try { $listener.Start() } catch { Write-Host "Server konnte nicht gestartet werden. Ist Port $($cfg.port) bereits belegt?" -ForegroundColor Red; Write-Host $_.Exception.Message; Read-Host 'Enter zum Beenden'; return }
    Write-Host "`n$AppName läuft." -ForegroundColor Green
    Write-Host "Survey-Hauptordner: $($cfg.rootFolder)"
    Write-Host "Lokale Survey-Basis-URL: $prefix" -ForegroundColor Green
    Write-Host 'Fehlende bekannte HiPS-Dateien werden bei Bedarf aus den Online-Quellen geladen und lokal gespeichert.' -ForegroundColor Cyan
    Write-Host 'Beenden mit Strg+C oder Fenster schließen.' -ForegroundColor Yellow
    while ($listener.IsListening) {
        try {
            $ctx = $listener.GetContext()
            $path = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath.TrimStart('/'))
            if ([string]::IsNullOrWhiteSpace($path)) { Serve-Directory $ctx $cfg.rootFolder '/'; continue }
            if ($path -eq 'status') {
                $data = [pscustomobject]@{ service=$AppName; running=$true; root=$cfg.rootFolder; port=$cfg.port; baseUrl=$prefix; version='0.2-test'; mappings=$cfg.mappings }
                Write-Text $ctx ($data | ConvertTo-Json -Depth 10) 200 'application/json; charset=utf-8'; continue
            }
            $local = Join-LocalPath $cfg.rootFolder $path
            if (Test-Path $local -PathType Container) { Serve-Directory $ctx $local ('/' + $path); continue }
            if (!(Test-Path $local -PathType Leaf)) {
                $remote = Guess-Remote $cfg $path
                if ($remote) { try { Download-Remote $remote $local | Out-Null } catch { Write-Text $ctx "Datei lokal nicht vorhanden und Online-Download fehlgeschlagen: $remote`n$($_.Exception.Message)" 404; continue } }
            }
            if (Test-Path $local -PathType Leaf) { Serve-File $ctx $local } else { Write-Text $ctx 'File not found.' 404 }
        } catch { try { if($ctx){ Write-Text $ctx $_.Exception.Message 500 } } catch {} }
    }
}

switch ($Mode) {
    'Config' { Configure; Read-Host 'Enter zum Schließen' }
    'Preload' { Preload; Read-Host 'Enter zum Schließen' }
    'Status' { $cfg=Load-Config; Write-Host "Basis-URL: http://127.0.0.1:$($cfg.port)/"; Write-Host "Ordner: $($cfg.rootFolder)"; Read-Host 'Enter zum Schließen' }
    default { Start-Server }
}
