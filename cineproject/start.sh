#!/bin/bash
echo "=========================================="
echo "  MovieTime - Starting Full Stack App"
echo "=========================================="

DIR="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo "[1/2] Starting Django Backend..."
cd "$DIR/backend"
pip install -r requirements.txt -q
python seed.py
python manage.py runserver &
BACKEND_PID=$!

sleep 2

echo "[2/2] Starting React Frontend..."
cd "$DIR/frontend"
npm install --silent
npm start &
FRONTEND_PID=$!

echo ""
echo "=========================================="
echo " Backend  → http://localhost:8000"
echo " Frontend → http://localhost:3000"
echo " Press Ctrl+C to stop both servers"
echo "=========================================="

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait
