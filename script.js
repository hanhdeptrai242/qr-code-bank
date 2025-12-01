// script.js

let bankData = {};

const DEFAULT = {
    bank: "Vietcombank",
    name: "BUI DUC HANH",
    number: "9966523518",
    amount: "0",
    content: ""
};

const elements = {
    bankName: document.getElementById('bankName'),
    accountName: document.getElementById('accountName'),
    accountNumber: document.getElementById('accountNumber'),
    qrImage: document.getElementById('qrImage'),
    bankLogo: document.getElementById('bankLogo'),
    bankCard: document.getElementById('bankCard'),
    amountDisplay: document.getElementById('amountDisplay'),
    
    bankGrid: document.getElementById('bankGrid'),
    inputName: document.getElementById('inputAccountName'),
    inputNumber: document.getElementById('inputAccountNumber'),
    inputAmount: document.getElementById('inputAmount'),
    inputContent: document.getElementById('inputContent'),
    
    captureBtn: document.getElementById('captureButton')
};

async function init() {
    await loadBankData();
    setupEventListeners();
}

async function loadBankData() {
    try {
        const response = await fetch('bank_data.json');
        bankData = await response.json();
        renderBankGrid();
        parseUrlToInputs();
    } catch (error) {
        console.error('Lỗi tải data:', error);
        alert('Lỗi tải dữ liệu ngân hàng.');
    }
}

function renderBankGrid() {
    elements.bankGrid.innerHTML = '';
    for (const [code, info] of Object.entries(bankData)) {
        const label = document.createElement('label');
        label.className = 'bank-option';
        
        const radio = document.createElement('input');
        radio.type = 'radio'; radio.name = 'bank_choice'; radio.value = code;
        
        const img = document.createElement('img');
        img.src = info.logo; img.alt = code;
        
        const span = document.createElement('span');
        span.textContent = code;

        label.appendChild(radio);
        label.appendChild(img);
        label.appendChild(span);
        elements.bankGrid.appendChild(label);
    }
}

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
        } catch (e) {}
    }

    const radioToSelect = elements.bankGrid.querySelector(`input[value="${current.bank}"]`);
    if (radioToSelect) {
        radioToSelect.checked = true;
        radioToSelect.parentElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    } else {
        const defaultRadio = elements.bankGrid.querySelector(`input[value="${DEFAULT.bank}"]`);
        if (defaultRadio) defaultRadio.checked = true;
    }

    elements.inputName.value = current.name;
    elements.inputNumber.value = current.number;
    elements.inputContent.value = current.content;
    if (current.amount && parseInt(current.amount) > 0) {
        elements.inputAmount.value = formatNumberWithDots(current.amount);
    } else {
        elements.inputAmount.value = "";
    }
    updateCardFromInputs();
}

function setupEventListeners() {
    elements.bankGrid.addEventListener('change', (e) => {
        if (e.target.name === 'bank_choice') updateCardFromInputs();
    });
    
    elements.inputName.addEventListener('input', () => {
        elements.inputName.value = elements.inputName.value.toUpperCase();
        updateCardFromInputs();
    });

    elements.inputNumber.addEventListener('input', updateCardFromInputs);
    elements.inputContent.addEventListener('input', updateCardFromInputs);
    
    elements.inputAmount.addEventListener('input', (e) => {
        let rawValue = e.target.value.replace(/\D/g, '');
        e.target.value = formatNumberWithDots(rawValue);
        updateCardFromInputs();
    });

    if (elements.captureBtn) {
        elements.captureBtn.addEventListener('click', captureAndCopyCard);
    }
}

function formatNumberWithDots(str) {
    if (!str) return "";
    return new Intl.NumberFormat('vi-VN').format(str);
}

// Hàm làm tối/sáng màu Hex
function adjustColor(color, amount) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

function updateCardFromInputs() {
    const checkedRadio = elements.bankGrid.querySelector('input[name="bank_choice"]:checked');
    const bankCode = checkedRadio ? checkedRadio.value : DEFAULT.bank;

    const accountName = elements.inputName.value || DEFAULT.name;
    const accountNumber = elements.inputNumber.value || DEFAULT.number;
    const content = elements.inputContent.value.trim();
    
    const rawAmountStr = elements.inputAmount.value.replace(/\./g, '');
    const amount = rawAmountStr ? parseInt(rawAmountStr) : 0;

    // --- XỬ LÝ NỀN PHỨC TẠP (GIAO THOA MÀU) ---
    const bankInfo = bankData[bankCode] || bankData[DEFAULT.bank];
    const mainColor = bankInfo.color;
    const darkColor = adjustColor(mainColor, -40); // Màu đậm hơn chút
    
    // Tạo chuỗi gradient phức tạp
    // Layer 1: Đốm sáng trắng mờ ở góc trái trên
    // Layer 2: Đốm sáng/đậm mờ ở góc phải dưới
    // Layer 3: Nền chính Linear Gradient chéo
    elements.bankCard.style.background = `
        radial-gradient(circle at 15% 15%, rgba(255, 255, 255, 0.25) 0%, transparent 45%),
        radial-gradient(circle at 85% 85%, rgba(0, 0, 0, 0.2) 0%, transparent 40%),
        linear-gradient(135deg, ${mainColor} 0%, ${darkColor} 100%)
    `;

    // Cập nhật nội dung
    elements.bankName.textContent = `Ngân hàng ${bankCode}`;
    elements.bankLogo.innerHTML = `<img src="${bankInfo.logo}" alt="${bankCode}">`;
    elements.accountName.textContent = accountName;
    elements.accountNumber.textContent = accountNumber;
    document.title = `${bankCode} - ${accountName}`;

    if (amount > 0) {
        elements.amountDisplay.textContent = `${formatNumberWithDots(amount)} VNĐ`;
        elements.amountDisplay.style.display = 'block';
    } else {
        elements.amountDisplay.style.display = 'none';
    }

    // QR & URL
    let qrUrl = `https://img.vietqr.io/image/${bankCode}-${accountNumber}-qr_only.jpg?amount=${amount}`;
    if (content) qrUrl += `&addInfo=${encodeURIComponent(content)}`;
    elements.qrImage.src = qrUrl;

    const urlName = accountName.replace(/\s+/g, '+');
    const urlContent = content.replace(/\s+/g, '+');
    let newUrlParam = `${bankCode}-${urlName}-${accountNumber}-${amount}`;
    if (urlContent) newUrlParam += `-${urlContent}`;

    const newUrl = `${window.location.pathname}?${newUrlParam}`;
    window.history.replaceState({ path: newUrl }, '', newUrl);
}

async function captureAndCopyCard() {
    try {
        Swal.fire({
            toast: true, position: 'top-end', icon: 'info',
            title: 'Đang xử lý ảnh...', showConfirmButton: false, timer: 1000
        });

        // Chụp ảnh
        const dataUrl = await domtoimage.toPng(elements.bankCard, { 
            quality: 1.0, scale: 2,
            style: { transform: 'scale(1)', margin: 0 } 
        });
        
        const blob = await fetch(dataUrl).then(res => res.blob());
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        
        Swal.fire({
            toast: true, position: 'top-end', icon: 'success',
            title: 'Đã copy ảnh!', showConfirmButton: false, timer: 2000
        });
    } catch (error) {
        console.error(error);
        Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Không thể chụp ảnh.' });
    }
}

document.addEventListener('DOMContentLoaded', init);
