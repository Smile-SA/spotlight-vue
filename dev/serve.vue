<script lang="ts">
import { defineComponent } from 'vue';
import Spotlight from '../src/spotlight.vue';

export default defineComponent({
  name: 'ServeDev',
  components: {
    Spotlight
  }
});
</script>

<template>
  <div id="app">
    <spotlight/>
  </div>
</template>
