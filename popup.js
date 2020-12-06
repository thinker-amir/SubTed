let saveButton = document.getElementById('apply');
let subtitleBackgroundAlphaRange = document.getElementById('subtitleBackgroundAlpha');

init();

function init() {
    appendFontSizeSuggestion();
    subtitleBackgroundAlphaRange.value = 0.5
}

function appendFontSizeSuggestion() {
    const dataList = document.getElementById("fontSize");
    const fontSizes = [18, 24, 30, 36, 48, 60, 72, 96]
    fontSizes.forEach(item => {
        let option = document.createElement("option");
        option.text = item
        dataList.appendChild(option)
    })

}

subtitleBackgroundAlphaRange.onchange = function () {
    document.getElementById('subtitleBackground').style.opacity = subtitleBackgroundAlphaRange.value;
};

saveButton.onclick = async function () {
    const config = storeStyles();
    await sendToBackground(config.styles);
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

function getElementValueById(id) {
    return document.getElementById(id).value;
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
