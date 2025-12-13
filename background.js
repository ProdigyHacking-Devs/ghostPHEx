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

        // Success → log to console
        console.log("Equation script injected successfully into math.prodigygame.com");

      } catch (err) {
        // Error → show alert inside the page
        await chrome.scripting.executeScript({
          target: { tabId: details.tabId },
          func: (message) => alert("Injection failed: " + message),
          args: [err.message]
        });
      }
    }
  },
  { url: [{ hostContains: "math.prodigygame.com" }] }
);
