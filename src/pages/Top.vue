<script setup lang="ts">
  import HeaderComponentTop from '../components/HeaderComponentTop.vue'
  import Transcode from '../components/Transcode.vue'
  import FooterComponent from '../components/FooterComponent.vue'
</script>

<template>
  <HeaderComponentTop/>
  <main class="mb-12 md:mb-24">
    <Transcode/>
  </main>
  <FooterComponent/>
</template>
