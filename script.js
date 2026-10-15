// Daftar menu SUN DAY KITCHEN. Harga ditulis dalam rupiah.
const makanan = [
  { nama: "Nasi Daun Jeruk", harga: 16000, emoji: "🍚", deskripsi: "Aroma daun jeruk yang wangi", favorit: true },
  { nama: "Mie Jebew", harga: 15000, emoji: "🍜", deskripsi: "Pedas gurih, bikin nagih", favorit: true },
  { nama: "Indomie Telur Kuah", harga: 12000, emoji: "🍲", deskripsi: "Hangat dan comforting" },
  { nama: "Indomie Telur Goreng", harga: 12000, emoji: "🍳", deskripsi: "Simple, enak, kenyang" },
  { nama: "Nasi Bakar", harga: 18000, emoji: "🍙", deskripsi: "Aroma bakar yang khas" },
  { nama: "Mix Platter", harga: 20000, emoji: "🍟", deskripsi: "Teman nongkrong rame-rame", favorit: true }
];

const minuman = [
  { nama: "Kopi Klepon", harga: 10000, emoji: "🧋", deskripsi: "Kopi dengan sentuhan klepon", favorit: true },
  { nama: "Es Mbok Sri", harga: 8000, emoji: "🥤", deskripsi: "Segar untuk nemenin malam" },
  { nama: "Kopi Hitam", harga: 5000, emoji: "☕", deskripsi: "Klasik, bold, mantap" },
  { nama: "Es Teh", harga: 3000, emoji: "🧊", deskripsi: "Segarnya nggak ribet" },
  { nama: "Es Nutrisari", harga: 5000, emoji: "🍊", deskripsi: "Manis dan menyegarkan" },
  { nama: "Es Chocolatos", harga: 7000, emoji: "🍫", deskripsi: "Cokelat creamy favorit" }
];

const nomorWhatsApp = "6283170605935";

function formatRupiah(angka) {
  return "Rp" + angka.toLocaleString("id-ID");
}

// Membuat kartu menu dari data di atas, agar tidak perlu menulis HTML berulang kali.
function tampilkanMenu(daftarMenu, elemenId) {
  const wadah = document.getElementById(elemenId);

  wadah.innerHTML = daftarMenu.map(item => `
    <article class="menu-card">
      <div class="menu-emoji" aria-hidden="true">${item.emoji}</div>
      <div class="menu-info">
        <h4>${item.nama}${item.favorit ? ' <span aria-label="best seller">✦</span>' : ""}</h4>
        <p>${item.deskripsi}</p>
        <div class="price">${formatRupiah(item.harga)}</div>
      </div>
      <button class="order-btn" type="button"
        aria-label="Pesan ${item.nama}"
        data-nama="${item.nama}" data-harga="${item.harga}" data-emoji="${item.emoji}">+</button>
    </article>
  `).join("");
}

// Klik tombol + akan membuka WhatsApp dengan nama menu dan harga yang dipilih.
// Keranjang menyimpan menu yang dipilih dan jumlah masing-masing.
const keranjang = {};

function tambahKeKeranjang(nama, harga, emoji) {
  if (keranjang[nama]) {
    keranjang[nama].jumlah += 1;
  } else {
    keranjang[nama] = { nama, harga, emoji, jumlah: 1 };
  }
  tampilkanKeranjang();
}

function ubahJumlah(nama, perubahan) {
  if (!keranjang[nama]) return;
  keranjang[nama].jumlah += perubahan;
  if (keranjang[nama].jumlah <= 0) delete keranjang[nama];
  tampilkanKeranjang();
}

function hapusDariKeranjang(nama) {
  delete keranjang[nama];
  tampilkanKeranjang();
}



