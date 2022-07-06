<template>
  <div class="camera">
    <VisionCamera 
      :isActive="true" 
      desiredCamera="founder" 
      :desiredResolution="{width:1280,height:720}"
      @opened="opened" 
    ></VisionCamera>
  </div>
  
</template>

<script>
import VisionCamera from './components/VisionCamera.vue'

export default {
  name: 'App',
  components: {
    VisionCamera
  },
  setup(){
    const opened = (camera) => {
      console.log(arguments);
      console.log(camera);
      console.log("emit opened");
    }
    return {
      opened
    }
  }
}
</script>

<style>
.camera {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  position: absolute;
}
</style>
