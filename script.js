const contact = {
  fullName: "Ankan Biswas",
  phone: "+353871904178",
  email: "ankan.biswas2710@gmail.com",
  websites: [
    "https://coffee-shop-ecommerce.vercel.app/",
    "https://your-coffee-shop.vercel.app/",
  ],
};

const qrCode = document.getElementById("qrCode");
const saveContactBtn = document.getElementById("saveContactBtn");
const saveCardBtn = document.getElementById("saveCardBtn");

const cardUrl = window.location.href;

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

function waitForImage(img) {
  return new Promise((resolve, reject) => {
    if (img.complete && img.naturalWidth > 0) {
      resolve(img);
      return;
    }
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Image failed to load"));
  });
}

function createQrCanvas(text, size = 360) {
  return new Promise((resolve, reject) => {
    const temp = document.createElement("div");
    temp.style.position = "fixed";
    temp.style.left = "-99999px";
    temp.style.top = "0";
    document.body.appendChild(temp);

    new QRCode(temp, {
      text,
      width: size,
      height: size,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });

    const start = Date.now();
    const timer = setInterval(() => {
      const canvas = temp.querySelector("canvas");
      if (canvas) {
        clearInterval(timer);
        document.body.removeChild(temp);
        resolve(canvas);
      } else if (Date.now() - start > 4000) {
        clearInterval(timer);
        document.body.removeChild(temp);
        reject(new Error("QR canvas did not render"));
      }
    }, 50);
  });
}

function renderVisibleQr() {
  if (!qrCode) return;

  qrCode.innerHTML = "";
  new QRCode(qrCode, {
    text: cardUrl,
    width: 112,
    height: 112,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H,
  });
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawCircularPhoto(ctx, img, x, y, size) {
  const ringGradient = ctx.createLinearGradient(x, y, x + size, y + size);
  ringGradient.addColorStop(0, "#f4d77d");
  ringGradient.addColorStop(0.5, "#b68a1f");
  ringGradient.addColorStop(1, "#f4d77d");

  ctx.fillStyle = ringGradient;
  ctx.beginPath();
  ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();

  const innerPadding = 8;
  const innerX = x + innerPadding;
  const innerY = y + innerPadding;
  const innerSize = size - innerPadding * 2;

  ctx.save();
  ctx.beginPath();
  ctx.arc(
    innerX + innerSize / 2,
    innerY + innerSize / 2,
    innerSize / 2,
    0,
    Math.PI * 2
  );
  ctx.clip();

  const iw = img.naturalWidth;
  const ih = img.naturalHeight;

  const scale = Math.max(innerSize / iw, innerSize / ih) * 1.35;
  const drawW = iw * scale;
  const drawH = ih * scale;

  const dx = innerX + (innerSize - drawW) / 2;
  const dy = innerY + (innerSize - drawH) / 2 - innerSize * 0.02;

  ctx.drawImage(img, dx, dy, drawW, drawH);
  ctx.restore();

  ctx.strokeStyle = "#111111";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(
    innerX + innerSize / 2,
    innerY + innerSize / 2,
    innerSize / 2 - 2,
    0,
    Math.PI * 2
  );
  ctx.stroke();
}

async function saveCardAsImage() {
  const canvas = document.createElement("canvas");
  canvas.width = 2280;
  canvas.height = 1485;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#050505";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  roundRect(ctx, 20, 20, 2240, 1445, 52);
  ctx.fillStyle = "#0b0b0b";
  ctx.fill();
  ctx.strokeStyle = "rgba(212,175,55,0.45)";
  ctx.lineWidth = 4;
  ctx.stroke();

  const glow = ctx.createLinearGradient(0, 20, 0, 520);
  glow.addColorStop(0, "rgba(212,175,55,0.18)");
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  roundRect(ctx, 20, 20, 2240, 600, 52);
  ctx.fill();

  const profileImg = new Image();
  profileImg.src = "profile.jpg";
  await waitForImage(profileImg);

  const qrCanvas = await createQrCanvas(cardUrl, 360);

  drawCircularPhoto(ctx, profileImg, 120, 120, 250);

  ctx.fillStyle = "#f6df95";
  ctx.font = "bold 108px Arial";
  ctx.fillText("Ankan Biswas", 450, 260);

  ctx.fillStyle = "#d8bf6a";
  ctx.font = "56px Arial";
  ctx.fillText("Digital Business Card", 450, 380);

  ctx.strokeStyle = "rgba(212,175,55,0.25)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(120, 520);
  ctx.lineTo(2140, 520);
  ctx.stroke();

  ctx.fillStyle = "#cfa944";
  ctx.font = "bold 42px Arial";
  ctx.fillText("CONTACT", 120, 720);

  ctx.fillStyle = "#f8edc4";
  ctx.font = "bold 64px Arial";
  ctx.fillText("📞  +353 871904178", 120, 860);
  ctx.fillText("✉️  ankan.biswas2710@gmail.com", 120, 980);

  roundRect(ctx, 1660, 640, 420, 420, 32);
  ctx.fillStyle = "#ffffff";
  ctx.fill();

  ctx.drawImage(qrCanvas, 1690, 670, 360, 360);

  ctx.fillStyle = "#d8bf6a";
  ctx.font = "44px Arial";
  ctx.fillText("Scan to open card", 1690, 1140);

  const imageURL = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = imageURL;
  link.download = "ankan-biswas-business-card.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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

if (saveCardBtn) {
  saveCardBtn.addEventListener("click", async () => {
    try {
      saveCardBtn.disabled = true;
      saveCardBtn.textContent = "Preparing card...";
      await saveCardAsImage();
    } catch (error) {
      console.error("Save image failed:", error);
      alert("Could not save the business card image. Please try again.");
    } finally {
      saveCardBtn.disabled = false;
      saveCardBtn.textContent = "Save Card to Gallery";
    }
  });
}

renderVisibleQr();
