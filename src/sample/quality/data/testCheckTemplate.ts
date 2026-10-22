import type { CheckTemplateGroup } from "./inspectionCommon";

/**
 * TEST IPQC巡查表 检查项模板(数据源自质量系统建模 JSON 提取)
 */
export const testCheckGroups: CheckTemplateGroup[] = [
  {
    title: "下载",
    items: [
      { content: "下载软件版本工具确认正确。", freq: "每班2次", mergeRule: "twoPerShift" },
    ],
  },
  {
    title: "写号",
    items: [
      { content: "写号工具脚本确认使用正确。", freq: "每班2次", mergeRule: "twoPerShift" },
      { content: "开检计划软件版本维护与生产任务书一致。", freq: "每班2次", mergeRule: "twoPerShift" },
    ],
  },
  {
    title: "校准",
    items: [
      { content: "校准配置文件确认使用正确。", freq: "每班2次", mergeRule: "twoPerShift" },
      { content: "校准工具版本及参数确认符合生产要求。", freq: "每班2次", mergeRule: "twoPerShift" },
      { content: "校准工具脚本确认使用正确。", freq: "每班2次", mergeRule: "twoPerShift" },
      { content: "工程是否每班开班使用金板进行线损点检并记录（保存测试L0GO）。", freq: "开班", mergeRule: "onceAll" },
      { content: "功率点检：确认工程功率点检是否有进行。", freq: "每班1次", mergeRule: "onceAll" },
      { content: "校准(CFT)工序直通率是否达标，填写实际直通率。", freq: "4H/次", mergeRule: "every4h" },
    ],
  },
  {
    title: "综测",
    items: [
      { content: "综测工具版本、脚本确认使用正确。", freq: "每班2次", mergeRule: "twoPerShift" },
    ],
  },
  {
    title: "传导",
    items: [
      { content: "传导工具版本、配置文件确认使用正确。", freq: "每班2次", mergeRule: "twoPerShift" },
    ],
  },
  {
    title: "功能位",
    items: [
      { content: "ATA工具版本及脚本确认使用正确。", freq: "每班2次", mergeRule: "twoPerShift" },
      { content: "功能（CIT)工序直通率是否达标，填写实际直通率。", freq: "4H/次", mergeRule: "every4h" },
      { content: "针对BTB连接器，工程检查FPC是否有变形、异物等不良；生产抽检主板BTB连接器是否变形，下陷等不良（涉及检查每台测试夹具）并做好记录。", freq: "每班2次", mergeRule: "twoPerShift" },
    ],
  },
  {
    title: "暗电流",
    items: [
      { content: "暗电流工具版本、脚本确认使用正确。", freq: "每班2次", mergeRule: "twoPerShift" },
    ],
  },
  {
    title: "点胶 工位",
    items: [
      { content: "胶水型号是否符合SOP要求并在有效期内进行使用。", freq: "4H/次", mergeRule: "every4h" },
      { content: "是否有对点胶效果进行质量管控(称重频率、外观检查)。", freq: "4H/次", mergeRule: "every4h" },
      { content: "点（防爆）胶、USB包裹胶、底部填充胶等胶水是否胶水填充OK,有无污染、溢胶等现象。", freq: "4H/次", mergeRule: "every4h" },
      { content: "转线确认底部填充胶轨道调速器是否固定；（如回流炉坏需烤箱烘烤时随机抽查静置时间8分钟以上）。", freq: "转线", mergeRule: "onceAll" },
    ],
  },
  {
    title: "扣屏蔽盖",
    items: [
      { content: "确认屏蔽盖料号使用正确，并确认上料记录（根据生产计划执行稽查）。", freq: "2H/次", mergeRule: "every2h" },
      { content: "屏蔽盖扣合位置和SOP位置一致。", freq: "2H/次", mergeRule: "every2h" },
      { content: "不允许有未扣合到位，变形，漏盖现象", freq: "2H/次", mergeRule: "every2h" },
    ],
  },
  {
    title: "目检",
    items: [
      { content: "确认BQC扫箱无提前扫箱状况（扫箱必须出箱标且除入库尾数时，无其他尾数）。", freq: "4H/次", mergeRule: "every4h" },
      { content: "生产相似的型号注意区分,注意混板现象发生。", freq: "4H/次", mergeRule: "every4h" },
    ],
  },
  {
    title: "包装",
    items: [
      { content: "包装前设定二次检验，检验漏焊接、漏点胶，漏屏蔽盖及弹片是否变形掉件等不良。", freq: "4H/次", mergeRule: "every4h" },
      { content: "确认现场封箱依照品牌标签使用的区域划分进行独立包装作业。", freq: "4H/次", mergeRule: "every4h" },
    ],
  },
  {
    title: "维修房",
    items: [
      { content: "烙铁使用前是否有经量测（温度及漏电压）其结果确认符合规定并作记录。", freq: "每班2次", mergeRule: "twoPerShift" },
      { content: "物料盒内的物料确认做区分（良品、不良品）并确认料号正确。", freq: "4H/次", mergeRule: "every4h" },
      { content: "维修OK的产品及待维修产品确认有做区域划分并做状态区分。", freq: "4H/次", mergeRule: "every4h" },
      { content: "维修板的维修动作、记录确认可以追溯。（随机抽查几个机型确认MES记录）。", freq: "4H/次", mergeRule: "every4h" },
      { content: "所有维修品必须走返修流程及录入系统，外观类不良标签最终由QC撕掉。", freq: "4H/次", mergeRule: "every4h" },
    ],
  },
  {
    title: "设备 管理",
    items: [
      { content: "测试仪器确认进行校验并贴有校验标签，确认在校验合格有效期内使用；", freq: "开班", mergeRule: "onceAll" },
      { content: "设备地线确认良好接地，维护及点检并记录；", freq: "开班", mergeRule: "onceAll" },
      { content: "在线治具确认进行验收并粘贴验收合格标签；确认各工序测试夹具与夹具共用清单机型或者SOP机型一致；", freq: "开班", mergeRule: "onceAll" },
      { content: "耦合类不良单独测耦合并打测试代码/副板全测音频测试并打代码。", freq: "4H/次", mergeRule: "every4h" },
      { content: "主板音频类（喇叭、听筒、MIC不良）耦合类不良品手动开机测试，并进行耦合、音频测试。", freq: "4H/次", mergeRule: "every4h" },
    ],
  },
  {
    title: "不良品 管理",
    items: [
      { content: "不良品有无明显标识、区分、并按要求进行准确真实记录。", freq: "4H/次", mergeRule: "every4h" },
      { content: "不良品维修后有无按返修流程进行重投全功能测试。", freq: "4H/次", mergeRule: "every4h" },
      { content: "主、副板不良品返修OK后单独区分并功能全测。", freq: "4H/次", mergeRule: "every4h" },
    ],
  },
  {
    title: "其他",
    items: [
      { content: "各操作岗位作业指导书为最新版本。", freq: "开班", mergeRule: "onceAll" },
      { content: "按要求正确佩戴好防静电手环&静电指套等防护措施。", freq: "开班", mergeRule: "onceAll" },
      { content: "关键/特殊岗位员工有上岗证。", freq: "开班", mergeRule: "onceAll" },
      { content: "生产场所清洁、整齐、温/湿度点检，无异常。", freq: "开班", mergeRule: "onceAll" },
      { content: "各工位报表记录及时、准确、真实填写，按要求审批。", freq: "4H/次", mergeRule: "every4h" },
      { content: "生产过程发现4M变更按流程提交确认。", freq: "4H/次", mergeRule: "every4h" },
      { content: "确认作业员操作手法与SOP一致。", freq: "4H/次", mergeRule: "every4h" },
      { content: "待机电流是否在要求SOP范围内。", freq: "开班", mergeRule: "onceAll" },
      { content: "已测试与未测试的产品作区分并贴有标示卡（备注清楚状态：机型、工单、数量、状态、日期）。", freq: "4H/次", mergeRule: "every4h" },
    ],
  },
];
