# PRD: CultureSync — The AI Campus Slang & Cultural Literacy Engine

> **Tài liệu Yêu cầu Sản phẩm (Product Requirements Document)**  
> **Đội ngũ thực hiện:** Team 14 | **Track thi đấu:** Track 2 — Intercultural Learning & Language  
> **Cố vấn phụ trách:** Thầy Hồ Quốc Đạt (Business Mentor) & Thầy Lê Hoàng Tuấn Kiệt (Technical Mentor)  
> **Định hướng cốt lõi:** Tập trung trực tiếp vào **Từ Lóng Học Đường (Campus Slang & Colloquialisms)** qua **Game Tình Huống AI (Ưu tiên 1)** và **Từ Điển Từ Lóng Thông Minh (Ưu tiên 2)**. Đã loại bỏ Chatbot chung chung.

---

## 1. Vấn đề (Problem Statement)

Khi sinh viên Việt Nam và sinh viên quốc tế (điển hình là sinh viên Singapore) làm việc nhóm trong các kỳ hackathon, đồ án hay trao đổi, rào cản lớn nhất gây hiểu lầm và xa cách **không phải là ngữ pháp tiếng Anh học thuật, mà là TỪ LÓNG HỌC ĐƯỜNG VÀ TỪ NGỮ ĐỊA PHƯƠNG (Campus Slang & Colloquialisms)**.

* **Thực tế giao tiếp nhóm (WhatsApp, Telegram, Discord):** Sinh viên không nói chuyện như sách giáo khoa; họ sử dụng dày đặc tiếng lóng địa phương:
  * Sinh viên Singapore dùng Singlish: *"Don't be so kiasu", "finish chop-chop can lah?", "I chope the room", "so sian"*...
  * Sinh viên Việt Nam dùng tiếng lóng: *"Gánh team", "bào việc", "thao túng tâm lý", "xụi lơ"*...
* **Hậu quả trực tiếp:**
  1. **Cảm giác bị cô lập (Out-group Alienation):** Sinh viên không hiểu từ lóng cảm thấy mình là "người ngoài cuộc", không biết bạn mình đang đùa hay đang mắng.
  2. **Hiểu lầm tai hại:** Khi Marcus nhắn *"Don't be so kiasu, just finish by 3 PM chop-chop"*, sinh viên Việt Nam tưởng chữ *"kiasu"* là chê bai mình ích kỷ, dẫn đến tự ái, đối đầu hoặc im lặng độc hại.
  3. **Công cụ hiện tại bất lực:** Google Translate và DeepL dịch sai hoàn toàn nghĩa của từ lóng học đường. Grammarly chỉ báo lỗi chính tả. ChatGPT đại trà đòi hỏi prompt phức tạp mà sinh viên không có thời gian viết.

---

## 2. Đối tượng người dùng (Target Audience)

* **Người dùng cuối (End Users):** Sinh viên đại học tham gia các dự án nhóm quốc tế, hackathon, trao đổi sinh viên (thí điểm trực tiếp trên cohort **FPT University $\times$ Republic Polytechnic Singapore**).
* **Bên chi trả / Khách hàng B2B2C:** Phòng Hợp tác Quốc tế, Phòng Công tác Sinh viên các trường đại học (mua bản quyền trang bị cho sinh viên trong tuần định hướng Orientation để đẩy nhanh tốc độ hòa nhập và giảm tỷ lệ drop out).

---

## 3. Kịch bản sử dụng (User Stories & Scenarios)

* **Kịch bản thực tế:** Bạn An (Việt Nam) thấy bạn Marcus (Singapore) nhắn vào nhóm:  
  > *"Hey guys, I chope-d the discussion booth at 2 PM. Bring your slides chop-chop, don't be so kiasu can lah?"*
* **Nếu không có công cụ:** An bối rối, tra Google Translate thì ra từ *"kiasu"* là *"sợ thua thiệt"* $\to$ An nghĩ Marcus đang mắng mình sợ thua, sinh ra bực bội.
* **Với CultureSync:**
  1. An mở app **CultureSync**, vào mục **Slang Game 60 giây**: Hệ thống đưa ra ngay tình huống nhóm của Marcus.
  2. An chọn phương án giải mã: *"Marcus đang giữ chỗ thảo luận và muốn cả nhóm làm nhanh để cùng đạt giải cao, không có ác ý."* $\to$ Đúng! Nhận +20 XP và duy trì chuỗi **Streak 🔥**.
  3. An mở nhanh **Từ Điển Slang** tra chữ *"chope"* $\to$ Hiểu ngay nét văn hóa dùng khăn giấy giữ chỗ bàn ăn của người Singapore.
  4. An tự tin nhắn lại: *"Steady lah Marcus! Bringing the slides now."* $\to$ Tình bạn nhóm gắn kết ngay lập tức!

---

## 4. Giải pháp đề xuất (Proposed Solution)

