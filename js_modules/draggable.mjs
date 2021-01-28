export class Draggable {
  constructor(el, header = "") {
    this.el = el;
    this.header = header;
    this.shiftX = null;
    this.shiftY = null;
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
    this.eventType = "";
    this.addEventHandlers();
    this.isDragging = false;
  }

  addEventHandlers() {
    //drag from header
    if (this.header) { 
      this.header.onmousedown = this.onPointerDown;
    } else {
    //else drag from body
      this.el.addEventListener("mousedown", this.onPointerDown);
    }
    //this.el.addEventListener("dragstart", (e) => e.preventDefault());
    document.addEventListener("mouseup", this.onPointerUp);
  }

  onPointerDown(e) {
    e = e || window.event;
    this.isDragging = true;
    //this.eventType = e.pointerType === "mouse" ? "mouse" : "pointer";
    this.eventType = "mouse";
    this.getDragPointer(e.clientX, e.clientY);
    this.el.style.cursor = 'url("../images/cursor_drag.png"), auto';
    document.addEventListener(this.eventType.concat("move"), this.onPointerMove);
  }

  getDragPointer(x, y) {
    const elRect = this.el.getBoundingClientRect();
    this.shiftX = x - elRect.left;
    this.shiftY = y - elRect.top;
  }

  onPointerMove(e) {
    e = e || window.event;
    var x = e.pageX;
    var y = e.pageY;

    if(this.isDragging) {
      var leftPosition = x - this.shiftX < 0 ? 0 : x - this.shiftX;
  
      if (this.el.offsetWidth + leftPosition > document.body.clientWidth) {
        leftPosition = document.body.clientWidth - this.el.offsetWidth;
      }
  
      var maxTopPos = document.querySelector(".navigation").offsetHeight;
      var topPosition = y - this.shiftY < maxTopPos ? maxTopPos : y - this.shiftY;
  
      if (this.el.offsetHeight + topPosition > document.body.clientHeight) {
        topPosition = document.body.clientHeight - this.el.offsetHeight;
      }
  
      //set responsive constraints for dragging object
      var el = document.querySelector("html");
      var style = window.getComputedStyle(el, null).getPropertyValue("font-size");
      var fontSize = parseInt(style);

      this.el.style.left = `${leftPosition / fontSize}rem`;
      this.el.style.top = `${topPosition / fontSize}rem`;
      }
  
  }

  onPointerUp() {
    this.isDragging = false;
  //  document.removeEventListener(this.eventType.concat("move"), this.onPointerMove);
    this.el.style.cursor = "";
  }
}