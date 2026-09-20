# Bảng Tương Thích & Ánh Xạ Chuẩn Agent (Multi-Agent Compatibility & Mapping)

Tài liệu này xác định cách thức bộ skills/rules (`HT_AI_SKILL`) tương thích và ánh xạ vào các agent phổ biến nhất hiện nay: **Claude Code**, **Oh My Pi (OMP)**, **OpenCode**, **Codex**, **Cursor**, **Windsurf**, và **Cline**.

---

## 1. Chuẩn Skill Này Có Phải Chuẩn Chung Không?

👉 **CÓ, ĐÂY CHÍNH LÀ CHUẨN MỞ TIÊU BIỂU (Open Agent Skills Standard).**

Định dạng này dựa trên cấu trúc `SKILL.md` với **YAML Frontmatter** được khởi xướng và hỗ trợ bởi:
- **Anthropic / Claude Code** (`.claude/skills/`, `skills add ...`)
- **Agent Skill Consortium / `npx skills`** (Chạy trên hơn 30+ coding agents: Claude Code, OpenCode, Codex, Cursor, Windsurf, Cline, v.v.)
- **Tokless / Tokscale Pipeline** (Hệ sinh thái công cụ tối ưu ngữ cảnh cho coding agents)

---

## 2. Bảng Ánh Xạ Thư Mục Cài Đặt Cho Từng Agent

Mỗi Agent có một đường dẫn quy ước để tự động nạp danh mục skills theo cơ chế lazy-loading:

| Nền tảng Agent | Vị trí đặt File Skills (`SKILL.md`) | Vị trí đặt Rules / Instructions |
|---|---|---|
| **Claude Code** | `.claude/skills/<skill-name>/SKILL.md` | `CLAUDE.md` hoặc `.claude/rules/*.md` |
| **Oh My Pi (OMP)** | `~/.omp/skills/<skill-name>/SKILL.md` hoặc local `skills/` | `~/.omp/rules/` hoặc system prompt |
| **OpenCode** | `.opencode/skills/<skill-name>/SKILL.md` | `OPENCODE.md` hoặc `.opencode/rules/` |
| **Codex (OpenAI)** | `.codex/skills/` hoặc root instructions | `AGENTS.md` |
| **Cursor** | `.cursor/rules/*.mdc` (chuyển đổi từ SKILL.md) | `.cursorrules` |
| **Windsurf** | `.windsurfrules` | `.windsurfrules` |
| **Cline** | `.clinerules` | `.clinerules` |

---

## 3. Điểm Giống Nhau & Khác Biệt Giữa Các Agent

### 3.1 Điểm Giống Nhau (Universal - Áp dụng 100%)
1. **Nguyên lý 2 tầng (Progressive Disclosure)**:
   - Tất cả các agent đều chỉ đọc bảng tóm tắt trước (`INDEX.md` hoặc frontmatter `description`).
   - Khi prompt người dùng kích hoạt từ khóa (`triggers`), agent mới gọi tool `read` hoặc `fetch` file chi tiết.
2. **Quy tắc phân chia tác vụ & Tokenless**:
   - Các rule như `01-anti-patterns.md`, `04-tokenless-ecosystem.md`, `05-task-partitioning.md` (Domain slicing, Caveman brevity, RTK filtering, CodeGraph) có giá trị tuyệt đối trên mọi LLM (Claude 3.5 Sonnet, GPT-4o, Gemini 1.5 Pro).

### 3.2 Điểm Khác Biệt Cần Lưu Ý (Tool-Level Differences)
- **Harness-Specific Tools**: Các hàm như `task(tasks=[...])`, `hub(op="start")`, `ast_edit` thuộc về các harness hỗ trợ multi-agent/DAP nâng cao như **Oh My Pi / Advanced Tool Harnesses**.
- **Claude Code Native**: Claude Code sử dụng `Bash`, `Edit`, `Read`, `Grep`, `Glob` và các MCP servers (như `codegraph_explore`).
- Khi chạy trên Claude Code, subagent fanning-out được thay thế bằng lệnh gọi plugin hoặc quy trình chạy lệnh song song trong terminal.
