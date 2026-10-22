<script setup lang="ts">
import {computed, ref, watch} from "vue";
import {i18n} from "@/lang";
import type {CheckMatrixPreps, CheckMatrixValue} from "@/components/types";
import {
    ensureCheckValue,
    getBlockLabel,
    getMergeBlocks,
    resolveTimeSlots,
    type CheckRenderRow,
} from "@/components/comp/checkmatrix/useCheckMatrixState";

const props = defineProps<{
    visible: boolean;
    row: CheckRenderRow | null;
    value: CheckMatrixValue;
    preps?: CheckMatrixPreps;
    disabled?: boolean;
}>();
const emits = defineEmits(["update:visible", "confirm"]);

const draftResults = ref<string[]>([]);
const draftRemark = ref("");

const timeSlots = computed(() => resolveTimeSlots(props.preps));
const slotCount = computed(() => timeSlots.value.length);
const blocks = computed(() =>
    getMergeBlocks(props.row?.item.mergeRule || "every2h", slotCount.value),
);
const readonly = computed(() => props.disabled);

/**
 * 当前检查项的备选项(行配置 > 容器配置 > 内置默认):
 * 选项按钮与"全部"批量按钮均按此渲染,显示 name,不硬编码 OK/NG/NA
 */
const options = computed(() => props.row?.options || []);

/** 选项按钮/批量按钮的颜色序号类(按选项在配置中的位置) */
const optionClass = (index: number) => `opt-${index}`;

const loadDraft = () => {
    if (!props.row || !props.value) return;
    const value = ensureCheckValue(props.value, [props.row], props.preps);
    const rowValue = value.rows[props.row.key];
    draftResults.value = [...(rowValue.results || [])];
    draftRemark.value = rowValue.remark || "";
};

watch(
    () => props.visible,
    (val) => {
        if (val) loadDraft();
    },
);

const blockLabel = (blockIndex: number) =>
    getBlockLabel(
        props.row?.item.mergeRule || "every2h",
        blockIndex,
        slotCount.value,
    );

const slotLabel = (slotIndex: number) =>
    timeSlots.value[slotIndex]?.label ||
        i18n("checkmatrix.blockSlot", slotIndex + 1);

const blockValue = (blockIndex: number) => {
    const block = blocks.value[blockIndex];
    return draftResults.value[block.start] || "";
};

const setBlock = (blockIndex: number, result: string) => {
    if (readonly.value) return;
    const block = blocks.value[blockIndex];
    for (let k = 0; k < block.span; k++) {
        draftResults.value[block.start + k] = result;
    }
};

const fillAll = (result: string) => {
    if (readonly.value) return;
    draftResults.value = draftResults.value.map(() => result);
};

const close = () => {
    emits("update:visible", false);
};

const confirm = () => {
    if (!props.row || !props.value) {
        close();
        return;
    }
    const value = ensureCheckValue(props.value, [props.row], props.preps);
    const rowValue = value.rows[props.row.key];
    rowValue.results = [...draftResults.value];
    rowValue.remark = draftRemark.value;
    emits("confirm");
    close();
};

const onMaskClick = () => close();
</script>

<template>
  <teleport to="body">
    <div
        v-if="visible"
        class="cm-drawer-mask"
        @click="onMaskClick"
    >
      <div
          class="cm-drawer"
          @click.stop
      >
        <div class="cm-drawer-header">
          <div class="cm-drawer-title">{{ row?.item.content }}</div>
          <div
              v-if="row?.item.freq"
              class="cm-drawer-freq"
          >{{ i18n("checkmatrix.freq") }}: {{ row.item.freq }}</div>
        </div>
        <div class="cm-drawer-body">
          <div
              v-for="(block, bi) in blocks"
              :key="bi"
              class="cm-drawer-block"
          >
            <div class="cm-drawer-block-head">
              <span class="cm-drawer-block-label">{{ blockLabel(bi) }}</span>
              <span class="cm-drawer-block-range">
                {{ slotLabel(block.start) }}
              </span>
            </div>
            <div class="cm-drawer-options">
              <div
                  v-for="(opt, oi) in options"
                  :key="oi"
                  class="cm-drawer-option"
                  :class="[
                      optionClass(oi),
                      {active: blockValue(bi) === opt.value},
                  ]"
                  @click="setBlock(bi, opt.value)"
              >{{ opt.name }}</div>
            </div>
          </div>
          <div
              v-if="preps?.showRemark !== false"
              class="cm-drawer-remark"
          >
            <div class="cm-drawer-block-label">{{ i18n("checkmatrix.remark") }}</div>
            <el-input
                v-model="draftRemark"
                :disabled="readonly"
                type="textarea"
                :rows="2"
                :placeholder="preps?.remarkPlaceholder || i18n('checkmatrix.remarkPlaceholder')"
            />
          </div>
        </div>
        <div class="cm-drawer-batch">
          <div
              v-for="(opt, oi) in options"
              :key="oi"
              class="cm-drawer-batch-btn"
              :class="[optionClass(oi), {disabled: readonly}]"
              @click="readonly ? undefined : fillAll(opt.value)"
          >{{ i18n("checkmatrix.fillAllPrefix") }}{{ opt.name }}</div>
        </div>
        <div class="cm-drawer-footer">
          <el-button
              class="cm-drawer-btn"
              @click="close"
          >{{ i18n("checkmatrix.cancel") }}</el-button>
          <el-button
              class="cm-drawer-btn"
              type="primary"
              :disabled="readonly"
              @click="confirm"
          >{{ i18n("checkmatrix.confirm") }}</el-button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style scoped lang="scss">
