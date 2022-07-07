Camera component for Vue 3. We can use this component for computer vision tasks like barcode scanning, text recognition, etc.

[Online demo](https://lovely-squirrel-9abb74.netlify.app/)

## Usage

```vue
<VisionCamera 
  :isActive="isActive" 
  :desiredResolution="{width:1280,height:720}"
  desiredCamera="back"
  facingMode="environment"
  @devicesLoaded="devicesLoaded"
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

const devicesLoaded = (devices) => {
  console.log(devices); // get the list of existing camera devices
}
```

## Installation

```
npm install vue-vision-camera
```

Then import the component to use it.

```js
import { VisionCamera } from 'vue-vision-camera'

export default {
  name: 'App',
  components: {
    VisionCamera
  }
}
```

## Demos

[Barcode Scanner](https://github.com/xulihang/vue-vision-camera/tree/main/example) using [Dynamsoft Barcode Reader](https://www.dynamsoft.com/barcode-reader/overview/)


## FAQ

How to specify which camera to use?

1. Use the `desiredCamera` prop. If one of the camera's name contains it, then it will be used. You can get the devices list in the `devicesLoaded` event.
2. Use the `facingMode` prop. Set it to `environment` to use the back camera. Set it to `user` to use the front camera. Please note that this is not supported on Desktop.

You can use the two props together.


