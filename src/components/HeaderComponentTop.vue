<template>
  <header class="mb-12 md:mb-24 pt-12 md:pt-24">
    <h1 class="mb-12 w-8/12 md:w-96 mx-auto">
      <picture class="block w-full">
        <!-- ダークモード用 -->
        <source srcset="../assets/logo-white.svg" media="(prefers-color-scheme: dark)" />
        <!-- ライトモード用 -->
        <source srcset="../assets/logo.svg" />
        <img src="../assets/logo.svg" alt="Mentori" />
      </picture>
    </h1>
    <p class="text-center leading-loose">「Mentori」はDiscord向け動画圧縮ツールです。<br>通常Discordの無料版では最大25MBの動画しかアップロードすることができません。<br>この「Mentori」では1ドロップ・1クリックで25MBへの動画圧縮を可能にします。</p>
  </header>
</template>
