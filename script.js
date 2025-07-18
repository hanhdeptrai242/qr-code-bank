let bankData;

/**
 * Chụp ảnh thẻ .card và sao chép vào clipboard của người dùng.
 * Sử dụng thư viện dom-to-image và SweetAlert2 để thông báo.
 */
async function captureAndCopyCard() {
    const cardElement = document.getElementById('bankCard');
    if (!cardElement) {
        Swal.fire({
            toast: true, position: 'top-end', icon: 'warning',
            title: 'Không tìm thấy thẻ để chụp!', showConfirmButton: false, timer: 2000
        });
        return;
    }

    // Hiển thị thông báo đang xử lý
    Swal.fire({
        toast: true, position: 'top-end', icon: 'info',
        title: 'Đang xử lý ảnh...', showConfirmButton: false, timer: 1500
    });

    try {
        // Chuyển đổi phần tử DOM thành ảnh PNG dạng dataURL
        const dataUrl = await domtoimage.toPng(cardElement, { 
            quality: 1.0, // Chất lượng cao nhất
        });
        
        // Chuyển dataURL thành Blob để sao chép
        const blob = await fetch(dataUrl).then(res => res.blob());
        const item = new ClipboardItem({ 'image/png': blob });
        
        // Ghi vào clipboard
        await navigator.clipboard.write([item]);
        
        // Thông báo thành công
        Swal.fire({
            toast: true, position: 'top-end', icon: 'success',
            title: 'Đã sao chép ảnh vào clipboard!',
            showConfirmButton: false, timer: 1500, timerProgressBar: true
        });

    } catch (error) {
        console.error('Lỗi khi chụp và sao chép ảnh:', error);
        Swal.fire({
            toast: true, position: 'top-end', icon: 'error',
            title: 'Lỗi!', text: 'Không thể sao chép ảnh.',
            showConfirmButton: false, timer: 2500, timerProgressBar: true
        });
    }
}


/**
 * Tải dữ liệu ngân hàng từ file bank_data.json
 */
async function loadBankData() {
    try {
        const response = await fetch('bank_data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        bankData = await response.json();
        // Sau khi tải xong dữ liệu thì mới phân tích URL để lấy thông tin
        await parseUrlData();
    } catch (error) {
        showError('Lỗi khi tải dữ liệu ngân hàng: ' + error.message);
        console.error('Lỗi tải bank_data.json:', error);
        bankData = {}; // Gán object rỗng để không bị lỗi ở các hàm sau
        await parseUrlData(); // Vẫn chạy để hiển thị dữ liệu mặc định
    }
}

/**
 * Định dạng số thành chuỗi tiền tệ Việt Nam (10000 -> "10.000")
 */
function formatCurrency(amount) {
    if (!amount || isNaN(Number(amount))) return "0";
    return new Intl.NumberFormat('vi-VN').format(amount);
}

/**
 * Phân tích tham số từ URL và cập nhật giao diện.
 */
async function parseUrlData() {
    if (!bankData) return;

    // Lấy các phần tử trên trang
    const bankNameElement = document.getElementById('bankName');
    const accountNameElement = document.getElementById('accountName');
    const accountNumberElement = document.getElementById('accountNumber');
    const qrImageElement = document.getElementById('qrImage');
    const bankLogoElement = document.getElementById('bankLogo');
    const bankCardElement = document.getElementById('bankCard');
    const amountDisplayElement = document.getElementById('amountDisplay');

    // Dữ liệu mặc định
    const defaultBank = "Vietcombank";
    const defaultAccountName = "BUI DUC HANH";
    const defaultAccountNumber = "9966523518";
    const defaultAmount = "0";
    const defaultAddInfo = "Chuyen khoan";

    // Gán giá trị mặc định ban đầu
    let currentBankName = defaultBank;
    let currentAccountName = defaultAccountName;
    let currentAccountNumber = defaultAccountNumber;
    let currentAmount = defaultAmount;
    let currentAddInfo = defaultAddInfo;

    // Phân tích URL để lấy thông tin
    const urlParams = new URLSearchParams(window.location.search);
    const keys = Array.from(urlParams.keys());

    if (keys.length > 0) {
        const urlData = keys[0];
        try {
            const decodedData = decodeURIComponent(urlData);
            const parts = decodedData.split('-');
            
            if (parts.length >= 3) {
                currentBankName = parts[0];
                currentAccountName = parts[1].replace(/\+/g, ' ');
                currentAccountNumber = parts[2];
                if (parts.length >= 4) currentAmount = parts[3];
                if (parts.length >= 5) currentAddInfo = parts.slice(4).join(' ').replace(/\+/g, ' ');
            } else {
                showError('Định dạng URL không hợp lệ.', 'warning');
            }
        } catch (error) {
            showError('Lỗi khi phân tích URL: ' + error.message);
        }
    }
    
    // Cập nhật thông tin văn bản lên thẻ
    bankNameElement.textContent = `Ngân hàng ${currentBankName}`;
    accountNameElement.textContent = currentAccountName;
    accountNumberElement.textContent = currentAccountNumber;
    document.title = `${currentBankName} - ${currentAccountName}`;

    if (currentAmount && Number(currentAmount) > 0) {
        amountDisplayElement.textContent = `${formatCurrency(currentAmount)} VNĐ`;
        amountDisplayElement.style.display = 'block';
    } else {
        amountDisplayElement.style.display = 'none';
    }

    // Cập nhật logo và màu sắc
    const bankInfo = bankData[currentBankName];
    if (bankInfo) {
        bankLogoElement.innerHTML = ''; 
        const logoImg = document.createElement('img');
        logoImg.src = bankInfo.logo;
        logoImg.alt = `${currentBankName} Logo`;
        bankLogoElement.appendChild(logoImg);
        bankCardElement.style.background = `linear-gradient(135deg, ${bankInfo.color} 0%, ${bankInfo.color} 100%)`;
    } else {
        showError(`Không tìm thấy thông tin cho ngân hàng: ${currentBankName}.`, 'warning');
        const defaultBankInfo = bankData[defaultBank] || {};
        bankLogoElement.innerHTML = `<img src="${defaultBankInfo.logo || ''}" alt="${defaultBank} Logo">`;
        bankCardElement.style.background = `linear-gradient(135deg, ${defaultBankInfo.color || '#2E8B57'} 0%, ${defaultBankInfo.color || '#2E8B57'} 100%)`;
    }

    // Tạo URL mới cho mã QR
    const qrUrl = `https://img.vietqr.io/image/${currentBankName}-${currentAccountNumber}-qr_only.jpg?amount=${currentAmount}&addInfo=${encodeURIComponent(currentAddInfo)}`;
    qrImageElement.src = qrUrl;
}

/**
 * Hiển thị thông báo lỗi/cảnh báo/thành công tùy chỉnh
 */
function showError(message, type = 'error') {
    const existingError = document.querySelector('.error-message');
    if (existingError) existingError.remove();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = `error-message ${type}`;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        if (errorDiv.parentNode) errorDiv.parentNode.removeChild(errorDiv);
    }, 4000);
}

// Hàm khởi tạo chính, chạy khi toàn bộ DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    // Bắt đầu quá trình bằng việc tải dữ liệu ngân hàng
    loadBankData();

    // Gán sự kiện click cho nút chụp ảnh
    const captureBtn = document.getElementById('captureButton');
    if (captureBtn) {
        captureBtn.addEventListener('click', captureAndCopyCard);
    }
});
