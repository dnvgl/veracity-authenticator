<template>
  <div class="p-6">
    <div align="center" v-if="status === 'Unauthorized' || status === 'Design'">
      <i class="fal fa-wifi-slash feedback-icon fail" aria-hidden="true"></i>
      <h1>No internet connection?</h1>
      <p>You are not authorized. Are you online?</p>
      <b-button @click="close" variant="subtle">Exit</b-button>
    </div>

    <div
      align="center"
      v-if="status === 'ProxyAuthError' || status === 'Design'"
    >
      <i class="fal fa-shield-check feedback-icon fail" aria-hidden="true"></i>
      <h1>No internet connection</h1>
      <p>Sign in failed due to restrictions from your firewall</p>
      <b-button @click="close" variant="subtle">Exit</b-button>
    </div>

    <div align="center" v-if="status === 'Offline' || status === 'Design'">
      <i class="fal fa-wifi-slash feedback-icon fail" aria-hidden="true"></i>
      <h1>No internet connection</h1>
      <p>Unable to load licenses. Are you online?</p>
      <b-button @click="init(true)" class="mr-2" variant="primary"
        >Retry</b-button
      >
      <b-button @click="close" variant="subtle">Exit</b-button>
    </div>

    <div v-if="status === 'Init' || status === 'Design'">
      Loading....
      <b-progress
        :value="100"
        :striped="true"
        :animated="true"
        v-show="true"
        variant="primary"
        class="mt-2"
      ></b-progress>
    </div>

    <div align="center" v-if="status === 'Success' || status === 'Design'">
      <i
        class="fal fa-check-circle feedback-icon success"
        aria-hidden="true"
      ></i>
      <h1>Successfully logged in</h1>
      <p>We were able to log you in successfully</p>
      <b-button @click="close" variant="subtle">Exit</b-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    macAddresses: Object,
  },
  data() {
    return {
      status: "Init", //Design
      message: "",
      value: 0,
    };
  },
  computed: {
    token() {
      return window.electron.getToken();
    },
  },
  methods: {
    setStatus(status) {
      if (this.status !== "Design") {
        this.status = status;
      }
    },
    init() {
      this.setStatus("Init");

      if (this.token === "Unauthorized") {
        window.electron.log("unauthorized");
        this.status = "Unauthorized";
        return;
      }

      if (this.token === "ProxyAuthError") {
        window.electron.log("proxyautherror");
        this.status = "ProxyAuthError";
        return;
      }

      this.setStatus("Success");
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style scoped>
.success {
  color: #36842d;
}

.fail {
  color: #c4262e;
}

.feedback-icon {
  font-size: 4em;
}
</style>
