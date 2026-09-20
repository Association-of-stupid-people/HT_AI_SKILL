# Quy Tắc Phân Chia Task Theo Từng Subagent (Task Partitioning & Allocation Rules)

Tài liệu này xác lập các nguyên tắc và ví dụ Nên/Không nên làm khi phân rã nhiệm vụ cho subagent.

---

## 1. Phân Chia Lát Cắt (Vertical vs Horizontal Partitioning)

### ❌ KHÔNG NÊN LÀM:
Phân chia theo tầng kỹ thuật ngang (Horizontal Layering):
```json
{
  "tasks": [
    {
      "name": "TypeCreator",
      "task": "Tạo interface User, Product, Order trong src/types/index.ts"
    },
    {
      "name": "ServiceCreator",
      "task": "Dùng interface từ src/types/index.ts để viết UserService, ProductService"
    }
  ]
}
```
*Vấn đề*: `ServiceCreator` bị phụ thuộc cứng vào file `index.ts` mà `TypeCreator` đang sửa, gây race condition và lỗi compile.

### ✅ NÊN LÀM:
Phân chia theo lát cắt dọc độc lập theo Domain (Vertical Slicing):
```json
{
  "context": "# Goal\nTriển khai User và Product domain\n# Contract\nsrc/types/base.ts (Read-only ID & Timestamp)",
  "tasks": [
    {
      "name": "UserDomainWorker",
      "task": "# Target\n- src/user/**\n# Change\n- Triển khai types, repository và service cho User\n# Acceptance\n- File src/user/service.ts pass type-check"
    },
    {
      "name": "ProductDomainWorker",
      "task": "# Target\n- src/product/**\n# Change\n- Triển khai types, repository và service cho Product\n# Acceptance\n- File src/product/service.ts pass type-check"
    }
  ]
}
```
*Lợi ích*: 2 agent chạy song song 100% không chạm vào file của nhau.

---

## 2. Định Nghĩa Tiêu Chí Nghiệm Thu (Acceptance Criteria)

### ❌ KHÔNG NÊN LÀM:
Giao task với tiêu chí chung chung, mơ hồ:
```markdown
# Acceptance
- Làm cho code chạy tốt và sạch sẽ.
- Sửa hết tất cả các lỗi có thể có.
- Tự kiểm tra lại xem ổn chưa.
```

### ✅ NÊN LÀM:
Tiêu chí nghiệm thu cụ thể, đo lường được:
```markdown
# Acceptance
- Hàm `hashPassword()` trả về chuỗi bcrypt hợp lệ độ dài 60 ký tự.
- Chạy file kiểm thử độc lập: `node tests/auth/hash.test.js` trả về Exit code 0.
- Không sửa bất kỳ file nào ngoài `src/auth/crypto.ts`.
```

---

## 3. Chỉ Thị Kiểm Thử & Linter (Testing & Linting Directives)

### ❌ KHÔNG NÊN LÀM:
Không nhắc nhở về phạm vi kiểm thử, dẫn đến việc subagent tự ý kích hoạt build toàn hệ thống:
```markdown
# Task
- Thêm thuộc tính `avatarUrl` vào User.
(Agent tự động chạy `npm test` toàn bộ 500 bài test của dự án, làm treo tiến trình).
```

### ✅ NÊN LÀM:
Ràng buộc chặt chẽ trong `# Constraints`:
```markdown
# Constraints
- TUYỆT ĐỐI KHÔNG chạy linter/formatter (eslint, prettier) hoặc full test suite (npm test).
- Chỉ kiểm tra cú pháp file vừa sửa hoặc chạy file test đơn lẻ của module.
- Việc tích hợp và test toàn hệ thống sẽ do Main Agent đảm nhiệm sau cùng.
```
