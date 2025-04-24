<script setup lang="ts">
  import { onMounted, reactive, ref, unref } from 'vue';
  import { SearchParams } from '@/components/types/Params';
  import { closeLoad, createCondition, dialogPreps, isJson, loadData } from '@/api/star_horse_utils.ts';
  import { createDatetime } from '../../../api/date_utils.ts';
  import { OrderByInfo, PageFieldInfo } from '@/components/types/PageFieldInfo';
  import websocket from '@/api/websocket.ts';
  import { getUserInfo } from '@/utils/auth.ts';
  import { message } from '@/utils/message.ts';
  import { postRequest } from '@/api/star_horse_apis.ts';

  defineProps({
    compSize: { type: String, default: 'small' }
  });
  let currentTab = ref<string>('notice');
  let messageList = ref<Array<any>>([]);
  let auditList = ref<Array<any>>([]);
  let totals = ref<number>(0);
  let totalMessages = ref<number>(0);
  let totalAudit = ref<number>(0);
  const url = '/system-config/system/messageRecord/getAllByCondition';
  const pageUrl = '/system-config/system/messageRecord/pageList';
  const init = async () => {
    let params = createParams('notice');
    let resultData = await loadData(url, params.fieldList, params.orderBy);
    let msgTemp: Array<any> = resultData.data;
    params = createParams('pending');
    resultData = await loadData(url, params.fieldList, params.orderBy);
    let auditTemp: Array<any> = resultData.data;
    reCount(msgTemp, auditTemp);
    webSocketOperation();
    loadByPage();
  };
  const reCount = (msgList: Array<any>, auditList: Array<any>) => {
    totalMessages.value = msgList?.filter((item) => item.statusCode == '1')?.length || 0;
    totalAudit.value = auditList?.filter((item) => item.statusCode == '1')?.length || 0;
    totals.value = totalMessages.value + totalAudit.value;
  };
  const webSocketOperation = () => {
    console.log('当前环境:', import.meta.env.MODE);
    websocket.init(import.meta.env.VITE_WEBSOCKET_URL, getUserInfo().idUsersinfo);
    websocket.setMessageCallback((data: any) => {
      let reData = JSON.parse(data);
      if (!isJson(reData.data)) {
        return;
      }
      reData = JSON.parse(reData.data);
      if (reData.type == 'notice') {
        let temp = messageList.value.find((item) => item.idMessageRecord == reData.idMessageRecord);
        if (temp?.idMessageRecord) {
          return;
        }
        // messageList.value.splice(0, 0, reData);
      } else {
        let temp = auditList.value.find((item) => item.idMessageRecord == reData.idMessageRecord);
        if (temp?.idMessageRecord) {
          return;
        }
        // auditList.value.splice(0, 0, reData);
      }
      message('你有新消息:' + reData.title, 'info', 2500, '新消息提醒', 'top-right');
      init();
    });
  };
  const dialogProps = dialogPreps();
  let outerData = ref<any>({});
  let noticePageInfo = ref<any>({
    currentPage: 1,
    pageSize: 20,
    totalData: 0,
    totalPage: 0
  });
  let auditPageInfo = ref<any>({
    currentPage: 1,
    pageSize: 20,
    totalData: 0,
    totalPage: 0
  });
  const formField = reactive<PageFieldInfo>({
    fieldList: [
      {
        label: '标题',
        fieldName: 'title',
        type: 'input',
        required: true,
        formVisible: !false,
        listVisible: !false
      },
      {
        label: '内容',
        fieldName: 'content',
        type: 'markdown',
        required: true,
        formVisible: !false,
        listVisible: !false
      }
    ]
  });
  const readMessage = (item: any) => {
    outerData.value = item;
    dialogProps.viewVisible = true;
  };
  const close = () => {
    dialogProps.viewVisible = false;
    updateMessage();
  };
  const updateMessage = async () => {
    let temp = unref(outerData);
    if (temp.type == 'notice') {
      temp.statusName = '已读';
    } else {
      temp.statusName = '已处理';
    }
    temp.statusCode = '2';
    await loadData('/system-config/system/messageResult/merge', temp);
    await init();
  };
  const pageChangeClick = async (page: number) => {
    if (currentTab.value == 'notice') {
      noticePageInfo.value.currentPage = page;
    } else {
      auditPageInfo.value.currentPage = page;
    }
    loadByPage();
  };
  const pageSizeClick = async (size: number) => {
    if (currentTab.value == 'notice') {
      noticePageInfo.value.pageSize = size;
    } else {
      auditPageInfo.value.pageSize = size;
    }
    loadByPage();
  };
  const tabChange = (tab: string) => {
    currentTab.value = tab;
    loadByPage();
  };
  const createParams = (type: string) => {
    let fieldList: SearchParams[] = [];
    fieldList.push(createCondition('type', type || currentTab.value));
    let param: SearchParams = createCondition('commonFlag', 'Y');
    param.orOperList = [createCondition('receivePersons', getUserInfo().username)];
    fieldList.push(param);
    let orderBy: OrderByInfo[] = [
      { fieldName: 'statusCode', ascOrDesc: 'asc' },
      { fieldName: 'createdTime', ascOrDesc: 'desc' }
    ];
    return { fieldList, orderBy };
  };
  const loadByPage = () => {
    let params = createParams('');
    postRequest(pageUrl, {
      fieldList: params.fieldList,
      orderBy: params.orderBy,
      currentPage: currentTab.value == 'notice' ? noticePageInfo.value.currentPage : auditPageInfo.value.currentPage,
      pageSize: (currentTab.value == 'notice' ? noticePageInfo.value.pageSize : auditPageInfo.value.pageSize) || 20
    })
      .then((res: any) => {
        if (res.data?.code != 0) {
          console.error(res.data.cnMessage);
          return;
        }
        let redata = res?.data.data;
        if (currentTab.value == 'notice') {
          noticePageInfo.value.totalData = redata.totalDatas;
          noticePageInfo.value.totalPage = redata.totalPages;
          noticePageInfo.value.currentPage = redata.currentPage;
          noticePageInfo.value.pageSize = redata.pageSize;
          messageList.value = redata.dataList;
        } else {
          auditPageInfo.value.totalData = redata.totalDatas;
          auditPageInfo.value.totalPage = redata.totalPages;
          auditPageInfo.value.currentPage = redata.currentPage;
          auditPageInfo.value.pageSize = redata.pageSize;
          auditList.value = redata.dataList;
        }
      })
      .catch((err: any) => {
        console.log(err);
      })
      .finally(() => {
        closeLoad();
      });
  };
  const auditMessage = (item: any) => {
    message('功能开发中...', 'info', 2500, '提示', 'bottom-right');
  };
  onMounted(() => {
    init();
  });
