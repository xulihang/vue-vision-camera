<template>
  <div>
    <vision-camera desiredCamera="back"></vision-camera>
  </div>
</template>

<script>
import {VisionCamera} from '../node_modules/vue-vision-camera/dist/VueVisionCamrea.common'

export default {
  name: 'App',
  components: {
    VisionCamera
  }
}
</script>

<style>
</style>
