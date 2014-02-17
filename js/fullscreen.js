/* jshint -W061 */
(function(){
var enterFullScreenEl = document.getElementById('enterFullScreen'),
    exitFullScreenEl = document.getElementById('exitFullScreen'),
    fullScreenableEl = document.getElementById('fullScreenable'),
    lastTouch = null,
    pullingInterval = null;


var OBSERVABLES = {
  'window': ['scrollX','pageXOffset', 'scrollY', 'pageYOffset', 'outerWidth', 'innerWidth', 'outerHeight', 'innerHeight'],
  'screen': ['width', 'height'],
  'document.body': ['clientWidth', 'clientHeight'],
  'fullScreenable': ['clientWidth', 'clientHeight', 'offsetLeft', 'offsetTop', 'style.left', 'style.top']
};



enterFullScreenEl.addEventListener('touchstart', enterFullScreen);
exitFullScreenEl.addEventListener('touchstart', function(event){
  exitFullScreen();
  });


function cancelEvent(event) {
  //event.stopPropagation();
  event.preventDefault();
}

function doubleTapCanceler(event) {
    var now = Date.now();
    if (lastTouch && (now - lastTouch) < 500 ) 
      cancelEvent(event);
    lastTouch = now;
}

function enterFullScreen() {
  pullingInterval = setInterval(pull, 30);
  fullScreenableEl.className = 'fullScreen';
  document.addEventListener('touchmove', cancelEvent);

  // Disabling touchscreen on element disables scroll on swipe and zoom in
  // doubletap on most devices but also disables input fields.
  document.addEventListener('touchstart', cancelEvent);
}

function exitFullScreen() {
  clearInterval(pullingInterval);
  fullScreenableEl.className = '';
  document.removeEventListener('touchmove', cancelEvent);
  document.removeEventListener('touchstart', doubleTapCanceler);
  document.body.style.overflow = 'hidden';
}

function pull() {
  var scrollX = window.scrollX || window.pageXOffset,
      scrollY = window.scrollY || window.pageYOffset;

  document.getElementById('monitor').innerHTML = observe().join('');

  // fix position of element if scrollX changes

  // http://stackoverflow.com/questions/1248081/get-the-browser-viewport-dimensions-with-javascript
  var width  = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
      height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

  var style = fullScreenableEl.style;
  if (scrollX !== 0)
    style.left = (scrollX - 1) + "px";
  else
    style.left = '0px';

  if (scrollY !== 0)
    style.top =  (scrollY - 1) + "px";
  else
    style.top = "0px";

  /*width = document.body.clientWidth;
  height = document.body.clientHeight;*/
  style.width = (width + 1) + 'px'; 
  style.height = (height + 1) + 'px'; 

  window.scrollTo(0,0);

}

if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {
    var viewportmeta = document.querySelector('meta[name="viewport"]');
    if (viewportmeta) {
        viewportmeta.content = 'width=device-width, minimum-scale=1.0, maximum-scale=1.0, initial-scale=1.0';
        document.body.addEventListener('gesturestart', function () {
            viewportmeta.content = 'width=device-width, minimum-scale=0.25, maximum-scale=1.6';
        }, false);
    }
}

function observe() {
  var ret = [];

  for (var key in OBSERVABLES) {
    ret.push('<p><b>' + key + '</b> ');
    for(var idx in OBSERVABLES[key]) {
        var property = OBSERVABLES[key][idx],
            value = null;
        try { value = eval(key+'.'+property); } catch(e) {}
        value = (value === null) ? document.getElementById(key)[property] : value;        
        ret.push(property+': <span class="value">'+value+'</span>, ');
    }
    ret.push('</p>');
  }

  return ret;
}

function multiplyLoremIpsum() {
  var loremIpsumEl = document.getElementById('loremIpsum');
  for(var i = 0; i < 10; i+=1) {
    document.body.appendChild(loremIpsumEl.cloneNode(true /* deep */));
  }
}

multiplyLoremIpsum();

})();
