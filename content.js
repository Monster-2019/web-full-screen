// content.js
const styles = {
    position: 'Fixed',
    left: '0',
    top: '0',
    zIndex: '999999',
    width: '100%',
    height: '100%'
}

let isWebFullScreen = false

const locationHref = location.href

const isDuboku = locationHref.includes('w.duboku.io/vodplay')
const isIyf = locationHref.includes('www.iyf.tv/play')

function getContainerElement() {
    let containerElement = null
    if (isIyf) {
        containerElement = document.querySelector('#main-player')
        if (containerElement) observer.disconnect()
    }
    if (isDuboku) {
        containerElement = document.querySelector('table').parentElement
        if (containerElement) {
            observer.disconnect()
            dubokuIframeKeydown(containerElement)
        }
    }

    if (containerElement) {
        observerKeydown(containerElement)
    }
}

function dubokuIframeKeydown(containerElement) {
    window.addEventListener('message', e => {
        const data = e.data
        if (data.keyCode && data.keyCode == 122) {
            toggleFullScreen(containerElement)
        }
    })
    parentHref = location.href
    iframeEl = containerElement.querySelector('table iframe')
    iframeEl.contentDocument.documentElement.addEventListener('keydown', e => {
        if (e.keyCode == 122) {
            e.preventDefault()
            window.parent.postMessage(
                {
                    keyCode: event.keyCode
                },
                parentHref
            )
        }
    })
}

function toggleDuboku(element) {
    if (!isWebFullScreen) {
        element.style['paddingBottom'] = '0px'
        element
            .querySelector('table iframe')
            .contentDocument.documentElement.querySelector('video').parentElement.style[
            'paddingTop'
        ] = '0px'
    } else {
        element.style['paddingBottom'] = '56.25%'
        element
            .querySelector('table iframe')
            .contentDocument.documentElement.querySelector('video').parentElement.style[
            'paddingTop'
        ] = '56.25%'
    }
}

function toggleFullScreen(element) {
    if (!element) {
        console.log('未找到视频元素')
        return 0
    }
    if (!isWebFullScreen) {
        for (let property in styles) {
            element.style[property] = styles[property]
        }
        document.body.style.overflow = 'hidden'
    } else {
        for (let property in styles) {
            element.style[property] = ''
        }
        document.body.style.overflow = 'auto'
    }
    if (isDuboku) {
        toggleDuboku(element)
    }

    isWebFullScreen = !isWebFullScreen
}

function observerKeydown(containerElement) {
    document.addEventListener(
        'keydown',
        e => {
            if (e.keyCode === 122) {
                // F11
                e.preventDefault()
                toggleFullScreen(containerElement)
            }
        },
        false
    )
}

console.log('content injection complete')

var observer = new MutationObserver(getContainerElement)
var config = { childList: true, subtree: true }
observer.observe(document.body, config)

getContainerElement()
