<template>
  <div class="controls" :style="{display: isActive ? 'none' : '' }">
    <button v-on:click="startCamera">
      Start Camera
    </button>
  </div>
  <div class="camera" :style="{display: isActive ? '' : 'none' }">
    <VisionCamera 
      :isActive="isActive" 
      :enableFetchingLoop="enableFetchingLoop"
      :desiredResolution="{width:1280,height:720}"
      desiredCamera="founder"
      @onFrameAvailable="onFrameAvailable"
      @opened="opened"
    >
      <button class="close-btn" v-on:click="closeCamera" >Close</button>
    </VisionCamera>
  </div>
  
</template>

<script>
import { onMounted, ref } from 'vue'
import { BarcodeReader } from "dynamsoft-javascript-barcode";
import { VisionCamera } from '../node_modules/vue-vision-camera/dist/VueVisionCamrea.common'

BarcodeReader.engineResourcePath = "https://unpkg.com/dynamsoft-javascript-barcode@9.0.2/dist/";

export default {
  name: 'App',
  components: {
    VisionCamera
  },
  setup(){
    let reader;
    const isActive = ref(false);
    const enableFetchingLoop = ref(true);
    onMounted(async ()=>{
      BarcodeReader.license = "DLS2eyJoYW5kc2hha2VDb2RlIjoiMjAwMDAxLTE2NDk4Mjk3OTI2MzUiLCJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSIsInNlc3Npb25QYXNzd29yZCI6IndTcGR6Vm05WDJrcEQ5YUoifQ==";
      reader = await BarcodeReader.createInstance();
    })

    const startCamera = () => {
      isActive.value = true;
    }
    const closeCamera = () => {
      isActive.value = false;
    }

    const opened = (camera) => {
      console.log(arguments);
      console.log(camera);
      console.log("emit opened");
    }

    const onFrameAvailable = async (data) => {
      enableFetchingLoop.value = false;
      const results = await reader.decode(data);
      console.log(results);
      enableFetchingLoop.value = true;
    }

    return {
      isActive,
      enableFetchingLoop,
      startCamera,
      closeCamera,
      onFrameAvailable,
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

.close-btn {
  top: 0;
  right: 0;
  position: absolute;
}

</style>

