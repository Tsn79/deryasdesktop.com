//click sound
const clickSound = document.querySelector('.click-sound');
document.querySelector('body').addEventListener('click', function () {
    clickSound.autoplay = true;
    clickSound.load();
  });

//meme generator
const memeExe = {
  gallery: document.querySelector("#meme-gallery"),
  canvas: document.querySelector("#meme-canvas"),
  container: document.querySelector("#meme-container"),
  uploadBtn: document.querySelector("#meme-uploadBtn"),
  downloadBtn: document.querySelector("#meme-downloadBtn"),
  galleryItems: document.querySelectorAll(".thumb")
}

var ctx = memeExe.canvas.getContext("2d");

//render selected gallery image onto canvas
function renderMemeToCanvas(event) {
  var image = new Image();
  image.onload = drawMeme;
  image.src = event.target.style.backgroundImage
    .slice(4, -1)
    .replace(/"/g, "");
 
  if(event.target.className === "thumb") {
    addActive(event.target);
  }   
}

//Change clicked meme frame style
function addActive(meme) {
  var memes = Array.from(memeExe.galleryItems);
  var clicked = memes.find(meme => meme.classList.contains("active"));
  if(clicked) {
    clicked.classList.remove("active");
  }
  meme.classList.add("active");
}


function drawMeme() {
  var meme = setMemeSize(this.width, this.height, 300, 300);

  //set canvas container same as meme dimensions
  memeExe.canvas.width = meme.width;
  memeExe.canvas.height = meme.height;

  memeExe.container.width = meme.width;
  memeExe.container.height = meme.height;

  ctx.drawImage(this, 0, 0, meme.width, meme.height);
}

function setMemeSize(memeWidth, memeHeight, targetWidth, targetHeight) {
  var result = { width:0, height:0 };
  var ratio = memeWidth / memeHeight;

  //set width to height proportion
  result.width = targetWidth;
  result.height = targetHeight / ratio;

  //if calculated height is more than target height, set width proportionally
  if (result.height > targetHeight) {
    result.height = targetHeight;
    result.width = targetWidth * ratio;
  }

  return result;

}

memeExe.gallery.addEventListener("click", renderMemeToCanvas);


