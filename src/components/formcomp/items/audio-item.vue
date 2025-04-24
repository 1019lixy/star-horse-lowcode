<template>
  <starhorse-form-item
      :isDesign="context.attrs['isDesign']"
      :disabled="context.attrs['disabled']"
      :bareFlag="context.attrs['bareFlag']"
      :form-item="field"
      :parentField="parentField"
  >
    <audio :fid="field.preps['name']" id="audio" controls></audio>
  </starhorse-form-item>
</template>
<script lang="ts" name="audioItem">
import {defineComponent, onMounted, shallowRef} from 'vue';
import {blobData} from '@/api/star_horse_apis.ts';
import Help from '@/components/help.vue';

export default defineComponent({
  components: {Help},
  setup(props, context) {
    const parentField = context.attrs['parentField'];

    const field = context.attrs['field'] as any;
    let formItem = shallowRef({label: 'input', required: false});
    let dataField = shallowRef('');
    let audio;
    const itemAction = () => {
      context.emit('selfFunc');
    };
    const init = async () => {
      let file = await blobData(field['audioUrl']);
      if (!file) {
        return;
      }
      // 开始识别
      let reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = function (event) {
        let arrBuffer = event.target.result as ArrayBuffer;
        let audioCtx = new AudioContext();
        audioCtx.decodeAudioData(arrBuffer, function (audioBuffer) {
          let duration = audioBuffer.duration;
          let channels = audioBuffer.numberOfChannels;
          let rate = audioBuffer.sampleRate;
          // 3秒
          let startOffset = 0;
          let endOffset = rate * 3;
          let frameCount = endOffset - startOffset;
          let newAudioBuffer;
          newAudioBuffer = new AudioContext().createBuffer(channels, endOffset - startOffset, rate);
          let anotherArray = new Float32Array(frameCount);
          let offset = 0;
          for (let channel = 0; channel < channels; channel++) {
            audioBuffer.copyFromChannel(anotherArray, channel, startOffset);
            newAudioBuffer.copyToChannel(anotherArray, channel, offset);
          }
          /**
           * 直接播放使用下面的代码
           // 创建AudioBufferSourceNode对象
           let source = audioCtx.createBufferSource();
           // 设置AudioBufferSourceNode对象的buffer为复制的3秒AudioBuffer对象
           source.buffer = newAudioBuffer;
           // 这一句是必须的，表示结束，没有这一句没法播放，没有声音
           // 这里直接结束，实际上可以对结束做一些特效处理
           source.connect(audioCtx.destination);
           // 资源开始播放
           source.start();
           */
          let blob = bufferToWave(newAudioBuffer, frameCount);
          /**
           * 转换成Base64使用下面的代码
           let reader2 = new FileReader();
           reader2.onload = function(evt){
           audio.src = evt.target.result;
           };
           reader2.readAsDataURL(blob);
           */
          // 使用Blob地址
          audio.src = URL.createObjectURL(blob);
        });
      };
    };
    // Convert AudioBuffer to a Blob using WAVE representation
    const bufferToWave = (abuffer, len) => {
      let numOfChan = abuffer.numberOfChannels,
          length = len * numOfChan * 2 + 44,
          buffer = new ArrayBuffer(length),
          view = new DataView(buffer),
          channels = [],
          i,
          sample,
          offset = 0,
          pos = 0;
      const setUint16 = (data) => {
        view.setUint16(pos, data, true);
        pos += 2;
      };
      const setUint32 = (data) => {
        view.setUint32(pos, data, true);
        pos += 4;
      };
      // write WAVE header
      setUint32(0x46464952); // "RIFF"
      setUint32(length - 8); // file length - 8
      setUint32(0x45564157); // "WAVE"
      setUint32(0x20746d66); // "fmt " chunk
      setUint32(16); // length = 16
      setUint16(1); // PCM (uncompressed)
      setUint16(numOfChan);
      setUint32(abuffer.sampleRate);
      setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
      setUint16(numOfChan * 2); // block-align
      setUint16(16); // 16-bit (hardcoded in this demo)
      setUint32(0x61746164); // "data" - chunk
      setUint32(length - pos - 4); // chunk length
      // write interleaved data
      for (i = 0; i < abuffer.numberOfChannels; i++) {
        channels.push(abuffer.getChannelData(i));
      }
      while (pos < length) {
        for (i = 0; i < numOfChan; i++) {
          // interleave channels
          sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
          sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0; // scale to 16-bit signed int
          view.setInt16(pos, sample, true); // write 16-bit sample
          pos += 2;
        }
        offset++; // next source sample
      }
      // create Blob
      return new Blob([buffer], {type: 'audio/wav'});
    };
    onMounted(() => {
      audio = document.getElementById('audio');
      init();
    });
    return {parentField, context, field, formItem, dataField};
  }
});
</script>
<style scoped></style>
