<script setup lang="ts">
  import { computed, onMounted, ref, watch } from 'vue';
  import { initDbList, openDatabase, tableColumns } from '@/utils/DbSearchUtils';
  import piniaInstance from '@/store';
  import { useGlobalConfigStore } from '@/store/GlobalConfig';
  import { SelectOption } from '@/components/types/SearchProps';
  import StarHorseIcon from '@/components/comp/StarHorseIcon.vue';
  import { useConsumerViewStore } from '@/store/ConsumerView';
  import { Config } from '@/api/settings';

  let configStore = useGlobalConfigStore(piniaInstance);
  const consumerView = useConsumerViewStore(piniaInstance);
  let compSize = computed(() => configStore.configFormInfo?.buttonSize || Config.compSize);
  let dataForm = ref<any>({});
  const filterTableName = ref<string>('');
  const tbTab = ref<string>('tb1');
  let assignDataList = ref<Array<any>>([]);
  let selectFields = ref<Array<SelectOption>>([]);
  let dbList = ref<any>([]);
  let tableAndColumnsList = ref<any>([]);
  let currentIndex = ref<any>(null);
  let currentData = ref<any>({});
  const fieldCompTypesMsg = `类型操作提示：
1、系统默认将数字类型的字段映射为数字输入框组件；
   将字符串类型的字段映射为单行文本框组件；
   将日期类型映射为日期选择器组件；
2、如果字段有特色业务需要，则可以将字段配置为对应的组件类型`;
  let columnsContr = ref<string>('Y');
  /**
   * 判断列数是否需要禁用
   * @param val
   */
  const containerTypeOperation = (val: any) => {
    columnsContr.value = val['containerType'] == 'box' ? 'N' : 'Y';
  };
  let currentDataVisible = ref<boolean>(false);
  const contextOperation = async (evt: Event, data: any, index: number) => {
    evt.preventDefault();
    evt.stopPropagation();
    currentData.value = data;
    console.log(data, index);
    await tableField(data.tableName);
    currentDataVisible.value = true;
    selectFieldsOperation(data.fields);
    dataForm.value = { ...data };
    containerTypeOperation(dataForm.value);
  };
  const tableOperClose = () => {
    dataForm.value = {};
    currentDataVisible.value = false;
  };
  const openDb = () => {
    if (!dbIndex.value) {
      return;
    }
    openDatabase(dbIndex.value)?.then((res: any) => {
      tableAndColumnsList.value = res;
      assignDataList.value = tableAndColumnsList.value;
    });
    currentIndex.value = dbIndex.value;
    consumerView.setDbConfigId(currentIndex.value);
  };
  const selectFieldsOperation = (datas: any) => {
    selectFields.value = [];
    datas?.forEach((item: any) => {
      selectFields.value.push({
        name: item.fieldName + '(' + item.comment + ')',
        value: item.fieldName
      });
    });
  };
  const tableField = async (tableName: string) => {
    let fdata = tableAndColumnsList.value.find((item: any) => item.tableName == tableName);
    if (fdata?.fields?.length > 0) {
      //如果已经有值，则不再请求后端
      consumerView.addTableInfo(tableName, fdata.fields);
      return fdata.fields;
    } else {
      fdata['fields'] = [];
    }
    fdata['fields'] = await tableColumns(currentIndex.value, tableName);
    return fdata['fields'];
  };
  const filterData = () => {
    if (!filterTableName.value) {
      assignDataList.value = tableAndColumnsList.value;
      return;
    }
    assignDataList.value = tableAndColumnsList.value.filter((item: any) =>
      item.tableName.toLowerCase().match(filterTableName.value.toLowerCase())
    );
  };
  const init = async () => {
    dbList.value = await initDbList();
  };
  const configDialogVisible = ref<boolean>(false);
  const closeAction = () => {
    configDialogVisible.value = false;
  };
  const viewConfig = () => {
    configDialogVisible.value = true;
  };
  const dratStart = (item: any, evt: DragEvent) => {
    let dt = evt.dataTransfer!;
    dt.effectAllowed = 'copy';
    item['name'] = item.tableName;
    item['label'] = item.comment || '';
    let fields = tableField(item.tableName);
    let items: Array<any> = [];
    for (let i in fields) {
      let temp = fields[i];
      items.push({
        name: temp.fieldName,
        type: temp.type,
        comment: temp.comment,
        primaryFlag: temp.primaryKey
      });
    }
    item['items'] = items;
    console.log(item);
    dt.setData('text/plain', JSON.stringify(item));
  };
  let dbIndex = ref<string>('');
  let dbConfigId = computed(() => consumerView.dbConfigId);
  watch(
    () => dbConfigId.value,
    (val: string) => {
      if (val != dbIndex.value) {
        dbIndex.value = val;
        openDb();
      }
    },
    {
      immediate: true,
      deep: true
    }
  );
  const configMsg = `操作指引：
1、此处配置主要是对字段展示方式,排除字段和组件类型做配置；
1、表字段在添加到舞台前需要做配置，配置好后再拖入舞台，
   否则配置不生效；
3、其他细节配置需要在舞台中进行处理`;
  onMounted(() => {
    init();
  });
