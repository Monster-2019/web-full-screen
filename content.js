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

function getContainerElement() {
    let videos = Array.from(document.querySelectorAll('video'))
    let videoElement = videos.find(e => e.src !== '')

    let containerElement = null
    while (true) {
        containerElement = videoElement.parentElement
        height = getComputedStyle(containerElement).height
        if (height.includes('px')) {
            break
        }
    }

    return containerElement
}

function openWebFullScreen(element) {
    for (let property in styles) {
        element.style[property] = styles[property]
    }
    document.body.style.overflow = 'hidden'
    isWebFullScreen = true
}

function closeWebFullScreen(element) {
    for (let property in styles) {
        element.style[property] = ''
    }
    document.body.style.overflow = 'auto'
    isWebFullScreen = false
}

function main() {
    let containerElement = getContainerElement()
    document.addEventListener(
        'keydown',
        e => {
            if (e.keyCode === 122) {
                e.preventDefault()
                if (!isWebFullScreen) {
                    openWebFullScreen(containerElement)
                } else {
                    closeWebFullScreen(containerElement)
                }
            }
        },
        false
    )
}

setTimeout(() => {
    main()
}, 1000)
