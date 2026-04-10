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

  const scale = Math.max(innerSize / iw, innerSize / ih) * 1.12;
  const drawW = iw * scale;
  const drawH = ih * scale;

  const dx = innerX + (innerSize - drawW) / 2;
  const dy = innerY + (innerSize - drawH) / 2 + innerSize * 0.10;

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
