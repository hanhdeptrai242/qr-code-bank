// script.js

let bankData = {};

// Cấu hình mặc định nếu không có dữ liệu
const DEFAULT = {
    bank: "Vietcombank",
    name: "BUI DUC HANH",
    number: "9966523518",
    amount: "0",
    content: ""
};

// Lấy các thẻ HTML cần thiết
const elements = {
    bankName: document.getElementById('bankName'),
    accountName: document.getElementById('accountName'),
    accountNumber: document.getElementById('accountNumber'),
    qrImage: document.getElementById('qrImage'),
    bankLogo: document.getElementById('bankLogo'),
    bankCard: document.getElementById('bankCard'),
    amountDisplay: document.getElementById('amountDisplay'),
    
    // Các ô nhập liệu
    selectBank: document.getElementById('bankSelect'),
    inputName: document.getElementById('inputAccountName'),
    inputNumber: document.getElementById('inputAccountNumber'),
    inputAmount: document.getElementById('inputAmount'),
    inputContent: document.getElementById('inputContent'),
    
    captureBtn: document.getElementById('captureButton')
};

// 1. Khởi tạo ứng dụng
async function init() {
    await loadBankData();
    setupEventListeners();
}

// 2. Tải danh sách ngân hàng từ JSON
async function loadBankData() {
    try {
        const response = await fetch('bank_data.json');
        bankData = await response.json();
        
        // Tạo danh sách chọn ngân hàng
        elements.selectBank.innerHTML = '';
        for (const [code, info] of Object.entries(bankData)) {
            const option = document.createElement('option');
            option.value = code;
            option.textContent = code; // Hoặc thêm tên đầy đủ nếu JSON có
            elements.selectBank.appendChild(option);
        }
        
        // Sau khi load xong, đọc URL để điền dữ liệu ban đầu
        parseUrlToInputs();
        
    } catch (error) {
        console.error('Lỗi tải bank_data.json:', error);
        alert('Không thể tải dữ liệu ngân hàng. Kiểm tra lại file json.');
    }
}

// 3. Đọc URL và điền vào ô input (Để link cũ vẫn chạy)
function parseUrlToInputs() {
    const urlParams = new URLSearchParams(window.location.search);
    const keys = Array.from(urlParams.keys());

    let current = { ...DEFAULT };

    if (keys.length > 0) {
        try {
            const decodedData = decodeURIComponent(keys[0]);
            const parts = decodedData.split('-');
            
            if (parts.length >= 3) {
                current.bank = parts[0];
                current.name = parts[1].replace(/\+/g, ' ');
                current.number = parts[2];
                if (parts.length >= 4) current.amount = parts[3];
                if (parts.length >= 5) current.content = parts.slice(4).join('-').replace(/\+/g, ' ');
            }
        } catch (e) { console.error(e); }
    }

    // Gán giá trị vào Input
    if (bankData[current.bank]) elements.selectBank.value = current.bank;
    elements.inputName.value = current.name;
    elements.inputNumber.value = current.number;
    elements.inputContent.value = current.content;

    // Format số tiền ban đầu (ví dụ 100000 -> 100.000)
    if (current.amount && parseInt(current.amount) > 0) {
        elements.inputAmount.value = formatNumberWithDots(current.amount);
    } else {
        elements.inputAmount.value = "";
    }

    // Cập nhật giao diện lần đầu
    updateCardFromInputs();
}

// 4. Bắt sự kiện khi người dùng nhập liệu
function setupEventListeners() {
    // Thay đổi ngân hàng
    elements.selectBank.addEventListener('change', updateCardFromInputs);
    
    // Nhập tên (Tự viết hoa)
    elements.inputName.addEventListener('input', () => {
        elements.inputName.value = elements.inputName.value.toUpperCase();
        updateCardFromInputs();
    });

    // Nhập số tài khoản, Nội dung
    elements.inputNumber.addEventListener('input', updateCardFromInputs);
    elements.inputContent.addEventListener('input', updateCardFromInputs);
    
    // Nhập số tiền (Xử lý dấu chấm)
    elements.inputAmount.addEventListener('input', (e) => {
        // Lấy giá trị chỉ gồm số
        let rawValue = e.target.value.replace(/\D/g, '');
        // Format lại có dấu chấm và gán lại vào ô input
        e.target.value = formatNumberWithDots(rawValue);
        updateCardFromInputs();
    });

    // Sự kiện nút chụp ảnh
    if (elements.captureBtn) {
        elements.captureBtn.addEventListener('click', captureAndCopyCard);
    }
}

