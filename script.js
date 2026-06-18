
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
        
        const href = this.getAttribute('href');
        if (href === '#menu-order' || href === '#kelompok') {
            e.preventDefault();
            return false;
        }
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});


document.querySelector('form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    const subject = this.querySelector('input[type="text"]').value;
    const message = this.querySelector('textarea').value;
    
    if(email && message) {
        alert('Terima kasih atas masukan Anda!');
        this.reset();
    }
});



function showMenuOrder(e) {
    e.preventDefault();
    document.getElementById('modalPesananMenu').classList.add('show');
}

function closeMenuOrder() {
    document.getElementById('modalPesananMenu').classList.remove('show');
}

function increaseQty(btn) {
    const qtySpan = btn.parentElement.querySelector('.qty');
    qtySpan.textContent = parseInt(qtySpan.textContent) + 1;
    updateTotal();
}

function decreaseQty(btn) {
    const qtySpan = btn.parentElement.querySelector('.qty');
    const currentQty = parseInt(qtySpan.textContent);
    if (currentQty > 0) {
        qtySpan.textContent = currentQty - 1;
        updateTotal();
    }
}

function updateTotal() {
    const items = document.querySelectorAll('.order-item');
    let total = 0;
    
    const prices = [30000, 30000, 30000, 30000, 9000, 9000, 13000, 18000, 13000, 12000, 4500];
    
    items.forEach((item, index) => {
        const qty = parseInt(item.querySelector('.qty').textContent);
        total += prices[index] * qty;
    });
    
    document.getElementById('hargaTotal').textContent = 'Rp ' + total.toLocaleString('id-ID');
}

function goToPayment() {
    const items = document.querySelectorAll('.order-item');
    const prices = [30000, 30000, 30000, 30000, 9000, 9000, 13000, 18000, 13000, 12000, 4500];
    
    let adaPesanan = false;
    let hargaTotal = 0;
    let daftarPesanan = '';
    
    items.forEach((item, index) => {
        const qty = parseInt(item.querySelector('.qty').textContent);
        if (qty > 0) {
            adaPesanan = true;
            const namaPesanan = item.querySelector('.item-info h4').textContent;
            const hargaPesanan = prices[index];
            const subtotal = hargaPesanan * qty;
            hargaTotal += subtotal;
            daftarPesanan += `<div class="payment-order-item">
                            <span>${namaPesanan} x${qty}</span>
                            <span>Rp ${subtotal.toLocaleString('id-ID')}</span>
                          </div>`;
        }
    });
    
    if (!adaPesanan) {
        alert('Pilih setidaknya satu menu terlebih dahulu!');
        return;
    }
    
    
    closeMenuOrder();
    document.getElementById('daftarPesananPembayaran').innerHTML = daftarPesanan;
    document.getElementById('hargaTotalPembayaran').textContent = 'Rp ' + hargaTotal.toLocaleString('id-ID');
    document.getElementById('modalPembayaran').classList.add('show');
}



function showKelompok(e) {
    e.preventDefault();
    document.getElementById('modalAnggotaKelompok').classList.add('show');
}

function closeKelompok() {
    document.getElementById('modalAnggotaKelompok').classList.remove('show');
}



let metodePaymentTerpilih = null;

function selectPaymentMethod(element, method) {

    document.querySelectorAll('.payment-option').forEach(el => {
        el.classList.remove('selected');
    });
    
    
    element.classList.add('selected');
    metodePaymentTerpilih = method;
    
    
    showPaymentForm(method);
}

