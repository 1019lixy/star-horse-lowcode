<template>
  <starhorse-form-item
      :isDesign="context.attrs['isDesign']"
      :bareFlag="context.attrs['bareFlag']"
      :form-item="field"
      :parentField="parentField"
  >
    <div ref="container" style="height: 600px;width: 100%"/>
  </starhorse-form-item>
</template>
<script lang="ts" name="excelItem">
import {defineComponent, onMounted, ref, shallowRef} from "vue";
/*
import {createUniver, defaultTheme, LocaleType, merge} from '@univerjs/presets'
import {UniverDocsCorePreset} from '@univerjs/presets/preset-docs-core'
import docsCoreZhCN from '@univerjs/presets/preset-docs-core/locales/zh-CN'
import {UniverDocsDrawingPreset} from '@univerjs/presets/preset-docs-drawing'
import docsDrawingZhCN from '@univerjs/presets/preset-docs-drawing/locales/zh-CN'
import {UniverDocsHyperLinkPreset} from '@univerjs/presets/preset-docs-hyper-link'
import docsHyperLinkZhCN from '@univerjs/presets/preset-docs-hyper-link/locales/zh-CN'
import '@univerjs/presets/lib/styles/preset-docs-core.css'
import '@univerjs/presets/lib/styles/preset-docs-drawing.css'
import '@univerjs/presets/lib/styles/preset-docs-hyper-link.css'
*/

export default defineComponent({
  setup(_props, context) {
    const parentField = context.attrs["parentField"];

    const field = context.attrs["field"] as any;
    let formItem = shallowRef({label: "input", required: false});
    let dataField = shallowRef("");
    const container = ref<HTMLElement | null>(null);
    const itemAction = () => {
      context.emit("selfFunc");
    };
    const init = async () => {
      /*const {univerAPI} = createUniver({
        locale: LocaleType.ZH_CN,
        locales: {
          [LocaleType.ZH_CN]: merge(
              {},
              docsCoreZhCN,
              docsDrawingZhCN,
              docsHyperLinkZhCN,
          ),
        },
        theme: defaultTheme,
        presets: [
          UniverDocsCorePreset({
            container: container.value,
          }),
          UniverDocsDrawingPreset(),
          UniverDocsHyperLinkPreset(),
        ],
      })
      univerAPI.createUniverDoc({})*/
    };
    const rendered = () => {
    };
    onMounted(() => {
      init();
    });
    return {parentField, context, field, formItem, dataField, itemAction, rendered, container};
  }
});
</script>
<style scoped></style>
