import type {CheckTemplateGroup} from "./inspectionCommon";

/**
 * DIP IPQC巡查表检查项模板(源自 D-MR-SMT-QA-005-F-016,12组50项)
 */
export const dipCheckGroups: CheckTemplateGroup[] = [
  {
    title: "投板",
    items: [
      {content: "确认物料料号和实物一致,并确认上料记录(根据生产计划执行稽查)", freq: "每班2次", mergeRule: "twoPerShift"},
    ],
  },
  {
    title: "插件",
    items: [
      {content: "上线的物料符合 SOP 或 BOM 表要求", freq: "2H/次", mergeRule: "every2h"},
      {content: "员工按 SOP 作业,物料摆放标识正确合理", freq: "2H/次", mergeRule: "every2h"},
      {content: "是否剪脚,剪脚高度是否符合 SOP", freq: "2H/次", mergeRule: "every2h"},
      {content: "元器件的插件位置方向正确,元件插到位,无漏插现象", freq: "2H/次", mergeRule: "every2h"},
    ],
  },
  {
    title: "波峰焊",
    items: [
      {content: "检查波峰焊有作业指导书,炉温按时测试", freq: "4H/次", mergeRule: "every4h"},
      {content: "波峰焊温区参数、低温区参数、链条速度、浸锡时间、助焊剂喷雾速度和气压与炉温曲线图和 SOP 一致", freq: "每班2次", mergeRule: "twoPerShift"},
      {content: "确认锡渣按时清理", freq: "每班2次", mergeRule: "twoPerShift"},
      {content: "检查焊盘上锡饱满,无批量假焊、虚焊、空焊、冷焊、连锡、少锡现象", freq: "4H/次", mergeRule: "every4h"},
      {content: "检查电源插座和网口物料 Pin 角面无异物,Pin 脚变形现象", freq: "4H/次", mergeRule: "every4h"},
      {content: "PCB 板面 CCD 下确认每 600mm² 内允许 ≤5 个合格尺寸锡珠(单面),反之拒收预警分析", freq: "4H/次", mergeRule: "every4h"},
      {content: "每季度确认测试工程安排从锡池取样送第三方检测,确认报告存档 OK(不晚于每季度结束前15天)", freq: "每季度/次", mergeRule: "onceAll"},
    ],
  },
  {
    title: "目检补焊",
    items: [
      {content: "烙铁使用前经量测(温度及漏电压)确认符合规定并作记录", freq: "每班2次", mergeRule: "twoPerShift"},
      {content: "补焊维修岗位烙铁温度设定正确,每天有做温度点检", freq: "每班2次", mergeRule: "twoPerShift"},
      {content: "补焊无伤及线路板;无连焊、虚焊、漏焊", freq: "2H/次", mergeRule: "every2h"},
      {content: "补焊产品有做清洁,清洁后产品无发白或残留物", freq: "2H/次", mergeRule: "every2h"},
    ],
  },
  {
    title: "开检测试",
    items: [
      {content: "工具、工具版本、软件确认使用正确", freq: "每班2次", mergeRule: "twoPerShift"},
      {content: "电源电压设置符合 SOP 要求", freq: "每班2次", mergeRule: "twoPerShift"},
      {content: "测试人员对测试不良品进行标识和记录,不良品放置在不良品区域内", freq: "2H/次", mergeRule: "every2h"},
      {content: "工程、品质、生产及时对不良品进行确认", freq: "2H/次", mergeRule: "every2h"},
    ],
  },
  {
    title: "PFT测试",
    items: [
      {content: "工具、工具版本、软件确认使用正确", freq: "每班2次", mergeRule: "twoPerShift"},
      {content: "电源电压设置符合 SOP 要求", freq: "每班2次", mergeRule: "twoPerShift"},
      {content: "测试夹具使用正确", freq: "每班2次", mergeRule: "twoPerShift"},
      {content: "测试步骤与 SOP 一致", freq: "每班2次", mergeRule: "twoPerShift"},
      {content: "测试人员对测试不良品有标识和记录,不良品放置在不良品区域内", freq: "2H/次", mergeRule: "every2h"},
    ],
  },
  {
    title: "目检",
    items: [
      {content: "检查焊接面无空焊、假焊、倒角、短路、虚焊、连锡、少锡、多锡、包锡等异常", freq: "4H/次", mergeRule: "every4h"},
      {content: "清洁后的产品无发白或残留物", freq: "4H/次", mergeRule: "every4h"},
      {content: "稽查拿板时用手指托拿板边,禁止手握捏卡槽、屏蔽盖等部件", freq: "4H/次", mergeRule: "every4h"},
      {content: "无集中性批量不良发生(相同不良≥3pcs/H 第一时间反馈管理人员)", freq: "2H/次", mergeRule: "every2h"},
      {content: "确认目检后 PCBA 放入托盘方向保持一致或符合 SOP 要求", freq: "2H/次", mergeRule: "every2h"},
    ],
  },
  {
    title: "包装",
    items: [
      {content: "确认 MES 系统扫描录入,单件流作业", freq: "4H/次", mergeRule: "every4h"},
      {content: "确认现场封箱依照标签工单、出货地划分,进行独立包装作业", freq: "4H/次", mergeRule: "every4h"},
    ],
  },
  {
    title: "线外维修",
    items: [
      {content: "烙铁使用前经量测(温度及漏电压)确认符合规定并作记录", freq: "每班2次", mergeRule: "twoPerShift"},
      {content: "物料盒内物料做区分(良品、不良品)并确认料号正确", freq: "4H/次", mergeRule: "every4h"},
      {content: "维修 OK 及待维修产品做区域划分并做状态区分", freq: "4H/次", mergeRule: "every4h"},
      {content: "针对维修外观不良及功能不良系统必须走返修流程", freq: "4H/次", mergeRule: "every4h"},
    ],
  },
  {
    title: "设备管理",
    items: [
      {content: "测试仪器确认校验并贴校验标签,在校验合格有效期内使用", freq: "开班", mergeRule: "onceAll"},
      {content: "设备地线确认良好接地,维护及点检并记录", freq: "开班", mergeRule: "onceAll"},
      {content: "在线治具确认验收并粘贴验收合格标签;确认各工序测试夹具与夹具共用清单机型或 SOP 机型一致", freq: "开班", mergeRule: "onceAll"},
    ],
  },
  {
    title: "不良品管理",
    items: [
      {content: "不良品有明显标识、区分、并按要求进行准确真实记录", freq: "4H/次", mergeRule: "every4h"},
      {content: "不良品需要在 1H 内处理完", freq: "4H/次", mergeRule: "every4h"},
    ],
  },
  {
    title: "其他",
    items: [
      {content: "各操作岗位作业指导书为最新版本", freq: "开班", mergeRule: "onceAll"},
      {content: "按要求正确佩戴防静电手环 & 静电指套等防护措施", freq: "开班", mergeRule: "onceAll"},
      {content: "关键/特殊岗位员工有上岗证", freq: "开班", mergeRule: "onceAll"},
      {content: "生产场所清洁、整齐、温/湿度点检,无异常", freq: "开班", mergeRule: "onceAll"},
      {content: "各工位报表记录及时、准确、真实填写,按要求审批", freq: "4H/次", mergeRule: "every4h"},
      {content: "生产过程发现 4M 变更按流程提交确认", freq: "4H/次", mergeRule: "every4h"},
      {content: "确认作业员操作手法与 SOP 一致;各工位生产叠板作业和存放情况", freq: "2H/次", mergeRule: "every2h"},
      {content: "生产线辅料(酒精、洗板水、防潮油等)有做标识,标识清楚", freq: "2H/次", mergeRule: "every2h"},
      {content: "已测试与未测试产品作区分并贴标示卡(备注状态:机型、工单、数量、状态、日期)", freq: "4H/次", mergeRule: "every4h"},
    ],
  },
];