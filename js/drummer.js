const drummer = {
  buttons: {},
};

drummer.drummerPane = document.querySelector("#drummer");

drummer.buttons.record = document.querySelector(".record");
drummer.buttons.pause = document.querySelector(".pause");
drummer.buttons.play = document.querySelector(".play");
drummer.buttons.reload = document.querySelector(".stop");

drummer.screen = document.querySelector(".playback-screen");
drummer.canvas = document.querySelector(".visualizer");
drummer.ctx = drummer.canvas.getContext("2d");
drummer.welcome = document.querySelector(".hello");
drummer.recordingBg = document.querySelector(".recording");
drummer.recordedBg = document.querySelector(".recorded");
drummer.progressBar = document.querySelector(".progress-bar");

drummer.sounds = document.querySelectorAll(".drum-sound");
drummer.record = document.querySelector(".recorded-audio");

drummer.isActive;

drummer.audio = (function () {
  var context,
    dest,
    mediaRecorder,
    isRecording = false,
    chunks = [],
    analyser,
    source,
    drawVisual;
  return {
    context: context,
    dest: dest,
    mediaRecorder: mediaRecorder,
    isRecording: isRecording,
    chunks: chunks,
    analyser: analyser,
    source: source,
    drawVisual: drawVisual,
  };
})();

drummer.playback = (function () {
  var songLength,
    getDuration,
    endOfTimeLimit = false,
    timeout,
    maxRecordDuration = 10000; //ms
  return {
    songLength: songLength,
    getDuration: getDuration,
    endOfTimeLimit: endOfTimeLimit,
    timeout: timeout,
    maxRecordDuration: maxRecordDuration
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
      type: "audio/mp4; codecs=mp4",
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

//https://www.thetopsites.net/article/52375280
//make sure duration does not return infinity with html audio tag
drummer.playback.getDuration = function (url, next) {
  var _player = new Audio(url);
  _player.addEventListener(
    "durationchange",
    function () {
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

    var requestAnimationFrame =
      window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame;

    drummer.audio.drawVisual = requestAnimationFrame(draw);
    analyser.getByteTimeDomainData(dataArray);

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
  }
  draw();
};

drummer.toggleZIndex = function (element) {
  var max = 1;
  var next = element.nextElementSibling,
    previous = element.previousElementSibling;

  while (next || previous) {
    if (next) {
      max = Math.max(parseInt(next.style.zIndex), max);
      next = next.nextElementSibling;
    }
    if (previous) {
      max = Math.max(parseInt(previous.style.zIndex), max);
      previous = previous.previousElementSibling;
    }
  }
  element.style.zIndex = `${max + 1}`;
};

drummer.buttonDisable = function (isTrue, ...arguments) {
  var isElementButton = arguments.every(
    (element) => element.nodeName.toLowerCase() == "button"
  );
  if (arguments.length > 0 && isElementButton) {
    for (var i = 0; i < arguments.length; i++) {
      if (isTrue == false) {
        arguments[i].disabled = false;
        //arguments[i].classList.remove("disable");
      } else {
        arguments[i].disabled = true;
        //arguments[i].classList.add("disable");
      }
    }
  }
};

drummer.reset = function () {
  drummer.toggleZIndex(drummer.welcome);
  //if recording, stop and delete data
  if (drummer.audio.isRecording == true) {
    drummer.audio.chunks = [];
    drummer.buttons.record.style.background = "";
    drummer.audio.mediaRecorder.requestData();
    drummer.audio.mediaRecorder.stop();
    drummer.audio.isRecording = !drummer.audio.isRecording;
    clearTimeout(drummer.playback.timeout);
    //if audio is playing
  } else {
    drummer.record.pause();
  }
};

//event listeners
drummer.record.addEventListener("timeupdate", function () {
  var that = this;
  function moveProgressBar() {
    var barPos = (that.currentTime * 98.5) / drummer.playback.songLength;
    drummer.progressBar.style.left = `${barPos}%`;
  }
  moveProgressBar();
});

drummer.handleRecord = function () {
  console.time("record");

  if (!drummer.audio.context) {
    drummer.createSound();
  }

  drummer.audio.isRecording = !drummer.audio.isRecording;

  //if record button pressed to start record
  if (drummer.audio.isRecording) {
    startRecord();
    //set a max time limit for record
    drummer.playback.timeout = setTimeout(() => {
      //if timeout ended record
      drummer.playback.endOfTimeLimit = true;
      return finishRecord();
    }, drummer.playback.maxRecordDuration);
    //if user ended record
    drummer.playback.endOfTimeLimit = false;
    //when record button is pressed to end record
  } else if (!drummer.audio.isRecording && !drummer.playback.endOfTimeLimit) {
    clearTimeout(drummer.playback.timeout);
    return finishRecord();
  }

  function startRecord() {
    window.cancelAnimationFrame(drummer.audio.drawVisual);
    drummer.audio.chunks = [];
    //if record is playing, pause before re-record
    drummer.record.pause();
    drummer.toggleZIndex(drummer.recordingBg);
    drummer.buttonDisable(
      true,
      drummer.buttons.play,
      drummer.buttons.pause,
      drummer.buttons.reload
    );
    drummer.buttons.record.style.background = "yellow";
    drummer.audio.mediaRecorder.start();
  }

  function finishRecord() {
    drummer.audio.isRecording = false;
    drummer.buttons.record.style.background = "";
    drummer.toggleZIndex(drummer.recordedBg);
    drummer.buttonDisable(
      false,
      drummer.buttons.play,
      drummer.buttons.pause,
      drummer.buttons.reload
    );
    drummer.audio.mediaRecorder.requestData();
    drummer.audio.mediaRecorder.stop();
  }

  console.timeEnd("record");
};

drummer.buttons.record.addEventListener("click", function () {
  return drummer.handleRecord();
});

drummer.buttons.play.addEventListener("click", function () {
  drummer.record.play();
  drummer.toggleZIndex(drummer.screen);
  drummer.visualize();

  drummer.playback.getDuration(drummer.record.src, function (duration) {
    drummer.playback.songLength = duration;
  });
});

drummer.buttons.pause.addEventListener("click", function () {
  drummer.record.pause();
});

drummer.buttons.reload.addEventListener("click", function () {
  drummer.record.currentTime = 0;
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
    setTimeout(function () {
      drummer.reset();
    }, 200);
  }
};
