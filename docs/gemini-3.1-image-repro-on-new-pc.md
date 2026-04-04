# Gemini 3.1 Image Repro (New PC)

目的：把老电脑上已验证成功的 Gemini 3.1 生图调用，原样搬到新电脑复用。

## 已验证成功的配置

- 模型名：`gemini-3.1-flash-image-preview`
- Endpoint：`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent`
- API 版本：`v1beta`
- 鉴权方式：`GEMINI_API_KEY` 环境变量
- 请求体关键字段：
  `contents[].parts[].text`
  `generationConfig.responseModalities = ["TEXT", "IMAGE"]`

## 脚本位置

- [gemini_31_image_repro.ps1](D:\hshpsd\temp\gemini_31_image_repro.ps1)

## 前置条件

先在 PowerShell 里设置 API Key：

```powershell
$env:GEMINI_API_KEY = "你的密钥"
```

如果要长期生效，改成系统或用户级环境变量。

## 直接运行

默认会生成一张透明背景红苹果 PNG，并保存到 `D:\hshpsd\temp\gemini_outputs\red_apple_transparent_gemini31.png`：

```powershell
powershell -ExecutionPolicy Bypass -File D:\hshpsd\temp\gemini_31_image_repro.ps1
```

## 自定义提示词和输出文件

```powershell
powershell -ExecutionPolicy Bypass -File D:\hshpsd\temp\gemini_31_image_repro.ps1 `
  -Prompt "Create a single blue potion bottle icon on a transparent background. Clean game-ready illustration, no text, no border, no extra objects." `
  -OutFile "D:\hshpsd\temp\gemini_outputs\blue_potion.png"
```

## 成功标志

脚本成功时会打印：

```text
OK -> D:\hshpsd\temp\gemini_outputs\...
```

## 这次老电脑实际跑通的完整命令

```powershell
$outDir = 'D:\hshpsd\temp\gemini_outputs'; New-Item -ItemType Directory -Force -Path $outDir | Out-Null; $outFile = Join-Path $outDir 'red_apple_transparent_gemini31.png'; $prompt = @'
Create a single small red apple icon on a transparent background.
Requirements: transparent PNG, centered subject, no shadow plane, no text, no border, no extra objects, simple clean game-ready illustration.
'@; $body = @{ contents = @(@{ parts = @(@{ text = $prompt }) }); generationConfig = @{ responseModalities = @('TEXT','IMAGE') } } | ConvertTo-Json -Depth 10; $resp = Invoke-RestMethod -Method Post -Uri 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent' -Headers @{ 'x-goog-api-key' = $env:GEMINI_API_KEY } -ContentType 'application/json' -Body $body; $parts = $resp.candidates[0].content.parts; $img = $parts | Where-Object { $_.inlineData -and $_.inlineData.data } | Select-Object -First 1; if (-not $img) { Write-Output ($resp | ConvertTo-Json -Depth 20); throw 'No image returned.' }; [IO.File]::WriteAllBytes($outFile, [Convert]::FromBase64String($img.inlineData.data)); Write-Output ('OK -> ' + $outFile)
```
