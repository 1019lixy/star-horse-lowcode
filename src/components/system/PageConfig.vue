<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {useGlobalConfigStore} from "@/store/GlobalConfig";
import {SelectOption} from "@/components/types";
import piniaInstance from "@/store";
import {useDark, useToggle, useVModel} from "@vueuse/core";
import {Config} from "@/api/settings";
import {i18n} from "@/lang";
import {StarHorseIcon} from "@/components/comp";

const props = withDefaults(defineProps<{
  hideDefaultConfig?: boolean,
  modelValue: boolean,
  direction?: string,
  resizable?: boolean,
  title?: string,
  compSize?: string,
}>(), {
  hideDefaultConfig: false,
  modelValue: false,
  direction: "rtl",
  resizable: false,
  title: () => i18n("dashboard.operationHabitsConfig"),
  compSize: "default",
});
const emits = defineEmits(["update:modelValue", "saveData"]);
const visible: any = useVModel(props, "modelValue", emits);
const configStore = useGlobalConfigStore(piniaInstance);
const sizeList = ref<Array<SelectOption>>([
  {name: i18n("size.large"), value: "large"},
  {name: i18n("size.medium"), value: "default"},
  {name: i18n("size.small"), value: "small"},
]);
const showTypeList = ref<Array<SelectOption>>([
  {name: i18n("displayStyle.arrangement"), value: "line"},
  {name: i18n("displayStyle.dropdown"), value: "dropdown"},
]);
const tableTypeList = ref<Array<SelectOption>>([
  {name: i18n("displayStyle.list"), value: "list"},
  {name: i18n("displayStyle.card"), value: "card"},
]);
// const pageStyleList: SelectOption[] = [
//   {name: i18n("displayStyle.computer"), value: "pc"},
//   {name: i18n("displayStyle.pad"), value: "pad"},
//   {name: i18n("displayStyle.phone"), value: "phone"},
// ];
const classicsList = ref<Array<any>>([
  {code: "gold", color: "#ffd700", name: i18n("color.gold")},
  {code: "orange", color: "#ffa500", name: i18n("color.orange")},
  {code: "darkorange", color: "#ff8c00", name: i18n("color.darkorange")},
  {code: "coral", color: "#ff7f50", name: i18n("color.coral")},
  {code: "pink", color: "#ffc0cb", name: i18n("color.pink")},
  {code: "lightpink", color: "#ffb6c1", name: i18n("color.lightpink")},
  {code: "lightsalmon", color: "#ffa07a", name: i18n("color.lightsalmon")},
  {code: "hotpink", color: "#ff69b4", name: i18n("color.hotpink")},
  {code: "tomato", color: "#ff6347", name: i18n("color.tomato")},
  {code: "orangered", color: "#ff4500", name: i18n("color.orangered")},
  {code: "deeppink", color: "#ff1493", name: i18n("color.deeppink")},
  {code: "fuchsia", color: "#ff00ff", name: i18n("color.fuchsia")},
  {code: "magenta", color: "#ff00ff", name: i18n("color.magenta")},
  {code: "red", color: "#ff0000", name: i18n("color.red")},
  {code: "salmon", color: "#fa8072", name: i18n("color.salmon")},
  {code: "wheat", color: "#f5deb3", name: i18n("color.wheat")},
  {code: "sandybrown", color: "#f4a460", name: i18n("color.sandybrown")},
  {code: "khaki", color: "#f0e68c", name: i18n("color.khaki")},
  {code: "lightcoral", color: "#f08080", name: i18n("color.lightcoral")},
  {
    code: "palegoldenrod",
    color: "#eee8aa",
    name: i18n("color.palegoldenrod"),
  },
  {code: "violet", color: "#ee82ee", name: i18n("color.violet")},
  {code: "darksalmon", color: "#e9967a", name: i18n("color.darksalmon")},
  {code: "burlywood", color: "#deb887", name: i18n("color.burlywood")},
  {code: "plum", color: "#dda0dd", name: i18n("color.plum")},
  {code: "crimson", color: "#dc143c", name: i18n("color.crimson")},
  {
    code: "palevioletred",
    color: "#db7093",
    name: i18n("color.palevioletred"),
  },
  {code: "goldenrod", color: "#daa520", name: i18n("color.goldenrod")},
  {code: "orchid", color: "#da70d6", name: i18n("color.orchid")},
  {code: "chocolate", color: "#d2691e", name: i18n("color.chocolate")},
  {code: "peru", color: "#cd853f", name: i18n("color.peru")},
  {code: "indianred", color: "#cd5c5c", name: i18n("color.indianred")},
  {
    code: "mediumvioletred",
    color: "#c71585",
    name: i18n("color.mediumvioletred"),
  },
  {code: "rosybrown", color: "#bc8f8f", name: i18n("color.rosybrown")},
  {code: "mediumorchid", color: "#ba55d3", name: i18n("color.mediumorchid")},
  {
    code: "darkgoldenrod",
    color: "#b8860b",
    name: i18n("color.darkgoldenrod"),
  },
  {code: "firebrick", color: "#b22222", name: i18n("color.firebrick")},

  {code: "greenyellow", color: "#adff2f", name: i18n("color.greenyellow")},
  {code: "darkgrey", color: "#a9a9a9", name: i18n("color.darkgrey")},
  {code: "brown", color: "#a52a2a", name: i18n("color.brown")},
  {code: "sienna", color: "#a0522d", name: i18n("color.sienna")},
  {code: "darkorchid", color: "#9932cc", name: i18n("color.darkorchid")},
  {code: "palegreen", color: "#98fb98", name: i18n("color.palegreen")},
  {code: "darkviolet", color: "#9400d3", name: i18n("color.darkviolet")},
  {code: "mediumpurple", color: "#9370db", name: i18n("color.mediumpurple")},
  {code: "lightgreen", color: "#90ee90", name: i18n("color.lightgreen")},
  {code: "darkseagreen", color: "#8fbc8f", name: i18n("color.darkseagreen")},
  {code: "saddlebrown", color: "#8b4513", name: i18n("color.saddlebrown")},
  {code: "darkmagenta", color: "#8b008b", name: i18n("color.darkmagenta")},
  {code: "darkred", color: "#8b0000", name: i18n("color.darkred")},
  {code: "blueviolet", color: "#8a2be2", name: i18n("color.blueviolet")},
  {code: "lightskyblue", color: "#87cefa", name: i18n("color.lightskyblue")},
  {code: "skyblue", color: "#87ceeb", name: i18n("color.skyblue")},
  {code: "olive", color: "#808000", name: i18n("color.olive")},
  {code: "purple", color: "#800080", name: i18n("color.purple")},
  {code: "maroon", color: "#800000", name: i18n("color.maroon")},
  {code: "aquamarine", color: "#7fffd4", name: i18n("color.aquamarine")},
  {code: "chartreuse", color: "#7fff00", name: i18n("color.chartreuse")},
  {code: "lawngreen", color: "#7cfc00", name: i18n("color.lawngreen")},
  {
    code: "mediumslateblue",
    color: "#7b68ee",
    name: i18n("color.mediumslateblue"),
  },
  {
    code: "lightslategrey",
    color: "#778899",
    name: i18n("color.lightslategrey"),
  },
  {code: "slategrey", color: "#708090", name: i18n("color.slategrey")},
  {code: "olivedrab", color: "#6b8e23", name: i18n("color.olivedrab")},
  {code: "slateblue", color: "#6a5acd", name: i18n("color.slateblue")},
  {code: "grey", color: "#808080", name: i18n("color.grey")},
  {code: "dimgray", color: "#696969", name: i18n("color.dimgray")},

  {
    code: "cornflowerblue",
    color: "#6495ed",
    name: i18n("color.cornflowerblue"),
  },
  {
    code: "darkolivegreen",
    color: "#556b2f",
    name: i18n("color.darkolivegreen"),
  },
  {code: "indigo", color: "#4b0082", name: i18n("color.indigo")},
  {
    code: "mediumturquoise",
    color: "#48d1cc",
    name: i18n("color.mediumturquoise"),
  },
  {
    code: "darkslateblue",
    color: "#483d8b",
    name: i18n("color.darkslateblue"),
  },
  {code: "steelblue", color: "#4682b4", name: i18n("color.steelblue")},
  {code: "royalblue", color: "#4169e1", name: i18n("color.royalblue")},
  {code: "turquoise", color: "#40e0d0", name: i18n("color.turquoise")},
  {
    code: "mediumseagreen",
    color: "#3cb371",
    name: i18n("color.mediumseagreen"),
  },
  {code: "limegreen", color: "#32cd32", name: i18n("color.limegreen")},
  {
    code: "darkslategrey",
    color: "#2f4f4f",
    name: i18n("color.darkslategrey"),
  },
  {code: "seagreen", color: "#2e8b57", name: i18n("color.seagreen")},
  {code: "forestgreen", color: "#228b22", name: i18n("color.forestgreen")},
  {
    code: "lightseagreen",
    color: "#20b2aa",
    name: i18n("color.lightseagreen"),
  },
  {code: "dodgerblue", color: "#1e90ff", name: i18n("color.dodgerblue")},
  {code: "midnightblue", color: "#191970", name: i18n("color.midnightblue")},
  {code: "aqua", color: "#00ffff", name: i18n("color.aqua")},
  {code: "cyan", color: "#00ffff", name: i18n("color.cyan")},
  {code: "springgreen", color: "#00ff7f", name: i18n("color.springgreen")},
  {code: "lime", color: "#00ff00", name: i18n("color.lime")},
  {
    code: "mediumspringgreen",
    color: "#00fa9a",
    name: i18n("color.mediumspringgreen"),
  },
  {
    code: "darkturquoise",
    color: "#00ced1",
    name: i18n("color.darkturquoise"),
  },
  {
    code: "darkturquoise1",
    color: "#00c7e1",
    name: i18n("color.darkturquoise1"),
  },
  {code: "deepskyblue", color: "#00bfff", name: i18n("color.deepskyblue")},
  {code: "darkcyan", color: "#008b8b", name: i18n("color.darkcyan")},
  {code: "teal", color: "#008080", name: i18n("color.teal")},
  {code: "green", color: "#008000", name: i18n("color.green")},
  {code: "darkgreen", color: "#006400", name: i18n("color.darkgreen")},
  {code: "blue", color: "#0000ff", name: i18n("color.blue")},
  {code: "mediumblue", color: "#0000cd", name: i18n("color.mediumblue")},
  {code: "darkblue", color: "#00008b", name: i18n("color.darkblue")},
  {code: "navy", color: "#000080", name: i18n("color.navy")},
  {code: "black", color: "#000000", name: i18n("color.black")},
]);
let configInfo = computed(() => configStore.configFormInfo);
const init = () => {
  configStore.clearAll();
};
const isDark = useDark({
  storageKey: "vitepress-theme-appearance",
});

