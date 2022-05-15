
//MOUSE CLICK
canvas.addEventListener("click", onClick, false);
canvas.addEventListener("contextmenu", onContextmenu, false);

canvas.addEventListener("mousemove", onMouseMove, false);
canvas.addEventListener("mousedown", onMouseDown, false);
document.addEventListener("mouseup", onMouseUp, false);
canvas.addEventListener("mousewheel", onMouseWheel, false);


var mouse = [0,0];

var mouseClickL = false;
var mouseClickR = false;

var mousePressL = false;
var mousePress1 = false;
var mousePressR = false;

var mouseWheel = 0;


function resetInput(){
	mouseClickL = false;
	mouseClickR = false;
	mouseWheel = 0;
}

//MOUSE EVENTS
function onClick(e){
	mouseClickL = true;
}

function onContextmenu(e){
	mouseClickR = true;
}


function onMouseMove(e)
{
  var w = (canvas.width/parseInt(canvas.offsetWidth, 10));
  var h = (canvas.height/parseInt(canvas.offsetHeight, 10));

  var x = e.x * w;
  var y = e.y * h;

  x -= canvas.offsetLeft * w - document.body.scrollLeft/2;
  y -= canvas.offsetTop * h - document.body.scrollTop/2;

  mouse = [x, canvas.height - y, 0];
  
  //console.log(mouseWorld);
}

function onMouseDown(e){
	if(e.button == 0){	//left click
		mousePressL = true;
	}
	else if(e.button == 1){		//wheel click
		mousePress1 = true;
	}
	else if(e.button == 2){		//right click
		mousePressR = true;
	}
}

function onMouseUp(e){
	
	if(e.button == 0){
		mousePressL = false;
	}
	else if(e.button == 1){
		mousePress1 = false;
	}
	else if(e.button == 2){
		mousePressR = false;
	}
}

function onMouseWheel(e){
	var wheel = e.wheelDelta/120;
	
	mouseWheel = wheel;
	//canvas.width += 2*wheel*8;
	//canvas.height += wheel*8;
}


//BUTTONS
(function() {
    var pressedKeys = {};

    function setKey(event, status) {
        var code = event.keyCode;
        var key;

        switch(code) {
		case 8 :	key = 'BACKSPACE'; break;
		case 9 :	key = 'TAB'; break;
		case 13:	key = 'ENTER'; break;
		case 16:	key = 'SHIFT'; break;
		case 17:	key = 'CTRL'; break;
		case 18:	key = 'ALT'; break;
		case 27:	key = 'ESC'; break;
        case 32:	key = 'SPACE'; break;
        case 37:	key = 'LEFT'; break;
        case 38:	key = 'UP'; break;
        case 39:	key = 'RIGHT'; break;
        case 40:	key = 'DOWN'; break;
		
		case 48:	key = '0'; break;
		case 49:	key = '1'; break;
		case 50:	key = '2'; break;
		case 51:	key = '3'; break;
		case 52:	key = '4'; break;
		case 53:	key = '5'; break;
		case 54:	key = '6'; break;
		case 55:	key = '7'; break;
		case 56:	key = '8'; break;
		case 57:	key = '9'; break;
		
		case 65:	key = 'A'; break;
		case 66:	key = 'B'; break;
		case 67:	key = 'C'; break;
		case 68:	key = 'D'; break;
		case 69:	key = 'E'; break;
		case 70:	key = 'F'; break;
		case 71:	key = 'G'; break;
		case 72:	key = 'H'; break;
		case 73:	key = 'I'; break;
		case 74:	key = 'J'; break;
		case 75:	key = 'K'; break;
		case 76:	key = 'L'; break;
		case 77:	key = 'M'; break;
		case 78:	key = 'N'; break;
		case 79:	key = 'O'; break;
		case 80:	key = 'P'; break;
		case 81:	key = 'Q'; break;
		case 82:	key = 'R'; break;
		case 83:	key = 'S'; break;
		case 84:	key = 'T'; break;
		case 85:	key = 'U'; break;
		case 86:	key = 'V'; break;
		case 87:	key = 'W'; break;
		case 88:	key = 'X'; break;
		case 89:	key = 'Y'; break;
		case 90:	key = 'Z'; break;
		
        default:
            // Convert ASCII codes to letters
            key = String.fromCharCode(code);
        }

        pressedKeys[key] = status;
    }

    document.addEventListener('keydown', function(e) {
        setKey(e, true);
    });

    document.addEventListener('keyup', function(e) {
        setKey(e, false);
    });
    

    window.addEventListener('blur', function() {
        pressedKeys = {};
    });

    window.input = {
        isDown: function(key) {
            return pressedKeys[key.toUpperCase()];
        }
    };
})();
