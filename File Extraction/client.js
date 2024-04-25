const videoFileInput = document.getElementById('video-file');
const videoPlayer = document.getElementById('video-player');

let playState = false;
let timestamp = 0;
let clientId = null;
let duration = null;

const ws = new WebSocket('ws://localhost:9090');

ws.onmessage = function(event) {
  const data = JSON.parse(event.data);
  if (data.clientId) {
    clientId = data.clientId;
    console.log('Connected with ID:', clientId);
  } else if (data.duration) {
    duration = data.duration;
    if (videoPlayer.duration === duration) {
      syncPlayerState(data.playState, data.timestamp);
    } else {
      console.error('Duration mismatch. Files are not synchronized.');
    }
  } else {
    syncPlayerState(data.playState, data.timestamp);
  }
};

videoFileInput.addEventListener('change', function() {
  const file = this.files[0];
  const fileURL = URL.createObjectURL(file);
  videoPlayer.src = fileURL;
  duration = null; // Reset duration when a new video is selected
});

videoPlayer.addEventListener('play', function() {
  playState = true;
  updateServer('playState', true);
});

videoPlayer.addEventListener('pause', function() {
  playState = false;
  updateServer('playState', false);
});

videoPlayer.addEventListener('timeupdate', function() {
  timestamp = Math.floor(videoPlayer.currentTime);
  updateServer('timestamp', timestamp);
});

function syncPlayerState(newPlayState, newTimestamp) {
  if (playState !== newPlayState) {
    if (newPlayState) {
      videoPlayer.play();
    } else {
      videoPlayer.pause();
    }
  }
  playState = newPlayState;
  timestamp = newTimestamp;
  videoPlayer.currentTime = timestamp;
}

function updateServer(type, value) {
  if (clientId) {
    ws.send(JSON.stringify({ clientId, type, value }));
  }
}

const playButton = document.getElementById('play-button');
playButton.addEventListener('click', function() {
  videoPlayer.play();
  updateServer('playState', true);
});