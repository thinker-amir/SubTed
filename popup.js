let saveElement = document.getElementById('apply');
let resetToDefaultElement = document.getElementById('resetToDefault');
let subtitleBackgroundAlphaRange = document.getElementById('subtitleBackgroundAlpha');
const DEFAULT_DATA = {
    "fontSize": 36,
    "subtitleColor": "#f6c100",
    "subtitleBackground": "#000000",
    "subtitleBackgroundAlpha": 0.5
}

saveElement.onclick = async function () {
    const config = storeStyles();
    await sendToBackground(config.styles);
}

resetToDefaultElement.onclick = async function () {
    removeStyles();
    init();
}

subtitleBackgroundAlphaRange.onchange = updateBackgroundColorInputOpacity;

init();

async function init() {
    const styles = await retriveStyles() || DEFAULT_DATA;
    appendOptionsToFontSizeSelector(parseInt(styles.fontSize));
    setColorOptions(styles);
}

function setColorOptions(styles) {
    setElementValueById("subtitleColor", styles.subtitleColor)
    setElementValueById("subtitleBackground", styles.subtitleBackground)
    setElementValueById("subtitleBackgroundAlpha", styles.subtitleBackgroundAlpha)
    updateBackgroundColorInputOpacity();
}

function createOptionElement(item, selected) {
    let option = document.createElement("option");
    option.text = item;
    if (item === selected)
        option.selected = true;
    return option;
}

function appendOptionsToFontSizeSelector(selected) {
    const dataList = document.getElementById("fontSize");
    const fontSizes = [18, 24, 30, 36, 48, 60, 72, 96];
    fontSizes.forEach(item => dataList.appendChild(createOptionElement(item, selected)))
}

function updateBackgroundColorInputOpacity() {
    document.getElementById('subtitleBackground').style.opacity = subtitleBackgroundAlphaRange.value;
}

function storeStyles() {
    const data = {
        "styles": {
            "fontSize": getElementValueById('fontSize'),
            "subtitleColor": getElementValueById('subtitleColor'),
            "subtitleBackground": getElementValueById('subtitleBackground'),
            "subtitleBackgroundAlpha": getElementValueById('subtitleBackgroundAlpha')
        }
    }
    chrome.storage.sync.set(data);
    return data;
}

function retriveStyles() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get('styles', function (data) {
            resolve(data["styles"]);
        });
    })
}

function removeStyles() {
    chrome.storage.sync.remove("styles");
}

function getElementValueById(id) {
    return document.getElementById(id).value;
}

function setElementValueById(id, value) {
    document.getElementById(id).value = value;
}

function sendToBackground(styles) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(
            activeTab.id,
            {
                "message": "apply",
                "styles": styles
            });
    });
}