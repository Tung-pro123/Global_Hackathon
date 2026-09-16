"""
app.py - Main Entrypoint for CultureSync (Team 14 - Global Hackathon 2026)
Architecture:
  - agent/   : Contains Skills (SKILL.md) and MCP Tools (mcp_server.py)
  - backend/ : Contains Database (SQLite) and API Routes
  - frontend/: Contains UI Templates and Static Assets
  - docs/    : Contains PRD and Architecture Blueprints
"""

import os
from flask import Flask, render_template, jsonify
import backend.database as database
from backend.routes import api_bp

# 1. Khởi tạo cơ sở dữ liệu SQLite
database.init_db()

# 2. Khởi tạo Flask Application
app = Flask(__name__, template_folder="templates")

# 3. Đăng ký Blueprint từ backend/routes.py
app.register_blueprint(api_bp)


@app.route("/")
def index():
    """Trang chủ giao diện người dùng"""
    return render_template("index.html")


@app.route("/health")
def health():
    """Health check endpoint phục vụ Render và giám sát hệ thống"""
    return jsonify({
        "status": "healthy",
        "service": "CultureSync",
        "team": "Team 14",
        "architecture": "Modular Agent (Skills + MCP Tools + SQLite Backend)"
    })


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.config["TEMPLATES_AUTO_RELOAD"] = True
    app.jinja_env.auto_reload = True
    print(f"🚀 CultureSync Modular Agent is launching on http://localhost:{port}")
    try:
        app.run(host="0.0.0.0", port=port, debug=False)
    except OSError:
        fallback_port = 5050
        print(f"⚠️ Port {port} đang bị tiến trình cũ chiếm giữ!")
        print(f"🚀 Tự động chuyển sang cổng dự phòng: http://localhost:{fallback_port}")
        app.run(host="0.0.0.0", port=fallback_port, debug=False)
