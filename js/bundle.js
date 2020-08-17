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
  textTop: document.querySelector(".canvas-text--top"),
  textBtm: document.querySelector(".canvas-text--bottom"),
  get memeArr() {
    return Array.from(this.galleryItems);
  },
  get ctx() {
    return this.canvas.getContext("2d");
  }
}

//render first image on canvas 
window.onload = function () {
  var image = new Image();
  image.onload = drawMeme;
  image.src = extractSrcFromUrl(memeExe.memeArr[0]);
  addActive(memeExe.memeArr[0]);
}


//render selected gallery image onto canvas
function renderMemeToCanvas(event) {
  var image = new Image();
  image.onload = drawMeme;
  image.src = extractSrcFromUrl(event.target);
 
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
  drawText();
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
function validateAndUploadMeme(event) {
  var memeFile = event.target.files[0];
  var validfileTypes = ["image/png", "image/jpg","image/jpeg"];
  if(memeFile && validfileTypes.includes(memeFile.type)) {
  var image = new Image(),
  URL = window.URL || window.webkitURL; 
  image.onload = drawMeme;
  image.src = URL.createObjectURL(memeFile);
  appendMemeUploadToGallery(image);
  }
}


function downloadMeme() {
  var imageUrl = memeExe.canvas.toDataURL("image/png")
                .replace("image/png", "image/octet-stream"); 
  memeExe.downloadBtn.setAttribute("href", imageUrl);
}

//when input is active, reflect changes on canvas
//https://javascript.info/coordinates
//https://stackoverflow.com/questions/3543687/how-do-i-clear-text-from-the-canvas-element
function drawText(e){ 
  memeExe.ctx.textBaseline = 'top';
  memeExe.ctx.textAlign = 'center';
  memeExe.ctx.font = '18px Roboto';
  memeExe.ctx.fillStyle = "rgba(255, 255, 255, 0)";
  memeExe.ctx.fillText(memeExe.textTop.value.toUpperCase(), memeExe.textTop.clientWidth/2, memeExe.textTop.offsetTop);

  memeExe.ctx.textBaseline = 'top';
  memeExe.ctx.textAlign = 'center';
  memeExe.ctx.font = '18px Roboto';

  memeExe.ctx.fillStyle = '#000';  
  memeExe.ctx.fillText(memeExe.textTop.value.toUpperCase(), memeExe.textTop.clientWidth/2, memeExe.textTop.offsetTop);
}



function appendMemeUploadToGallery(image) {
  var newEle = '';
  var src = image.src;
  newEle = document.createElement("div");
  newEle.style.backgroundImage = `url('${src}')`;
  newEle.className = "thumb";
  memeExe.gallery.prepend(newEle);
  memeExe.gallery.removeChild(memeExe.gallery.lastElementChild);
  addActive(newEle);
}


function extractSrcFromUrl(galleryItem) {
  return galleryItem.style.backgroundImage.slice(4, -1).replace(/"/g, "");
}

memeExe.gallery.addEventListener("click", renderMemeToCanvas);
memeExe.uploadBtn.addEventListener("change", validateAndUploadMeme, false);
memeExe.downloadBtn.addEventListener("click", downloadMeme);
memeExe.textTop.addEventListener("input", drawText);