function showPaymentForm(method) {
    const divForm = document.getElementById('divFormPembayaran');
    const fieldTambahan = document.getElementById('fieldTambahanPembayaran');
    const judul = document.getElementById('judulFormPembayaran');
    
    divForm.style.display = 'block';
    fieldTambahan.innerHTML = '';
    
    switch(method) {
        case 'card':
            judul.textContent = 'Form Pembayaran - Kartu Kredit';
            fieldTambahan.innerHTML = `
                <div class="form-group">
                    <label>Nomor Kartu Kredit *</label>
                    <input type="text" placeholder="1234-5678-9012-3456" maxlength="19" required>
                </div>
                <div class="form-group">
                    <label>Nama di Kartu *</label>
                    <input type="text" placeholder="Nama Pemegang Kartu" required>
                </div>
                <div style="display: flex; gap: 15px;">
                    <div class="form-group" style="flex: 1;">
                        <label>Bulan/Tahun *</label>
                        <input type="text" placeholder="MM/YY" maxlength="5" required>
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label>CVV *</label>
                        <input type="text" placeholder="123" maxlength="3" required>
                    </div>
                </div>
            `;
            break;
        case 'ewallet':
            judul.textContent = 'Form Pembayaran - E-Wallet';
            fieldTambahan.innerHTML = `
                <div class="form-group">
                    <label>Pilih E-Wallet *</label>
                    <select required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                        <option>-- Pilih E-Wallet --</option>
                        <option>GoPay</option>
                        <option>OVO</option>
                        <option>DANA</option>
                        <option>LinkAja</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Nomor Telepon (terdaftar di E-Wallet) *</label>
                    <input type="tel" placeholder="08xx-xxxx-xxxx" required>
                </div>
            `;
            break;
        case 'bank':
            judul.textContent = 'Form Pembayaran - Transfer Bank';
            fieldTambahan.innerHTML = `
                <div class="form-group">
                    <label>Pilih Bank *</label>
                    <select required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                        <option>-- Pilih Bank --</option>
                        <option>BCA</option>
                        <option>Mandiri</option>
                        <option>BNI</option>
                        <option>BRI</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Nomor Rekening *</label>
                    <input type="text" placeholder="1234567890" required>
                </div>
            `;
            break;
        case 'cash':
            judul.textContent = 'Form Pembayaran - Tunai';
            fieldTambahan.innerHTML = `
                <div class="form-group">
                    <label>Alamat Pengiriman *</label>
                    <textarea placeholder="Masukkan alamat lengkap" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; height: 80px;"></textarea>
                </div>
            `;
            break;
    }
}

function completePayment() {
    const nama = document.getElementById('namaPemesan').value;
    const telepon = document.getElementById('nomorTelepon').value;
    
    if (!nama || !telepon) {
        alert('Silakan isi semua field yang wajib!');
        return;
    }
    
    if (!metodePaymentTerpilih) {
        alert('Silakan pilih metode pembayaran!');
        return;
    }
    
    
    const namaMetode = {
        'card': 'Kartu Kredit',
        'ewallet': 'E-Wallet',
        'bank': 'Transfer Bank',
        'cash': 'Tunai'
    };
    
    const hargaTotalBayar = document.getElementById('hargaTotalPembayaran').textContent;
    alert(`Pembayaran Anda sebesar ${hargaTotalBayar} melalui ${namaMetode[metodePaymentTerpilih]} telah berhasil diproses!\n\nNama: ${nama}\nNo. Telepon: ${telepon}\n\nTerima kasih telah memesan!`);
    
    
    closePayment();
    resetMenuOrder();
}

function closePayment() {
    document.getElementById('modalPembayaran').classList.remove('show');
}

function resetMenuOrder() {
    document.querySelectorAll('.qty').forEach(qty => {
        qty.textContent = '0';
    });
    updateTotal();
    metodePaymentTerpilih = null;
    document.querySelectorAll('.payment-option').forEach(el => {
        el.classList.remove('selected');
    });
    document.getElementById('divFormPembayaran').style.display = 'none';
    document.getElementById('namaPemesan').value = '';
    document.getElementById('nomorTelepon').value = '';
}


window.addEventListener('click', function(event) {
    const modalMenu = document.getElementById('modalPesananMenu');
    const modalKelompok = document.getElementById('modalAnggotaKelompok');
    const modalBayar = document.getElementById('modalPembayaran');
    
    if (event.target === modalMenu) {
        closeMenuOrder();
    }
    if (event.target === modalKelompok) {
        closeKelompok();
    }
    if (event.target === modalBayar) {
        closePayment();
    }
});
