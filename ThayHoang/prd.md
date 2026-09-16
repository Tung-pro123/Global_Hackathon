# PRD: Góc Ban Công

## 1. Vấn đề (Problem Statement)

Người thuê trọ ở thành phố hay mua vài chậu cây về đặt ngoài ban công rồi để chết dần. Vấn đề không nằm ở chỗ họ lười, mà ở chỗ mỗi loại cây cần một nhịp chăm khác nhau, còn thứ họ nhận được khi mua chỉ là một cái tên loài dán trên chậu. Nhãn ghi tên loài không nói cho ai biết hôm nay có phải ngày tưới hay không, nên người trồng phải đoán, đoán sai, rồi mất cây. Việc này đáng giải quyết vì một chậu cây chết là một lần người ta tin rằng mình không trồng được cây, và lần sau họ không mua nữa.

## 2. Đối tượng người dùng (Target Audience)

Người trẻ thuê trọ hoặc thuê căn hộ nhỏ ở thành phố, có một ban công hoặc một khung cửa sổ hứng nắng, đã từng mua cây về trồng và đã từng làm chết cây. Họ muốn có cây trong nhà nhưng không muốn biến việc chăm cây thành một môn học.

## 3. Kịch bản sử dụng (User Stories & Scenarios)

[Giả định] Một người mua chậu cây thứ hai sau khi chậu thứ nhất đã chết. Họ mang cây về, đặt ngoài ban công, và trong tuần đầu thì tưới rất chăm. Sang tuần thứ hai, công việc bận lên, lịch tưới trôi vào khoảng nhớ mang máng. Cây bắt đầu rụng lá, người trồng không rõ là do thiếu nước hay do úng nước, nên xử lý bằng cách tưới nhiều hơn, và cây chết nhanh hơn. Với một tấm thẻ chăm cây cắm ngay tại chậu, câu hỏi "hôm nay có tưới không" được trả lời tại chỗ, bằng một dấu hiệu nhìn thấy được trên chính chậu cây đó, thay vì bằng trí nhớ.

## 4. Giải pháp đề xuất (Proposed Solution)

Trọng tâm giải pháp là một bộ thẻ chăm cây cắm tại chậu, mỗi loài một thẻ, ghi nhịp tưới và dấu hiệu nhận biết cây đang thiếu hay đang thừa nước, viết bằng ngôn ngữ của người chưa từng trồng cây. Nhóm ban đầu đề xuất nhiều hướng thiên về thiết bị — cảm biến độ ẩm cắm chậu gửi thông báo về điện thoại, ứng dụng nhắc lịch tưới, chậu tự tưới có bình chứa ngầm, và mô hình giao cây định kỳ hàng tháng. Sau khi xét lại từ phía người thuê trọ, nhóm nhận ra điểm mấu chốt: thứ họ thiếu không phải lời nhắc mà là khả năng đọc được tình trạng cây đang đứng trước mặt. Một lời nhắc vẫn buộc người ta đoán; một dấu hiệu thì không. Vì vậy các hướng thiết bị và ứng dụng bị lùi ưu tiên, còn hướng thẻ chăm cây tại chậu được chọn làm trọng tâm vì giải quyết đúng gốc rễ với chi phí thấp nhất và không cần điện.

## 5. Tính năng chính (Key Features)

### 5.1 Thẻ chăm cây cắm tại chậu

- **Là gì:** Thẻ cứng chống ẩm cắm vào đất từng chậu, ghi nhịp tưới của loài đó và các dấu hiệu nhìn thấy được của cây thiếu nước và cây úng nước.
- **Vì sao:** Trả lời câu hỏi "hôm nay có tưới không" ngay tại chỗ người trồng đang đứng, không cần điện, không cần nhớ, không cần mở điện thoại.
- **Ưu tiên:** P0

### 5.2 Cảm biến độ ẩm gửi thông báo

- **Là gì:** Que cảm biến cắm vào đất, đo độ ẩm và gửi thông báo về điện thoại khi đất khô.
- **Vì sao:** Đo được chính xác hơn mắt thường, nhưng cần pin và cần một chiếc que cho mỗi chậu, nên chi phí tăng theo số cây.
- **Ưu tiên:** P1

### 5.3 Ứng dụng nhắc lịch tưới

