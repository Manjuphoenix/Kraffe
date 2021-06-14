import * as Tone from 'tone'

var SynthPad = (function() {
  // Variables
  var myCanvas;
  var frequencyLabel;
  var volumeLabel;

  var myAudioContext;
  var oscillator;
  var gainNode;


  // Notes
  var lowNote = 261.63; // C4
  var highNote = 493.88; // B4
 


  // Constructor
  var SynthPad = function() {
    myCanvas = document.getElementById('synth-pad');
    frequencyLabel = document.getElementById('frequency');
    volumeLabel = document.getElementById('volume');
  
    // Create an audio context.
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    myAudioContext = new window.AudioContext();
  
    SynthPad.setupEventListeners();
  };
  
  
  // Event Listeners
  SynthPad.setupEventListeners = function() {
  
    // Disables scrolling on touch devices.
    document.body.addEventListener('touchmove', function(event) {
      event.preventDefault();
    }, false);
  
    myCanvas.addEventListener('mousedown', SynthPad.playSound);
    myCanvas.addEventListener('touchstart', SynthPad.playSound);
  
    myCanvas.addEventListener('mouseup', SynthPad.stopSound);
    document.addEventListener('mouseleave', SynthPad.stopSound);
    myCanvas.addEventListener('touchend', SynthPad.stopSound);
  };
  
  
  // Play a note.
  SynthPad.playSound = function(event) {
    oscillator = myAudioContext.createOscillator();
    gainNode = myAudioContext.createGain();
  
    oscillator.type = 'triangle';
  
    gainNode.connect(myAudioContext.destination);
    oscillator.connect(gainNode);
  
    SynthPad.updateFrequency(event);
  
    oscillator.start(0);
  
    myCanvas.addEventListener('mousemove', SynthPad.updateFrequency);
    myCanvas.addEventListener('touchmove', SynthPad.updateFrequency);
  
    myCanvas.addEventListener('mouseout', SynthPad.stopSound);
  };
  
  
  // Stop the audio.
  SynthPad.stopSound = function(event) {
    oscillator.stop(0);
  
    myCanvas.removeEventListener('mousemove', SynthPad.updateFrequency);
    myCanvas.removeEventListener('touchmove', SynthPad.updateFrequency);
    myCanvas.removeEventListener('mouseout', SynthPad.stopSound);
  };
   
  
  // Calculate the note frequency.
  SynthPad.calculateNote = function(posX) {
    var noteDifference = highNote - lowNote;
    var noteOffset = (noteDifference / myCanvas.offsetWidth) * (posX - myCanvas.offsetLeft);
    return lowNote + noteOffset;
  };
  
  
  // Calculate the volume.
  SynthPad.calculateVolume = function(posY) {
    var volumeLevel = 1 - (((100 / myCanvas.offsetHeight) * (posY - myCanvas.offsetTop)) / 100);
    return volumeLevel;
  };
  
  
  // Fetch the new frequency and volume.
  SynthPad.calculateFrequency = function(x, y) {
    var noteValue = SynthPad.calculateNote(x);
    var volumeValue = SynthPad.calculateVolume(y);
  
    oscillator.frequency.value = noteValue;
    gainNode.gain.value = volumeValue;
  
    frequencyLabel.innerHTML = Math.floor(noteValue) + ' Hz';
    volumeLabel.innerHTML = Math.floor(volumeValue * 100) + '%';
  };
  
  
  // Update the note frequency.
  SynthPad.updateFrequency = function(event) {
    if (event.type == 'mousedown' || event.type == 'mousemove') {
      SynthPad.calculateFrequency(event.x, event.y);
    } else if (event.type == 'touchstart' || event.type == 'touchmove') {
      var touch = event.touches[0];
      SynthPad.calculateFrequency(touch.pageX, touch.pageY);
    }
  };
  
  
  // Export SynthPad.
  return SynthPad;
})();


// Initialize the page.
window.onload = function() {
  var synthPad = new SynthPad();
}

