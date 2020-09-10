const drummer = {
    buttons: {}
};

drummer.drummerPane = document.querySelector("#drummer");
drummer.buttons.record = document.querySelector(".record");
drummer.buttons.pause = document.querySelector(".pause");
drummer.buttons.play = document.querySelector(".play");
drummer.buttons.stop = document.querySelector(".stop");
drummer.canvas = document.querySelector(".visualizer");
drummer.ctx = drummer.canvas.getContext("2d");

//test
drummer.sounds = document.querySelector(".drum");
drummer.record = document.querySelector(".recorded-audio");

drummer.recordingTimeMS = 5000;

//audio recording
//https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API
//https://mdn.github.io/web-dictaphone/
let audioCtx;
let dest;
let mediaRecorder;
let clicked = false;
let oscillatorNode;
let gainNode;
let constantNode;

let chunks = [];

//BUGS
//Sound does not play while recording

//https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API

function init() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext)();
 
  source = audioCtx.createMediaElementSource(drummer.sounds);

  dest = audioCtx.createMediaStreamDestination();

  mediaRecorder = new MediaRecorder(dest.stream);

  source.connect(dest);
  

  mediaRecorder.ondataavailable = function(evt) {
    // push each chunk (blobs) in an array
    chunks.push(evt.data);
  };

  mediaRecorder.onstop = function(evt) {
    // Make blob out of our blobs, and open it.
    let blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
    drummer.record.src = URL.createObjectURL(blob);
  };
}

drummer.buttons.record.addEventListener('click', function() {
  if(!audioCtx) {
    init();
  }

  if (!clicked) {
    mediaRecorder.start();
    drummer.buttons.record.style.background = "yellow";
    console.log("start recording")
    clicked = true;
  } else {
    drummer.buttons.record.style.background = "";
    mediaRecorder.requestData();
    mediaRecorder.stop();
  }

})

drummer.buttons.play.addEventListener('click', function() {
  drummer.record.play();
})


drummer.buttons.pause.addEventListener('click', function() {
  drummer.record.pause();
})















drummer.drummerPane.addEventListener("keyup", function (e) {
  //now remove the class
  if (document.querySelector(`.key[data-key='${e.keyCode}']`)) {
    document
      .querySelector(`.key[data-key='${e.keyCode}']`)
      .classList.remove("playing");
  }
});


//focus drummer when it is open
window.onhashchange = function () {
  if (location.hash === "#drummer") {
    drummer.drummerPane.focus();
  } else {
    drummer.drummerPane.blur();
  }
};


drummer.drummerPane.addEventListener("keydown", function (e) {
    var audioMatch = document.querySelector(`audio[data-key='${e.keyCode}']`);
    if (audioMatch) {
      //add playing class to the corresponding data
      document
        .querySelector(`.key[data-key='${e.keyCode}']`)
        .classList.add("playing");
      audioMatch.autoplay = true;
      audioMatch.load();
    }
  });