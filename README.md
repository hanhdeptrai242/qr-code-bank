# 💳 Thẻ Thông Tin Chuyển Khoản Động

Đây là một công cụ web đơn giản giúp bạn tạo nhanh một thẻ thông tin chuyển khoản chuyên nghiệp và đẹp mắt. Tất cả thông tin như ngân hàng, tên chủ khoản, số tài khoản, số tiền và nội dung chuyển khoản đều được lấy động từ tham số trên URL.

Công cụ sẽ tự động tạo mã QR theo chuẩn VietQR và cho phép người dùng chụp lại hình ảnh thẻ thông tin này để sao chép vào clipboard chỉ với một cú nhấp chuột, cực kỳ tiện lợi để gửi cho người khác.

[**➡️ Xem Demo Trực Tiếp ⬅️**](https://hanhdeptrai242.github.io/qr-code-bank/?Vietcombank-BUI%20DUC%20HANH-9966523518-100000-gui%20tang%20ban%20ly%20cafe)

---

### 🖼️ Giao diện

<img src="https://d3tx3wg2jy0sui.cloudfront.net/2bf0a34e7fc448a6b15166df2af27c26.png" alt="Giao diện thẻ thông tin chuyển khoản"/>

---

### ✨ Tính Năng Nổi Bật

*   **Tạo thẻ động từ URL:** Không cần sửa code, chỉ cần thay đổi URL là bạn có ngay một thẻ thông tin mới.
*   **Tự động nhận diện Logo & Màu sắc:** Công cụ tự lấy logo và màu sắc đặc trưng của hơn 25+ ngân hàng từ file `bank_data.json`.
*   **Hỗ trợ hiển thị số tiền & nội dung:** Mã QR được tạo ra đã bao gồm sẵn số tiền và nội dung chuyển khoản, giúp người chuyển không cần nhập lại.
*   **📸 Chụp và Sao chép ảnh:** Chỉ cần một cú nhấp chuột vào nút "Chụp ảnh", toàn bộ thẻ thông tin sẽ được chuyển thành ảnh và sao chép vào clipboard.
*   **📱 Thiết kế Responsive:** Giao diện hiển thị tốt trên cả máy tính và thiết bị di động.
*   **🔧 Dễ dàng tùy chỉnh:** Bạn có thể dễ dàng thêm ngân hàng mới bằng cách cập nhật file `bank_data.json`.

---

### 🚀 Cách Sử Dụng

Bạn chỉ cần tạo một URL theo cấu trúc dưới đây và truy cập nó.

#### Cấu trúc URL:

```
https://hanhdeptrai242.github.io/qr-code-bank/?{TEN_NGAN_HANG}-{TEN_CHU_KHOAN}-{SO_TAI_KHOAN}-{SO_TIEN}-{NOI_DUNG}
```

**Trong đó:**

*   `{TEN_NGAN_HANG}`: Mã ngân hàng viết liền không dấu. **Xem danh sách mã được hỗ trợ ở bảng bên dưới.**
*   `{TEN_CHU_KHOAN}`: Tên chủ tài khoản. **Dùng dấu `+` để thay cho khoảng trắng**. (ví dụ: `NGUYEN+VAN+A`).
*   `{SO_TAI_KHOAN}`: Số tài khoản ngân hàng.
*   `{SO_TIEN}`: (Tùy chọn) Số tiền cần chuyển. Nếu không có, mặc định là 0.
*   `{NOI_DUNG}`: (Tùy chọn) Nội dung chuyển khoản. Dùng dấu `+` thay cho khoảng trắng.

#### Ví dụ:

URL để tạo thẻ cho **BUI DUC HANH**, ngân hàng **Vietcombank**, STK **9966523518**, số tiền **100,000 VNĐ** với nội dung "gui tang ban ly cafe":

```
https://hanhdeptrai242.github.io/qr-code-bank/?Vietcombank-BUI+DUC+HANH-9966523518-100000-gui+tang+ban+ly+cafe
```

---

### 🏦 Danh Sách Ngân Hàng Được Hỗ Trợ

Dưới đây là danh sách các mã ngân hàng bạn cần sử dụng trong tham số `TEN_NGAN_HANG` của URL.

| STT | Tên Ngân Hàng | Giá trị sử dụng trong URL |
|:---:|:---|:---|
| 1 | Ngân hàng TMCP Quân đội | `MBBank` |
| 2 | Ngân hàng TMCP Ngoại thương Việt Nam | `Vietcombank` |
| 3 | Ngân hàng TMCP Kỹ thương Việt Nam | `Techcombank` |
| 4 | Ngân hàng TMCP Đầu tư và Phát triển Việt Nam | `BIDV` |
| 5 | Ngân hàng TMCP Công Thương Việt Nam | `VietinBank` |
| 6 | Ngân hàng TMCP Á Châu | `ACB` |
| 7 | Ngân hàng TMCP Tiên Phong | `TPBank` |
| 8 | Ngân hàng TMCP Việt Nam Thịnh Vượng | `VPBank` |
| 9 | Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam | `Agribank` |
| 10 | Ngân hàng TMCP Hàng hải Việt Nam | `MSB` |
| 11 | Ngân hàng TMCP Phương Đông | `OCB` |
| 12 | Ngân hàng TMCP Kiên Long | `KienlongBank` |
| 13 | Ngân hàng TMCP Xuất Nhập khẩu Việt Nam | `Eximbank` |
| 14 | Ngân hàng TMCP Phát triển Thành phố Hồ Chí Minh | `HDBank` |
| 15 | Ngân hàng TMCP Sài Gòn Thương Tín | `Sacombank` |
| 16 | Ngân hàng TMCP Quốc tế Việt Nam | `VIB` |
| 17 | Ngân hàng TMCP An Bình | `ABBANK` |
| 18 | Ngân hàng Bưu điện Liên Việt | `LPBank` |
| 19 | Ngân hàng TMCP Bắc Á | `BacABank` |
| 20 | Ngân hàng TMCP Đông Nam Á | `SeABank` |
| 21 | Ngân hàng TMCP Sài Gòn - Hà Nội | `SHB` |
| 22 | Ngân hàng TMCP Quốc Dân | `NCB` |
| 23 | Ngân hàng TNHH MTV Woori Việt Nam | `WooriBank` |
| 24 | Ngân hàng TMCP Việt Á | `VietABank` |
| 25 | Ngân hàng TMCP Việt Nam Thương Tín | `VietBank` |
| 26 | Ngân hàng TMCP Nam Á | `NamABank` |
| 27 | Ngân hàng TMCP Dầu Khí Toàn Cầu | `PGBank` |
| 28 | Ngân hàng TNHH MTV Public Việt Nam | `PublicBank` |

---

### 🛠️ Cài Đặt và Tùy Chỉnh

Nếu bạn muốn chạy dự án này trên máy của mình hoặc tùy chỉnh thêm:

1.  **Clone repository:**
    ```bash
    git clone https://github.com/hanhdeptrai242/qr-code-bank.git
    ```
2.  **Thêm ngân hàng mới:**
    Mở file `bank_data.json` và thêm một đối tượng mới với cấu trúc:
    ```json
    {
      "MA_NGAN_HANG": {
        "logo": "img/ten_logo.png",
        "color": "#maumotsac"
      }
    }
    ```
3.  **Chạy dự án:**
    Chỉ cần mở file `index.html` bằng trình duyệt. Để có trải nghiệm tốt nhất, bạn nên sử dụng một server ảo (ví dụ: extension "Live Server" trên VSCode).

---

### 💻 Công Nghệ Sử Dụng

*   **HTML5**
*   **CSS3**
*   **JavaScript (ES6+)**
*   **[dom-to-image.js](https://github.com/tsayen/dom-to-image):** Thư viện giúp chuyển đổi một node DOM thành hình ảnh.
*   **[SweetAlert2](https://sweetalert2.github.io/):** Thư viện tạo các thông báo pop-up đẹp mắt.

---

### 🙏 Lời Cảm Ơn

*   Cảm ơn [vietqr.io](https://vietqr.io/) đã cung cấp API tạo mã QR miễn phí và tiện lợi.
*   Cảm ơn các tác giả của thư viện `dom-to-image` và `SweetAlert2`.
