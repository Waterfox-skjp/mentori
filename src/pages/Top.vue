<script setup lang="ts">
  import { onMounted } from 'vue'
  import { ModalsContainer, useModal } from 'vue-final-modal'
  import { useStorage } from '@vueuse/core'
  import HeaderComponentTop from '../components/HeaderComponentTop.vue'
  import Transcode from '../components/Transcode.vue'
  import FooterComponent from '../components/FooterComponent.vue'
  import ModalTerms from '../components/ModalTerms.vue'

  // モーダル設定
  const { open, close } = useModal({
    component: ModalTerms,
    attrs: {
      clickToClose: false,
      escToClose: false,
      onConfirm() {
        close()
      },
    }
  })

  // 承諾モーダルのローカルストレージチェック
  const agreementFlag = useStorage('agreement-flag', false)

  // 未承諾の場合はモーダルを開く
  onMounted(() => {
    if (!agreementFlag.value) {
      open()
    }
  })
</script>

<template>
  <HeaderComponentTop/>
  <main class="mb-12 md:mb-24">
    <Transcode/>
  </main>
  <FooterComponent/>
  <ModalsContainer />
</template>
