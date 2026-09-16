# 🚀 Hướng Dẫn Deploy CultureSync SlangArena Lên GitHub & Render

Tài liệu này hướng dẫn chi tiết từng bước để đẩy dự án lên **GitHub** và triển khai trực tiếp lên **Render** (chỉ cần **1 Web Service duy nhất** chạy trọn gói cả Frontend React + Backend API).

---

## 📌 Tổng Quan Kiến Trúc Khi Deploy
- **Frontend**: React 18 + Vite (được build thành static files trong `client/dist`).
- **Backend**: Node.js + Express (vừa phục vụ API `/api/...`, vừa tự động phân phối giao diện React).
- **Lợi ích**: 
  - ✅ **1 Domain duy nhất** (ví dụ: `https://cultursync-slangarena.onrender.com`).
  - ✅ **0% lỗi CORS** (không bị xung đột tên miền chéo).
  - ✅ **Tiết kiệm 100% tài nguyên**: Chỉ tốn 1 slot Free Web Service trên Render.

---

## BƯỚC 1: Đẩy Dự Án Lên GitHub

Mở terminal (PowerShell / Command Prompt / Git Bash) tại thư mục gốc của dự án `d:\Cac_Cuoc_Thi\Global_Hackathon`:

```bash
# 1. Khởi tạo git (nếu máy bạn chưa khởi tạo)
git init

# 2. Thêm toàn bộ file vào git (các file rác, node_modules và .env đã được .gitignore bảo vệ)
git add .

# 3. Tạo commit đầu tiên
git commit -m "feat: CultureSync SlangArena with AI Persona, Dino Quest & 40 Slangs"

# 4. Đổi tên nhánh chính thành main
git branch -M main

# 5. Tạo 1 repository mới trên GitHub (ví dụ: https://github.com/your-username/Global_Hackathon)
# Sau đó liên kết repo với máy tính:
git remote add origin https://github.com/Tung-pro123/Global_Hackathon.git

# 6. Đẩy code lên GitHub
git push -u origin main
```

*(Nếu bạn đã có sẵn remote origin, bạn chỉ cần gõ `git add .` -> `git commit -m "Update fullstack app"` -> `git push`)*.

---

## BƯỚC 2: Triển Khai Miễn Phí Lên Render (Render.com)

1. Truy cập **[dashboard.render.com](https://dashboard.render.com/)** và đăng nhập bằng tài khoản GitHub của bạn.
2. Bấm nút **"New +"** ở góc trên bên phải -> Chọn **"Web Service"**.
3. Chọn mục **"Build and deploy from a Git repository"** -> Bấm **Next**.
4. Tìm và chọn repository **`Global_Hackathon`** của bạn -> Bấm **Connect**.
5. Điền các thông số cấu hình như sau:

| Mục cấu hình | Giá trị điền vào |
| :--- | :--- |
| **Name** | `cultursync-slangarena` *(hoặc tên bất kỳ bạn thích)* |
| **Region** | `Singapore (Southeast Asia)` *(chọn Singapore để đường truyền về VN nhanh nhất)* |
| **Branch** | `main` |
| **Root Directory** | *(Để trống)* |
| **Runtime** | `Node` |
| **Build Command** | `npm run build` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` ($0/month) |

6. Kéo xuống phần **Environment Variables** (Biến môi trường) và thêm 2 biến:
   - `NODE_ENV` = `production`
   - `GROQ_API_KEY` = `<điền_api_key_groq_của_bạn>` *(Lấy miễn phí tại console.groq.com)*

7. Bấm **"Create Web Service"**!

---

## BƯỚC 3: Render Tự Động Build & Phát Hành

Render sẽ tự động thực hiện:
1. Chạy lệnh `npm run build`: Tự động build React Vite app thành các file tối ưu trong `client/dist`.
2. Chạy lệnh `npm start`: Khởi động Express Server.
3. Cấp phát một đường link công khai có HTTPS miễn phí (ví dụ: `https://cultursync-slangarena.onrender.com`).

---

## ✅ Kiểm Tra Sau Khi Deploy Thành Công
Khi màn hình Render hiện `Live`:
1. Bấm vào link web service của Render.
2. Kiểm tra Game Dino chạy mượt mà ngay trên web.
3. Thử tính năng **Chơi Nhanh (Khách)** và **Đăng Ký Tài Khoản (AI May Đo)**.
4. Mở tab **Pokédex** bấm **`✨ May Đo Câu AI`** để xem AI sinh câu trực tiếp trên cloud!