</script>

<template>
  <star-horse-dialog
    :dialog-visible="dialogProps.viewVisible"
    :dialogProps="dialogProps"
    :title="'查看数据'"
    :isView="true"
    :selfFunc="true"
    @closeAction="close"
  >
    <star-horse-data-view :outerData="outerData" :field-list="formField" />
  </star-horse-dialog>
  <el-popover
    :popper-style="{ width: 'unset !important' }"
    placement="bottom-end"
    :width="600"
    trigger="hover"
    :show-arrow="false"
  >
    <template #reference>
      <el-badge :value="totals">
        <star-horse-icon icon-class="messages" color="var(--star-horse-white)" />
      </el-badge>
    </template>
    <el-tabs v-model="currentTab" @tab-change="tabChange">
      <el-tab-pane label="消息" name="notice">
        <template #label>
          <el-badge :value="totalMessages"> 消息 </el-badge>
        </template>
        <div class="message-body">
          <el-scrollbar>
            <ul class="message-list">
              <li
                class="message-item"
                v-for="(item, index) in messageList"
                :key="index"
                @click="readMessage(item)"
                :class="{
                  unread: item.statusCode == '1'
                }"
              >
                <div class="message-title">
                  <span class="message-title-name">{{ item.title }}</span>
                  <span class="message-title-time">{{ createDatetime(item.createdTime) }}</span>
                </div>
              </li>
            </ul>
          </el-scrollbar>
        </div>
        <div class="message-footer">
          <el-pagination
            :total="noticePageInfo.totalData"
            @current-change="pageChangeClick"
            @size-change="pageSizeClick"
            :size="compSize"
            v-model:currentPage="noticePageInfo.currentPage"
            v-model:page-size="noticePageInfo.pageSize"
            v-model:pageCount="noticePageInfo.totalPage"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="待办" name="pending">
        <template #label>
          <el-badge :value="totalAudit"> 待办 </el-badge>
        </template>
        <div class="message-body">
          <el-scrollbar>
            <ul class="message-list">
              <li
                class="message-item"
                v-for="(item, index) in auditList"
                :key="index"
                @click="auditMessage(item)"
                :class="{
                  unread: item.statusCode == '1'
                }"
              >
                <div class="message-title">
                  <span class="message-title-name">{{ item.title }}</span>
                  <span class="message-title-time">{{ createDatetime(item.createdTime) }}</span>
                </div>
              </li>
            </ul>
          </el-scrollbar>
        </div>
        <div class="message-footer">
          <el-pagination
            :total="auditPageInfo.totalData"
            @current-change="pageChangeClick"
            @size-change="pageSizeClick"
            :size="compSize"
            v-model:currentPage="auditPageInfo.currentPage"
            v-model:page-size="auditPageInfo.pageSize"
            v-model:pageCount="auditPageInfo.totalPage"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-popover>
</template>

<style scoped lang="scss">
  .message-body {
    height: 400px;
    overflow: hidden;

    .message-list {
      margin: 0;
      min-width: 450px;

      .unread {
        color: #5cb87a;

        &:hover {
          cursor: pointer;
        }
      }

      .message-item {
        line-height: 30px;

        .message-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 10px;
          border-bottom: 1px solid #eee;
        }
      }
    }
  }

  .message-footer {
    height: 30px;
    margin-top: 10px;
    display: flex;
    align-items: center;
  }
</style>
