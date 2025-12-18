<script setup lang="ts">
import { VueSignaturePad } from "@selemondev/vue3-signature-pad";
import type { Signature } from "@selemondev/vue3-signature-pad";
import { ref, useTemplateRef } from "vue";

const state = ref({
  disabled: false,
});

const signature = useTemplateRef<Signature>("signature");

function dataURLToBlob(dataURL: string) {
  // Code taken from https://github.com/ebidel/filer.js
  const parts = dataURL.split(";base64,");
  const contentType = parts[0]?.split(":")[1];
  const raw = window.atob(parts[1]!);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
}
function handleSave(dataURL: string, downloadFormat: string) {
  if (signature.value?.isCanvasEmpty())
    return alert("Signature cannot be empty!");
  const _data_url = signature.value?.toDataURL(dataURL);
  const blob = dataURLToBlob(_data_url!);
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.style = "display: none";
  a.href = url;
  a.download = downloadFormat;

  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
}
function handleClear() {
  return signature.value?.clearCanvas();
}
function handleUndo() {
  return signature.value?.undo();
}
</script>

<template>
  <div class="grid place-items-center w-full min-h-screen">
    <div class="flex flex-col items-center space-y-4">
      <div class="bg-gray-100 p-6">
        <VueSignaturePad
            ref="signature"
            height="400px"
            width="1280px"

            :max-width="2"
            :min-width="2"
            :disabled="state.disabled"
        />
      </div>

      <button type="button" @click="handleSave('image/jpeg', 'signature-pad.jpg')">
        Save
      </button>
      <button type="button" @click="handleClear">Clear</button>
      <button type="button" @click="handleUndo">Undo</button>
    </div>
  </div>
</template>
