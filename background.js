chrome.webNavigation.onCompleted.addListener(
    function (details) {
        console.log('onCompleted event detected:', details.url)
        chrome.scripting.executeScript({
            target: { tabId: details.tabId },
            files: ['content.js']
        })
        // }
    },
    {
        url: [
            { urlMatches: 'https://www.iyf.tv/play.*' },
            { urlMatches: 'https://w.duboku.io/vodplay.*' }
        ]
    }
)

chrome.webNavigation.onHistoryStateUpdated.addListener(
    function (details) {
        console.log('onHistoryStateUpdated event detected:', details.url)
        chrome.scripting.executeScript({
            target: { tabId: details.tabId },
            files: ['content.js']
        })
        // }
    },
    {
        url: [
            { urlMatches: 'https://www.iyf.tv/play.*' },
            { urlMatches: 'https://w.duboku.io/vodplay.*' }
        ]
    }
)

console.log('background injection complete')
