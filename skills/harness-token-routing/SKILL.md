---
name: harness-token-routing
description: Quy tắc tích hợp CodeGraph, Claude-Mem, RTK và Caveman.
triggers:
  - "tiết kiệm token"
  - "codegraph"
  - "claude-mem"
  - "rtk"
  - "caveman"
---

# Harness Token Routing

Kỹ năng điều hướng tác vụ thông minh tới 4 công cụ tối ưu hóa token và trí nhớ: **CodeGraph**, **Claude-Mem**, **RTK**, và **Caveman**.

---

## 1. Điều Hướng Đồ Thị & Trí Nhớ (CodeGraph & Mem)

### ❌ KHÔNG NÊN LÀM:
- Chạy khắp codebase đọc từng thư mục để vẽ sơ đồ kiến trúc bằng tay.
- Bỏ qua kho dữ liệu trí nhớ, bắt đầu từ con số 0 với các lỗi cấu hình phức tạp đã gặp nhiều lần.

### ✅ NÊN LÀM:
- Luôn kiểm tra trí nhớ trước:
  ```python
  # Tìm kiếm trong memory xem giải pháp đã có từ trước chưa
  task(tasks=[{"agent": "scout", "task": "Search claude-mem for docker build cache issues"}])
  ```
- Dùng CodeGraph để truy xuất nhanh quan hệ đồ thị mã nguồn (ai gọi ai, file nào bị ảnh hưởng trực tiếp) trước khi can thiệp.

---

## 2. Quản Lý Đầu Ra CLI & Phong Cách Phản Hồi (RTK & Caveman)

### ❌ KHÔNG NÊN LÀM:
- Để terminal in toàn bộ raw log khổng lồ làm phình to context window.
- Trả lời người dùng bằng các đoạn văn mở đầu rườm rà, lặp lại câu hỏi của họ hoặc cảm ơn thừa thãi.

### ✅ NÊN LÀM:
- Để hook RTK lọc và nén log lệnh tự động (giữ lại stack trace và mã lỗi quan trọng).
- Trả lời theo phong cách Caveman: Ngắn gọn, tập trung vào Sự thật $\rightarrow$ Quyết định $\rightarrow$ Rủi ro $\rightarrow$ Bằng chứng xác thực.