</script>
<template>
  <el-row>
    <el-col :span="24">
      <el-select
        :size="compSize"
        @change="openDb"
        clearable
        filterable
        id="dbInfo"
        placeholder="请选择数据库信息"
        v-model="dbIndex"
      >
        <el-option :key="sitem.value" :label="sitem.name" :value="sitem.value" v-for="sitem in dbList"> </el-option>
      </el-select>
    </el-col>
  </el-row>
  <div style="margin-top: 5px"></div>
  <el-input :size="compSize" placeholder="请输入关键字" v-model="filterTableName" @keydown.enter="filterData">
    <template #append>
      <star-horse-icon @click="filterData" icon-class="search" color="var(--star-horse-style)" />
    </template>
  </el-input>
  <el-scrollbar height="90%">
    <ul class="ghost">
      <template v-for="(data, idx) in assignDataList">
        <li
          draggable="true"
          @dragstart="async (evt) => await dratStart(data, evt)"
          :style="{
            border: currentData.tableName == data.tableName ? '2px dashed var(--star-horse-style)' : 'none',
            'align-items': 'center',
            cursor: 'move'
          }"
          @click="(evt) => contextOperation(evt, data, idx)"
        >
          <star-horse-icon icon-class="table" style="height: 18px" />
          <el-tooltip :content="data.comment">
            {{ data.tableName }}
          </el-tooltip>
        </li>
      </template>
    </ul>
  </el-scrollbar>
</template>
<style scoped lang="scss">
  :deep(.el-popover) {
    overflow-x: hidden;
  }

  .popover-header {
    display: flex;
    background: var(--star-horse-style);
    height: 30px;
    justify-content: end;
  }

  ul {
    margin: 5px;
    display: flex;
    flex-direction: column;

    li {
      height: 25px;
      border-radius: 2px;
      cursor: pointer;
      margin: 1px;
      display: flex;

      :deep(.el-tooltip__trigger) {
        display: inline-flex;
        align-items: center;
        margin-top: 0;
        overflow: hidden;
        vertical-align: middle;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: left;
        height: inherit;
        flex: 1;
      }

      .svg-icon {
        width: 18px;
        height: 18px;
      }
    }

    li:nth-child(even) {
      background: #e5e5e5;
    }

    li:nth-child(odd) {
      background: #f1f2f3;
    }
  }

  .field-table {
    border: 1px solid var(--star-horse-style);

    tr > th,
    tr > td {
      border: 1px solid var(--star-horse-style);
      height: 25px;
      font-size: 12px;
      padding-left: 5px;

      :nth-child(2) {
        width: 120px;
      }
    }
  }
</style>
