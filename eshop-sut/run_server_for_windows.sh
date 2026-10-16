#!/bin/bash

# Lấy thư mục chứa chính script này
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Dừng các tiến trình node đang chạy (hỗ trợ cả Windows và Unix)
taskkill //F //IM node.exe 2>/dev/null || killall node 2>/dev/null || true

# Khởi chạy Backend
(cd "$DIR/backend" && node server.js) &

# Khởi chạy Frontend Web
(cd "$DIR/frontend-web" && npm run dev) &

# Khởi chạy Frontend Admin
(cd "$DIR/frontend-admin" && npm run dev) &

wait
