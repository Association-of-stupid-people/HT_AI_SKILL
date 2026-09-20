# Quy Tắc Điều Phối Subagent (Subagent Concurrency & Delegation Rules)

Tập hợp các điều kiện tiên quyết và ràng buộc bất biến (invariants) khi AI ủy quyền công việc cho subagent.

---

## 1. Điều Kiện Kích Hoạt Subagent (Delegation Gates)

### ❌ KHÔNG NÊN:
- Spawn subagent cho những việc đơn lẻ mất 1 bước:
  ```json
  // Lãng phí tài nguyên cho việc đọc 1 file
  task(tasks=[{"task": "Đọc file package.json xem có lodash không"}])
  ```
- Serialize các task độc lập (gọi lần lượt từng subagent một):
  - Chạy task 1 $\rightarrow$ đợi xong $\rightarrow$ chạy task 2 $\rightarrow$ đợi xong.

### ✅ NÊN LÀM:
- Tự làm các tác vụ đọc/sửa nhanh bằng các tool chuyên biệt (`read`, `edit`).
- Fan-out đồng thời tất cả các lát cắt độc lập trong một mảng `tasks[]` duy nhất:
  ```json
  task(
    context="# Goal\nCập nhật đồng thời 2 module độc lập...",
    tasks=[
      {"name": "AuthWorker", "agent": "task", "task": "..."},
      {"name": "PaymentWorker", "agent": "task", "task": "..."}
    ]
  )
  ```

---

## 2. Ranh Giới Ghi File (Write Boundaries)

### ❌ KHÔNG NÊN:
- Giao cùng một file cho nhiều subagent chạy đồng thời:
  ```text
  Worker A: "Thêm hàm validateLogin vào src/shared/utils.ts"
  Worker B: "Thêm hàm formatCurrency vào src/shared/utils.ts"
  --> Gây xung đột git / ghi đè mất code của nhau!
  ```

### ✅ NÊN LÀM:
- Phân định ranh giới sở hữu file dứt khoát:
  ```text
  Worker A: Sở hữu src/auth/**
  Worker B: Sở hữu src/payment/**
  File dùng chung (src/shared/utils.ts): Main agent tự thêm cả 2 hàm trước khi gọi subagent, hoặc xử lý sau khi 2 worker xong.
  ```

---

## 3. Quản Lý Tiến Trình Chờ & Giao Tiếp (Hub & Polling)

### ❌ KHÔNG NÊN:
- Polling liên tục không nghỉ:
  ```python
  # Vòng lặp rỗng gây spam token và CPU
  while not job_done:
      hub(op="jobs")
  ```
- Dùng `read` hoặc `grep` để xem subagent đang làm gì trong các file nháp.

### ✅ NÊN LÀM:
- Để cơ chế async job tự bàn giao khi hoàn tất (auto-delivery).
- Chỉ gọi `hub(op="wait")` khi Main agent hoàn toàn không còn việc gì khác để làm trong turn đó.
- Gửi tin nhắn ngang hàng nếu cần điều phối:
  ```python
  hub(op="send", to="AuthWorker", message="Hàm authenticateUser có nhận thêm tham số tenantId không?")
  ```

---

## 4. Kiểm Chứng Nghiệm Thu (Verification Gate)

### ❌ KHÔNG NÊN:
- Tin tưởng mù quáng vào trạng thái `"completed"` của subagent:
  ```text
  "Subagent AuthWorker đã hoàn thành, do đó tính năng đăng nhập đã xong!"
  ```

### ✅ NÊN LÀM:
- Kiểm tra diff thực tế mà subagent đã tạo:
  ```bash
  # Kiểm tra thay đổi thực tế trên file
  git status -s
  ```
- Chạy kịch bản smoke test thực tế chứng minh code vừa sửa hoạt động đúng.
