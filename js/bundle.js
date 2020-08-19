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
  memeText: document.querySelectorAll(".input-text"),
  get ctx() {
    return this.canvas.getContext("2d");
  }
}

//helper functions
memeExe.helperFunc = {};


//render selected gallery image onto canvas
memeExe.renderMemeToCanvas = function(event) {
  var image = new Image();
  image.onload = memeExe.drawMeme;
  image.src = extractSrcFromUrl(event.target);
 
  if(event.target.className === "thumb") {
    memeExe.toggleActive(event.target);
  }  
}

//https://jaketrent.com/post/addremove-classes-raw-javascript/
//Compatible with IE
memeExe.helperFunc.hasClass = function(ele, className) {
  if(ele.classList) {
    return ele.classList.contains(className)
  } else {
    return !!ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
  } 
}

memeExe.helperFunc.removeClass = function(ele, className) {
  if(ele.classList) {
    ele.classList.remove(className);
  }
  else if(memeExe.helperFunc.hasClass(ele, className)) {
    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
    ele.className=ele.className.replace(reg, ' ')
  }
}

memeExe.helperFunc.addClass = function(ele, className) {
  if (ele.classList)
    ele.classList.add(className)
  else if (!hasClass(ele, className)) ele.className += " " + className
}


memeExe.toggleActive = function(element) {
  var activeCls = document.body.querySelector(".active");
  if(activeCls) {
    memeExe.helperFunc.removeClass(activeCls, "active");
  }
  memeExe.helperFunc.addClass(element, "active");
}


memeExe.drawMeme = function() {
  var meme = setMemeSize(this.width, this.height, 300, 300);

  //set canvas container same as meme dimensions
  memeExe.canvas.width = meme.width;
  memeExe.canvas.height = meme.height;

  memeExe.container.width = meme.width;
  memeExe.container.height = meme.height;

  memeExe.ctx.drawImage(this, 0, 0, meme.width, meme.height);
  drawText(memeExe.textTop.value, "top", 20);
  drawText(memeExe.textBtm.value, "bottom", 18); 
}


function drawText(text, pos, font){
  var copy = text.toUpperCase(),
  yPos = "",
  xPos = "";

  switch (pos) {
    case 'top': 
      yPos = (memeExe.textTop.clientWidth/2)+1;
      xPos = memeExe.textTop.offsetTop+10;
      break;
    
    case 'bottom':
      yPos = (memeExe.textBtm.clientWidth/2)+1;
      xPos = memeExe.textBtm.offsetTop+10;
      break;
  }
  
  memeExe.ctx.textBaseline = 'top';
  memeExe.ctx.textAlign = 'center';
  memeExe.ctx.font = 'bold '+font+'px Helvetica';
  memeExe.ctx.shadowColor="#000";
  memeExe.ctx.shadowOffsetX=2;
  memeExe.ctx.shadowOffsetY=2;
  memeExe.ctx.shadowBlur=0;
  memeExe.ctx.fillStyle = '#fff';
  memeExe.ctx.fillText(copy, yPos, xPos);  
}


//NEWLY UPLOAD IMAGE IS NOT LISTED IN MEMEEXE.MEMEARR
memeExe.updateMeme = function() {
  setTimeout(function(){
    var image = new Image();
    image.onload = memeExe.drawMeme;
    //var activeCls = findElementClassByName("active", memeExe.gallery);
    var activeCls = document.querySelector(".active");
    image.src = extractSrcFromUrl(activeCls);    
  }, 1);
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

//during upload, drawmemetext should be inactive
//user meme upload 
function validateAndUploadMeme(event) {
  var memeFile = event.target.files[0];
  var validfileTypes = ["image/png", "image/jpg","image/jpeg"];
  if(memeFile && validfileTypes.includes(memeFile.type)) {
  var image = new Image(),
  URL = window.URL || window.webkitURL; 
  image.onload = memeExe.drawMeme;
  image.src = URL.createObjectURL(memeFile);
  appendMemeUploadToGallery(image);
  }
}


function downloadMeme() {
  var imageUrl = memeExe.canvas.toDataURL("image/png")
                .replace("image/png", "image/octet-stream"); 
  memeExe.downloadBtn.setAttribute("href", imageUrl);
}

//LAST ELEMENT CHILD IS NOT REMOVED FROM GALLERY
function appendMemeUploadToGallery(image) {
  var newEle = '';
  var src = image.src;
  newEle = document.createElement("div");
  newEle.style.backgroundImage = `url('${src}')`;
  newEle.className = "thumb";
  memeExe.gallery.prepend(newEle);
  memeExe.gallery.removeChild(memeExe.gallery.lastElementChild);
  memeExe.toggleActive(newEle);
}


function extractSrcFromUrl(galleryItem) {
  if(galleryItem) {
    return galleryItem.style.backgroundImage.slice(4, -1).replace(/"/g, "");
  }
}

memeExe.gallery.addEventListener("click", memeExe.renderMemeToCanvas);
memeExe.uploadBtn.addEventListener("change", validateAndUploadMeme);
memeExe.downloadBtn.addEventListener("click", downloadMeme);
Array.from(memeExe.memeText).forEach(text => {
  text.addEventListener("keydown", memeExe.updateMeme);
  text.addEventListener("keyup", memeExe.updateMeme);
  text.addEventListener("focus", memeExe.updateMeme);
}); 


//render first image on canvas 
window.onload = function() {
  var image = new Image();
    image.onload = memeExe.drawMeme;
    image.src = extractSrcFromUrl(memeExe.gallery.firstElementChild)
  memeExe.toggleActive(memeExe.gallery.firstElementChild);
};
