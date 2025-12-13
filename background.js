const DEFAULT_SCRIPT_URL =
  "https://raw.githubusercontent.com/CrackinPMG2024/HackMenuX/refs/heads/main/source";

chrome.webNavigation.onCompleted.addListener(
  async (details) => {
    if (details.url.includes("math.prodigygame.com") && details.frameId === 0) {
      try {
        const { devMode, scriptUrl } = await chrome.storage.local.get([
          "devMode",
          "scriptUrl"
        ]);
        const url = devMode && scriptUrl ? scriptUrl : DEFAULT_SCRIPT_URL;

        const response = await fetch(url);
        const scriptText = await response.text();

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
