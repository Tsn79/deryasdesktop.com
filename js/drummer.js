const drummer = {
  buttons: {},
};

drummer.drummerPane = document.querySelector("#drummer");

drummer.buttons.record = document.querySelector(".record");
drummer.buttons.pause = document.querySelector(".pause");
drummer.buttons.play = document.querySelector(".play");
drummer.buttons.stop = document.querySelector(".stop");

drummer.canvasContainer = document.querySelector(".drummer__canvas-box");
drummer.canvas = document.querySelector(".visualizer");
drummer.ctx = drummer.canvas.getContext("2d");

drummer.sounds = document.querySelectorAll(".drum-sound");
drummer.record = document.querySelector(".recorded-audio");

drummer.module = (function () {
  var audioCtx,
    dest,
    mediaRecorder,
    clicked = false,
    chunks = [],
    analyser,
    source,
    drawVisual;
  return {
    audioCtx: audioCtx,
    dest: dest,
    mediaRecorder: mediaRecorder,
    clicked: clicked,
    chunks: chunks,
    analyser: analyser,
    source: source,
    drawVisual: drawVisual,
  };
})();

//[X]Sound does not play while recording
//[X]Include multiple sound files
//[X]Give functionality cancel button
//[X]When record is pressed, rewrite on existing audio node
//[X]Connect with canvas
//[X]While song is playing, display sound waves on canvas

//[X]When record is pressed, change the canvas into recording.
//[X]When record is pressed again, change the canvas into visualize.

//Reset canvas width and height to container

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

drummer.initCanvas = (function () {
  //visually fill the positioned parent
  drummer.canvas.style.width = "100%";
  drummer.canvas.style.height = "100%";

  //set the internal size to match
  drummer.canvas.width = drummer.canvas.offsetWidth;
  drummer.canvas.height = drummer.canvas.offsetHeight;
})();

drummer.printOnCanvas = function (msg = "") {
  var ctx = drummer.ctx;
  //capitalize first letter
  msg = msg
    ? msg.replace(/(^\w{1})|(\s{1}\w{1})/g, (match) => match.toUpperCase())
    : null;
  ctx.font = '45px "VT323"';
  ctx.fillStyle = "rgb(239, 202, 8)";
  ctx.shadowColor = "red";
  ctx.shadowOffsetX = 5;
  ctx.shadowOffsetY = 5;
  ctx.fillText(msg, 80, 60);
};

drummer.visualize = function (audioElement) {
  if (drummer.module.source === undefined) {
    drummer.module.source = drummer.module.audioCtx.createMediaElementSource(
      audioElement
    );
  }

  const analyser = drummer.module.audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  var bufferLength = analyser.frequencyBinCount;
  var dataArray = new Uint8Array(bufferLength);

  drummer.module.source.connect(analyser);
  analyser.connect(drummer.module.audioCtx.destination);

  function draw() {
    const WIDTH = drummer.canvas.width;
    const HEIGHT = drummer.canvas.height;

    drummer.module.drawVisual = requestAnimationFrame(draw);
    analyser.getByteTimeDomainData(dataArray);

    drummer.ctx.fillStyle = "rgb(200, 200, 200)";
    drummer.ctx.fillRect(0, 0, WIDTH, HEIGHT);

    drummer.ctx.lineWidth = 2;
    drummer.ctx.strokeStyle = "rgb(0, 0, 0)";

    drummer.ctx.beginPath();

    let sliceWidth = (WIDTH * 1.0) / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      let v = dataArray[i] / 128.0;
      let y = (v * HEIGHT) / 2;

      if (i === 0) {
        drummer.ctx.moveTo(x, y);
      } else {
        drummer.ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    drummer.ctx.lineTo(drummer.canvas.width, drummer.canvas.height / 2);
    drummer.ctx.stroke();
  }
  draw();
};

//event listeners
drummer.buttons.record.addEventListener("click", function () {
  if (!drummer.module.audioCtx) {
    drummer.init();
  }

  if (!drummer.module.clicked) {
    drummer.module.chunks = [];
    drummer.module.mediaRecorder.start();
    window.cancelAnimationFrame(drummer.module.drawVisual);
    clearCanvas();
    drummer.printOnCanvas("recording..");
    drummer.buttons.record.style.background = "yellow";
    console.log("start recording");
    drummer.module.clicked = true;
  } else {
    drummer.buttons.record.style.background = "";
    clearCanvas();
    drummer.visualize(drummer.record);
    drummer.module.mediaRecorder.requestData();
    drummer.module.mediaRecorder.stop();
    drummer.module.clicked = false;
  }

  function clearCanvas() {
    drummer.ctx.clearRect(0, 0, drummer.canvas.width, drummer.canvas.height);
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
