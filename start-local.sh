#!/usr/bin/env bash
# 在本地启动网页服务，用浏览器打开（勿仅用 file:// 双击打开，否则可能空白或图片不显示）
cd "$(dirname "$0")"
PORT="${1:-8765}"
echo "正在启动：http://127.0.0.1:${PORT}/"
echo "按 Ctrl+C 停止服务"
exec python3 -m http.server "$PORT" --bind 127.0.0.1
