const webScreenSVG = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="18px" height="18px" viewBox="0 0 100 100" aria-hidden="true" role="img" class="iconify iconify--gis" preserveAspectRatio="xMidYMid meet"><path d="M8.5 22.5A3.5 3.5 0 0 0 5 26v48a3.5 3.5 0 0 0 3.5 3.5h83A3.5 3.5 0 0 0 95 74V26a3.5 3.5 0 0 0-3.5-3.5h-83zm3.5 7h76v41H12v-41z" fill="#ffffff"/></svg>`

let timer;

console.log("duboku.js loaded")

const docu = document.querySelector("#playleft iframe").contentDocument

addForwardButton();
addWebScreenButton();
observerVideoPlay();

// vjs-forward-control

function addForwardButton() {
    const forwardBtn = document.createElement('button')
    forwardBtn.className = 'vjs-forward-control vjs-control vjs-button'

    const spanEl = document.createElement('span')
    spanEl.className = 'vjs-icon-placeholder'
    forwardBtn.appendChild(spanEl)

    const spanEl1 = document.createElement('span')
    spanEl1.className = 'vjs-control-text'
    spanEl1.innerText = 'Forward'
    forwardBtn.appendChild(spanEl1)

    forwardBtn.addEventListener('click', () => changeTime(10), false)
    docu.querySelector(".vjs-rewind-control").insertAdjacentElement('afterend', forwardBtn)
}

function addWebScreenButton() {
    const webscreenBtn = document.createElement('button')
    webscreenBtn.className = 'vjs-webscreen-control vjs-control vjs-button'
    webscreenBtn.innerHTML = webScreenSVG
    webscreenBtn.addEventListener('click', toggleWebScreen, false)

    const spanEl = document.createElement('span')
    spanEl.className = 'vjs-control-text'
    spanEl.innerText = 'WebScreen'
    webscreenBtn.appendChild(spanEl)

    docu.querySelector(".vjs-fullscreen-control").insertAdjacentElement('beforebegin', webscreenBtn)
}

function toggleWebScreen() {
    const videoIframe = document.querySelector("#playleft iframe")
    if (videoIframe.classList.contains("full")) {
        videoIframe.classList.remove("full")
        videoIframe.style.position = "absolute"
        document.body.style.overflow = "auto"
        videoIframe.style.zIndex = 0
        document.body.querySelector("header").style.display = "block"
    } else {
        videoIframe.classList.add("full")
        videoIframe.style.position = "fixed"
        document.body.style.overflow = "hidden"
        videoIframe.style.zIndex = 9999
        document.body.querySelector("header").style.display = "none"
    }
}

function observerVideoPlay() {
    const video = docu.querySelector('video')
    if (video) {
        video.addEventListener('loadedmetadata', () => {
            const videoId = getVideoId()
            const savedTime = localStorage.getItem(videoId)
            if (savedTime) {
                video.currentTime = parseFloat(savedTime)
            }
        })
        video.addEventListener('timeupdate', () => {
            const currentTime = video.currentTime
            const videoId = getVideoId()
            localStorage.setItem(videoId, currentTime)
        })
        video.addEventListener('ended', () => {
            localStorage.removeItem(getVideoId())
        })
        document.addEventListener("keydown", handleKeydown, false)
        docu.addEventListener("keydown", handleKeydown, false)
    }
}

function getVideoId() {
    return window.location.href.split("/").pop().split(".")[0]
}

function changeTime(second) {
    const video = docu.querySelector('video')
    if (video) {
        const currentTime = video.currentTime
        let newTime;
        if (second < 0) {
            newTime = Math.max(currentTime + second, 0)
        } else {
            const duration = video.duration
            newTime = Math.min(currentTime + second, duration)
        }
        video.currentTime = newTime
    }
}

function handleKeydown(event) {
    switch (event.key) {
        case 'ArrowLeft':
            changeTime(-10)
            break;
        case 'ArrowRight':
            changeTime(10)
            break;
        case 'Escape': // 也可以同時監聽 Esc 鍵
            if (document.querySelector("#playleft iframe")?.classList.contains("full")) {
                toggleWebScreen()
            }
            break;
        default:
            break;
    }
}