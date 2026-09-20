# HT_AI_SKILL (Harness AI Skills & Agent Routing)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Platform](https://img.shields.io/badge/Agents-Claude%20Code%20%7C%20Oh%20My%20Pi%20%7C%20Codex%20%7C%20Cursor-blue)](https://github.com/Association-of-stupid-people/HT_AI_SKILL)

Bộ kỹ năng (Skills), quy tắc (Rules) và kịch bản phân rã tác vụ chuẩn mã nguồn mở, tối ưu hóa toàn diện cho các hệ thống AI Agent Harness: **Claude Code**, **Oh My Pi (OMP)**, **Codex**, **OpenCode**, và **Cursor**.

---

## 📦 Cài Đặt (Quick Installation)

### Cách 1: Cài đặt tự động qua 1 dòng lệnh (Khuyên dùng)

**macOS / Linux:**
```bash
curl -fsSL https://raw.githubusercontent.com/Association-of-stupid-people/HT_AI_SKILL/main/scripts/install.sh | bash
```

**Windows (PowerShell):**
```powershell
irm https://raw.githubusercontent.com/Association-of-stupid-people/HT_AI_SKILL/main/scripts/install.ps1 | iex
```

---

### Cách 2: Dùng Node / npx

Chạy trực tiếp từ repository mà không cần clone:
```bash
npx https://github.com/Association-of-stupid-people/HT_AI_SKILL.git
```

Hoặc thêm trực tiếp thông qua trình quản lý skills mở:
```bash
npx skills add Association-of-stupid-people/HT_AI_SKILL
```

---

### Cách 3: Cài đặt thủ công (Manual Setup)

Sao chép thư mục `skills/` vào thư mục cấu hình của Agent tương ứng:

- **Claude Code**: Sao chép vào `.claude/skills/` hoặc `~/.claude/skills/`
- **Oh My Pi (OMP)**: Sao chép vào `~/.omp/skills/`
- **Cursor**: Sao chép vào `.cursor/rules/`
- **Codex / Universal**: Sao chép vào `.agent/skills/` và khai báo trong `AGENTS.md`

---

## 🏗️ Cấu Trúc Dự Án Chuẩn Mã Nguồn Mở

```text
HT_AI_SKILL/
├── bin/
│   └── install.js                     # CLI installer tự động phát hiện môi trường agent
├── scripts/
│   ├── install.sh                     # Trình cài đặt 1-line cho macOS/Linux
│   └── install.ps1                    # Trình cài đặt 1-line cho Windows PowerShell
├── package.json                       # npm / npx metadata
├── CLAUDE.md                          # Tự động nạp vào Claude Code
├── AGENTS.md                          # Tự động nạp vào Codex / Universal Agents
├── docs/                              # Tài liệu kiến trúc chuyên sâu
│   ├── lazy-loading-architecture.md   # Cơ chế nạp tiến bộ (Progressive Disclosure)
│   └── multi-agent-compatibility.md   # Bảng ánh xạ các nền tảng agent
├── skills/                            # Lõi Kỹ Năng (Core Skills - Lazy Loaded)
│   ├── INDEX.md                       # Manifest định tuyến nhanh (Tầng 1)
│   ├── harness-task-architect/        # Phân rã nhiệm vụ & điều phối subagent song song
│   │   └── SKILL.md
│   ├── harness-subagent-master/       # Ma trận phân loại agent & ranh giới file
│   │   └── SKILL.md
│   ├── harness-code-intelligence/     # LSP-first, AST refactoring & surgical edit
│   │   └── SKILL.md
│   └── harness-token-routing/         # Tích hợp CodeGraph, Claude-Mem, RTK, Caveman
│       └── SKILL.md
└── rules/                             # Các Quy Tắc Bất Biến (Hard Invariants)
    ├── 01-anti-patterns.md            # Các bẫy hành vi sai lầm & cách tránh
    ├── 02-concurrency-rules.md        # Giới hạn batch & an toàn song song
    ├── 04-tokenless-ecosystem.md      # Quy tắc nén token và lọc log
    └── 05-task-partitioning.md        # Nguyên tắc phân chia lát cắt dọc (Vertical Slicing)
```

---

## ⚡ Cơ Chế Hoạt Động (Progressive Disclosure)

Để tránh lãng phí context token, hệ thống sử dụng cơ chế nạp tiến bộ 2 tầng:
1. **Tầng 1 (Manifest)**: Chỉ nạp bảng tóm tắt `skills/INDEX.md` (~50 tokens) vào System Prompt để agent biết khi nào cần kỹ năng nào.
2. **Tầng 2 (On-Demand Loading)**: Agent chỉ thực hiện lệnh đọc chi tiết file `SKILL.md` hoặc `rules/*.md` khi bài toán người dùng thực sự kích hoạt từ khóa (`triggers`).

---

## 🤝 Đóng Góp & Giấy Phép
Dự án được phát hành theo giấy phép [MIT](LICENSE). Mọi đóng góp mở rộng skill cho các agent harnesses mới đều được hoan nghênh!