.cm-drawer-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
}

.cm-drawer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-radius: 16px 16px 0 0;
  max-height: 82vh;
  display: flex;
  flex-direction: column;
}

.cm-drawer-header {
  padding: 14px 16px 10px;
  border-bottom: 1px solid #f0f1f3;
}

.cm-drawer-title {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.5;
  color: #1f2329;
  word-break: break-all;
}

.cm-drawer-freq {
  font-size: 12px;
  color: #8a919c;
  margin-top: 4px;
}

.cm-drawer-body {
  overflow-y: auto;
  padding: 12px 16px;
  flex: 1;
}

.cm-drawer-block {
  margin-bottom: 16px;
}

.cm-drawer-block-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.cm-drawer-block-label {
  font-size: 14px;
  font-weight: 600;
  color: #1f2329;
}

.cm-drawer-block-range {
  font-size: 12px;
  color: #8a919c;
}

.cm-drawer-options {
  display: flex;
  gap: 8px;
}

/* 选项按钮:4 类(空/OK/NG/NA)等分一行,尺寸紧凑适配移动端 */
.cm-drawer-option {
  flex: 1;
  min-width: 0;
  text-align: center;
  padding: 9px 2px;
  border-radius: 6px;
  border: 1px solid #dfe2e7;
  font-size: 13px;
  line-height: 1.2;
  color: #4e5560;
  user-select: none;

  &.opt-0.active {
    background: #f3f4f6;
    border-color: #4e5560;
    color: #1f2329;
    font-weight: 700;
  }

  &.opt-1.active {
    background: #e8f6ee;
    border-color: #16a34a;
    color: #16a34a;
    font-weight: 700;
  }

  &.opt-2.active {
    background: #fdecec;
    border-color: #dc2626;
    color: #dc2626;
    font-weight: 700;
  }

  &.opt-3.active {
    background: #fdf3e3;
    border-color: #d97706;
    color: #d97706;
    font-weight: 700;
  }

  &.opt-4.active {
    background: #eef2fb;
    border-color: #4b5bab;
    color: #4b5bab;
    font-weight: 700;
  }

  &.opt-5.active {
    background: #f3eefb;
    border-color: #7c4bb0;
    color: #7c4bb0;
    font-weight: 700;
  }
}

.cm-drawer-remark {
  margin-bottom: 8px;

  .cm-drawer-block-label {
    margin-bottom: 6px;
    display: block;
  }
}

/* 批量按钮:与上方选项同一选项集与列数(按当前检查项配置),逐列对齐 */
.cm-drawer-batch {
  display: flex;
  gap: 8px;
  padding: 0 16px 8px;

  .cm-drawer-batch-btn {
    flex: 1;
    min-width: 0;
    text-align: center;
    padding: 9px 2px;
    border-radius: 6px;
    border: 1px solid #dfe2e7;
    background: #fff;
    font-size: 13px;
    line-height: 1.2;
    color: #4e5560;
    user-select: none;

    &.opt-1 {
      color: #16a34a;
      border-color: #bfe6cd;
    }

    &.opt-2 {
      color: #dc2626;
      border-color: #f3c8c8;
    }

    &.opt-3 {
      color: #d97706;
      border-color: #f0dcb4;
    }

    &.opt-4 {
      color: #4b5bab;
      border-color: #c9d2ec;
    }

    &.opt-5 {
      color: #7c4bb0;
      border-color: #ddcdf0;
    }

    &.disabled {
      opacity: 0.5;
    }
  }
}

.cm-drawer-footer {
  display: flex;
  gap: 10px;
  padding: 10px 16px calc(14px + env(safe-area-inset-bottom));
  border-top: 1px solid #f0f1f3;

  .cm-drawer-btn {
    flex: 1;
    margin: 0;
    padding: 12px 0;
    font-size: 15px;
  }
}
</style>