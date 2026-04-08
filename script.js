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
const saveCardBtn = document.getElementById("saveCardBtn");
const saveBtn = document.getElementById("saveContactBtn");
const statusText = document.getElementById("statusText");
const profilePhoto = document.getElementById("profilePhoto");

const cardUrl = window.location.href;
qrCode.src = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(cardUrl)}`;

function setStatus(message, isError = false) {
  statusText.textContent = message;
  statusText.style.color = isError ? "#aa1f1f" : "#274063";
}

function buildVCard() {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${contact.fullName}`,
    `TEL;TYPE=CELL:${contact.phone}`,
    `EMAIL;TYPE=INTERNET:${contact.email}`,
    ...contact.websites.map((site) => `URL:${site}`),
    "END:VCARD",
  ];

  return lines.join("\n");
}

saveBtn.addEventListener("click", () => {
  const vCardContent = buildVCard();
  const blob = new Blob([vCardContent], { type: "text/vcard;charset=utf-8" });
  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = "ankan-biswas-contact.vcf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
  setStatus("Contact file downloaded. Open it to save the contact on your phone.");
});

function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

async function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function saveCardToGallery() {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#ebedf1";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#e6c43c";
    ctx.fillRect(0, 0, canvas.width, 640);

    const photo = await loadImage(profilePhoto.currentSrc || profilePhoto.src);
    const avatarSize = 360;
    const avatarX = (canvas.width - avatarSize) / 2;
    const avatarY = 90;

    ctx.save();
    ctx.beginPath();
    ctx.arc(canvas.width / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(photo, avatarX, avatarY, avatarSize, avatarSize);
    ctx.restore();

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "#051a48";
    ctx.textAlign = "center";
    ctx.font = "bold 78px Arial";
    ctx.fillText(contact.fullName, canvas.width / 2, 540);

    ctx.fillStyle = "#3b4a64";
    ctx.font = "52px Arial";
    ctx.fillText("Digital Business Card", canvas.width / 2, 610);

    ctx.fillStyle = "#506a8a";
    ctx.font = "bold 48px Arial";
    ctx.fillText("CONTACT", 220, 770);

    ctx.fillStyle = "#f0f2f6";
    drawRoundedRect(ctx, 70, 810, 940, 140, 36);
    ctx.fill();

    ctx.fillStyle = "#0b1d49";
    ctx.font = "46px Arial";
    ctx.textAlign = "left";
    ctx.fillText(`+ ${contact.phone}`, 130, 895);
    ctx.fillText(contact.email, 80, 980);

    const qrImg = await loadImage(qrCode.src);
    ctx.drawImage(qrImg, 360, 1080, 360, 360);

    ctx.textAlign = "center";
    ctx.fillStyle = "#3b4a64";
    ctx.font = "40px Arial";
    ctx.fillText("Scan QR to open my digital card", canvas.width / 2, 1490);

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png", 1));
    const fileName = "ankan-biswas-business-card.png";

    if (navigator.canShare && navigator.canShare({ files: [new File([blob], fileName, { type: "image/png" })] })) {
      const file = new File([blob], fileName, { type: "image/png" });
      await navigator.share({ files: [file], title: "Ankan Biswas Business Card" });
      setStatus("Card image is ready. Choose Save Image/Gallery in the share options.");
      return;
    }

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    setStatus("Card image downloaded. Open it and save to gallery.");
  } catch (error) {
    setStatus("Could not save card image. Please try again.", true);
  }
}

saveCardBtn.addEventListener("click", saveCardToGallery);

setStatus("Tap 'Save Card to Gallery' to download your business card image.");
