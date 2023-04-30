<template>
  <header class="flex items-center justify-center fixed top-0 left-0 z-50 w-full h-16 md:h-24 bg-white dark:bg-neutral-900">
    <div class="mx-auto w-5/12 md:w-64">
      <router-link to="/">
        <picture class="block w-full">
          <source srcset="../assets/logo-white.svg" media="(prefers-color-scheme: dark)" />
          <source srcset="../assets/logo.svg" />
          <img src="../assets/logo.svg" alt="Mentori" />
        </picture>
      </router-link>
    </div>
  </header>
</template>
