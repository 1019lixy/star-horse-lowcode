import type { CheckTemplateGroup } from "./inspectionCommon";

/**
 * SMT IPQC巡查表 检查项模板(数据源自质量系统建模 JSON 提取)
 */
export const smtCheckGroups: CheckTemplateGroup[] = [
  {
    title: "KTR仓",
    items: [
      { content: "锡膏/胶水的存储与使用方法是否符合锡膏、胶水管控要求，并做好先进先出管制；", freq: "4H/次", mergeRule: "every4h" },
      { content: "镭雕、喷码后的PCB是否进行真空或放入防潮柜中并做好先进先出管制；", freq: "2H/次", mergeRule: "every2h" },
      { content: "每班开班前制作开班PCB镭雕、喷码首件确认并做记录；", freq: "每班/次", mergeRule: "onceAll" },
      { content: "巡查抽检镭雕、喷码PCB是否符合要求(镭雕工位只允许1个料号PCB)；", freq: "2H/次", mergeRule: "every2h" },
    ],
  },
  {
    title: "印刷",
    items: [
      { content: "PCB型号、版本、配置以及钢网、刮刀、治具是否与作业指导书相符；", freq: "4H/次", mergeRule: "every4h" },
      { content: "印刷、SIP参数设置与作业指导书是否相符；", freq: "4H/次", mergeRule: "every4h" },
      { content: "锡膏型号确认及锡膏使用状况确认，锡膏内盖是否盖紧；二次锡膏是否在有效期限内使用，锡膏是否过干,印刷质量效果；", freq: "4H/次", mergeRule: "every4h" },
      { content: "锡膏定期添加并做记录；", freq: "4H/次", mergeRule: "every4h" },
      { content: "钢网定期清洗并做记录；", freq: "4H/次", mergeRule: "every4h" },
      { content: "印刷程序名称与作业指导书相符；", freq: "4H/次", mergeRule: "every4h" },
      { content: "印刷直通率是否达标98.5%（记录实际轨道直通率数值）；", freq: "2H/次", mergeRule: "every2h" },
    ],
  },
  {
    title: "贴片",
    items: [
      { content: "程式名称确认与作业指导书相符；", freq: "4H/次", mergeRule: "every4h" },
      { content: "散料上料是否依站位表上料并作记录；阻容元器件是否旧物料取样1PCS，新料取样2PCS；", freq: "2H/次", mergeRule: "every2h" },
      { content: "确认生产全核站位物料；", freq: "1次/每班", mergeRule: "onceAll" },
      { content: "每班散料是否有上午、下午进行处理并通知IPQC确认并做记录；", freq: "4H/次", mergeRule: "every4h" },
      { content: "抽查在线物料标识是否完整正确及在有效期限内；", freq: "4H/次", mergeRule: "every4h" },
      { content: "湿敏元器件开封后是否填写并粘贴《真空包装管制使用标签》及在有效期；", freq: "4H/次", mergeRule: "every4h" },
    ],
  },
  {
    title: "炉前AOI",
    items: [
      { content: "元件无错贴，立碑，连锡，偏移，变形等现象；", freq: "2H/次", mergeRule: "every2h" },
    ],
  },
  {
    title: "回流焊",
    items: [
      { content: "核查工程是否按时取炉前锡膏板进行X-Ray检测并做记录；", freq: "4H/次", mergeRule: "every4h" },
      { content: "炉温设定是否正确,并每天工艺技术人员进行测试炉温；", freq: "4H/次", mergeRule: "every4h" },
      { content: "炉温曲线是否符合标准要求并签字确认；", freq: "4H/次", mergeRule: "every4h" },
    ],
  },
  {
    title: "炉后",
    items: [
      { content: "元件无错贴，立碑，连锡，偏移，变形等现象；", freq: "2H/次", mergeRule: "every2h" },
      { content: "打印标签的排版/字体等格式，内容与文件要求相符；", freq: "2H/次", mergeRule: "every2h" },
      { content: "X-Ray检测是否每2H进行检查并做记录；", freq: "2H/次", mergeRule: "every2h" },
    ],
  },
  {
    title: "分板",
    items: [
      { content: "每班开班前是否制作开线首件并做记录；", freq: "每班/次", mergeRule: "onceAll" },
      { content: "更换铣刀时是否做记录并通知品质人员确认；", freq: "4H/次", mergeRule: "every4h" },
      { content: "对分板后的主板进行抽检2拼版，分板毛边±0.1mm范围内；", freq: "2H/次", mergeRule: "every2h" },
      { content: "每台设备是否悬挂有分板样品；", freq: "4H/次", mergeRule: "every4h" },
    ],
  },
  {
    title: "不良品 管理",
    items: [
      { content: "不良品有无明显标识、区分、有无按要求进行准确真实记录；", freq: "2H/次", mergeRule: "every2h" },
      { content: "炉后不良品及时送修，不良品返修后有无外观全检并通知IPQC确认；", freq: "2H/次", mergeRule: "every2h" },
      { content: "清洗后的板子是否有记录SN并通知IPQC确认；", freq: "2H/次", mergeRule: "every2h" },
      { content: "有MIC的产品水洗更换MIC并区分投入生产；维修MIC后需备注清晰并区分转入下工序；", freq: "2H/次", mergeRule: "every2h" },
      { content: "印刷不良品是否在1H内进行处理并投入生产；", freq: "2H/次", mergeRule: "every2h" },
    ],
  },
  {
    title: "其他",
    items: [
      { content: "各操作岗位作业指导书是否为最新版本，作业指导书内容是否全面符合要求；", freq: "4H/次", mergeRule: "every4h" },
      { content: "是否按要求正确佩戴好防静电手环与静电指套等产品防护措施；", freq: "4H/次", mergeRule: "every4h" },
      { content: "关键/特殊岗位员工是否有上岗证，作业员对作业标准是否完全掌握；", freq: "每班/次", mergeRule: "onceAll" },
      { content: "生产场所是否清洁，整齐，温/湿度是否点检，有无异常；", freq: "4H/次", mergeRule: "every4h" },
      { content: "各记录是否及时，准确，真实填写，有无按要求审核；", freq: "2H/次", mergeRule: "every2h" },
      { content: "生产过程发现4M变更是否按流程提交确认；", freq: "4H/次", mergeRule: "every4h" },
      { content: "现场物料状态标识区分是否到位，一条线无多种产品同时放置现场；", freq: "4H/次", mergeRule: "every4h" },
    ],
  },
];
