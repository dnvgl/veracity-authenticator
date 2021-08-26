<template>
  <b-container id="app">
    <feedback class="p-4" :mac-addresses="macAddress" />
  </b-container>
</template>

<script>
import Feedback from "./components/Feedback.vue";

export default {
  name: "App",
  components: {
    Feedback,
  },
  data() {
    return {
      macAddress: window.electron.getMacAddress(),
    };
  },
};
</script>
