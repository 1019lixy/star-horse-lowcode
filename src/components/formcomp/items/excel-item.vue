<template>
  <starhorse-form-item
      :isDesign="context.attrs['isDesign']"
      :bareFlag="context.attrs['bareFlag']"
      :formItem="field"
      :parentField="parentField"
  >
    <div ref="container" style="height: 600px;width: 100%"></div>
  </starhorse-form-item>
</template>

<script lang="ts">
import {onMounted, onBeforeUnmount, ref, toRaw, defineComponent, shallowRef} from 'vue'
/*
import {createUniver, defaultTheme, LocaleType, merge, Univer} from '@univerjs/presets';
import {UniverSheetsCorePreset} from '@univerjs/presets/preset-sheets-core';
import UniverPresetSheetsCoreZhCN from '@univerjs/presets/preset-sheets-core/locales/zh-CN';
import '@univerjs/presets/lib/styles/preset-sheets-core.css';
*/

export default defineComponent({
  setup(_props, context) {
    const parentField = context.attrs["parentField"];
    const field = context.attrs["field"] as any;
    let formItem = shallowRef({label: "input", required: false});
    let dataField = shallowRef("");
    const container = ref<HTMLElement | null>(null);
    // const univerAPIRef = ref<Univer | null>(null);

    onMounted(() => {
      /*const {univerAPI} = createUniver({
        locale: LocaleType.ZH_CN,
        locales: {
          [LocaleType.ZH_CN]: merge(
              {},
              UniverPresetSheetsCoreZhCN,
          ),
        },
        theme: defaultTheme,
        presets: [
          UniverSheetsCorePreset({
            container: container.value,
          }),
        ],
      });

      univerAPI.createWorkbook({name: 'Test Sheet'});

      univerAPIRef.value = univerAPI;*/
    });

    onBeforeUnmount(() => {
      /*toRaw(container.value)?.dispose();
      univerAPIRef.value = null;*/
    });
    return {parentField, context, field, formItem, dataField, container};
  }
})
</script>
