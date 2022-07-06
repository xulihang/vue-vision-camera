<template>
  <div class="controls" :style="{display: isActive ? 'none' : '' }">
    <button v-on:click="startCamera">
      Start Camera
    </button>
  </div>
  <div class="vision-camera" :style="{display: isActive ? '' : 'none' }">
    <VisionCamera 
      :isActive="isActive" 
      :enableFetchingLoop="enableFetchingLoop"
      :desiredResolution="{width:1280,height:720}"
      desiredCamera="founder"
      @onFrameAvailable="onFrameAvailable"
      @opened="opened"
    >
      <svg
        :viewBox="viewBox"
        preserveAspectRatio="xMidYMid slice"
        class="overlay"
      >
        <polygon v-bind:key="'polygon'+index" v-for="(barcodeResult,index) in barcodeResults"
          :points="getPointsData(barcodeResult.localizationResult)"
          class="barcode-polygon"
        />
        <text v-bind:key="'text'+index" v-for="(barcodeResult,index) in barcodeResults"
          :x="barcodeResult.localizationResult.x1"
          :y="barcodeResult.localizationResult.y1"
          fill="red"
          font-size="25"
        > {{barcodeResult.barcodeText}}</text>
      </svg>
      <button class="close-btn" v-on:click="closeCamera" >Close</button>
    </VisionCamera>
  </div>
  
</template>

<script>
import { onMounted, ref } from 'vue'
import { BarcodeReader } from "dynamsoft-javascript-barcode";
import { VisionCamera } from '../node_modules/vue-vision-camera/dist/VueVisionCamrea.common'
import '../node_modules/vue-vision-camera/dist/VueVisionCamrea.css'

BarcodeReader.engineResourcePath = "https://unpkg.com/dynamsoft-javascript-barcode@9.0.2/dist/";

export default {
  name: 'App',
  components: {
    VisionCamera
  },
  setup(){
    let reader;
    const viewBox = ref("0 0 1280 720");
    const barcodeResults = ref([]);
    const isActive = ref(false);
    const enableFetchingLoop = ref(true);
    onMounted(async ()=>{
      BarcodeReader.license = "DLS2eyJoYW5kc2hha2VDb2RlIjoiMjAwMDAxLTE2NDk4Mjk3OTI2MzUiLCJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSIsInNlc3Npb25QYXNzd29yZCI6IndTcGR6Vm05WDJrcEQ5YUoifQ==";
      reader = await BarcodeReader.createInstance();
    })

    const getPointsData = (lr) => {
      let pointsData = lr.x1 + "," + lr.y1 + " ";
      pointsData = pointsData + lr.x2+ "," + lr.y2 + " ";
      pointsData = pointsData + lr.x3+ "," + lr.y3 + " ";
      pointsData = pointsData + lr.x4+ "," + lr.y4;
      return pointsData;
    }

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
      viewBox.value = "0 0 "+camera.videoWidth+" "+camera.videoHeight;
    }

    const onFrameAvailable = async (data) => {
      enableFetchingLoop.value = false;
      const results = await reader.decode(data);
      barcodeResults.value = results;
      enableFetchingLoop.value = true;
      console.log(results);
    }

    return {
      viewBox,
      barcodeResults,
      isActive,
      enableFetchingLoop,
      startCamera,
      closeCamera,
      onFrameAvailable,
      opened,
      getPointsData
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

.barcode-polygon {
  fill:rgba(85,240,40,0.5);
  stroke:green;
  stroke-width:1;
}

.overlay {
  top: 0;
  left: 0;
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>

