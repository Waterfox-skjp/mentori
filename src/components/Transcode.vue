<script setup lang="ts">
  import { ref } from 'vue'
  import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'
  import { useColorMode } from '@vueuse/core'


  const themeMode = useColorMode() // Ref<'dark' | 'light'>
  const ffmpeg = createFFmpeg({
    log: true,
  })
  const inputVideoEl = ref<any>(null)
  let inputVideo = ref('')
  let outputVideo = ref('')
  let inputName = ref('')
  let inputSize = ref(0)
  let inputType = ref('')
  let outputName = ref('')
  let progress = ref(-1)
  let transcodeFlag = ref(false)
  let isDragOver = ref(false)

  const onChange = (e: any) => {
    let file = e.target.files[0]
    if (file.type.indexOf('mp4') != -1 || file.type.indexOf('quicktime') != -1 || file.type.indexOf('x-matroska') != -1) {
      if (file.size < 314572800) {
        inputVideo.value = URL.createObjectURL(file)
        inputName.value = file.name
        inputSize.value = file.size
        inputType.value = file.type
        transcodeFlag.value = true
      } else {
        alert('サイズオーバー')
        e.currentTarget.value = ''
      }
    } else {
      alert('未対応ファイル')
      e.currentTarget.value = ''
    }
  }

  const onDrag = (type: string) => {
    isDragOver.value = type === 'over'
  }

  const onDrop = () => {
    isDragOver.value = false
  }

  const transcode = async () => {
    transcodeFlag.value = false
    if (!ffmpeg.isLoaded()) {
      await ffmpeg.load()
    }
    ffmpeg.setProgress(({ ratio }) => {
      progress.value = Math.round(ratio * 100)
    })
    ffmpeg.FS('writeFile', inputName.value, await fetchFile(inputVideo.value))
    const bitrate = bitrateCalc() + 'k'
    const config = ['-i', inputName.value, '-c:v', 'libx264', '-b:v', bitrate, '-r', '30', '-s', '896x504', '-b:a', '96k', 'output.mp4']
    await ffmpeg.run(...config)
    outputName.value = baseName(inputName.value) + '_transcode.mp4'
    const data = ffmpeg.FS('readFile', 'output.mp4')
    outputVideo.value = URL.createObjectURL(
      new Blob([data.buffer], { type: 'video/mp4' })
    )
    transcodeFlag.value = true
  }

  const reset = () => {
    inputVideo.value = ''
    outputVideo.value = ''
    progress.value = -1
    transcodeFlag.value = false
  }

  const baseName = (str: string) => {
    let base = new String(str).substring(str.lastIndexOf('/') + 1);
    if (base.lastIndexOf('.') != -1)
      base = base.substring(0, base.lastIndexOf('.'));
    return base;
  }

  const bitrateCalc = () => {
    const duration: number = parseInt(inputVideoEl.value.duration)
    let bitrate: number = (((26214400 / duration) / 128) * 10) / 10 - 96; // 23.8MBベースで計算
    bitrate = Math.ceil(bitrate)
    return bitrate
  }

  const mbByteCalc = (byte: number) => {
    let mbByte = byte / 1048576
    return Math.floor(mbByte * 10) / 10
  }
</script>

