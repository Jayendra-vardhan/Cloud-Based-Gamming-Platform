// client.js

const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const socket = io.connect('http://localhost:8080');

navigator.mediaDevices.getUserMedia({ audio: true, video: true })
  .then((stream) => {
    localVideo.srcObject = stream;

    stream.getTracks().forEach((track) => {
      socket.emit('video-audio', {
        kind: track.kind,
        streamId: track.id,
        data: (sender) => {
          if (sender.readyState === 'running') {
            sender.receive(track);
          }
        },
      });
    });

    socket.on('video-audio', (data) => {
      if (data.kind === 'video' || data.kind === 'audio') {
        data.data(remoteVideo.srcObject.getVideoTracks()[0]);
      }
    });
  })
  .catch((err) => {
    console.error('Error accessing media devices: ', err);
  });