navigator.mediaDevices.getUserMedia({audio:true})
.then(stream => {handlerFunction(stream)})


      function handlerFunction(stream) {
      rec = new MediaRecorder(stream);
      rec.ondataavailable = e => {
        audioChunks.push(e.data);
        if (rec.state == "inactive"){
          let blob = new Blob(audioChunks,{type:'audio/mpeg-3'});
          recordedAudio.src = URL.createObjectURL(blob);
          recordedAudio.controls=true;
          recordedAudio.autoplay=true;
          sendData(blob)
        }
      }
    }
          function sendData(data) {}

  record.onclick = e => {
    console.log('I was clicked')
    record.disabled = true;
    record.style.backgroundColor = "blue"
    stopRecord.disabled=false;
    audioChunks = [];
    rec.start();
  }
  stopRecord.onclick = e => {
    console.log("I was clicked")
    record.disabled = false;
    stop.disabled=true;
    record.style.backgroundColor = "red"
    rec.stop();
  }

  const filterData = audioBuffer => {
    const rawData = audioBuffer.getChannelData(0); // We only need to work with one channel of data
    const samples = 70; // Number of samples we want to have in our final data set
    const blockSize = Math.floor(rawData.length / samples); // the number of samples in each subdivision
    const filteredData = [];
    for (let i = 0; i < samples; i++) {
      let blockStart = blockSize * i; // the location of the first sample in the block
      let sum = 0;
      for (let j = 0; j < blockSize; j++) {
        sum = sum + Math.abs(rawData[blockStart + j]) // find the sum of all the samples in the block
      }
      filteredData.push(sum / blockSize); // divide the sum by the block size to get the average
    }
    return filteredData;
  }


  // For creating waveform
  var wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: 'violet',
    progressColor: 'purple'
});

/* Here upload your audio */

wavesurfer.load('audio1.mp3');

/* Here Play audio */

wavesurfer.on('ready', function () {
    wavesurfer.play();
});

function playKeyboard(){

	let pressColor = '#1BC0EA'; //color when key is pressed


	var isMobile = !!navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i);
	if(isMobile) { var evtListener = ['touchstart', 'touchend']; } else { var evtListener = ['mousedown', 'mouseup']; }

	var __audioSynth = new AudioSynth();
	__audioSynth.setVolume(0.5);
	var __octave = 4; //sets position of middle C, normally the 4th octave
	

	// Key bindings, notes to keyCodes.
	var keyboard = {
			
			/* ~ */
			192: 'C,-2',

			/* 1 */
			49: 'C#,-2',

			/* 2 */
			50: 'D,-2',

			/* 3 */
			51: 'D#,-2',

			/* 4 */
			52: 'E,-2',

			/* 5 */
			53: 'F,-2',

			/* 6 */
			54: 'F#,-2',

			/* 7 */
			55: 'G,-2',

			/* 8 */
			56: 'G#,-2',

			/* 9 */
			57: 'A,-2',

			/* 0 */
			48: 'A#,-2',

			/* - */
			189: 'B,-2',

			/* = */
			187: 'C,-1',

			/* Q */
			81: 'C#,-1',

			/* W */
			87: 'D,-1',

			/* E */
			69: 'D#,-1',

			/* R */
			82: 'E,-1',

			/* T */
			84: 'F,-1',

			/* Y */
			89: 'F#,-1',

			/* U */
			85: 'G,-1',

			/* I */
			73: 'G#,-1',

			/* O */
			79: 'A,-1',

			/* P */
			80: 'A#,-1',

			/* [ */
			219: 'B,-1',

			/* ] */
			221: 'C,0',

			/* A */
			65: 'C#,0',

			/* S */
			83: 'D,0',

			/* D */
			68: 'D#,0',

			/* F */
			70: 'E,0',

			/* G */
			71: 'F,0',

			/* H */
			72: 'F#,0',

			/* J */
			74: 'G,0',

			/* K */
			75: 'G#,0',

			/* L */
			76: 'A,0',

			/* ; */
			186: 'A#,0',

			/* " */
			222: 'B,0',
			

			/* Z */
			90: 'C,1',

			/* X */
			88: 'C#,1',

			/* C */
			67: 'D,1',

			/* V */
			86: 'D#,1',

			/* B */
			66: 'E,1',

			/* N */
			78: 'F,1',

			/* M */
			77: 'F#,1',

			/* , */
			188: 'G,1',

			/* . */
			190: 'G#,1',

			/* / */
			191: 'A,1',

			/* <- */
			37: 'A#,1',

			/* -> */
			39: 'B,1',
		
		};
	
	var reverseLookupText = {};
	var reverseLookup = {};

	// Create a reverse lookup table.
	for(var i in keyboard) {
	
		var val;

		switch(i|0) { //some characters don't display like they are supposed to, so need correct values
		
			case 187: //equal sign
				val = 61; //???
				break;
			
			case 219: //open bracket
				val = 91; //left window key
				break;
			
			case 221: //close bracket
				val = 93; //select key
				break;
			
			case 188://comma
				val = 44; //print screen
				break;
			//the fraction 3/4 is displayed for some reason if 190 wasn't replaced by 46; it's still the period key either way
			case 190: //period
				val = 46; //delete
				break;
			
			default:
				val = i;
				break;
			
		}
	
		reverseLookupText[keyboard[i]] = val;
		reverseLookup[keyboard[i]] = i;
	
	}

	// Keys you have pressed down.
	var keysPressed = [];

	// Generate keyboard
	let visualKeyboard = document.getElementById('keyboard');
	let selectSound = {
		value: "0" //piano
	};

	var iKeys = 0;
	var iWhite = 0;
	var notes = __audioSynth._notes; //C, C#, D....A#, B

	for(var i=-2;i<=1;i++) {
		for(var n in notes) {
			if(n[2]!='b') {
				var thisKey = document.createElement('div');
				if(n.length>1) { //adding sharp sign makes 2 characters
					thisKey.className = 'black key'; //2 classes
					thisKey.style.width = '30px';
					thisKey.style.height = '120px';
					thisKey.style.left = (40 * (iWhite - 1)) + 25 + 'px';
				} else {
					thisKey.className = 'white key';
					thisKey.style.width = '40px';
					thisKey.style.height = '200px';
					thisKey.style.left = 40 * iWhite + 'px';
					iWhite++;
				}

				var label = document.createElement('div');
				label.className = 'label';

				let s = getDispStr(n,i,reverseLookupText);

				label.innerHTML = '<b class="keyLabel">' + s + '</b>' + '<br /><br />' + n.substr(0,1) +
					'<span name="OCTAVE_LABEL" value="' + i + '">' + (__octave + parseInt(i)) + '</span>' + (n.substr(1,1)?n.substr(1,1):'');
				thisKey.appendChild(label);
				thisKey.setAttribute('ID', 'KEY_' + n + ',' + i);
				thisKey.addEventListener(evtListener[0], (function(_temp) { return function() { fnPlayKeyboard({keyCode:_temp}); } })(reverseLookup[n + ',' + i]));
				visualKeyboard[n + ',' + i] = thisKey;
				visualKeyboard.appendChild(thisKey);
				
				iKeys++;
			}
		}
	}

	visualKeyboard.style.width = iWhite * 40 + 'px';

	window.addEventListener(evtListener[1], function() { n = keysPressed.length; while(n--) { fnRemoveKeyBinding({keyCode:keysPressed[n]}); } });
	

