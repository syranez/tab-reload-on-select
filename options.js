async function saveOptions () {

    browser.storage.local.set({
        "reloadTimeoutUnit":  document.querySelector("#reloadTimeoutUnit").value,
        "reloadTimeoutValue": document.querySelector("#reloadTimeoutValue").value
    });
}

async function restoreOptions () {

    let settings = await browser.storage.local.get();

    document.querySelector("#reloadTimeoutUnit").value = settings.reloadTimeoutUnit || "minutes";
    document.querySelector("#reloadTimeoutValue").value = settings.reloadTimeoutValue || 60;
}

document.addEventListener("DOMContentLoaded", () => {

    restoreOptions();

    for (let el of document.querySelectorAll("input, select")) {
        el.addEventListener("change", saveOptions)
    }
})
