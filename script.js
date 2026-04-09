if (saveCardBtn && saveCardLayout) {
  saveCardBtn.addEventListener("click", async () => {
    try {
      saveCardLayout.style.left = "0";
      saveCardLayout.style.top = "0";
      saveCardLayout.style.opacity = "0";
      saveCardLayout.style.pointerEvents = "none";

      await new Promise((resolve) => setTimeout(resolve, 80));

      const canvas = await html2canvas(saveCardLayout, {
        backgroundColor: "#050505",
        scale: 3,
        useCORS: true,
      });

      saveCardLayout.style.left = "-99999px";

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