- **Là gì:** Ứng dụng điện thoại giữ lịch tưới cho từng chậu và đẩy thông báo tới người dùng.
- **Vì sao:** Nhóm đánh giá lời nhắc không giải quyết được việc người trồng vẫn phải đoán tình trạng cây, nên xếp sau.
- **Ưu tiên:** P2

### 5.4 Chậu tự tưới có bình chứa ngầm

- **Là gì:** Chậu hai lớp với bình nước ngầm, tự thấm nước lên đất khi đất khô.
- **Vì sao:** Bỏ được thao tác tưới, nhưng buộc người dùng thay toàn bộ chậu đang có và giá thành cao hơn hẳn.
- **Ưu tiên:** P2

### 5.5 Giao cây định kỳ hàng tháng

- **Là gì:** Mô hình gửi cây mới tới nhà người dùng theo tháng.
- **Vì sao:** Nhóm đánh giá hướng này làm tăng số cây phải chăm chứ không làm người ta chăm giỏi hơn, nên có thể bỏ qua.
- **Ưu tiên:** P2 (nhóm đề xuất có thể bỏ qua)

## 6. Phạm vi (Scope: In / Out)

[Giả định] Dựa trên thứ tự ưu tiên nhóm đã chốt, phạm vi bản đầu tiên đề xuất như sau:

- **Trong phạm vi (In):** Thẻ chăm cây cắm tại chậu.
- **Cân nhắc cho giai đoạn sau (In, phase 2):** Cảm biến độ ẩm gửi thông báo.
- **Ngoài phạm vi ban đầu (Out):** Ứng dụng nhắc lịch tưới, chậu tự tưới có bình chứa ngầm.
- **Loại bỏ (Out):** Giao cây định kỳ hàng tháng.

## 7. Khác biệt & Rủi ro (Differentiation & Risks)

Khác biệt cốt lõi so với các sản phẩm chăm cây khác là giải pháp không cố nhắc người dùng đúng lúc, mà dạy họ đọc được cái cây đang đứng trước mặt. Sau một mùa dùng thẻ, người trồng nhìn lá là biết, và thẻ trở thành thừa — đó là kết quả mong muốn chứ không phải thất bại của sản phẩm.

Rủi ro chính nhóm xác định:

- Thẻ có thể bị coi như một mẩu giấy khuyến mãi kèm chậu và bị vứt đi ngay khi mua.
- Nhịp tưới ghi trên thẻ chỉ đúng trong một khoảng điều kiện; một ban công hướng tây gắt nắng và một khung cửa sổ hướng bắc thiếu sáng không thể dùng chung một nhịp.
- Người trồng có thể đọc thẻ một lần rồi không nhìn lại, khiến thẻ mất tác dụng đúng vào lúc cây bắt đầu có vấn đề.

## 8. Chỉ số thành công (Success Metrics)

[Giả định] Nhóm chưa thảo luận chỉ tiêu đo lường cụ thể. Các chỉ số định tính có thể cân nhắc gồm: tỉ lệ cây còn sống sau mùa đầu tiên theo người trồng tự báo, mức độ người trồng mua thêm chậu tiếp theo, và việc người trồng có tự nhận ra dấu hiệu thiếu nước mà không cần nhìn thẻ nữa hay không.

## 9. Giả định & Câu hỏi mở (Assumptions & Open Questions)

- [Giả định] §3 (Kịch bản sử dụng): kịch bản được dựng lại từ insight nhóm nêu về việc người trồng phải đoán tình trạng cây; nhóm không mô tả một tình huống theo trình tự thời gian cụ thể.
- [Giả định] §6 (Phạm vi In/Out): việc chia giai đoạn được suy ra trực tiếp từ thứ tự ưu tiên nhóm chốt, nhóm không dùng khung in scope/out of scope khi thảo luận.
- [Giả định] §8 (Chỉ số thành công): nhóm không thảo luận chỉ số đo lường; các chỉ số nêu trên được suy ra từ vấn đề và tính năng đã thống nhất.
- Câu hỏi mở: nhóm chưa chốt thẻ được bán rời hay đi kèm theo chậu cây khi mua.
- Câu hỏi mở: nhóm chưa xác định danh sách loài cây nào có thẻ trong bản đầu tiên.
