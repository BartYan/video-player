const container = document.querySelector(".container"),
mainVideo = container.querySelector("video"),
videoTimeline = container.querySelector(".video__timeline"),
progressBar = container.querySelector(".progress-bar"),
volumeBtn = container.querySelector(".volume img"),
volumeSlider = container.querySelector(".options-right input");
currentVidTime = container.querySelector(".current-time"),
videoDuration = container.querySelector(".video-duration"),
playPauseBtn = container.querySelector(".play-pause"),
playPauseImg = container.querySelector(".play-pause img"),
fullScreenBtn = container.querySelector(".fullscreen img");
let timer;

const hideControls = () => {
    if(mainVideo.paused) return;
    timer = setTimeout(() => {
        container.classList.remove("show-controls");
    }, 3000);
}
hideControls();

container.addEventListener("mousemove", () => {
    container.classList.add("show-controls");
    clearTimeout(timer);
    hideControls();
});

const formatTime = time => {
    let seconds = Math.floor(time % 60),
    minutes = Math.floor(time / 60) % 60,
    hours = Math.floor(time / 3600);

    seconds = seconds < 10 ? `0${seconds}` : seconds;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    hours = hours < 10 ? `0${hours}` : hours;

    if(hours == 0) {
        return `${minutes}:${seconds}`
    }
    return `${hours}:${minutes}:${seconds}`;
}

videoTimeline.addEventListener("mousemove", e => {
    let timelineWidth = videoTimeline.clientWidth;
    let offsetX = e.offsetX;
    let percent = Math.floor((offsetX / timelineWidth) * mainVideo.duration);
    const progressTime = videoTimeline.querySelector("span");
    offsetX = offsetX < 20 ? 20 : (offsetX > timelineWidth - 20) ? timelineWidth - 20 : offsetX;
    progressTime.style.left = `${offsetX}px`;
    progressTime.innerText = formatTime(percent);
});

videoTimeline.addEventListener("click", e => {
    let timelineWidth = videoTimeline.clientWidth;
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
});

mainVideo.addEventListener("timeupdate", e => {
    let {currentTime, duration} = e.target;
    let percent = (currentTime / duration) * 100;
    progressBar.style.width = `${percent}%`;
    currentVidTime.innerText = formatTime(currentTime);
});

mainVideo.addEventListener("loadeddata", () => {
    videoDuration.innerText = formatTime(mainVideo.duration);
});

const draggableProgressBar = e => {
    let timelineWidth = videoTimeline.clientWidth;
    progressBar.style.width = `${e.offsetX}px`;
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
    currentVidTime.innerText = formatTime(mainVideo.currentTime);
}

//volume
const i = document.querySelector('input[type="range"].slider-progress')
i.style.setProperty('--value', i.value);
i.style.setProperty('--min', i.min == '' ? '0' : i.min);
i.style.setProperty('--max', i.max == '' ? '100' : i.max);
i.addEventListener('input', () => i.style.setProperty('--value', i.value));

volumeBtn.addEventListener("click", () => {
    i.style.setProperty('--value', 0)
    mainVideo.volume = 0.0;
    volumeBtn.src = "https://bartyan.pl/video-view/images/svg/volumeoff.svg"
    volumeSlider.value = mainVideo.volume;
});
volumeBtn.addEventListener("input", () => {

});

volumeSlider.addEventListener("input", e => {
    mainVideo.volume = e.target.value;
    if(e.target.value > 0) {
        volumeBtn.src = "https://bartyan.pl/video-view/images/volume-icon@3x.png"
    } else {
        volumeBtn.src = "https://bartyan.pl/video-view/images/svg/volumeoff.svg"
    }
});
addEventListener('fullscreenchange', (e) => {container.classList.toggle("fullscreen"); console.log('papapa') });
fullScreenBtn.addEventListener("click", () => {
    if(document.fullscreenElement) {
        return document.exitFullscreen();
    }    
    container.requestFullscreen();
});

mainVideo.addEventListener("play", () => playPauseBtn.classList.replace("fa-play", "fa-pause"));
mainVideo.addEventListener("pause", () => playPauseBtn.classList.replace("fa-pause", "fa-play"));
playPauseBtn.addEventListener("click", () => {
    playPauseBtn.classList.toggle('pauseActive');
    if(mainVideo.paused) {
        mainVideo.play();
        playPauseImg.src = "https://bartyan.pl/video-view/images/svg/pause-icon.svg";
    } else {
        mainVideo.pause();
        playPauseImg.src = "https://bartyan.pl/video-view/images/svg/play-icon-w.svg";
    } 
});
videoTimeline.addEventListener("mousedown", () => videoTimeline.addEventListener("mousemove", draggableProgressBar));
document.addEventListener("mouseup", () => videoTimeline.removeEventListener("mousemove", draggableProgressBar));