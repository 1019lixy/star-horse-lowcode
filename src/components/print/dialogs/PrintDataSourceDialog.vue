<script setup lang="ts" name="PrintDataSourceDialog">
/**
 * 打印模板设计器 - 数据源配置弹窗
 * 职责：管理模板的多个数据源（静态/API/SQL/表单）
 * 强制使用 star-horse-dialog
 */
import { computed, ref, watch } from "vue";
import { i18n } from "@/lang";
import StarHorseDialog from "@/components/comp/StarHorseDialog.vue";
import { DEFAULT_DATA_FIELDS } from "../constants";
import type { PrintDataSource, PrintDataField } from "../types";

const props = defineProps<{
    visible: boolean;
    dataSources: PrintDataSource[];
}>();

const emits = defineEmits<{
    (e: "update:visible", v: boolean): void;
    (e: "save", list: PrintDataSource[]): void;
}>();

const innerVisible = computed({
    get: () => props.visible,
    set: (v) => emits("update:visible", v),
});

const localList = ref<PrintDataSource[]>(JSON.parse(JSON.stringify(props.dataSources)));
const activeId = ref<string>("");
const editing = ref<PrintDataSource | null>(null);

watch(
    () => props.visible,
    (v) => {
        if (v) {
            localList.value = JSON.parse(JSON.stringify(props.dataSources));
            if (localList.value.length && !activeId.value) {
                activeId.value = localList.value[0].id;
                editing.value = localList.value[0];
            }
        }
    },
    { immediate: true },
);

const selectSource = (id: string) => {
    activeId.value = id;
    editing.value = localList.value.find((s) => s.id === id) || null;
};

const addSource = () => {
    const newSource: PrintDataSource = {
        id: `ds_${Date.now()}`,
        name: i18n("print.datasource.newName"),
        type: "static",
        fields: JSON.parse(JSON.stringify(DEFAULT_DATA_FIELDS)),
        staticData: {},
    };
    localList.value.push(newSource);
    selectSource(newSource.id);
};

const deleteSource = (id: string) => {
    const idx = localList.value.findIndex((s) => s.id === id);
    if (idx < 0) return;
    localList.value.splice(idx, 1);
    if (activeId.value === id) {
        activeId.value = localList.value[0]?.id || "";
        editing.value = localList.value[0] || null;
    }
};

const addField = () => {
    if (!editing.value) return;
    editing.value.fields.push({
        name: `field_${editing.value.fields.length + 1}`,
        label: i18n("print.datasource.newField"),
        type: "string",
        sample: "",
    });
};

const deleteField = (idx: number) => {
    if (!editing.value) return;
    editing.value.fields.splice(idx, 1);
};

const handleSave = () => {
    emits("save", JSON.parse(JSON.stringify(localList.value)));
    innerVisible.value = false;
};

const fieldTypes: Array<{ label: string; value: PrintDataField["type"] }> = [
    { label: i18n("print.field.type.string"), value: "string" },
    { label: i18n("print.field.type.number"), value: "number" },
    { label: i18n("print.field.type.date"), value: "date" },
    { label: i18n("print.field.type.boolean"), value: "boolean" },
    { label: i18n("print.field.type.object"), value: "object" },
    { label: i18n("print.field.type.array"), value: "array" },
];
</script>

