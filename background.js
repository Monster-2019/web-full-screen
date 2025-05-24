function injectScript(details, evnet) {
    console.log(`${evnet} event detected:`, details.url)
    if (details.url.includes("duboku.io")) {
        chrome.scripting.executeScript({
            target: { tabId: details.tabId },
            files: ['duboku.js']
        })
    }
    // iyf 是 SPA 程序，在首次进入时会同时触发onCompleted和onHistoryStateUpdated导致多次注入，切换页面只触发onHistoryStateUpdated，因此不处理onCompleted事件
    if (details.url.includes("iyf.tv") && evnet !== "onCompleted") {
        chrome.scripting.executeScript({
            target: { tabId: details.tabId },
            files: ['iyf.js']
        })
    }
}

const observer = {
    url: [
        { urlMatches: 'https://www.iyf.tv/play.*' },
        { urlMatches: 'https://.*duboku.io/vodplay.*' }
    ]
}

chrome.webNavigation.onCompleted.addListener(
    (details) => injectScript(details, 'onCompleted'),
    observer
)

chrome.webNavigation.onHistoryStateUpdated.addListener(
    (details) => injectScript(details, 'onHistoryStateUpdated'),
    observer
)

console.log('background injection complete')
