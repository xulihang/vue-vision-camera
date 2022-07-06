import VisionCamera from './components/VisionCamera.vue'
const install = (app) => {
  app.component('vision-camera', VisionCamera);
}

export {
  VisionCamera
}

const plugin = {
  install
}
export default plugin;
