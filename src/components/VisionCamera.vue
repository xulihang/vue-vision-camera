<template>
  <div class="camera-container full">
    <video class="camera full" ref="camera" v-on:loadeddata="onCameraOpened" muted autoplay="true" playsinline="true" webkit-playsinline></video>
    <slot></slot>
  </div>
</template>

<script>
import {onMounted, ref, watch, onBeforeUnmount} from 'vue';

export default {
  name: 'VisionCamera',
  emits: ['opened','closed','devicesLoaded'],
  props: {
    desiredCamera: String,
    desiredResolution: {width:Number,height:Number},
    isActive: Boolean,
    facingMode: String,
  },
  setup(props,context) {
    const camera = ref(null);
    let devices = null;
    let localStream;
    onMounted(() => {
      if (props.isActive != false) {
        playWithDesired();
      }
    });

    onBeforeUnmount(() => {
      stop();
    });

    const onCameraOpened = () => {
      context.emit("opened", camera.value);
    };

    
    const loadDevices = async () => {
      if (checkBrowser() === "Safari") {
        //console.log("is safari");
        const constraints = {video: true, audio: false};
        await navigator.mediaDevices.getUserMedia(constraints)
      }
      const mediaDevices = await navigator.mediaDevices.enumerateDevices();
      let cameraDevices = [];
      for (let i=0;i<mediaDevices.length;i++){
        let device = mediaDevices[i];
        if (device.kind == 'videoinput'){ // filter out audio devices
          cameraDevices.push(device);
        }
      }
      devices = cameraDevices;
      context.emit("devicesLoaded", devices);
    }

    const playWithDesired = async () => {
      if (!devices) {
        await loadDevices(); // load the camera devices list if it hasn't been loaded
      }
      let desiredDevice = getDesiredDevice(devices)

      if (desiredDevice) {
        let options = {};
        options.deviceId=desiredDevice;
        if (props.desiredResolution) {
          options.desiredResolution=props.desiredResolution;
        }
        if (props.facingMode) {
          options.facingMode = props.facingMode;
        }

        play(options);
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
   
    const play = (options) => {
      stop(); // close before play
      var constraints = {};

      if (options.deviceId){
        constraints = {
          video: {deviceId: options.deviceId},
          audio: false
        }
      }else{
        constraints = {
          video: {width:1280, height:720},
          audio: false
        }
      }
      
      if (options.facingMode) {
        delete constraints["video"]["deviceId"];
        constraints["video"]["facingMode"] = { exact: options.facingMode };
      }

      if (options.desiredResolution) {
        constraints["video"]["width"] = options.desiredResolution.width;
        constraints["video"]["height"] = options.desiredResolution.height;
      }

      navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
        localStream = stream;
        // Attach local stream to video element
        camera.value.srcObject = stream;
      }).catch(function(err) {
        if (options.facingMode) { // facing mode not supported on desktop Chrome
          delete options["facingMode"];
          play(options);
        }else{
          console.error('getUserMediaError', err, err.stack);
        }
      });
    }
   
    const stop = () => {
      try{
        if (localStream){
          const tracks = localStream.getTracks();
          for (let i=0;i<tracks.length;i++) {
            const track = tracks[i];
            track.stop();
          }
          context.emit('closed');
        }
      } catch (e){
        alert(e.message);
      }
    };

    const checkBrowser = () => {
      // Get the user-agent string
      let userAgentString = navigator.userAgent;
      if (userAgentString.indexOf("Chrome") > -1) {
        return "Chrome";
      }else if (userAgentString.indexOf("MSIE") > -1 || userAgentString.indexOf("rv:") > -1) {
        return "IE";
      }else if (userAgentString.indexOf("Firefox") > -1) {
        return "Firefox";
      }else if (userAgentString.indexOf("Safari") > -1) {
        return "Safari";
      }
    }

    watch(() => props.isActive, (newVal) => {
      if (newVal === true) {
        playWithDesired();
      }else{
        stop();
      }
    });

    return {
      camera,
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

