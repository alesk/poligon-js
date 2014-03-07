// create video element and track progress evetns


(function(global) {
var VIDEO_SRC = 'http://media.w3.org/2010/05/sintel/trailer.mp4',
    videoWrapperEl = document.getElementById('video-wrapper'),
    videoHolderEl = document.getElementById('video-holder'),
    monitor = document.getElementById('monitor'),
    progressCounterEl = document.getElementById('progress-counter'),
    progressCounter = 0,
    progressBarEl = document.getElementById('progress-bar');

videoHolderEl.innerHTML = tmpl(
    '<video id="video"><source src="<%= src %>" /></video>', 
    {src: VIDEO_SRC});

var video = document.getElementById('video');

video.addEventListener('click', onClick);
video.addEventListener('progress', onProgress);


function onClick(event) {
  if (video.paused)
    video.play();
  else
    video.pause();
}

function onProgress(event) {
  console.log("progress");
  progressCounter += 1;
  progressCounterEl.innerText = progressCounter;
  if (video.buffered && video.buffered.length && video.duration) {
    var width = (video.buffered.end(0) / video.duration) * 100;
    progressBarEl.style.width =  width+ '%';
    console.log(width);
  }
}

})(window);
