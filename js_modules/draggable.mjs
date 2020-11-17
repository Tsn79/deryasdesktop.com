export class Draggable {
    constructor(el, header="") {
    this.el = el
    this.header = header
    this.shiftX = null
    this.shiftY = null
    this.offsetWidth = this.el.offsetWidth;
    this.offsetHeight = this.el.offsetHeight;
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.addEventHandlers()
    }
    
    addEventHandlers() {
      if(this.header) {
        //drag from header
        this.header.addEventListener('mousedown', this.onMouseDown)
      } else {
        this.el.addEventListener('mousedown', this.onMouseDown)
      }
    
    this.el.addEventListener('dragstart', e => e.preventDefault())
    document.addEventListener('mouseup', this.onMouseUp)
    }
    
    onMouseDown(e) { 
    e = e || window.event;
    //e.preventDefault();
    this.getDragPointer(e.clientX, e.clientY)
    this.prepareElement()
    this.moveElementTo(e.pageX, e.pageY)
    document.addEventListener('mousemove', this.onMouseMove)
    }
    
    getDragPointer(x, y) {
    const elRect = this.el.getBoundingClientRect()
    this.shiftX = x - elRect.left
    this.shiftY = y - elRect.top
    
    }
    
    prepareElement() {
    //this.el.style.position = 'absolute'
    this.el.style.zIndex = 999
    }
    
    moveElementTo(x, y) {
    var leftPosition = x - this.shiftX < 0 ? 0 : x - this.shiftX;

    if(this.offsetWidth + leftPosition > document.body.clientWidth) {
      leftPosition = document.body.clientWidth - this.offsetWidth;
    }
    
    var maxTopPos = document.querySelector(".navigation").offsetHeight;
    var topPosition = y - this.shiftY < maxTopPos ? maxTopPos : y - this.shiftY
  
    if(this.offsetHeight + topPosition > document.body.clientHeight) {
      topPosition = document.body.clientHeight - this.offsetHeight;
    }
    this.el.style.left = `${leftPosition/10}rem`;
    this.el.style.top = `${(topPosition/10)}rem`;
    }
    
    onMouseMove(e) {
    e = e || window.event;
    this.moveElementTo(e.pageX, e.pageY)
    }
    
    onMouseUp(e) {
    document.removeEventListener('mousemove', this.onMouseMove)
    }
    
    }