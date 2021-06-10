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
