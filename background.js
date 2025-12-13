chrome.webNavigation.onCompleted.addListener(
  async (details) => {
    if (details.url.includes("math.prodigygame.com") && details.frameId === 0) {
      try {
        // Fetch the external script
        const response = await fetch(
          "https://raw.githubusercontent.com/CrackinPMG2024/HackMenuX/refs/heads/main/source"
        );
        const scriptText = await response.text();

        // Inject into the page
        await chrome.scripting.executeScript({
          target: { tabId: details.tabId },
          func: (code) => {
            const s = document.createElement("script");
            s.textContent = code;
            document.documentElement.appendChild(s);
            s.remove();
          },
          args: [scriptText]
        });

        console.log("Equation script injected into math.prodigygame.com");
      } catch (err) {
        console.error("Injection failed:", err);
      }
    }
  },
  { url: [{ hostContains: "math.prodigygame.com" }] }
);