<template>
  <section>
    <div class="md:container mx-2.5 md:mx-auto">
      <video :src="inputVideo" controls ref="inputVideoEl" class="p-upload__inputvideo"/>
      <div class="p-upload__field" v-if="!inputVideo">
        <div
          class="p-upload__field-inner"
          :class="{ 'is-over': isDragOver }"
          @dragover.prevent="onDrag('over')"
          @dragleave="onDrag('leave')"
          @drop.stop="onDrop"
        >
          <input type="file" @change="onChange" accept=".mp4, .mov, .mkv" class="p-upload__field-input" />
          <p class="p-upload__field-text">動画をドラッグ＆ドロップ <br>またはクリックでファイル選択<br><small>（.mp4、.mov、.mkv限定、300MBまで）</small></p>
        </div>
      </div>
      <div class="p-upload__field is-completed" v-if="inputVideo && progress == -1">
        <div class="p-upload__field-inner">
          <div class="p-upload__field-data">
            <div class="p-upload__field-icon"></div>
            <dl class="p-upload__field-list">
              <div class="p-upload__field-item">
                <dt class="p-upload__field-label">ファイル名</dt>
                <dd class="p-upload__field-value">{{ inputName }}</dd>
              </div>
              <div class="p-upload__field-item">
                <dt class="p-upload__field-label">ファイルサイズ</dt>
                <dd class="p-upload__field-value">{{ mbByteCalc(inputSize) }}MB</dd>
              </div>
              <div class="p-upload__field-item">
                <dt class="p-upload__field-label">ファイル形式</dt>
                <dd class="p-upload__field-value">{{ inputType }}</dd>
              </div>
            </dl>
            <div class="p-upload__field-delete" @click="reset"></div>
          </div>
        </div>
      </div>
      <div class="mb-12 flex justify-center" v-if="progress >= 0">
        <ve-progress
          :progress="progress"
          :legend-formatter="({ currentValue }) => `${currentValue}%`"
          color="#f97316"
          emptyColor="#CCC"
        />
      </div>

      <template v-if="outputVideo">
        <div class="mb-12 flex justify-center">
          <video :src="outputVideo" controls />
        </div>
        <a :href="outputVideo" :download="outputName" class="mx-auto mb-6 w-9/12 max-w-xs py-3.5 flex justify-center items-center rounded-full bg-orange-500 hover:bg-orange-700 transition duration-300 text-white font-bold">
          <svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg>
          <span>ダウンロード</span>
        </a>
        <button @click="reset" :disabled="!transcodeFlag" class="mx-auto w-9/12 max-w-xs py-3.5 block rounded-full bg-orange-500 hover:bg-orange-700 transition duration-300 text-white font-bold">他のファイルを圧縮する</button>
      </template>
      <template v-else>
        <button @click="transcode" v-if="transcodeFlag" class="mx-auto w-9/12 max-w-xs py-3.5 block rounded-full bg-orange-500 hover:bg-orange-700 transition duration-300 md:text-xl text-white font-bold">
          圧縮開始
        </button>
        <button v-else class="mx-auto w-9/12 max-w-xs py-3.5 block rounded-full bg-orange-500 opacity-50 md:text-xl text-white font-bold cursor-not-allowed">
          圧縮開始
        </button>
      </template>
    </div>
  </section>
</template>

<style lang="scss">
.p-upload {
  &__inputvideo { display: none; }
  &__field {
    border-radius: 0.625rem;
    border: 3px dashed #888;
    margin-bottom: 3rem;
    background-color: rgba($color: #000, $alpha: .1);
    width: 100%;
    height: 20rem;
    &-text { font-size: 1.25rem; text-align: center; letter-spacing: .1em;
      small { font-size: 0.75rem; letter-spacing: .1em; }
    }
    &-inner {
      width: 100%;
      height: 100%;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      &.is-over { background-color: rgba($color: #000, $alpha: .4); }
    }
    &-input {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      opacity: 0;
      cursor: pointer;
    }
    &-data { display: flex; align-items: center; position: relative; }
    &-icon { margin-right: 1.5rem; font-size: 3.75rem;
      &::before {
        display: block;
        font-family: 'Material Icons';
        font-weight: normal;
        font-style: normal;
        content: "\eb87";
      }
    }
    &-list { letter-spacing: .1em; }
    &-item { display: flex; }
    &-label { width: 9rem;
      &::after { content: "："; }
    }
    &-value { flex: 1; }
    &-delete { margin-left: 1.5rem; line-height: 1; font-size: 1.875rem; cursor: pointer;
      &::before {
        font-family: 'Material Icons';
        font-weight: normal;
        font-style: normal;
        content: "\e5c9";
      }
    }
    &.is-completed { border-style: solid; }
  }
  &__progress { display: flex; justify-content: center; }
}

@media (prefers-color-scheme: dark) {
  .p-upload {
    &__field { border-color: #fff; }
  }
}

@media screen and (max-width: 767px) {
  .p-upload {
    &__field { border-width: 2px;
      &-data { display: block; }
      &-icon { margin-right: 0; margin-bottom: 1rem; line-height: 1; text-align: center; }
      &-list {
        .p-upload__field-item:not(:last-child) { margin-bottom: .5em; }
      }
      &-label { width: 9em; }
      &-delete { margin: 2rem auto 0; width: 2rem; font-size: 2rem; aspect-ratio: 1 / 1; }
    }
  }
}
</style>
