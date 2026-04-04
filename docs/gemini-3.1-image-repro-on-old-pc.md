# Gemini 3.1 Image Repro (Old PC)

目标：在老电脑上确认 `gemini-3.1` 生图的可复现调用方式，并把关键信息带回新电脑复用。

## 1. 跑最小可复现生图测试

请让 Codex 在老电脑执行一条“最小测试”，要求：
- 使用 `gemini-3.1` 图像模型。
- 生成 1 张透明背景小图。
- 保存到本地文件。
- 把“完整可运行命令”原样打印出来（不要省略 URL、模型名、API 版本、请求体字段）。

你可以直接对 Codex 说：

```text
请做一个最小可复现测试：用 gemini-3.1 生成 1 张透明背景 PNG（比如红苹果），保存到本地。
并把你实际执行成功的完整命令原样输出给我，不要省略任何参数。
```

## 2. 导出环境变量信息（可脱敏）

让 Codex 执行：

```powershell
Get-ChildItem Env: | Where-Object { $_.Name -match 'GEMINI|GOOGLE|VERTEX|PROJECT|LOCATION|API' } | Sort-Object Name
```

目的：确认老电脑是走 API Key 还是 Vertex AI（project/location/OAuth）。

## 3. 导出成功调用日志线索

让 Codex 执行：

```powershell
rg -n "gemini-3.1|image-preview|generateContent|predict|googleapis|vertexai|saved:|OK ->" -S C:\Users\Administrator\.codex\log\codex-tui.log
```

## 4. 回传给新电脑的关键信息

把以下 5 项发给新电脑上的 Codex：

1. 成功时使用的模型名  
2. 成功时完整 endpoint（`v1beta` / `v1alpha` / Vertex）  
3. 请求体结构（关键字段，如 `responseModalities` 或 `instances/parameters`）  
4. 鉴权方式（API Key / OAuth）  
5. 成功输出的日志关键行（包含“保存文件成功”或可识别成功响应）

## 5. 说明

- 如果老电脑也是 404/403，请让 Codex把完整错误体一起带回来。  
- 不需要上传密钥明文；可只给变量名和调用方式。  
