<template>
  <div class="controls" :style="{display: isActive ? 'none' : '' }">
    <button v-on:click="startCamera">
      Start Camera
    </button>
  </div>
  <div class="vision-camera" :style="{display: isActive ? '' : 'none' }">
    <VisionCamera 
      :isActive="isActive" 
      :desiredResolution="{width:1280,height:720}"
      desiredCamera="founder"
      facingMode="environment"
      @devicesLoaded="devicesLoaded"
      @closed="closed"
      @opened="opened"
    >
      <button class="close-btn" v-on:click="closeCamera" >Close</button>
    </VisionCamera>
  </div>
  
</template>

<script>
import { ref } from 'vue'
import VisionCamera from './components/VisionCamera.vue'

export default {
  name: 'App',
  components: {
    VisionCamera
  },
  setup(){
    const isActive = ref(false);

    const startCamera = () => {
      isActive.value = true;
    }
    const closeCamera = () => {
      isActive.value = false;
    }

    const devicesLoaded = (devices) => {
      console.log(devices);
    }

    const opened = (camera) => {
      console.log(arguments);
      console.log(camera);
      console.log("emit opened");
    }

    const closed = () => {
      console.log("emit closed");
    }

    return {
      isActive,
      startCamera,
      closeCamera,
      devicesLoaded,
      closed,
      opened
    }
  }
}
</script>

<style>
.vision-camera {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  position: absolute;
}

.close-btn {
  top: 0;
  right: 0;
  position: absolute;
}

</style>
