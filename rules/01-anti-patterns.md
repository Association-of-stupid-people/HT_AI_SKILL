# Các Anti-Pattern Khi Tương Tác Với Harness

Bộ quy tắc ngăn chặn các thói quen xấu làm lãng phí context token, giảm độ chính xác và gây nghẽn quá trình thực thi của AI.

---

## 1. Anti-Patterns Về Công Cụ

### 1.1 Tìm kiếm & Đọc file
- ❌ **KHÔNG NÊN**:
  ```bash
  # Lạm dụng bash để grep hoặc duyệt file
  bash(command="grep -rn 'getUser' src/ | head -n 20")
  bash(command="find src/ -name '*.ts'")
  ```
- ✅ **NÊN LÀM**:
  ```python
  # Dùng công cụ chuyên biệt tối ưu token và AST
  grep(pattern="getUser", path="src")
  glob(path="src/**/*.ts")
  # Nếu cần tra cứu symbol chính xác:
  lsp(action="references", file="src/users/service.ts", line=42, symbol="getUser")
  ```

### 1.2 Chỉnh sửa mã nguồn
- ❌ **KHÔNG NÊN**:
  ```python
  # Đọc sơ sài rồi ghi đè cả file lớn hàng ngàn dòng
  write(path="src/big_file.ts", content="[toàn bộ 2000 dòng file chỉ đổi 1 chữ]")
  # Hoặc edit mà đoán dải dòng bị ẩn (...)
  edit(input="[src/big_file.ts#A1B2]\nPUT 10.=50:\n+...")
  ```
- ✅ **NÊN LÀM**:
  ```python
  # Đọc chính xác dải dòng cần sửa với snapshot hash thực tế
  read(path="src/big_file.ts:40-60")
  # Sau đó dùng line-anchored edit chính xác hoặc block edit
  edit(input="[src/big_file.ts#C3D4]\nPUT 45.=48:\n+    return updatedValue;")
  ```

---

## 2. Anti-Patterns Về Subagent & Concurrency

### 2.1 Ủy quyền kế hoạch
- ❌ **KHÔNG NÊN**:
  ```json
  // Tạo subagent với task mơ hồ để subagent tự loay hoay
  {
    "task": "Nghiên cứu codebase và lên kế hoạch tái cấu trúc authentication."
  }
  ```
- ✅ **NÊN LÀM**:
  ```json
  // Main agent tự phân tích kiến trúc, giao việc rõ ràng với hợp đồng
  {
    "name": "AuthMigration",
    "agent": "task",
    "task": "# Target\n- src/auth/jwt.ts\n# Change\n- Thay thế HS256 bằng RS256 theo interface ITokenSigner\n# Acceptance\n- Token verify trả về đúng claims khi chạy test cục bộ"
  }
  ```

### 2.2 Quản lý tiến trình kiểm thử trong Subagent
- ❌ **KHÔNG NÊN**:
  - Giao 3 subagent chạy song song, mỗi subagent đều tự chạy `npm run build` và `npm test`.
  - Hậu quả: Xung đột file `.cache`, nghẽn CPU, lỗi race condition.
- ✅ **NÊN LÀM**:
  - Trong `context` của batch, ghi rõ: *"Bỏ qua hoàn toàn linter, formatter và project-wide test suite"*.
  - Main agent sau khi thu hồi hết kết quả từ 3 subagent mới chạy build và test một lần duy nhất.

---

## 3. Anti-Patterns Về Kiểm Thử & Nghiệm Thu

### 3.1 Báo cáo hoàn thành không căn cứ
- ❌ **KHÔNG NÊN**:
  - Trả lời: *"Tôi đã sửa xong code theo yêu cầu, mọi thứ trông có vẻ tốt."* (Chưa hề chạy lệnh kiểm tra thực tế nào).
- ✅ **NÊN LÀM**:
  - Chạy smoke test thực tế qua CLI/script và trích xuất kết quả đầu ra:
  ```bash
  # Chạy thử tính năng vừa sửa
  bash(command="node dist/test-runner.js --spec auth")
  ```
  - Báo cáo: *"Đã chạy xác thực với node dist/test-runner.js. Kết quả: 5/5 assertions passed (Exit code 0)."*

### 3.2 Viết test hình thức (Mock Tautology)
- ❌ **KHÔNG NÊN**:
  - Viết test chỉ để mock 1 hàm rồi assert chính hàm mock đó trả về giá trị mock.
- ✅ **NÊN LÀM**:
  - Viết test kiểm tra hành vi biên (edge cases), chuyển đổi trạng thái thực tế và ngoại lệ có thể xảy ra.