const toggle = () => {
  console.log(isDark);
  useToggle(isDark);
};
const changeOperation = (_val?: any) => {
  configStore.setConfigFormInfo(configInfo.value);
};
const resetDefault = () => {
  let defaultConfig = {
    tagsView: "Y",
    inputSize: "default",
    buttonSize: "default",
    buttonShowType: "dropdown",
    themeColor: "#409EFF",
    position: "left",
    menusCfg: "tradition",
    shortCutMenus: "Y",
  };
  configStore.setConfigFormInfo(defaultConfig);
};
const saveData = () => {
  changeOperation();
  emits("saveData", configInfo.value);
  visible.value = false;
};
const classicsTheme = (color: string) => {
  configInfo.value.themeColor = color;
  changeOperation(null);
};
/**
 * 获取配置信息
 */
const getConfigInfo = () => {
  return configInfo.value;
};
onMounted(() => {
  init();
});
defineExpose({
  getConfigInfo
});
</script>
<template>
  <el-drawer v-model="visible" :direction="direction" header-class="hstyle" :close-on-click-modal="false"
             :close-on-press-escape="false"
             :resizable="resizable">
    <template #header>
      <h3>{{ title }}</h3>
    </template>
    <template #default>
      <el-card class="inner_content">
        <el-scrollbar height="100%" v-if="!hideDefaultConfig">
          <el-form
              class="page-config"
              :model="configInfo"
              :size="compSize"
              label-position="top"
          >
            <slot name="header" :form="configInfo"></slot>
            <!--            <el-divider content-position="left">
                          {{i18n('pageConfig.pageStyle')}}
                        </el-divider>
                        <el-select v-model="configInfo.pageStyle" :options="pageStyleList" :props="{
                          label:'name'
                        }"/>-->
            <el-divider content-position="left">
              <el-form-item
                  prop="themeColor"
                  :label="i18n('pageConfig.color')"
                  :label-position="'left'"
              >
                <el-color-picker
                    v-model="configInfo.themeColor"
                    @change="changeOperation"
                />
              </el-form-item>
            </el-divider>
            <el-form-item
                prop="themeColor"
                :label="i18n('pageConfig.themeColor')"
                style="height: 200px; width: 100%; overflow: auto"
            >
              <template v-for="item in classicsList">
                <div class="theme-item" @click="classicsTheme(item.color)">
                  <el-tag
                      :color="item.color"
                      style="margin-right: 8px"
                      :size="Config.compSize"
                  />
                  <span>{{ item.name }}</span>
                </div>
              </template>
            </el-form-item>
            <el-divider content-position="left">
              <h4>{{ i18n("pageConfig.sizeAndList") }}</h4>
            </el-divider>
            <el-row gutter="10">
              <el-col :span="8">
                <el-form-item
                    prop="inputSize"
                    :label="i18n('pageConfig.componentSize')"
                >
                  <el-select
                      v-model="configInfo.inputSize"
                      @change="changeOperation"
                  >
                    <el-option
                        v-for="item in sizeList"
                        :value="item.value"
                        :label="item.name"
                        :key="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                    prop="buttonSize"
                    :label="i18n('pageConfig.buttonSize')"
                >
                  <el-select
                      v-model="configInfo.buttonSize"
                      @change="changeOperation"
                  >
                    <el-option
                        v-for="item in sizeList"
                        :value="item.value"
                        :label="item.name"
                        :key="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                    prop="tableType"
                    :label="i18n('pageConfig.dataDisplay')"
                >
                  <el-select
                      v-model="configInfo.tableType"
                      @change="changeOperation"
                  >
                    <el-option
                        v-for="item in tableTypeList"
                        :value="item.value"
                        :label="item.name"
                        :key="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-divider content-position="left">
              <h4>{{ i18n("pageConfig.menu") }}</h4>
            </el-divider>
            <el-row gutter="10">
              <el-col :span="12">
                <el-form-item
                    prop="position"
                    :label="i18n('pageConfig.menuPosition')"
                >
                  <el-radio-group
                      v-model="configInfo.position"
                      @change="changeOperation"
                  >
                    <el-radio :label="i18n('pageConfig.top')" value="top"/>
                    <el-radio :label="i18n('pageConfig.left')" value="left"/>
                    <el-radio :label="i18n('pageConfig.right')" value="right"/>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="menusCfg" :label="i18n('pageConfig.menuStyle')">
                  <el-radio-group
                      v-model="configInfo.menusCfg"
                      @change="changeOperation"
                  >
                    <el-radio
                        :label="i18n('pageConfig.traditionalStyle')"
                        value="tradition"
                    />
                    <el-radio
                        :label="i18n('pageConfig.fixedWidth')"
                        value="fixed"
                    />
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <slot name="content" :form="configInfo"></slot>
            <slot :form="configInfo"></slot>
            <el-divider content-position="left">
              <h4>{{ i18n("pageConfig.otherConfig") }}</h4>
            </el-divider>
            <el-row :gutter="10">
              <el-col :span="8">
                <el-form-item prop="tagsView" :label="i18n('pageConfig.tagsView')">
                  <el-switch
                      v-model="configInfo.tagsView"
                      :active-value="'Y'"
                      :inactive-value="'N'"
                      @change="changeOperation"
                  >
                  </el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                    prop="shortCutMenus"
                    :label="i18n('pageConfig.shortcutMenu')"
                >
                  <el-switch
                      v-model="configInfo.shortCutMenus"
                      :active-value="'Y'"
                      :inactive-value="'N'"
                      @change="changeOperation"
                  >
                  </el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                    prop="buttonShowType"
                    :label="i18n('pageConfig.buttonDisplayStyle')"
                >
                  <el-select
                      v-model="configInfo.buttonShowType"
                      @change="changeOperation"
                  >
                    <el-option
                        v-for="item in showTypeList"
                        :value="item.value"
                        :label="item.name"
                        :key="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <slot name="footer" :form="configInfo"></slot>
          </el-form>

        </el-scrollbar>
        <div class="flex flex-col w-full h-full" v-else>
          <slot name="header" :form="configInfo"></slot>
          <slot name="content" :form="configInfo"></slot>
          <slot :form="configInfo"></slot>
          <slot name="footer" :form="configInfo"></slot>
        </div>
      </el-card>
    </template>
    <template #footer>
      <div class="footer-button">
        <el-button :size="compSize" @click="saveData" type="primary">
          <star-horse-icon icon-class="save" color="#fff"/>
          {{ i18n("form.confirm") }}
        </el-button>
        <el-button :size="compSize" type="text" @click="resetDefault">
          <star-horse-icon icon-class="reset"/>
          {{ i18n("pageConfig.resetDefaultConfig") }}
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>
<style scoped lang="scss">
.page-config {
  height: 100%;
  overflow: hidden;
  width: 95%;
  margin: 10px auto;
}

.footer-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: start;
}

.theme-item {
  align-items: center;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  width: 25%;
  overflow: auto;
}

.el-tag {
  border: none;
  aspect-ratio: 1;
}
</style>
