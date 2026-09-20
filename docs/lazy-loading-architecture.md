# Hướng Dẫn Kỹ Thuật: Cơ Chế Nhúng Skill Theo Nhu Cầu (Lazy-Loading Skills)

## 1. Vấn Đề Của Cách Nhúng Cũ (Greedy Loading)
Nếu nhúng toàn bộ nội dung file `.md` vào system prompt hoặc bắt agent đọc mọi file ngay từ đầu:
- ❌ **Lãng phí Context Window**: Tiêu tốn hàng nghìn tokens vô ích ngay cả khi người dùng chỉ hỏi câu đơn giản.
- ❌ **Loãng Ngữ Cảnh (Context Dilution)**: Quá nhiều quy tắc không liên quan khiến mô hình dễ bị lẫn lộn, quên chỉ dẫn chính.
- ❌ **Chi Phí Cao & Chậm Chạp**: Tăng thời gian suy luận (TTFT - Time To First Token).

---

## 2. Chuẩn Nhúng 2 Tầng Tối Ưu (Two-Tier Progressive Disclosure)

Chuẩn tối ưu nhất cho AI Agent Harness là **Progressive Disclosure** (Tiết lộ thông tin lũy tiến):

### Tầng 1: Manifest Tinh Gọn (Chỉ chiếm ~20-30 tokens mỗi skill)
Được đặt ở System Prompt / Index khởi động. Chỉ gồm: **Tên skill**, **Mục đích** và **Điều kiện kích hoạt (Trigger condition)**.

```xml
<skills>
- harness-task-architect: Phân rã bài toán phức tạp và điều phối batch subagent qua `task`. Dùng khi có từ 2 lát cắt độc lập hoặc người dùng yêu cầu xử lý song song.
- harness-subagent-master: Ma trận phân loại agent (`scout`, `task`, `sonic`, `reviewer`), ranh giới sở hữu file và giao tiếp ngang hàng qua `hub`. Dùng khi cần giao việc chuyên sâu cho subagent.
- harness-code-intelligence: Tra cứu và refactor chuẩn LSP-first, cú pháp AST (`ast_edit`) và phẫu thuật mã nguồn (`PUT N*:`). Dùng khi khảo sát quan hệ symbol hoặc sửa code an toàn.
- harness-token-routing: Quy tắc tích hợp CodeGraph, Claude-Mem, RTK và Caveman. Dùng khi cần tối ưu token, tìm giải pháp từ phiên cũ hoặc đọc log nén.
</skills>
```

### Tầng 2: Nội Dung Chi Tiết (Chỉ đọc khi thỏa mãn trigger)
Khi và CHỈ KHI bài toán của người dùng chạm đúng **Trigger condition**, Agent mới thực hiện lệnh đọc tài liệu thông qua URI nội bộ:
$$\text{Trigger Hit} \longrightarrow \text{Tool Call: } \texttt{read(path="skill://<name>")}$$

---

## 3. Cấu Trúc File Chuẩn Của Từng Skill (`SKILL.md`)

Mỗi file `SKILL.md` phải có phần **Frontmatter (Metadata)** rõ ràng ở đầu file:

```markdown
---
name: harness-task-architect
description: Hướng dẫn phân rã nhiệm vụ và điều phối đa subagent song song.
triggers:
  - "chạy song song"
  - "parallel"
  - "phân chia task"
  - "tạo subagent"
---

# Harness Task Architect
... (Nội dung chi tiết chỉ được tải khi agent gọi đọc) ...
```

---

## 4. Cách Tích Hợp Vào Cấu Trúc Dự Án Hiện Tại

1. File **`skills/INDEX.md`** đóng vai trò là bảng tra cứu (Routing Catalog).
2. Khi agent khởi động, agent **chỉ cần đọc duy nhất file `skills/INDEX.md`**.
3. Các file chi tiết bên trong `skills/**` hoặc `rules/**` **chỉ được đọc khi agent tự thấy cần thiết**.
