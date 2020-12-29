export class Draggable {
  constructor(el, header = "") {
    this.el = el;
    this.header = header;
    this.shiftX = null;
    this.shiftY = null;
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
    this.addEventHandlers();
  }

  addEventHandlers() {
    if (this.header) {
      //drag from header
      this.header.onpointerdown = this.onPointerDown;
    } else {
      this.el.addEventListener("pointerdown", this.onPointerDown);
    }

    this.el.addEventListener("dragstart", (e) => e.preventDefault());
    document.addEventListener("pointerup", this.onPointerUp);
  }

  onPointerDown(e) {
    e = e || window.event;
    this.el.style.cursor = 'url("../images/cursor_drag.png"), auto';
    this.getDragPointer(e.clientX, e.clientY);
    this.prepareElement();
    this.moveElementTo(e.pageX, e.pageY);
    document.addEventListener("pointermove", this.onPointerMove);
  }

  getDragPointer(x, y) {
    const elRect = this.el.getBoundingClientRect();
    this.shiftX = x - elRect.left;
    this.shiftY = y - elRect.top;
  }

  prepareElement() {
    this.el.style.zIndex = 999;
  }

  moveElementTo(x, y) {
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

  onPointerMove(e) {
    e = e || window.event;
    this.moveElementTo(e.pageX, e.pageY);
  }

  onPointerUp(e) {
    document.removeEventListener("pointermove", this.onPointerMove);
    this.el.style.cursor = "";
  }
}