// Detect keypresses, play notes.

	var fnPlayKeyboard = function(e) {
	
		var i = keysPressed.length;
		while(i--) {
			if(keysPressed[i]==e.keyCode) {
				return false;	
			}
		}
		keysPressed.push(e.keyCode);

		if(keyboard[e.keyCode]) {
			if(visualKeyboard[keyboard[e.keyCode]]) {
				visualKeyboard[keyboard[e.keyCode]].style.backgroundColor = pressColor;
				//visualKeyboard[keyboard[e.keyCode]].classList.add('playing'); //adding class only affects keypress and not mouse click
				visualKeyboard[keyboard[e.keyCode]].style.marginTop = '5px';
				visualKeyboard[keyboard[e.keyCode]].style.boxShadow = 'none';
			}
			var arrPlayNote = keyboard[e.keyCode].split(',');
			var note = arrPlayNote[0];
			var octaveModifier = arrPlayNote[1]|0;
			fnPlayNote(note, __octave + octaveModifier);
		} else {
			return false;	
		}
	
	}
	// Remove key bindings once note is done.
	var fnRemoveKeyBinding = function(e) {
	
		var i = keysPressed.length;
		while(i--) {
			if(keysPressed[i]==e.keyCode) {
				if(visualKeyboard[keyboard[e.keyCode]]) {
					//visualKeyboard[keyboard[e.keyCode]].classList.remove('playing');
					visualKeyboard[keyboard[e.keyCode]].style.backgroundColor = '';
					visualKeyboard[keyboard[e.keyCode]].style.marginTop = '';
					visualKeyboard[keyboard[e.keyCode]].style.boxShadow = '';
				}
				keysPressed.splice(i, 1);
			}
		}
	
	}
	// Generates audio for pressed note and returns that to be played
	var fnPlayNote = function(note, octave) {

		src = __audioSynth.generate(selectSound.value, note, octave, 2);
		container = new Audio(src);
		container.addEventListener('ended', function() { container = null; });
		container.addEventListener('loadeddata', function(e) { e.target.play(); });
		container.autoplay = false;
		container.setAttribute('type', 'audio/wav');
		container.load();
		return container;
	
	};

	//returns correct string for display
	function getDispStr(n,i,lookup) {

		if(n=='C' && i==-2){
			return "~";
		}else if(n=='B' && i==-2){
			return "-";
		}else if(n=='A#' && i==0){
			return ";";
		}else if(n=='B' && i==0){
			return "\"";
		}else if(n=='A' && i==1){
			return "/";
		}else if(n=='A#' && i==1){
			return "<-";
		}else if(n=='B' && i==1){
			return "->";
		}else{
			return String.fromCharCode(lookup[n + ',' + i]);
		}

	}
	window.addEventListener('keydown', fnPlayKeyboard);
	window.addEventListener('keyup', fnRemoveKeyBinding);
}