let SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"><path fill="#ffffffb3" fill-rule="evenodd" d="M469.334 106.667v298.667H42.667V106.667zm-42.667 42.667H85.334v213.333h341.333z"/></svg>`

console.log("iyf.js loaded")

window.addEventListener('load', () => {
    let timer = setInterval(() => {
        const el = document.querySelector("vg-controls")
        if (el) {
            clearInterval(timer)
            addWebScreenButton();
            observerVideoPlay();
            return
        }
    }, 100)
})

function addWebScreenButton() {
    const webscreenBtn = document.createElement('button')
    webscreenBtn.className = 'webscreen control-item'
    webscreenBtn.innerHTML = SVG
    webscreenBtn.style.border = "none"
    webscreenBtn.style.backgroundColor = "transparent"
    webscreenBtn.style.display = "grid"
    webscreenBtn.style.placeContent = "center"

    webscreenBtn.addEventListener('click', toggleWebScreen, false)

    document.querySelector("vg-fullscreen").insertAdjacentElement('beforebegin', webscreenBtn)
}

function toggleWebScreen() {
    const container = document.querySelector("#main-player")
    if (container.classList.contains("full")) {
        container.classList.remove("full")
        container.style.position = "relative"
        container.style.zIndex = 0
        document.body.style.overflow = "auto"
    } else {
        container.classList.add("full")
        container.style.position = "fixed"
        container.style.top = 0
        container.style.left = 0
        container.style.zIndex = 9999
        document.body.style.overflow = "hidden"
    }
}

function observerVideoPlay() {
    const video = document.querySelector('#video_player')
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
            if (currentTime > 0) {
                localStorage.setItem(videoId, currentTime)
            }
        })
        video.addEventListener('ended', () => {
            localStorage.removeItem(getVideoId())
        })
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                const container = document.querySelector("#main-player")
                if (container.classList.contains("full")) {
                    toggleWebScreen()
                }
            }
        })
    }
}

function getVideoId() {
    return window.location.href.split("/").pop().split("?")[0]
}