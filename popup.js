document.addEventListener("DOMContentLoaded", () => {
    const serviceSelect = document.getElementById("service");
    const input = document.getElementById("profileName");
    const saveButton = document.getElementById("save");
    const deleteButton = document.getElementById("delete");
    const body = document.body;
    const textElements = document.querySelectorAll("h2, p, label, select, input, button");
    const inputLabel = document.getElementById("profileLabel");

    // Theme settings per streaming service
    const themes = {
        netflix: { bg: "#181818", text: "white", save: "#e50914", delete: "#555", input: "#303030", select: "#404040" },
        crunchyroll: { bg: "#f47521", text: "black", save: "#ff9800", delete: "#bb5500", input: "#ffffff", select: "#ffb347" },
        disneyplus: { bg: "#1a1d29", text: "white", save: "#113ccf", delete: "#555577", input: "#303030", select: "#50577a" }
    };
    function showMessage(message, type = "success") {
    let msgBox = document.getElementById("messageBox");
    if (!msgBox) {
        msgBox = document.createElement("div");
        msgBox.id = "messageBox";
        msgBox.style.position = "absolute";
        msgBox.style.bottom = "10px";
        msgBox.style.left = "50%";
        msgBox.style.transform = "translateX(-50%)";
        msgBox.style.padding = "10px";
        msgBox.style.borderRadius = "5px";
        msgBox.style.color = "white";
        msgBox.style.fontSize = "14px";
        msgBox.style.textAlign = "center";
        document.body.appendChild(msgBox);
    }

    msgBox.textContent = message;
    msgBox.style.backgroundColor = type === "error" ? "#e50914" : "#28a745";

    msgBox.style.display = "block";
    setTimeout(() => {
        msgBox.style.display = "none";
    }, 3000);
}


    function updateTheme(service) {
        if (themes[service]) {
            body.style.backgroundColor = themes[service].bg;
            saveButton.style.backgroundColor = themes[service].save;
            deleteButton.style.backgroundColor = themes[service].delete;
            input.style.backgroundColor = themes[service].input;
            input.style.color = themes[service].text;
            serviceSelect.style.backgroundColor = themes[service].select;
            serviceSelect.style.color = themes[service].text;
            textElements.forEach(el => el.style.color = themes[service].text);
            if (inputLabel) inputLabel.style.color = themes[service].text;
        }
    }

    function loadProfile() {
        chrome.storage.sync.get(null, data => {
            let history = data.serviceHistory || [];
            let lastUsedService = history.length > 0 ? history[history.length - 1] : serviceSelect.options[0].value;
            if (serviceSelect.querySelector(`option[value='${lastUsedService}']`)) {
                serviceSelect.value = lastUsedService;
            }
            updateTheme(serviceSelect.value);
            input.value = data[serviceSelect.value] !== undefined ? data[serviceSelect.value] : "";
        });
    }

    serviceSelect.addEventListener("change", () => {
        updateTheme(serviceSelect.value);
        chrome.storage.sync.get(serviceSelect.value, data => {
            input.value = data[serviceSelect.value] !== undefined ? data[serviceSelect.value] : "";
        });
    });

     saveButton.addEventListener("click", () => {
        const service = serviceSelect.value;
        const profile = input.value.trim();
        if (profile) {
            chrome.storage.sync.get("serviceHistory", data => {
                let history = data.serviceHistory || [];
                history = history.filter(s => s !== service);
                history.push(service);
                chrome.storage.sync.set({ [service]: profile, serviceHistory: history }, () => {
                    showMessage(`${service} profile saved!`);
                    loadProfile();
                });
            });
        } else {
            showMessage("Please enter a profile name.", "error");
        }
    });

    deleteButton.addEventListener("click", () => {
        const service = serviceSelect.value;
        chrome.storage.sync.get("serviceHistory", data => {
            let history = data.serviceHistory || [];
            history = history.filter(s => s !== service);
            chrome.storage.sync.set({ serviceHistory: history }, () => {
                chrome.storage.sync.remove(service, () => {
                    input.value = "";
                    showMessage(`${service} profile deleted!`);
                    loadProfile();
                });
            });
        });
    });


    chrome.storage.sync.get("serviceHistory", () => {
        loadProfile();
    });
});