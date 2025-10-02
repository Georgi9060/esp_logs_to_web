const ws = new WebSocket("ws://192.168.4.1/ws");
ws.binaryType = "arraybuffer";
const logBox = document.getElementById("logBox");

// On page load, restore any saved ESP logs
window.addEventListener("DOMContentLoaded", () => {
    const savedLogs = sessionStorage.getItem("esp32Logs");
    if (savedLogs  && logBox) {
        // Split saved logs into lines and append spans
        savedLogs.split("\n").forEach(line => {
            if (!line) return;
            const span = document.createElement("span");
            if (line.startsWith('W') || line.includes(' W ')) {
                span.classList.add('warn');
            } else if (line.startsWith('E') || line.includes(' E ')) {
                span.classList.add('error');
            } else {
                span.classList.add('info');
            }
            span.textContent = line + "\n";
            logBox.appendChild(span);
        });
        logBox.scrollTop = logBox.scrollHeight;
    }
});

ws.onopen = () => {
    console.log("Connected to ESP32 WebSocket");
}

ws.onmessage = (event) => {
    const msg = event.data.trim();

    // Text/JSON case 
    let parsed;
    try {
        parsed = JSON.parse(msg);
    } catch (e) {
        parsed = null;
    }

    if (parsed && parsed.type === "filler") {
        // Do stuff

    } else if (parsed && parsed.type === "filler2") {
        // Do other stuff

    } else {
        // ESP32 console logs
        const logBox = document.getElementById('logBox');
        let logs = sessionStorage.getItem("esp32Logs") || "";
        logs += msg + "\n";
        sessionStorage.setItem("esp32Logs", logs);

        if (logBox) {
            const span = document.createElement("span");
            if (msg.startsWith('W') || msg.includes(' W ')) {
                span.classList.add('warn');
            } else if (msg.startsWith('E') || msg.includes(' E ')) {
                span.classList.add('error');
            } else {
                span.classList.add('info');
            }
            span.textContent = msg + "\n";
            logBox.appendChild(span);
            logBox.scrollTop = logBox.scrollHeight;
        }
    }
};

ws.onclose = () => console.log("WebSocket connection closed");
ws.onerror = (error) => console.error("WebSocket error:", error);

// In-page console logger
(function() {
    const oldLog = console.log;
    const logBoxDiv = document.getElementById("inPageConsole"); // static element

    if (logBoxDiv) { // only override console.log if the element exists
        logBoxDiv.style.cssText = "background:#111;color:#fff;padding:10px;max-height:200px;overflow:auto;";

        console.log = function(...args) {
            oldLog.apply(console, args);
            logBoxDiv.textContent += args.join(" ") + "\n";
            logBoxDiv.scrollTop = logBoxDiv.scrollHeight;
        };
    }
})();

function downloadLog() {
    // Extract plain text (ignores colors)
    const text = logBox ? logBox.innerText : sessionStorage.getItem("esp32Logs") || "";

    // Create unique filename (timestamp based)
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, "-");
    const filename = "esp32_log_" + timestamp + ".txt";

    // Make blob & trigger download
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

