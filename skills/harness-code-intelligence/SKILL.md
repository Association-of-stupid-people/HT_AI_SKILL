---
name: harness-code-intelligence
description: Tra cứu và refactor chuẩn LSP-first, cú pháp AST (`ast_edit`) và phẫu thuật mã nguồn (`PUT N*:`).
triggers:
  - "rename"
  - "tìm hàm"
  - "references"
  - "ast_edit"
  - "sửa code"
---

# Harness Code Intelligence

Kỹ năng điều hướng, tra cứu và chỉnh sửa mã nguồn thông minh, ưu tiên cấu trúc AST và Language Server Protocol (LSP).

---

## 1. Tra Cứu & Điều Hướng Symbol

### ❌ KHÔNG NÊN LÀM:
- Dùng regex text search để tìm nơi gọi hàm hoặc đổi tên biến:
  ```python
  # Nguy cơ bỏ sót các callsite khác file hoặc match nhầm tên biến trong comment/string
  grep(pattern="processPayment", path="src")
  ```
- Mở toàn bộ file 3000 dòng để cuộn tìm vị trí khai báo hàm.

### ✅ NÊN LÀM:
- Sử dụng LSP để phân tích ngữ nghĩa chính xác:
  ```json
  // Tìm tất cả nơi gọi hàm chính xác dựa trên AST
  lsp(action="references", file="src/billing/service.ts", line=35, symbol="processPayment")
  
  // Đổi tên đồng loạt trên toàn bộ codebase an toàn tuyệt đối
  lsp(action="rename", file="src/billing/service.ts", line=35, symbol="processPayment", new_name="executePayment")
  ```

---

## 2. Kỹ Thuật Chỉnh Sửa Mã Nguồn (Line-Anchored & AST Edit)

### ❌ KHÔNG NÊN LÀM:
- Ghi đè cả file lớn:
  ```python
  write(path="src/big_handler.ts", content="[2000 dòng code mới]")
  ```
- Dùng `edit` nhưng truyền dải dòng không hiển thị hoặc đoán mò nội dung bị lược bớt (`...`).

### ✅ NÊN LÀM:
- Sửa phẫu thuật (surgical edit) với block operator `PUT N*:`:
  ```text
  [src/big_handler.ts#D4E5]
  PUT 120*:
  +function calculateTotal(items: CartItem[]): number {
  +    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  +}
  ```
- Với các thay đổi cú pháp lặp lại quy mô lớn (codemod): Dùng `ast_edit` với metavariables (`$A`, `$$$ARGS`).
