---
name: harness-subagent-master
description: Ma trận phân loại agent (`scout`, `task`, `sonic`, `reviewer`), ranh giới sở hữu file và giao tiếp ngang hàng qua `hub`.
triggers:
  - "subagent"
  - "giao việc"
  - "scout"
  - "điều phối agent"
---

# Harness Subagent Master

Kỹ năng chuyên sâu về phân công, giám sát và thu hồi kết quả từ các subagents qua tool `task` và `hub`.

---

## 1. Phân Bổ Agent Type (Agent Typing)

### ❌ KHÔNG NÊN LÀM:
- Chỉ định `agent: "scout"` nhưng lại yêu cầu sửa mã nguồn:
  ```json
  {
    "agent": "scout",
    "task": "Tìm lỗi bug trong src/auth.ts và sửa lại giúp tôi"
  }
  ```
  *(Scout là read-only model, sẽ thất bại hoặc không thể thực hiện lệnh ghi)*.
- Giao task cơ học (đổi tên biến trên 50 file) cho agent model lớn tốn kém.

### ✅ NÊN LÀM:
- Phân luồng chính xác:
  ```json
  // Bước 1: Dùng scout khảo sát nhanh
  {"agent": "scout", "task": "Khảo sát các file phụ thuộc vào interface IUserService"}

  // Bước 2: Dùng task hoặc sonic để sửa đổi
  {"agent": "task", "task": "Cập nhật logic implement trong src/users/service.ts"}
  ```

---

## 2. Quản Lý Giao Tiếp Ngang Hàng Giữa Các Subagents

### ❌ KHÔNG NÊN LÀM:
- Để 2 subagent chạy ngầm tự đoán ý nhau hoặc cố tình can thiệp vào tiến trình của nhau.
- Main agent gọi kiểm tra dồn dập trong khi các worker đang xử lý logic nặng.

### ✅ NÊN LÀM:
- Thiết lập kênh trao đổi thông điệp trực tiếp qua IRC `hub`:
  ```python
  # Subagent WorkerAuth gửi sang WorkerBilling
  hub(op="send", to="WorkerBilling", message="Auth token đã đổi sang format Bearer, hãy cập nhật header bên Billing.")
  ```
- Main agent tôn trọng cơ chế `auto-delivery` của hệ thống harness.
