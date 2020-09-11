const drummer = {
  buttons: {},
};

drummer.drummerPane = document.querySelector("#drummer");

drummer.buttons.record = document.querySelector(".record");
drummer.buttons.pause = document.querySelector(".pause");
drummer.buttons.play = document.querySelector(".play");
drummer.buttons.stop = document.querySelector(".stop");

drummer.canvas = document.querySelector(".visualizer");
drummer.ctx = drummer.canvas.getContext("2d");

drummer.sounds = document.querySelectorAll(".drum-sound");
drummer.record = document.querySelector(".recorded-audio");
drummer.recordingTimeMS = 5000;

drummer.module = (function () {
  var audioCtx,
    dest,
    mediaRecorder,
    clicked = false,
    chunks = [];
  return {
    audioCtx: audioCtx,
    dest: dest,
    mediaRecorder: mediaRecorder,
    clicked: clicked,
    chunks: chunks,
  };
})();

//[X]Sound does not play while recording
//[X]Include multiple sound files
//[X]Give functionality cancel button
//[X]When record is pressed, rewrite on existing audio node
//[ ]Connect with canvas

//https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API

//***************************AUDIO RECORD***************************************//

drummer.init = function () {
  //create an audio context
  drummer.module.audioCtx = new (window.AudioContext ||
    window.webkitAudioContext ||
    window.mozAudioContext)();

  drummer.module.dest = drummer.module.audioCtx.createMediaStreamDestination();

  drummer.module.mediaRecorder = new MediaRecorder(drummer.module.dest.stream);

  var createAudioTrack = function (audioCtx, audioEls) {
    var tracks = [];
    audioEls.forEach((ele) => {
      var track = audioCtx.createMediaElementSource(ele);
      tracks.push(track);
    });
    return {
      connect: function (dest, ctxDest) {
        tracks.forEach((track) => {
          track.connect(dest);
          track.connect(ctxDest);
        });
      },
    };
  };

  createAudioTrack(drummer.module.audioCtx, Array.from(drummer.sounds)).connect(
    drummer.module.dest,
    drummer.module.audioCtx.destination
  );

  drummer.module.mediaRecorder.ondataavailable = function (evt) {
    // push each chunk (blobs) in an array
    drummer.module.chunks.push(evt.data);
  };

  drummer.module.mediaRecorder.onstop = function (evt) {
    // Make blob out of our blobs, and open it.
    let blob = new Blob(drummer.module.chunks, {
      type: "audio/ogg; codecs=opus",
    });
    //create new audio here
    drummer.record.src = URL.createObjectURL(blob);
  };
};

drummer.printOnCanvas = function (ctx, msg="") {
  //capitalize first letter
  msg = msg
    ? msg.replace(/(^\w{1})|(\s{1}\w{1})/g, (match) => match.toUpperCase())
    : null;
  ctx.font = '45px "VT323"';
  ctx.fillStyle = "rgb(239, 202, 8)";
  ctx.textAlign = "center";
  ctx.shadowColor = "red";
  ctx.shadowOffsetX = 5;
  ctx.shadowOffsetY = 5;
  ctx.fillText(msg, 150, 90);

  return {
    clear: function(canvas, isTrue) {
      if(isTrue) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }
};

//event listeners
drummer.buttons.record.addEventListener("click", function () {
  if (!drummer.module.audioCtx) {
    drummer.init();
  }

  if (!drummer.module.clicked) {
    drummer.module.chunks = [];
    drummer.module.mediaRecorder.start();
    drummer.printOnCanvas(drummer.ctx, "recording..");
    drummer.buttons.record.style.background = "yellow";
    console.log("start recording");
    drummer.module.clicked = true;
  } else {
    drummer.buttons.record.style.background = "";
    drummer.printOnCanvas(drummer.ctx).clear(drummer.canvas, true);
    drummer.module.mediaRecorder.requestData();
    drummer.module.mediaRecorder.stop();
    drummer.module.clicked = false;
  }
});

drummer.buttons.play.addEventListener("click", function () {
  drummer.record.play();
});

drummer.buttons.pause.addEventListener("click", function () {
  drummer.record.pause();
});

drummer.buttons.stop.addEventListener("click", function () {
  drummer.record.load();
});

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
