<template>
  <div class="camera-container full">
    <video class="camera full" ref="camera" v-on:loadeddata="onCameraOpened" muted autoplay="true" playsinline="true" webkit-playsinline></video>
    <canvas style="display:none" ref="canvas"></canvas>
    <slot></slot>
  </div>
</template>

<script>
import {onMounted, ref, watch, onBeforeUnmount} from 'vue';
let devices = null;
let localStream;
let interval = null;

export default {
  name: 'VisionCamera',
  emits: ['opened','onFrameAvailable'],
  props: {
    desiredCamera: String,
    desiredResolution: {width:Number,height:Number},
    isActive: Boolean,
    enableFetchingLoop: Boolean,
    fps:Number,
  },
  setup(props,context) {
    const camera = ref(null);
    const canvas = ref(null);
    onMounted(() => {
      if (props.isActive != false) {
        playWithDesired();
      }
    });

    onBeforeUnmount(() => {
      stopFetchingLoop();
      stop();
    });

    const onCameraOpened = () => {
      console.log("opened");
      context.emit("opened",camera.value);
      canvas.value.width = camera.value.videoWidth;
      canvas.value.height = camera.value.videoHeight;
      if (props.enableFetchingLoop === true) {
        startFetchingLoop();
      }
    };

    
    const loadDevices = async () => {
      var constraints = {video: true, audio: false};
      await navigator.mediaDevices.getUserMedia(constraints)
      const mediaDevices = await navigator.mediaDevices.enumerateDevices();
      var cameraDevices = [];
      for (var i=0;i<mediaDevices.length;i++){
        var device = mediaDevices[i];
        if (device.kind == 'videoinput'){ // filter out audio devices
          cameraDevices.push(device);
        }
      }
      devices = cameraDevices;
    }

    const playWithDesired = async () => {
      if (!devices) {
        await loadDevices(); // load the camera devices list if it hasn't been loaded
      }
      let desiredDevice = getDesiredDevice(devices)
      if (desiredDevice) {
        if (props.desiredResolution) {
          play(desiredDevice, props.desiredResolution);
        }else{
          play(desiredDevice);
        }
      }else{
        throw new Error("No camera detected");
      }
    }
   
    const getDesiredDevice = (devices) => {
      var count = 0;
      var desiredIndex = 0;
      for (var i=0;i<devices.length;i++){
        var device = devices[i];
        var label = device.label || `Camera ${count++}`;
        if (props.desiredCamera) {
          if (label.toLowerCase().indexOf(props.desiredCamera.toLowerCase()) != -1) {
            desiredIndex = i;
            break;
          } 
        }
      }

      if (devices.length>0) {
        return devices[desiredIndex].deviceId; // return the device id
      }else{
        return null;
      }
    }
   
    const play = (deviceId, desiredResolution) => {

      console.log(deviceId);
      console.log(desiredResolution);

      stop(); // close before play
      var constraints = {};
      
      if (deviceId){
        constraints = {
          video: {deviceId: deviceId},
          audio: false
        }
      }else{
        constraints = {
          video: true,
          audio: false
        }
      }

      if (desiredResolution) {
        constraints["video"]["width"] = desiredResolution.width;
        constraints["video"]["height"] = desiredResolution.height;
      }
        
      navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
        localStream = stream;
        // Attach local stream to video element
        camera.value.srcObject = stream;
      }).catch(function(err) {
        console.error('getUserMediaError', err, err.stack);
        alert(err.message);
      });
    }
   
    const stop = () => {
      try{
        if (localStream){
          localStream.getTracks().forEach(track => track.stop());
        }
      } catch (e){
        alert(e.message);
      }
    };

    watch(() => props.isActive, (newVal) => {
      if (newVal === true) {
        playWithDesired();
      }else{
        stop();
      }
    });

    watch(() => props.enableFetchingLoop, (newVal) => {
      stopFetchingLoop();
      if (newVal === true) {
        startFetchingLoop();
      }
    });

    const getImageData = (video) => {
      const ctx = canvas.value.getContext('2d');
      ctx.drawImage(video, 0, 0);
      return ctx.getImageData(0, 0, canvas.value.width, canvas.value.height)
    }

    const startFetchingLoop = () => {
        let mSeconds = 100;
        if (props.fps) {
          mSeconds = 1000 / props.fps;
        }

        const sendFrame = () => {
          if (camera.value.videoWidth != 0) {
            const data = getImageData(camera.value);
            context.emit("onFrameAvailable",data);
          }
        }

        interval = setInterval(sendFrame, mSeconds);
    }

    const stopFetchingLoop = () => {
      clearInterval(interval);
    }

    return {
      camera,
      canvas,
      onCameraOpened
    };
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.camera-container {
  position: relative;
}
   
.camera {
  position: absolute;
  object-fit: cover;
}
   
.full {
  width:100%;
  height:100%;
  left:0;
  top:0;
}
</style>

