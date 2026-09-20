# Hướng Dẫn Kích Hoạt Dự Án (Project Guidelines)

Tài liệu này được nạp tự động vào Claude Code khi khởi động phiên làm việc.

## 1. Danh Mục Kỹ Năng Tự Động Nạp Khi Cần (On-Demand Skills)
Tham khảo `skills/INDEX.md` để biết chi tiết trigger.
- **Phân rã task song song**: Đọc `skills/harness-task-architect/SKILL.md` khi người dùng yêu cầu xử lý song song hoặc bài toán có nhiều lát cắt độc lập.
- **Điều phối Subagent**: Đọc `skills/harness-subagent-master/SKILL.md` khi cần chỉ định ranh giới file hoặc phân công vai trò agent (`scout`, `task`, `sonic`).
- **Code Intelligence & AST**: Đọc `skills/harness-code-intelligence/SKILL.md` khi cần refactor an toàn, đổi tên symbol hoặc sửa mã phẫu thuật.
- **Tối ưu Token & Bộ nhớ**: Đọc `skills/harness-token-routing/SKILL.md` khi tương tác với CodeGraph, Claude-Mem, RTK và phong cách phản hồi Caveman.

## 2. Nguyên Tắc Bất Biến (Hard Invariants)
- **Không bao giờ đọc trước toàn bộ file**: Chỉ đọc các file kỹ năng khi bài toán thực sự chạm điều kiện kích hoạt.
- **Phong cách Caveman**: Phản hồi súc tích, đi thẳng vào Sự thật kỹ thuật $\rightarrow$ Quyết định $\rightarrow$ Bằng chứng xác thực.
- **Không đoán nội dung bị ẩn**: Tuyệt đối không edit dựa trên dấu chấm lửng `...`.
