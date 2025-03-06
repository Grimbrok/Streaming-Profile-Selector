document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("profileName");
    const saveButton = document.getElementById("save");
    const deleteButton = document.getElementById("delete");

    // Load the saved profile name
    chrome.storage.sync.get("netflixProfile", data => {
        if (data.netflixProfile) {
            input.value = data.netflixProfile;
        }
    });

    // Save the profile name
    saveButton.addEventListener("click", () => {
        const profile = input.value.trim();
        if (profile) {
            chrome.storage.sync.set({ netflixProfile: profile }, () => {
                alert("Profile saved!");
            });
        }
    });

    // Delete the profile name
    deleteButton.addEventListener("click", () => {
        chrome.storage.sync.remove("netflixProfile", () => {
            input.value = "";
            alert("Profile deleted!");
        });
    });
});
