# Quy Tắc Điều Phối Công Cụ Tối Ưu Token & Ngữ Cảnh (Tokenless Ecosystem)

Tài liệu này định nghĩa các quy tắc cốt lõi khi AI tương tác với hệ sinh thái công cụ hỗ trợ: **CodeGraph**, **Claude-Mem**, **RTK (Runtime Token Killer)**, và **Caveman**.

---

## 1. CodeGraph (`codegraph_explore`)

### ❌ KHÔNG NÊN:
- Grep chuỗi vô định trên toàn bộ thư mục khi cần tìm ai gọi hàm:
  ```bash
  grep -rn "calculateTax" src/  # Trả về hàng trăm kết quả rác gồm comment, log, test
  ```
- Mở từng file một chỉ để lần theo vết imports/call-chain.

### ✅ NÊN LÀM:
- Sử dụng CodeGraph để lấy đồ thị phân tích tác động (`impact analysis`):
  ```json
  // Gọi CodeGraph lấy call hierarchy
  codegraph_explore(action="callers", symbol="calculateTax", file="src/billing/tax.ts")
  ```
- Kết hợp với `lsp` (`action: "references"`) khi đã xác định được đúng file cần sửa.

---

## 2. Claude-Mem (`mem-search`)

### ❌ KHÔNG NÊN:
- Tự mò mẫm giải quyết lại các vấn đề phức tạp đã từng làm trong dự án:
  - *"Không hiểu sao project này chạy build lại bị lỗi memory heap size, để tôi đọc hết webpack.config.js..."*
- Lưu trữ mọi thứ rườm rà vào bộ nhớ (lưu cả code thô, log rác).

### ✅ NÊN LÀM:
- Trước khi bắt đầu một lỗi lạ, kiểm tra bộ nhớ xuyên phiên:
  ```python
  # Tìm kiếm trong memory xem lần trước xử lý thế nào
  task(tasks=[{"agent": "scout", "task": "Search memory for heap size build fixes"}])
  # Hoặc dùng skill mem-search
  ```
- Khi giải quyết xong vấn đề khó: Ghi nhận 2 dòng đúc kết nguyên nhân và cách fix.

---

## 3. RTK (Runtime Token Killer)

### ❌ KHÔNG NÊN:
- Để lệnh test/build xả hàng ngàn dòng log trực tiếp vào context prompt:
  ```bash
  # Lệnh xả 5000 dòng log gây tràn bộ nhớ LLM
  bash(command="npm test")
  ```
- Tự viết các bộ lọc pipe shell phức tạp dễ làm mất exit code:
  ```bash
  npm test | grep "FAIL" | head -n 10  # Dễ che giấu lỗi thực tế
  ```

### ✅ NÊN LÀM:
- Để RTK tự động chặn ở tầng hook/extension:
  - Lệnh vẫn chạy: `npm test`
  - RTK tự động cắt bỏ thông tin thừa (tiến trình download, thanh progress bar, các test case pass vô thưởng vô phạt).
  - Trả về đúng: Tổng số test pass/fail và stack trace chính xác của test case bị lỗi.

---

## 4. Caveman (Giao Tiếp & Phản Hồi Súc Tích)

### ❌ KHÔNG NÊN:
```text
Chào bạn! Tôi rất vui được hỗ trợ bạn giải quyết vấn đề này. 
Theo như bạn đã mô tả, hệ thống đang gặp lỗi không thể kết nối tới cơ sở dữ liệu. 
Để giải quyết việc này, tôi đã kiểm tra file cấu hình .env và nhận thấy cổng kết nối đang để là 5432 thay vì 5433. 
Tôi đã tiến hành sửa đổi nó giúp bạn rồi nhé. Dưới đây là các bước tôi đã làm:
1. Đọc file .env
2. Sửa cổng
3. Lưu lại
Bây giờ mọi thứ đã hoàn tất, bạn hãy thử lại xem sao nhé!
```
*(Lãng phí >100 tokens vô nghĩa, gây chậm chạp và loãng ngữ cảnh)*.

### ✅ NÊN LÀM:
```text
Nguyên nhân: Sai DB port trong `.env` (`5432` $\rightarrow$ `5433`).
Đã sửa: `src/config/database.ts#A1B2` cập nhật cổng kết nối theo env.
Xác thực: Đã chạy `npm run test:db-conn` $\rightarrow$ Kết nối PostgreSQL thành công (Exit code 0).
```
*(Súc tích, 100% sự thật kỹ thuật, chỉ rõ vị trí và bằng chứng).*
