function saveOptions () {

    const settings = {
        "reloadTimeoutUnit":  document.querySelector("#reloadTimeoutUnit").value,
        "reloadTimeoutValue": document.querySelector("#reloadTimeoutValue").value,
        "refreshOnReload":    document.querySelector("#refreshOnReload").checked
    };

    saveSettings(settings);
}

async function restoreOptions () {

    let settings = await getSettings();

    document.querySelector("#reloadTimeoutUnit").value  = settings.reloadTimeoutUnit;
    document.querySelector("#reloadTimeoutValue").value = settings.reloadTimeoutValue;
    document.querySelector("#refreshOnReload").checked  = settings.refreshOnReload;
}

document.addEventListener("DOMContentLoaded", () => {

    restoreOptions();

    for (let el of document.querySelectorAll("input, select")) {
        el.addEventListener("change", saveOptions)
    }
})
