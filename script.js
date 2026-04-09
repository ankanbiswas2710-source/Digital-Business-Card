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
      resolve();
      return;
    }
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Image failed to load"));
  });
}

function waitForCanvas(container) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const timer = setInterval(() => {
      const canvas = container.querySelector("canvas");
      if (canvas) {
        clearInterval(timer);
        resolve(canvas);
      } else if (Date.now() - start > 4000) {
        clearInterval(timer);
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

async function buildSaveCardElement() {
  const wrapper = document.createElement("div");
  wrapper.style.position = "fixed";
  wrapper.style.left = "20px";
  wrapper.style.top = "20px";
  wrapper.style.width = "760px";
  wrapper.style.padding = "34px 34px 28px";
  wrapper.style.borderRadius = "28px";
  wrapper.style.border = "2px solid rgba(212,175,55,0.45)";
  wrapper.style.background = "linear-gradient(180deg, #151515 0%, #050505 100%)";
  wrapper.style.color = "#f5e7b7";
  wrapper.style.zIndex = "-1";
  wrapper.style.pointerEvents = "none";
  wrapper.style.opacity = "0";

  wrapper.innerHTML = `
    <div style="display:flex;align-items:center;gap:28px;margin-bottom:24px;">
      <div style="width:170px;height:170px;border-radius:50%;padding:6px;background:linear-gradient(135deg,#f4d77d,#b68a1f,#f4d77d);flex-shrink:0;">
        <img
          id="saveProfileImg"
          src="profile.jpg"
          alt="Profile picture of Ankan Biswas"
          style="
            width:100%;
            height:100%;
            display:block;
            object-fit:cover;
            object-position:center 8%;
            transform:scale(1.08);
            border-radius:50%;
            border:4px solid #111111;
            background:#111111;
          "
          onerror="this.src='assets/profile-placeholder.svg'"
        />
      </div>

      <div style="flex:1;">
        <h2 style="margin:0 0 10px;font-size:50px;line-height:1.05;color:#f6df95;font-weight:800;">Ankan Biswas</h2>
        <p style="margin:0;font-size:28px;color:#d8bf6a;">Digital Business Card</p>
      </div>
    </div>

    <div style="height:1px;background:rgba(212,175,55,0.25);margin:18px 0 24px;"></div>

    <div style="display:flex;justify-content:space-between;align-items:center;gap:28px;">
      <div style="flex:1;">
        <p style="font-size:15px;letter-spacing:0.16em;text-transform:uppercase;color:#cfa944;font-weight:800;margin:0 0 14px;">Contact</p>
        <p style="margin:0 0 12px;font-size:28px;font-weight:600;color:#f8edc4;line-height:1.35;">📞 +353 871904178</p>
        <p style="margin:0 0 12px;font-size:28px;font-weight:600;color:#f8edc4;line-height:1.35;word-break:break-word;">✉️ ankan.biswas2710@gmail.com</p>
      </div>

      <div style="text-align:center;flex-shrink:0;">
        <div id="saveQrBox" style="width:180px;height:180px;padding:10px;background:#fff;border-radius:16px;margin-bottom:10px;display:flex;align-items:center;justify-content:center;"></div>
        <p style="margin:0;font-size:18px;color:#d8bf6a;">Scan to open card</p>
      </div>
    </div>
  `;

  document.body.appendChild(wrapper);

  const saveQrBox = wrapper.querySelector("#saveQrBox");
  new QRCode(saveQrBox, {
    text: cardUrl,
    width: 160,
    height: 160,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H,
  });

  const img = wrapper.querySelector("#saveProfileImg");
  await waitForImage(img);
  await waitForCanvas(saveQrBox);

  return wrapper;
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
    let saveCard = null;

    try {
      saveCardBtn.disabled = true;
      saveCardBtn.textContent = "Preparing card...";

      saveCard = await buildSaveCardElement();

      const canvas = await html2canvas(saveCard, {
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
    } catch (error) {
      console.error("Save image failed:", error);
      alert("Could not save the business card image. Please try again.");
    } finally {
      if (saveCard && saveCard.parentNode) {
        saveCard.parentNode.removeChild(saveCard);
      }
      saveCardBtn.disabled = false;
      saveCardBtn.textContent = "Save Card to Gallery";
    }
  });
}

renderVisibleQr();