Trọng tâm giải pháp là **CultureSync — The AI Campus Slang & Cultural Literacy Engine**:
Nhóm quyết định **LOẠI BỎ CHATBOT NÓI CHUYỆN PHIẾM** để dồn toàn lực vào 2 tính năng giải quyết đúng nỗi đau từ lóng:

1. **ƯU TIÊN 1 (Trọng tâm hàng đầu): Game Tình Huống Văn Hóa & Từ Lóng (SlangArena Game):**
   * Các màn thử thách 60 giây mô phỏng tình huống tin nhắn WhatsApp thực tế được nạp trực tiếp từ SQLite Database (tốc độ 0ms, không lo lỗi API khi pitch).
   * Tính điểm Cultural Tact Score, tích lũy điểm kinh nghiệm (XP) và duy trì chuỗi ngày học liên tục (Streaks 🔥).
2. **ƯU TIÊN 2 (Công cụ tra cứu đi kèm): Từ Điển Từ Lóng Học Đường Thông Minh (Smart Slang Pokedex):**
   * Tra cứu tức thì từ lóng Singlish và Tiếng Việt, giải thích nguồn gốc, tâm lý văn hóa và cách phản hồi phù hợp.

---

## 5. Vai trò cốt lõi của AI (The Core Role of AI)

AI trong CultureSync không phải là chatbot tán gẫu, mà đóng vai trò là **HỆ THỐNG CÀO DỮ LIỆU & NẠP TỪ LÓNG TỰ ĐỘNG (AI Autonomous Slang Harvester & Ingestion Pipeline)**:
1. **Cào và phát hiện từ lóng mới nổi (Autonomous Slang Discovery):**
   * Từ lóng giới trẻ biến đổi liên tục qua từng học kỳ trên mạng xã hội, diễn đàn sinh viên (Reddit, TikTok, nhóm Telegram, chat đồ án).
   * AI (Groq 120B / Gemini) tự động quét và thu thập các từ lóng học đường mới nhất chưa từng có trong hệ thống.
2. **Lọc trùng & Phân tích tâm lý học ngôn ngữ (De-duplication & Cultural Structuring):**
   * AI kiểm tra đối chiếu với toàn bộ từ lóng đã có trong Database `cultursync.db` để đảm bảo **100% không trùng lặp**.
   * AI tự động giải mã ngữ nghĩa thực tế (pragmatic intent vs. literal translation), bối cảnh dùng trên WhatsApp và gợi ý phản hồi ngoại giao.
3. **Tự động sinh câu đố thử thách & nạp thẳng vào Database (Auto-Ingestion):**
   * AI tự động đóng gói từ lóng mới thành 1 tình huống đố vui trắc nghiệm (1 đáp án chuẩn văn hóa + 3 đáp án gây hiểu lầm) và ghi thẳng vào SQLite Database.
   * Nhờ đó, kho câu hỏi của Game và Từ điển luôn luôn tươi mới mỗi ngày mà **không cần con người phải nhập tay thủ công**.
4. **Tại sao mô hình này tối ưu vượt trội so với gọi AI trực tiếp mỗi câu chơi:**
   * **Độ trễ 0 giây & Độ ổn định 100% khi Thuyết trình:** Người chơi load câu hỏi trực tiếp từ SQLite Database cực mượt, không sợ rớt mạng, không sợ đơ API hay quá tải rate-limit khi Giám khảo trực tiếp chấm thi!

---

## 6. Phân cấp tính năng & Phạm vi (P0 / P1 / P2)

* **P0 (Cốt lõi bắt buộc cho Prototype 48h):**
   * **SlangArena Scenario Game:** Thử thách tin nhắn WhatsApp 60s, giải mã từ lóng, tính điểm và cập nhật Streak từ SQLite.
   * **Smart Slang Pokedex:** Tra cứu từ lóng song phương (Việt - Sing) có giải thích tâm lý văn hóa.
   * **AI Slang Harvester:** Module AI tự động cào từ lóng mới chưa từng có và nạp vào Database (`agent/slang_crawler.py`).
* **P1 (Mở rộng cho Demo Day):**
   * Hệ thống huy hiệu văn hóa (Badges).
   * Thống kê bảng xếp hạng sinh viên giao lưu quốc tế.
* **P2 (Loại bỏ khỏi 48h):**
   * Chatbot đàm thoại tự do (loại bỏ vì dàn trải, khó đo lường).
   * Thiết bị phần cứng phiên dịch.

---

## 7. Chỉ số thành công (Success Metrics)

* **Định lượng:**
  * 100% sinh viên tham gia test giải mã đúng các từ lóng Singlish (*kiasu, chop-chop, chope, can lah*).
  * Tốc độ AI sinh tình huống game: **Dưới 1.0 giây** qua Groq 120B.
* **Định tính:**
  * Sinh viên cảm thấy hào hứng chơi game thử thách hơn là đọc sách ngữ pháp.
  * Xóa bỏ hoàn toàn cảm giác ngượng ngùng khi bước vào nhóm làm việc quốc tế.
