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

drummer.audio = (function () {
  var context,
    dest,
    mediaRecorder,
    recordToggled = true,
    chunks = [],
    analyser,
    source,
    drawVisual;
  return {
    context: context,
    dest: dest,
    mediaRecorder: mediaRecorder,
    recordToggled: recordToggled,
    chunks: chunks,
    analyser: analyser,
    source: source,
    drawVisual: drawVisual,
  };
})();

drummer.playback = (function () {
  var songLength,
    currTime = 0,
    getDuration;
  return {
    songLength: songLength,
    currTime: currTime,
    getDuration: getDuration,
  };
})();

//***************************AUDIO RECORD***************************************//

drummer.createSound = function () {
  //create an audio context
  drummer.audio.context = new (window.AudioContext ||
    window.webkitAudioContext ||
    window.mozAudioContext)();

  drummer.audio.dest = drummer.audio.context.createMediaStreamDestination();
  drummer.audio.mediaRecorder = new MediaRecorder(drummer.audio.dest.stream);

  var createAudioTrack = function (context, audioEls) {
    var tracks = [];
    audioEls.forEach((ele) => {
      var track = context.createMediaElementSource(ele);
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

  createAudioTrack(drummer.audio.context, Array.from(drummer.sounds)).connect(
    drummer.audio.dest,
    drummer.audio.context.destination
  );

  drummer.audio.mediaRecorder.ondataavailable = function (evt) {
    // push each chunk (blobs) in an array
    drummer.audio.chunks.push(evt.data);
  };

  drummer.audio.mediaRecorder.onstop = function (evt) {
    // Make blob out of our blobs, and open it.
    var blob = new Blob(drummer.audio.chunks, {
      type: "audio/wav; codecs=wav",
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

drummer.printRecordMsg = function (msg = "") {
  var ctx = drummer.ctx;
  //clear canvas
  ctx.clearRect(0, 0, drummer.canvas.width, drummer.canvas.height);
  //capitalize first letter
  msg = msg
    ? msg.replace(/(^\w{1})|(\s{1}\w{1})/g, (match) => match.toUpperCase())
    : null;
  ctx.font = '45px "VT323", Lato';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgb(239, 202, 8)";
  ctx.shadowColor = "red";
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;
  ctx.fillText(msg, drummer.canvas.width/2, drummer.canvas.height/2);
};

//https://www.thetopsites.net/article/52375280
//make sure duration does not return infinity with html audio tag
drummer.playback.getDuration = function (url, next) {
  var _player = new Audio(url);
  _player.addEventListener(
    "durationchange",
    function (e) {
      if (this.duration != Infinity) {
        var duration = this.duration;
        _player.remove();
        next(duration);
      }
    },
    false
  );
  _player.load();
  _player.currentTime = 24 * 60 * 60; //fake big time
  _player.volume = 0;
  _player.play();
  //waiting...
};

drummer.visualize = function () {
  if (drummer.audio.source === undefined) {
    drummer.audio.source = drummer.audio.context.createMediaElementSource(
      drummer.record
    );
  }

  const analyser = drummer.audio.context.createAnalyser();
  analyser.fftSize = 2048;
  var bufferLength = analyser.frequencyBinCount;
  var dataArray = new Uint8Array(bufferLength);
  drummer.audio.source.connect(analyser);
  analyser.connect(drummer.audio.context.destination);

  function draw() {
    const WIDTH = drummer.canvas.width;
    const HEIGHT = drummer.canvas.height;

    drummer.audio.drawVisual = requestAnimationFrame(draw);
    analyser.getByteTimeDomainData(dataArray);

    drummer.ctx.shadowOffsetX = 0;
    drummer.ctx.shadowOffsetY = 0;

    drummer.ctx.fillStyle = "rgb(0, 0, 0)";
    drummer.ctx.fillRect(0, 0, WIDTH, HEIGHT);

    drummer.ctx.lineWidth = 2;
    drummer.ctx.strokeStyle = "rgb(35, 218, 206)";

    drummer.ctx.beginPath();

    var sliceWidth = (WIDTH * 1.0) / bufferLength;
    var x = 0;

    for (var i = 0; i < bufferLength; i++) {
      var v = dataArray[i] / 128.0;
      var y = (v * HEIGHT) / 2;

      if (i === 0) {
        drummer.ctx.moveTo(x, y);
      } else {
        drummer.ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    drummer.ctx.lineTo(drummer.canvas.width, drummer.canvas.height / 2);
    drummer.ctx.stroke();

    (function createProgressBar() {
      var barPos = 0;
      var barWidth = 6;
      var barHeight = HEIGHT;
      barPos =
        (drummer.playback.currTime * (WIDTH - barWidth)) /
        drummer.playback.songLength; //-0.06
      drummer.ctx.moveTo(0, 0);
      drummer.ctx.fillStyle = "rgb(254, 246, 171)";
      drummer.ctx.fillRect(barPos, 0, barWidth, barHeight);
    })();
  }
  draw();
};

//event listeners
drummer.record.addEventListener("timeupdate", function () {
  //console.log("current time is " + this.currentTime);
  drummer.playback.currTime = this.currentTime;
});

drummer.buttons.record.addEventListener("click", function () {
  if (!drummer.audio.context) {
    drummer.createSound();
  }

  if (drummer.audio.recordToggled) {
    drummer.audio.chunks = [];
    drummer.audio.mediaRecorder.start();
    window.cancelAnimationFrame(drummer.audio.drawVisual);
    drummer.printRecordMsg("recording..");
    drummer.buttons.record.style.background = "yellow";
    console.log("start recording");
    drummer.audio.recordToggled = !drummer.audio.recordToggled;
  } else {
    drummer.buttons.record.style.background = "";
    drummer.visualize();
    drummer.audio.mediaRecorder.requestData();
    drummer.audio.mediaRecorder.stop();
    drummer.audio.recordToggled = !drummer.audio.recordToggled;
  }
});

drummer.buttons.play.addEventListener("click", function () {
  drummer.record.play();
  //getData();
  drummer.playback.getDuration(drummer.record.src, function (duration) {
    console.log("new duration is ");
    console.log(duration);
    drummer.playback.songLength = duration;
  });
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

//focus drummer window when it is open
window.onhashchange = function () {
  if (location.hash === "#drummer") {
    drummer.drummerPane.focus();
  } else {
    drummer.drummerPane.blur();
  }
};