<template>
    <star-horse-dialog
        v-model="innerVisible"
        :title="i18n('print.datasource.title')"
        box-width="70%"
        box-height="70%"
        :is-show-reset="false"
        :self-func="true"
        @merge="handleSave"
    >
        <div class="ds-dialog">
            <!-- 左侧数据源列表 -->
            <div class="ds-list">
                <div class="ds-list-header">
                    <span>{{ i18n('print.datasource.listTitle') }}</span>
                    <el-button  type="primary" @click="addSource" plain>
                        <star-horse-icon icon-class="add" cursor="pointer"/>
                    </el-button>
                </div>
                <div class="ds-list-body">
                    <div
                        v-for="ds in localList"
                        :key="ds.id"
                        class="ds-item"
                        :class="{ active: activeId === ds.id }"
                        @click="selectSource(ds.id)"
                    >
                        <div class="ds-name">{{ ds.name }}</div>
                        <div class="ds-meta">{{ ds.type }} · {{ ds.fields.length }} {{ i18n('print.datasource.fields') }}</div>
                        <el-button

                            type="danger"
                            link
                            @click.stop="deleteSource(ds.id)"
                        >
                            <star-horse-icon icon-class="delete" cursor="pointer"/>
                        </el-button>
                    </div>
                </div>
            </div>

            <!-- 右侧编辑区 -->
            <div class="ds-edit" v-if="editing">
                <el-form  label-width="100px">
                    <el-form-item :label="i18n('print.datasource.name')">
                        <el-input v-model="editing.name"/>
                    </el-form-item>
                    <el-form-item :label="i18n('print.datasource.type')">
                        <el-select v-model="editing.type">
                            <el-option :label="i18n('print.datasource.type.static')" value="static"/>
                            <el-option :label="i18n('print.datasource.type.api')" value="api"/>
                            <el-option :label="i18n('print.datasource.type.sql')" value="sql"/>
                            <el-option :label="i18n('print.datasource.type.form')" value="form"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="editing.type === 'api'" :label="i18n('print.datasource.apiUrl')">
                        <el-input v-model="editing.apiUrl" placeholder="https://..."/>
                    </el-form-item>
                    <el-form-item v-if="editing.type === 'sql'" :label="i18n('print.datasource.sql')">
                        <el-input v-model="editing.sql" type="textarea" :rows="3"/>
                    </el-form-item>
                    <el-form-item v-if="editing.type === 'form'" :label="i18n('print.datasource.formId')">
                        <el-input v-model="editing.formId"/>
                    </el-form-item>
                    <el-form-item v-if="editing.type === 'static'" :label="i18n('print.datasource.staticData')">
                        <el-input
                            v-model="editing.staticData"
                            type="textarea"
                            :rows="4"
                            placeholder='{"field":"value"}'
                        />
                    </el-form-item>

                    <el-divider content-position="left">
                        <span>{{ i18n('print.datasource.fields') }}</span>
                        <el-button  type="primary" link @click="addField">
                            <star-horse-icon icon-class="add" cursor="pointer"/>
                            {{ i18n('print.datasource.addField') }}
                        </el-button>
                    </el-divider>

                    <el-table :data="editing.fields"  border>
                        <el-table-column :label="i18n('print.datasource.fieldName')" prop="name" width="120">
                            <template #default="{ row }">
                                <el-input v-model="row.name" />
                            </template>
                        </el-table-column>
                        <el-table-column :label="i18n('print.datasource.fieldLabel')" prop="label" width="120">
                            <template #default="{ row }">
                                <el-input v-model="row.label" />
                            </template>
                        </el-table-column>
                        <el-table-column :label="i18n('print.datasource.fieldType')" prop="type" width="100">
                            <template #default="{ row }">
                                <el-select v-model="row.type" >
                                    <el-option
                                        v-for="ft in fieldTypes"
                                        :key="ft.value"
                                        :label="ft.label"
                                        :value="ft.value"
                                    />
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column :label="i18n('print.datasource.fieldSample')" prop="sample">
                            <template #default="{ row }">
                                <el-input v-model="row.sample" />
                            </template>
                        </el-table-column>
                        <el-table-column :label="i18n('print.datasource.operation')" width="80">
                            <template #default="{ $index }">
                                <el-button  type="danger" link @click="deleteField($index)">
                                    <star-horse-icon icon-class="delete" cursor="pointer"/>
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form>
            </div>
            <div v-else class="ds-empty">
                {{ i18n('print.datasource.emptyTip') }}
            </div>
        </div>
        <template #footer>
            <el-button @click="innerVisible = false">{{ i18n('dialog.close') }}</el-button>
            <el-button type="primary" @click="handleSave">{{ i18n('dialog.save') }}</el-button>
        </template>
    </star-horse-dialog>
</template>

<style lang="scss" scoped>
.ds-dialog {
    display: flex;
    height: 100%;
    gap: 8px;

    .ds-list {
        width: 220px;
        display: flex;
        flex-direction: column;
        border-right: 1px solid var(--el-border-color-lighter);

        .ds-list-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px;
            font-size: 13px;
            font-weight: 600;
            border-bottom: 1px solid var(--el-border-color-lighter);
        }

        .ds-list-body {
            flex: 1;
            overflow-y: auto;
            padding: 4px;
        }

        .ds-item {
            display: flex;
            align-items: center;
            padding: 8px;
            border-radius: 4px;
            cursor: pointer;
            gap: 4px;

            &:hover {
                background: var(--el-fill-color-light);
            }

            &.active {
                background: var(--el-color-primary-light-9);
            }

            .ds-name {
                flex: 1;
                font-size: 13px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .ds-meta {
                font-size: 11px;
                color: var(--el-text-color-secondary);
            }
        }
    }

    .ds-edit {
        flex: 1;
        overflow-y: auto;
        padding: 8px 12px;
    }

    .ds-empty {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--el-text-color-secondary);
        font-size: 13px;
    }
}
</style>
