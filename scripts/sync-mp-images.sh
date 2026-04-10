#!/usr/bin/env bash
# 将网页版 image/ 同步到小程序分包图片目录
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p "$ROOT/miniprogram/packageImages/images"
cp -f "$ROOT/image/"*.* "$ROOT/miniprogram/packageImages/images/"
echo "已同步到 miniprogram/packageImages/images/"
