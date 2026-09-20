# Bảng Chỉ Mục Skills (Skill Manifest Index)

Bảng tra cứu nhẹ (Manifest) dùng cho Agent runtime. **CHỈ ĐỌC CHI TIẾT KHI GẶP TÌNH HUỐNG TƯƠNG ỨNG.**

---

<skills>
- harness-task-architect: Hướng dẫn phân rã nhiệm vụ và điều phối batch subagent qua `task`. Dùng khi bài toán có từ 2 lát cắt độc lập, hoặc người dùng yêu cầu xử lý song song ("parallel"). Đọc chi tiết: `skills/harness-task-architect/SKILL.md`.
- harness-subagent-master: Ma trận phân loại agent (`scout`, `task`, `sonic`, `reviewer`), ranh giới sở hữu file và giao tiếp ngang hàng qua `hub`. Dùng khi cần giao việc chi tiết cho subagent. Đọc chi tiết: `skills/harness-subagent-master/SKILL.md`.
- harness-code-intelligence: Tra cứu và refactor chuẩn LSP-first, cú pháp AST (`ast_edit`) và phẫu thuật mã nguồn (`PUT N*:`). Dùng khi khảo sát quan hệ symbol hoặc sửa code an toàn. Đọc chi tiết: `skills/harness-code-intelligence/SKILL.md`.
- harness-token-routing: Quy tắc tích hợp CodeGraph, Claude-Mem, RTK và Caveman. Dùng khi cần tối ưu token, tìm giải pháp từ phiên cũ hoặc đọc log nén. Đọc chi tiết: `skills/harness-token-routing/SKILL.md`.
</skills>

---

## Danh Mục Quy Tắc Cốt Lõi (Rules - Chỉ đọc khi đối mặt tình huống cụ thể)
- `rules/01-anti-patterns.md`: Đọc khi chuẩn bị chạy lệnh bash duyệt file hoặc sửa mã nguồn lớn.
- `rules/02-concurrency-rules.md`: Đọc khi cần kiểm tra giới hạn batch, tránh race condition khi phân việc.
- `rules/04-tokenless-ecosystem.md`: Đọc khi chuẩn bị chạy test/build lớn hoặc cần map đồ thị quan hệ bằng CodeGraph.
- `rules/05-task-partitioning.md`: Đọc khi phân vân cách chia task (chia theo tầng ngang hay lát cắt dọc).