function tampilkanKeranjang() {
  const wadah = document.getElementById("cartItems");
  const daftar = Object.values(keranjang);
  const jumlahItem = daftar.reduce((total, item) => total + item.jumlah, 0);
  const subtotal = daftar.reduce((total, item) => total + item.harga * item.jumlah, 0);

  document.getElementById("cartCount").textContent = `${jumlahItem} item`;
  document.getElementById("cartSubtotal").textContent = formatRupiah(subtotal);
  document.getElementById("cartTotal").textContent = formatRupiah(subtotal);

  const checkoutButton = document.getElementById("checkoutButton");
  const clearButton = document.getElementById("clearCartButton");
  checkoutButton.disabled = daftar.length === 0;
  clearButton.disabled = daftar.length === 0;

  if (daftar.length === 0) {
    wadah.innerHTML = `
      <div class="cart-empty">
        <span>🛒</span><strong>Keranjang masih kosong</strong>
        <p>Yuk, pilih menu favoritmu dulu!</p>
        <a href="#menu" class="text-link">Lihat menu ↓</a>
      </div>`;
    return;
  }

  wadah.innerHTML = daftar.map(item => `
    <article class="cart-row">
      <div class="cart-row-emoji" aria-hidden="true">${item.emoji}</div>
      <div class="cart-row-info">
        <strong>${item.nama}</strong>
        <small>${formatRupiah(item.harga)} / item</small>
        <div class="quantity-controls">
          <button type="button" data-action="minus" data-nama="${item.nama}" aria-label="Kurangi ${item.nama}">−</button>
          <span>${item.jumlah}</span>
          <button type="button" data-action="plus" data-nama="${item.nama}" aria-label="Tambah ${item.nama}">+</button>
          <button class="remove-item" type="button" data-action="remove" data-nama="${item.nama}">Hapus</button>
        </div>
      </div>
      <div class="cart-row-price">${formatRupiah(item.harga * item.jumlah)}</div>
    </article>
  `).join("");

  wadah.querySelectorAll("button[data-action]").forEach(button => {
    button.addEventListener("click", () => {
      const nama = button.dataset.nama;
      const aksi = button.dataset.action;
      if (aksi === "plus") ubahJumlah(nama, 1);
      if (aksi === "minus") ubahJumlah(nama, -1);
      if (aksi === "remove") hapusDariKeranjang(nama);
    });
  });
}

function aktifkanTombolPesan() {
  document.querySelectorAll(".order-btn").forEach(tombol => {
    tombol.addEventListener("click", () => {
      tambahKeKeranjang(
        tombol.dataset.nama,
        Number(tombol.dataset.harga),
        tombol.dataset.emoji
      );
      // Setelah menambahkan menu, pindahkan perhatian ke keranjang.
      const cartSection = document.getElementById("keranjang");
      cartSection.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  document.getElementById("clearCartButton").addEventListener("click", () => {
    Object.keys(keranjang).forEach(nama => delete keranjang[nama]);
    tampilkanKeranjang();
  });

  document.getElementById("checkoutButton").addEventListener("click", () => {
    const daftar = Object.values(keranjang);
    if (daftar.length === 0) return;

    const rincian = daftar.map(item =>
      `- ${item.nama} x${item.jumlah} = ${formatRupiah(item.harga * item.jumlah)}`
    ).join("\n");
    const subtotal = daftar.reduce((total, item) => total + item.harga * item.jumlah, 0);
    const pesan = `Halo SUN DAY KITCHEN! Saya mau pesan:\n${rincian}\n\nSubtotal: ${formatRupiah(subtotal)}\nOngkir: mohon dikonfirmasi admin\nTotal sementara: ${formatRupiah(subtotal)} (belum termasuk ongkir)\n\nMetode: Delivery / takeaway (mohon konfirmasi)\nAlamat pengantaran: [isi alamat jika delivery]\n\nTerima kasih!`;
    const url = `https://wa.me/${nomorWhatsApp}?text=${encodeURIComponent(pesan)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  });
}

// Navigasi hamburger agar nyaman digunakan di layar HP.
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  const terbuka = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(terbuka));
  menuToggle.textContent = terbuka ? "✕" : "☰";
});

navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  });
});

tampilkanMenu(makanan, "foodMenu");
tampilkanMenu(minuman, "drinkMenu");
aktifkanTombolPesan();
tampilkanKeranjang();
document.getElementById("year").textContent = new Date().getFullYear();
