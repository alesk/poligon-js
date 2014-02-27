/**
 * Test for requestFullscreen api.
 */

var enterFullScreenEl = document.getElementById('enterFullScreen'),
    exitFullScreenEl = document.getElementById('exitFullScreen'),
    fullScreenableEl = document.getElementById('fullScreenable'),
    monitorEl = document.getElementById('monitor');


enterFullScreenEl.addEventListener('click', enterFullScreen);
exitFullScreenEl.addEventListener('click', exitFullScreen);
document.addEventListener('fullscreenchange', reportSuccess);
document.addEventListener('webkitfullscreenchange', reportSuccess);

document.addEventListener('fullscreenerror', reportError);
document.addEventListener('webkitfullscreenerrror', reportError);

function enterFullScreen() {

  if (fullScreenableEl.requestFullscreen) {
    fullScreenableEl.requestFullscreen();
    monitorEl.innerText = 'requestFullscreen';
    return;
  }

  if (fullScreenableEl.webkitRequestFullscreen) {
    fullScreenableEl.webkitRequestFullscreen();
    monitorEl.innerText = 'webkitRequestFullscreen';
    return;
  }

  alert("No requestFullscreen API supported");
}

function exitFullScreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
    return;
  }

  if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
    return;
  }
}

function reportSuccess() { monitorEl.innerText = monitorEl.innerText + ': success'; }
function reportError() { monitorEl.innerText = monitorEl.innerText + ': error'; }
