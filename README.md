# Bộ Skills Tối Ưu Hóa Tương Tác Với Harness (Oh My Pi / AI Agent Harness)

Kho lưu trữ này cung cấp bộ kỹ năng (skills), quy tắc (rules), và prompt patterns chuẩn hóa giúp AI tận dụng tối đa năng lực của agent harness: điều phối subagent (`task`), giao tiếp ngang hàng/tiến trình (`hub`), code intelligence (`lsp`, `ast_edit`), và vòng lặp thực thi tự động.

---

## 1. Cấu Trúc Thư Mục Chuẩn

```text
HT_AI_SKILL/
├── README.md                          # Tổng quan, hướng dẫn cài đặt và tích hợp
├── docs/                              # Tài liệu kiến trúc & hướng dẫn tích hợp
│   ├── lazy-loading-architecture.md   # Cơ chế nhúng tiến bộ (Progressive Disclosure)
│   └── multi-agent-compatibility.md   # Bảng ánh xạ cho Claude Code, Codex, Cursor, Cline
├── CLAUDE.md                          # File nạp tự động cho Claude Code
├── AGENTS.md                          # File nạp tự động cho Codex & Universal Agents
├── skills/                            # Các skill kích hoạt theo ngữ cảnh
│   ├── INDEX.md                       # Manifest tinh gọn chứa danh mục & trigger
│   ├── harness-task-architect/        # Phân rã nhiệm vụ & điều phối subagent song song
│   │   ├── SKILL.md                   # Chỉ dẫn kích hoạt và quy tắc thực thi
│   │   └── prompts/
│   │       └── task-decomposition.md  # Template phân tách context, contracts và task units
│   ├── harness-subagent-master/       # Chuyên sâu về phân công, giám sát & thu hồi subagent
│   │   └── SKILL.md                   # Agent typing, ma trận vai trò, template fanning-out
│   ├── harness-hub-orchestrator/      # Quản lý tiến trình nền, workers & peer messaging
│   │   ├── SKILL.md
│   │   └── workflows/
│   │       ├── process-lifecycle.md   # Khởi chạy, readiness check, logs & graceful shutdown
│   │       └── peer-coordination.md   # Giao tiếp IRC giữa các subagent
│   ├── harness-code-intelligence/     # Tối ưu hóa đọc & sửa mã nguồn
│   │   ├── SKILL.md
│   │   └── recipes/
│   │       ├── lsp-first.md           # Điều hướng & refactor qua LSP thay vì text search
│   │       ├── ast-rewrite.md         # Quy tắc codemod an toàn qua AST pattern
│   │       └── surgical-edit.md       # Kỹ thuật dùng line-anchored edit chính xác
│   ├── harness-token-routing/         # Điều hướng công cụ tối ưu token (CodeGraph, RTK, Mem, Caveman)
│   │   └── SKILL.md                   # Chu trình 4 pha nén token và kịch bản kích hoạt
│   └── harness-verification-loop/     # Kiểm thử chứng minh & đóng gói bàn giao
│       ├── SKILL.md
│       └── checks/
│           ├── smoke-test-patterns.md # Kiểm thử thực tế (CLI, API, UI headless)
│           └── completion-gate.md     # Checklist nghiệm thu trước khi kết thúc turn
├── rules/                             # Các quy tắc nền tảng nạp vào runtime
│   ├── 01-anti-patterns.md            # Các lỗi AI thường gặp và cách chặn
│   ├── 02-concurrency-rules.md        # Ràng buộc chạy song song (batch cap, non-overlapping)
│   ├── 03-verification-standards.md   # Tiêu chuẩn bằng chứng thực thi (deliverable proof)
│   ├── 04-tokenless-ecosystem.md      # Quy tắc phối hợp CodeGraph, Claude-Mem, RTK, Caveman
│   └── 05-task-partitioning.md        # Nguyên tắc phân rã task lát cắt dọc & biên giới sở hữu
└── templates/                         # Mẫu output & contracts dùng chung
    ├── task-batch.json                # Schema mẫu khi gọi function `task`
    └── verification-report.md         # Template báo cáo bằng chứng nghiệm thu
```

---

## 2. Chi Tiết Các Kỹ Năng Cốt Lõi (Core Skills)

### 2.1 `harness-task-architect`
* **Mục tiêu:** Hướng dẫn AI cách phân rã bài toán phức tạp thành các đơn vị độc lập để chạy đa agent qua `task`.
* **Trọng tâm:**
  - Định dạng chuẩn: `# Goal`, `# Constraints`, `# Contract` trong `context`.
  - Phân bổ đúng agent type (`scout` cho việc đọc/tra cứu, `task` cho triển khai).
  - Khử phụ thuộc: không validate/lint giữa chừng để tránh xung đột mã nguồn.

### 2.2 `harness-hub-orchestrator`
* **Mục tiêu:** Kiểm soát tiến trình dài hạn (`hub` với `op: "start"`, `ps`, `logs`, `wait`) và điều phối giao tiếp giữa các worker.
* **Trọng tâm:**
  - Thiết lập readiness condition chính xác (regex log + TCP port).
  - Quản lý lifecycle: dọn dẹp tiến trình, tránh rò rỉ process nền.
  - Sử dụng hub messaging thay vì polling lãng phí token.

### 2.3 `harness-code-intelligence`
* **Mục tiêu:** Chặn hành vi grep/sửa chay bằng text khi đã có công cụ chuyên sâu.
* **Trọng tâm:**
  - Quy tắc **LSP-first**: luôn tra cứu `definition`, `references`, `rename` qua LSP.
  - Sử dụng `ast_edit` khi thay đổi cú pháp diện rộng.
  - Dùng line-anchored `edit` với block operator (`PUT N*:`) thay vì viết đè toàn bộ file.

### 2.4 `harness-verification-loop`
* **Mục tiêu:** Đảm bảo AI luôn có bằng chứng chạy thật trước khi nghiệm thu.
* **Trọng tâm:**
  - Smoke test thực thi trực tiếp, không phụ thuộc vào unit test tự bịa.
  - Xác thực giao diện hoặc CLI output thực tế.
