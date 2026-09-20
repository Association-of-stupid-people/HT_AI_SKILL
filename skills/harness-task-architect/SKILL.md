---
name: harness-task-architect
description: Hướng dẫn phân rã nhiệm vụ và điều phối batch subagent qua `task`.
triggers:
  - "chạy song song"
  - "parallel"
  - "phân chia task"
  - "chia việc"
---

# Harness Task Architect

Kỹ năng tối ưu hóa việc phân rã nhiệm vụ và điều phối batch subagents thông qua tool `task`.

## 1. Nguyên Tắc Phân Rã
1. **Không giao toàn quyền thiết kế cấp cao cho subagent**: Main agent phải tự phân chia kiến trúc, module hóa ranh giới và xác định interface trước khi phân việc.
2. **Read-only vs Mutation**:
   - Tra cứu, khảo sát mã nguồn, tìm pattern: BẮT BUỘC chỉ định `agent: "scout"`.
   - Viết mã nguồn, sửa lỗi, tích hợp: dùng `task` mặc định hoặc specialist phù hợp.
3. **Bỏ qua kiểm tra diện rộng ở subagent**: Nghiêm cấm chạy full test suite/linter/formatter trong subagent; chỉ chạy xác thực tập trung một lần ở cuối phiên tại Main agent.

## 2. Cấu Trúc Batch Chuẩn

```markdown
# Context Template
# Goal
[Mô tả chính xác đích đến cần đạt được trong batch này]

# Constraints
- Không chạy linter/format/test toàn bộ dự án
- Giữ nguyên các public API không liên quan
- Sử dụng các file/symbol đã quy ước trong hợp đồng

# Contract
- Type definitions: [Đường dẫn file hoặc interface mẫu]
- File boundary: Agent A sở hữu `src/foo/*`, Agent B sở hữu `src/bar/*`
```

```markdown
# Task Template
# Target
- File: [Đường dẫn chính xác]
- Symbols: [Hàm/Class cụ thể]

# Change
- Thêm mới logic xử lý X
- Cập nhật hàm Y để trả về kết quả Z

# Acceptance
- Hàm X trả về đúng kết quả khi chạy kịch bản thử nghiệm cục bộ
- Không thay đổi các file ngoài phạm vi được chỉ định
```
