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
  galleryItems: document.querySelectorAll(".thumb"),
  get memeArr() {
    return Array.from(this.galleryItems);
  },
  get ctx() {
    return this.canvas.getContext("2d");
  }
}


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
  //var clicked = memeExe.memeArr.find(meme => meme.classList.contains("active"));
  var clicked = document.querySelector(".active");
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

  memeExe.ctx.drawImage(this, 0, 0, meme.width, meme.height);
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

//user meme upload
function uploadMeme(event) {
  var memeFile = event.target.files[0];
  var image = new Image();
  image.onload = drawMeme;
  image.src = URL.createObjectURL(memeFile);
  var newEle= document.createElement("div");
  newEle.style.backgroundImage = `url('${image.src}')`;
  newEle.className = "thumb";
  memeExe.gallery.prepend(newEle);
  memeExe.gallery.removeChild(memeExe.gallery.lastElementChild);
  addActive(newEle);
}

memeExe.gallery.addEventListener("click", renderMemeToCanvas);
memeExe.uploadBtn.addEventListener("change", uploadMeme, false);