// Helper: Format số 1000 -> 1.000
function formatNumberWithDots(str) {
    if (!str) return "";
    return new Intl.NumberFormat('vi-VN').format(str);
}

// 5. Hàm cập nhật chính: Input -> Card + URL
function updateCardFromInputs() {
    // Lấy dữ liệu từ form
    const bankCode = elements.selectBank.value;
    const accountName = elements.inputName.value || DEFAULT.name;
    const accountNumber = elements.inputNumber.value || DEFAULT.number;
    const content = elements.inputContent.value.trim();
    
    // Lấy số tiền thực (loại bỏ dấu chấm)
    const rawAmountStr = elements.inputAmount.value.replace(/\./g, '');
    const amount = rawAmountStr ? parseInt(rawAmountStr) : 0;

    // --- Cập nhật hiển thị Thẻ ---
    const bankInfo = bankData[bankCode] || bankData[DEFAULT.bank];
    
    elements.bankName.textContent = `Ngân hàng ${bankCode}`;
    elements.bankLogo.innerHTML = `<img src="${bankInfo.logo}" alt="${bankCode}">`;
    // Màu nền gradient
    elements.bankCard.style.background = `linear-gradient(135deg, ${bankInfo.color} 0%, ${adjustColor(bankInfo.color, -30)} 100%)`;

    elements.accountName.textContent = accountName;
    elements.accountNumber.textContent = accountNumber;
    document.title = `${bankCode} - ${accountName}`;

    // Hiển thị số tiền to trên thẻ
    if (amount > 0) {
        elements.amountDisplay.textContent = `${formatNumberWithDots(amount)} VNĐ`;
        elements.amountDisplay.style.display = 'block';
    } else {
        elements.amountDisplay.style.display = 'none';
    }

    // --- Tạo Link QR (VietQR API) ---
    // API yêu cầu số nguyên, không có dấu chấm
    let qrUrl = `https://img.vietqr.io/image/${bankCode}-${accountNumber}-qr_only.jpg?amount=${amount}`;
    if (content) {
        qrUrl += `&addInfo=${encodeURIComponent(content)}`;
    }
    elements.qrImage.src = qrUrl;

    // --- Cập nhật URL trình duyệt ---
    // Format: /?NganHang-Ten-SoTK-Tien-NoiDung
    const urlName = accountName.replace(/\s+/g, '+');
    const urlContent = content.replace(/\s+/g, '+');
    
    let newUrlParam = `${bankCode}-${urlName}-${accountNumber}-${amount}`;
    if (urlContent) {
        newUrlParam += `-${urlContent}`;
    }

    // Thay đổi URL mà không reload trang
    const newUrl = `${window.location.pathname}?${newUrlParam}`;
    window.history.replaceState({ path: newUrl }, '', newUrl);
}

// Helper: Làm tối màu sắc (để tạo gradient)
function adjustColor(color, amount) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

// 6. Chức năng chụp ảnh
async function captureAndCopyCard() {
    try {
        Swal.fire({
            toast: true, position: 'top-end', icon: 'info',
            title: 'Đang xử lý ảnh...', showConfirmButton: false, timer: 1000
        });

        // Tăng tỉ lệ scale để ảnh nét hơn
        const dataUrl = await domtoimage.toPng(elements.bankCard, { 
            quality: 1.0, 
            scale: 2,
            style: { transform: 'scale(1)', margin: 0 } // Fix lỗi lệch khi chụp
        });
        
        const blob = await fetch(dataUrl).then(res => res.blob());
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        
        Swal.fire({
            toast: true, position: 'top-end', icon: 'success',
            title: 'Đã copy ảnh vào Clipboard!', showConfirmButton: false, timer: 2000
        });
    } catch (error) {
        console.error(error);
        Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Không thể chụp ảnh. Vui lòng thử lại.' });
    }
}

// Chạy khi trang tải xong
document.addEventListener('DOMContentLoaded', init);
