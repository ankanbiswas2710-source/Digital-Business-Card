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
const saveQrCode = document.getElementById("saveQrCode");
const saveContactBtn = document.getElementById("saveContactBtn");
const saveCardBtn = document.getElementById("saveCardBtn");
const saveCardLayout = document.getElementById("saveCardLayout");

const cardUrl = window.location.href;

const qrUrl =
  "https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=" +
  encodeURIComponent(cardUrl);

if (qrCode) {
  qrCode.src = qrUrl;
}

if (saveQrCode) {
  saveQrCode.src = qrUrl;
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

if (saveCardBtn && saveCardLayout) {
  saveCardBtn.addEventListener("click", async () => {
    try {
      saveCardLayout.style.left = "20px";
      saveCardLayout.style.top = "20px";
      saveCardLayout.style.zIndex = "9999";

      const canvas = await html2canvas(saveCardLayout, {
        backgroundColor: "#050505",
        scale: 3,
        useCORS: true,
      });

      saveCardLayout.style.left = "-99999px";
      saveCardLayout.style.top = "0";
      saveCardLayout.style.zIndex = "-1";

      const imageURL = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imageURL;
      link.download = "ankan-biswas-business-card.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Save image failed:", error);
    }
  });
}
