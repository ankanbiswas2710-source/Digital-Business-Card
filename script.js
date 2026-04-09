const contact = {
  fullName: "Ankan Biswas",
  phone: "+353871904178",
  email: "ankan.biswas2710@gmail.com",
  websites: [
    "https://coffee-shop-ecommerce.vercel.app/",
    "https://your-coffee-shop.vercel.app",
  ],
};

const qrCode = document.getElementById("qrCode");
const saveContactBtn = document.getElementById("saveContactBtn");
const saveCardBtn = document.getElementById("saveCardBtn");
const captureCard = document.getElementById("captureCard");

const cardUrl = window.location.href;

// Generate QR code automatically from live page URL
if (qrCode) {
  qrCode.src = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(cardUrl)}`;
}

function buildVCard() {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${contact.fullName}`,
    `TEL;TYPE=CELL:${contact.phone}`,
    `EMAIL;TYPE=INTERNET:${contact.email}`,
    ...contact.websites.map((site) => `URL:${site}`),
    `URL:${cardUrl}`,
    "END:VCARD",
  ];

  return lines.join("\n");
}

// Save contact as .vcf
if (saveContactBtn) {
  saveContactBtn.addEventListener("click", () => {
    const vCardContent = buildVCard();
    const blob = new Blob([vCardContent], {
      type: "text/vcard;charset=utf-8",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "ankan-biswas-contact.vcf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  });
}

// Save card as image to gallery
if (saveCardBtn && captureCard) {
  saveCardBtn.addEventListener("click", async () => {
    const canvas = await html2canvas(captureCard, {
      backgroundColor: "#050505",
      scale: 3,
      useCORS: true,
    });

    const imageURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = imageURL;
    link.download = "ankan-biswas-business-card.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}
