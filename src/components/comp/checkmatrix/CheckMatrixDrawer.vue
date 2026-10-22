<script setup lang="ts">
import {computed, ref, watch} from "vue";
import type {CheckMatrixPreps, CheckMatrixValue} from "@/components/types";
import {
    ensureCheckValue,
    getBlockLabel,
    getMergeBlocks,
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

const slotCount = computed(() => props.preps?.timeSlots?.length || 6);
const blocks = computed(() =>
    getMergeBlocks(props.row?.item.mergeRule || "every2h", slotCount.value),
);
const readonly = computed(() => props.disabled);

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
    props.preps?.timeSlots?.[slotIndex]?.label || `时段${slotIndex + 1}`;

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
          >稽核频率: {{ row.item.freq }}</div>
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
                  class="cm-drawer-option"
                  :class="[blockValue(bi) === '' ? 'active empty' : 'empty']"
                  @click="setBlock(bi, '')"
              >空</div>
              <div
                  class="cm-drawer-option"
                  :class="[blockValue(bi) === 'OK' ? 'active ok' : 'ok']"
                  @click="setBlock(bi, 'OK')"
              >OK</div>
              <div
                  class="cm-drawer-option"
                  :class="[blockValue(bi) === 'NG' ? 'active ng' : 'ng']"
                  @click="setBlock(bi, 'NG')"
              >NG</div>
              <div
                  class="cm-drawer-option"
                  :class="[blockValue(bi) === 'NA' ? 'active na' : 'na']"
                  @click="setBlock(bi, 'NA')"
              >NA</div>
            </div>
          </div>
          <div
              v-if="preps?.showRemark !== false"
              class="cm-drawer-remark"
          >
            <div class="cm-drawer-block-label">备注</div>
            <el-input
                v-model="draftRemark"
                :disabled="readonly"
                type="textarea"
                :rows="2"
                :placeholder="preps?.remarkPlaceholder || '填写备注'"
            />
          </div>
        </div>
        <div class="cm-drawer-batch">
          <el-button
              :disabled="readonly"
              @click="fillAll('OK')"
          >全部OK</el-button>
          <el-button
              :disabled="readonly"
              @click="fillAll('NA')"
          >全部NA</el-button>
        </div>
        <div class="cm-drawer-footer">
          <el-button
              class="cm-drawer-btn"
              @click="close"
          >取消</el-button>
          <el-button
              class="cm-drawer-btn"
              type="primary"
              :disabled="readonly"
              @click="confirm"
          >确认保存</el-button>
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

.cm-drawer-option {
  flex: 1;
  min-width: 62px;
  text-align: center;
  padding: 13px 4px;
  border-radius: 8px;
  border: 1px solid #dfe2e7;
  font-size: 14px;
  color: #4e5560;
  user-select: none;

  &.ok.active {
    background: #e8f6ee;
    border-color: #16a34a;
    color: #16a34a;
    font-weight: 700;
  }

  &.ng.active {
    background: #fdecec;
    border-color: #dc2626;
    color: #dc2626;
    font-weight: 700;
  }

  &.na.active {
    background: #fdf3e3;
    border-color: #d97706;
    color: #d97706;
    font-weight: 700;
  }

  &.empty.active {
    background: #f3f4f6;
    border-color: #4e5560;
    color: #1f2329;
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

.cm-drawer-batch {
  display: flex;
  gap: 10px;
  padding: 0 16px 8px;

  .el-button {
    flex: 1;
    margin: 0;
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