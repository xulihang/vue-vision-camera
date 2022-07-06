Camera component for Vue 3. We can use this component for computer vision tasks like barcode scanning, text recognition, etc.

## Usage

```vue
<VisionCamera 
  :isActive="isActive" 
  :desiredResolution="{width:1280,height:720}"
  desiredCamera="back"
  @closed="closed"
  @opened="opened"
>
```

```js
const opened = (cam) => {
  console.log("camera opened");
  //get the inner video element in the opened event
}

const closed = () => {
  console.log("camera closed");
}
```

## Installation

### Via NPM

```
npm install vue-vision-camera
```

Then import the component to use it.

```js
import VisionCamera from 'vue-vision-camera'
export default {
  name: 'App',
  components: {
    VisionCamera
  }
}
```

### Via CDN

```
<script src="https://unpkg.com/vue"></script>
<script src="https://unpkg.com/vue-vision-camera/dist/VueVisionCamrea.umd.min.js"></script>
```

## Demos

[Barcode Scanning using Dynamsoft Barcode Reader](https://github.com/xulihang/vue-vision-camera/tree/main/example)


