console.log("🚀 Streaming Auto Profile Script started!");

const services = {
    "netflix.com": { selector: ".profile-name", storageKey: "netflix" },
    "crunchyroll.com": { selector: "[data-t='profile-name'], .profile-item-name", storageKey: "crunchyroll" },
    "disneyplus.com": { selector: "[data-testid^='profile-avatar-'] h3", storageKey: "disneyplus" }
};

const currentHost = window.location.hostname.replace("www.", "");
const currentService = Object.keys(services).find(service => currentHost.includes(service));

if (currentService) {
    console.log(`🌍 Detected service: ${currentService}`);

    chrome.storage.sync.get(services[currentService].storageKey, data => {
        const storedProfile = data[services[currentService].storageKey];
        console.log(`🔍 Stored profile: ${storedProfile || "None"}`);

        if (storedProfile) {
            selectProfile(storedProfile, services[currentService].selector);
        }
    });
} else {
    console.log("⚠️ No supported service detected.");
}

function waitForProfiles(selector, callback, maxRetries = 5, interval = 1000) {
    let attempts = 0;

    const checkProfiles = setInterval(() => {
        const elements = document.querySelectorAll(selector);
        console.log(`🔍 Try ${attempts + 1}: Found ${elements.length} profiles`);

        if (elements.length > 0) {
            clearInterval(checkProfiles);
            callback(elements);
        }

        attempts++;
        if (attempts >= maxRetries) {
            clearInterval(checkProfiles);
            console.log("⏹️ Max retries reached. No profiles found.");
        }
    }, interval);
}

function selectProfile(profileName, selector) {
    console.log(`🚀 Selecting profile for: ${currentService}`);

    waitForProfiles(selector, (profiles) => {
        let selected = false;

        profiles.forEach(profile => {
            if (profile.textContent.trim() === profileName) {
                console.log(`✅ Matching profile found: ${profileName}`);

                if (currentService === "disneyplus.com") {
                    profile.closest("[data-testid^='profile-avatar-']").click();
                } else {
                    profile.click();
                }

                selected = true;
            }
        });

        if (!selected) {
            console.log(`⚠️ Profile '${profileName}' not found.`);
        }
    });
}
