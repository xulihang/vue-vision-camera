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

```
npm install vue-vision-camera
```

Then import the component to use it.

```js
import { VisionCamera } from '../node_modules/vue-vision-camera/dist/VueVisionCamrea.common'
import '../node_modules/vue-vision-camera/dist/VueVisionCamrea.css'

export default {
  name: 'App',
  components: {
    VisionCamera
  }
}
```

## Demos

[Barcode Scanner](https://github.com/xulihang/vue-vision-camera/tree/main/example) using [Dynamsoft Barcode Reader](https://www.dynamsoft.com/barcode-reader/overview/)


