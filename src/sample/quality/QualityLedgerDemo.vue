<script setup lang="ts" name="QualityLedgerDemo">
import {computed, reactive, ref, watch} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import InspectionToolbar from "@/sample/quality/components/InspectionToolbar.vue";
import {ledgerDefs, type LedgerDef} from "@/sample/quality/data/ledgerData";

const currentKey = ref(ledgerDefs[0].key);
const currentLedger = computed<LedgerDef>(
    () =>
        ledgerDefs.find((ledger) => ledger.key === currentKey.value) ||
        ledgerDefs[0],
);

const storageKey = (key: string) => `sh_quality_ledger_${key}`;

const ledgerDataMap = reactive<Record<string, Array<Record<string, any>>>>(
    Object.fromEntries(
        ledgerDefs.map((ledger) => {
            let rows = [...ledger.dataList];
            const raw = localStorage.getItem(storageKey(ledger.key));
            if (raw) {
                try {
                    const saved = JSON.parse(raw);
                    if (Array.isArray(saved)) rows = saved;
                } catch (e) {
                    rows = [...ledger.dataList];
                }
            }
            return [ledger.key, rows];
        }),
    ),
);

const currentRows = computed(
    () => ledgerDataMap[currentLedger.value.key] || [],
);

const persist = () => {
    localStorage.setItem(
        storageKey(currentLedger.value.key),
        JSON.stringify(currentRows.value),
    );
};

watch(currentKey, persist);

const dialogVisible = ref(false);
const editFormRef = ref();
const editForm = ref<Record<string, any>>({});

const editFormRules = computed(() =>
    Object.fromEntries(
        currentLedger.value.columns.map((column) => [
            column.prop,
            [{required: true, message: `请输入${column.label}`, trigger: "blur"}],
        ]),
    ),
);

const openAddDialog = () => {
    editForm.value = Object.fromEntries(
        currentLedger.value.columns.map((column) => [column.prop, ""]),
    );
    dialogVisible.value = true;
};

const confirmAdd = async () => {
    const valid = await editFormRef.value?.validate?.().catch(() => false);
    if (!valid) return;
    currentRows.value.push({
        ...editForm.value,
        id: currentRows.value.length + 1,
    });
    persist();
    dialogVisible.value = false;
    ElMessage.success("记录已添加");
};

const removeRow = (row: Record<string, any>) => {
    ElMessageBox.confirm("确认删除该条记录?", "提示", {type: "warning"})
        .then(() => {
            const list = currentRows.value;
            const index = list.indexOf(row);
            if (index >= 0) {
                list.splice(index, 1);
                persist();
                ElMessage.success("记录已删除");
            }
        })
        .catch(() => undefined);
};

const resetData = () => {
    const ledger = currentLedger.value;
    ElMessageBox.confirm("恢复为内置示例数据?当前修改将丢失", "提示", {
        type: "warning",
    })
        .then(() => {
            ledgerDataMap[ledger.key] = [...ledger.dataList];
            persist();
            ElMessage.success("已恢复示例数据");
        })
        .catch(() => undefined);
};

const formOptions = ledgerDefs.map((ledger) => ({
    key: ledger.key,
    title: ledger.title,
}));

const currentKeyModel = computed({
    get: () => currentKey.value,
    set: (val: string) => {
        currentKey.value = val;
    },
});
</script>

<template>
  <div class="quality-demo">
    <inspection-toolbar
        :title="currentLedger.title"
        :stats="{ok: 0, ng: 0, na: 0, empty: 0, total: currentRows.length}"
        kind="rowEdit"
        :form-options="formOptions"
        :current-key="currentKeyModel"
        @update:current-key="currentKeyModel = $event"
    />
    <div class="ledger-card">
      <div class="ledger-actions">
        <el-button type="primary" @click="openAddDialog">新增记录</el-button>
        <el-button @click="resetData">恢复示例数据</el-button>
        <span class="ledger-count">共 {{ currentRows.length }} 条</span>
      </div>
      <el-table
          :key="currentLedger.key"
          :data="currentRows"
          border
          stripe
          height="520"
      >
        <el-table-column
            v-for="column in currentLedger.columns"
            :key="column.prop"
            :prop="column.prop"
            :label="column.label"
            :min-width="column.width || 120"
            show-overflow-tooltip
        />
        <el-table-column label="操作" width="90" fixed="right">
          <template #default="{row}">
            <el-button link type="danger" @click="removeRow(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
        v-model="dialogVisible"
        :title="`新增${currentLedger.title}记录`"
        width="560px"
    >
      <el-form
          ref="editFormRef"
          :model="editForm"
          :rules="editFormRules"
          label-width="110px"
      >
        <el-form-item
            v-for="column in currentLedger.columns"
            :key="column.prop"
            :label="column.label"
            :prop="column.prop"
        >
          <el-input
              v-model="editForm[column.prop]"
              :placeholder="`请输入${column.label}`"
              clearable
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAdd">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.quality-demo {
  max-width: 1400px;
  margin: 0 auto;
  padding: 12px 14px 40px;
  background: #f4f5f7;
  min-height: 100%;
}

.ledger-card {
  background: #fff;
  border: 1px solid var(--sh-cm-bd, #c9cdd3);
  border-radius: 8px;
  padding: 12px;
}

.ledger-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;

  .el-button {
    margin: 0;
  }
}

.ledger-count {
  font-size: 12px;
  color: #8a919c;
  margin-left: auto;
}
</style>