import {createServer} from "vite";
import fs from "node:fs";
import path from "node:path";

/**
 * 生成 E:/quantity 下 13 个 Excel 表单的 dynamicform 设计器结构 JSON。
 * 严格按设计器导出格式:{ formInfo, dataList, exportTime, version }
 * dataList 元素结构对齐 FieldOperationUtils.fieldCopy 真实产物:
 *   { id, compType:"container"|"formItem", itemType, fieldName, preps }
 * descriptions/table/checkmatrix 容器均用 preps.elements[];
 * checkmatrix 与 dytable 完全同构(preps.elements 为行列二维结构)。
 */
const OUT_DIR = "E:/quantity";

// SSR 环境 stub(inspectionCommon -> useCheckMatrixState -> i18n -> lang/index.ts 引用 window)
globalThis.window = globalThis.window || {__starHorseHostLang__: undefined};
globalThis.localStorage = globalThis.localStorage || {getItem: () => null, setItem() {}, removeItem() {}, clear() {}};

const vite = await createServer({
  server: {middlewareMode: true},
  appType: "custom",
  logLevel: "error",
});

const load = async (p) => {
  try {
    return await vite.ssrLoadModule(p);
  } catch (e) {
    console.error("LOAD_FAIL", p, e?.message);
    return null;
  }
};

let seed = 100000;
const uid = () => {
  seed += 1;
  return `${seed.toString(16)}-4f21-4d8b-9a30-${(seed * 7).toString(16)}abcdef01`;
};
const fieldNameOf = () => `field_${Math.random().toString(36).slice(2, 8)}`;
const idOf = (u) => `Id${u}`;

const now = new Date().toISOString();

/** 普通字段 -> 设计器 formItem */
const buildField = (field) => {
  const u = uid();
  const label = field.label || "";
  return {
    id: idOf(u),
    compType: "formItem",
    itemType: field.type || "input",
    fieldName: field.fieldName,
    preps: {
      id: idOf(u),
      label,
      name: field.fieldName,
      itemNameLabel: label,
      dataIndex: field.preps?.dataIndex,
      formVisible: true,
      listVisible: true,
      viewVisible: true,
      searchVisible: false,
      required: field.required === true,
      disabled: false,
      clearable: true,
      readonly: false,
      maxLength: 255,
      placeholder: field.preps?.placeholder || (label ? `请输入${label}` : ""),
      dataSource: "",
      values: field.preps?.values || [],
      rules: [],
      helpMsg: "",
      // checkitem 专有属性(时段合并规则/备选项)
      ...(field.type === "checkitem"
        ? {
            mergeRule: field.preps?.mergeRule || "every2h",
            options: Array.isArray(field.preps?.options)
              ? field.preps.options
              : field.preps?.options || "",
            groupLevel: String(field.preps?.groupLevel || 1),
          }
        : {}),
      // html 静态说明块(缺点定义/填写说明)
      ...(field.type === "html"
        ? {
            staticData: field.preps?.staticData === true,
            textContent: field.preps?.textContent || "",
            // 圆角矩形等外观由既有 preps.styles 参数驱动(html-item 渲染)
            styles: field.preps?.styles || "",
          }
        : {}),
      // checkitem 点检格(mergeRule/options 透传,供 checkmatrix-item 渲染)
      ...(field.type === "checkitem"
        ? {
            mergeRule: field.preps?.mergeRule,
            options: field.preps?.options || [],
          }
        : {}),
    },
  };
};

/** checkmatrix 静态文本格 -> dytable 同构列定义 */
const staticCellToJson = (cell) => ({
  id: idOf(uid()),
  cellVisible: cell.preps?.cellVisible !== false,
  colspan: cell.preps?.colspan || 1,
  rowspan: cell.preps?.rowspan || 1,
  staticData: true,
  textContent: cell.textContent || cell.preps?.textContent,
  visiblePlatform: "all",
  visualColIndex: cell.preps?.visualColIndex,
  groupLevel: cell.preps?.groupLevel,
  items: [],
});

/** checkmatrix 字段格(checkitem/input 等) -> dytable 同构列定义 */
const fieldCellToJson = (cell) => {
  // buildFieldCell 产出的是字段本身(与 boxDytableAnalysis 一致), 需包装成 items:[field]
  const field = buildField(cell);
  return {
    id: idOf(uid()),
    cellVisible: cell.preps?.cellVisible !== false,
    colspan: cell.preps?.colspan || 1,
    rowspan: cell.preps?.rowspan || 1,
    staticData: false,
    visualColIndex: cell.preps?.visualColIndex,
    items: [field],
  };
};

/** checkmatrix 单元格 -> dytable 同构列定义(按 staticData 分派) */
const cellToJson = (cell) =>
  cell.staticData ? staticCellToJson(cell) : fieldCellToJson(cell);

/** checkmatrix 二维数组 elements -> dytable 同构 elements[](每行={id,columns[]}) */
const elements2dToJson = (twoDimArray) =>
  twoDimArray.map((row) => ({
    id: idOf(uid()),
    columns: row.map(cellToJson),
  }));

/**
 * checkmatrix 容器 -> 设计器 container(与 dytable 同构)。
 * elements 为已转换的行列结构,每行 {id,columns[]},每列 {staticData,textContent,items,rowspan,colspan,cellVisible}。
 */
const buildCheckMatrixContainer = (title, elements, preps = {}) => {
  const u = uid();
  const fieldName = fieldNameOf();
  return {
    id: idOf(u),
    compType: "container",
    itemType: "checkmatrix",
    fieldName,
    preps: {
      id: idOf(u),
      label: title,
      name: fieldName,
      itemNameLabel: title,
      dataIndex: preps.dataIndex ?? 10,
      matrixTitle: preps.matrixTitle || title,
      columnModel: preps.columnModel || "triState",
      showRemark: preps.showRemark !== false,
      allowKeyboard: preps.allowKeyboard !== false,
      showLineNumber: preps.showLineNumber !== false,
      showStats: preps.showStats === true,
      fillColumnOnHeaderClick: preps.fillColumnOnHeaderClick !== false,
      fillRowOnIndexClick: preps.fillRowOnIndexClick !== false,
      itemColumnWidth: String(preps.itemColumnWidth ?? "320"),
      slotColumnWidth: String(preps.slotColumnWidth ?? "96"),
      hideLabel: true,
      // elements 二维数组(与 dytable 完全同构)
      elements: elements,
    },
  };
};

/** descriptions 容器 -> 设计器 container(elements[].items[]) */
const buildDescriptions = (label, groups, preps = {}) => {
  const u = uid();
  const fieldName = fieldNameOf();
  return {
    id: idOf(u),
    compType: "container",
    itemType: "descriptions",
    fieldName,
    preps: {
      id: idOf(u),
      label,
      name: fieldName,
      itemNameLabel: label,
      descTitle: label,
      dataIndex: preps.dataIndex ?? 1,
      direction: preps.direction || "horizontal",
      column: preps.column || 3,
      border: preps.border !== false,
      size: "default",
      descItemLabelWidth: preps.descItemLabelWidth || "120px",
      descItemAlign: "left",
      descItemLabelAlign: "",
      descItemClassName: "",
      descItemLabelClassName: "",
      descExtra: "",
      elements: groups.map((group) => ({
        label: group.title,
        subTablePrimaryKey: group.title,
        subTableName: group.title,
        subFormFlag: "Y",
        formVisible: "Y",
        items: group.fields.map(buildField),
      })),
    },
  };
};

/** table 容器(子表) -> 设计器 container(preps.elements[{colIndex,columns,items}]) */
const buildTable = (label, columns, extra = {}) => {
  const u = uid();
  const fieldName = fieldNameOf();
  return {
    id: idOf(u),
    compType: "container",
    itemType: "table",
    fieldName,
    preps: {
      id: idOf(u),
      label,
      name: fieldName,
      itemNameLabel: label,
      dataIndex: extra.dataIndex ?? 20,
      subFormFlag: extra.subFormFlag || "Y",
      staticColumn: extra.staticColumn || "N",
      dialogType: "dialog",
      tableBorder: true,
      striped: true,
      showHeader: true,
      columns: 1,
      elements: [
        {
          id: idOf(uid()),
          colIndex: 1,
          columns: 1,
          items: columns.map(buildField),
        },
      ],
    },
  };
};

const writeJson = (fileName, title, dataList) => {
  const payload = {
    formInfo: {formName: title, currentPageType: "pc"},
    dataList,
    exportTime: now,
    version: "1.0",
  };
  fs.mkdirSync(OUT_DIR, {recursive: true});
  fs.writeFileSync(
    path.join(OUT_DIR, fileName),
    JSON.stringify(payload, null, 2),
    "utf-8",
  );
  console.log(`  ✓ ${fileName} (${dataList.length} 顶层组件)`);
};

console.log("=== 生成设计器结构 JSON 到", OUT_DIR);

// ---------- 1. IPQC 巡查表(3张): descriptions 公共 + checkmatrix 点检 + table 问题明细 ----------
const inspectionForms = await load("/src/sample/quality/data/inspectionForms.ts");

const inspectionSpecs = [
  ["DIP-IPQC巡查表.json", "DIP IPQC巡查表", inspectionForms.dipIpqcForm],
  ["SMT-IPQC巡查表.json", "SMT IPQC巡查表", inspectionForms.smtIpqcForm],
  ["TEST-IPQC巡查表.json", "TEST IPQC巡查表", inspectionForms.testIpqcForm],
];

for (const [fileName, title, form] of inspectionSpecs) {
  const headerField = form.fieldList.fieldList.find(
    (f) => f.containerType === "descriptions",
  );
  const matrixField = form.fieldList.fieldList.find(
    (f) => f.containerType === "checkmatrix",
  );
  const issueField = form.fieldList.fieldList.find(
    (f) => f.containerType === "table",
  );
  // containerFields[0].fieldList 已是二维数组 elements(与 dytable 同构)
  const elements2d = matrixField.containerFields[0].fieldList;
  const dataList = [
    buildDescriptions(
      "基础信息",
      [{title: "基础信息", fields: headerField.containerFields[0].fieldList}],
      {
        column: 3,
        descItemLabelWidth: "90px",
        dataIndex: headerField.preps?.dataIndex,
        direction: headerField.preps?.direction,
      },
    ),
    buildCheckMatrixContainer(
      "稽核结果",
      elements2dToJson(elements2d),
      {
        dataIndex: matrixField.preps?.dataIndex,
        matrixTitle: matrixField.preps?.matrixTitle || `${title} · 稽核结果`,
        columnModel: matrixField.preps?.columnModel || "triState",
        showRemark: matrixField.preps?.showRemark !== false,
        allowKeyboard: matrixField.preps?.allowKeyboard !== false,
        showLineNumber: matrixField.preps?.showLineNumber !== false,
        showStats: matrixField.preps?.showStats === true,
        fillColumnOnHeaderClick: matrixField.preps?.fillColumnOnHeaderClick !== false,
        fillRowOnIndexClick: matrixField.preps?.fillRowOnIndexClick !== false,
        itemColumnWidth: String(matrixField.preps?.itemColumnWidth || 320),
        slotColumnWidth: String(matrixField.preps?.slotColumnWidth || 96),
      },
    ),
    buildTable("问题点 & 改善记录", issueField.containerFields[0].fieldList, {
      dataIndex: issueField.preps?.dataIndex,
    }),
    buildField(
      form.fieldList.fieldList.find((f) => f.type === "html") || {
        label: "缺点定义",
        fieldName: "field_note",
        type: "html",
        preps: {staticData: true, textContent: "", dataIndex: 30},
      },
    ),
  ];
  writeJson(fileName, title, dataList);
}

// ---------- 2. 首件确认表(3张): descriptions 公共 + checkmatrix(rowEdit 行式点检) ----------
const firstForms = await load("/src/sample/quality/data/firstArticleForms.ts");
const firstSpecs = [
  ["SMT首件确认表.json", "SMT首件确认表", firstForms.smtFirstForm],
  ["DIP首件确认表.json", "DIP首件确认表", firstForms.dipFirstForm],
  ["TEST点胶首件确认表.json", "TEST点胶首件确认表", firstForms.testGlueFirstForm],
];

for (const [fileName, title, form] of firstSpecs) {
  const headerField = form.fieldList.fieldList.find(
    (f) => f.containerType === "descriptions",
  );
  const matrixField = form.fieldList.fieldList.find(
    (f) => f.containerType === "checkmatrix",
  );
  const elements2d = matrixField.containerFields[0].fieldList;
  const dataList = [
    buildDescriptions(
      "首件信息",
      [{title: "公共信息", fields: headerField.containerFields[0].fieldList}],
      {
        column: 3,
        descItemLabelWidth: "100px",
        dataIndex: headerField.preps?.dataIndex,
        direction: headerField.preps?.direction,
      },
    ),
    buildCheckMatrixContainer(
      "首件确认项目",
      elements2dToJson(elements2d),
      {
        dataIndex: matrixField.preps?.dataIndex,
        matrixTitle: matrixField.preps?.matrixTitle || `${title} · 确认项目`,
        columnModel: matrixField.preps?.columnModel || "rowEdit",
        showRemark: matrixField.preps?.showRemark !== false,
      },
    ),
    buildField(
      form.fieldList.fieldList.find((f) => f.type === "html") || {
        label: "确认说明",
        fieldName: "field_note",
        type: "html",
        preps: {staticData: true, textContent: "", dataIndex: 30},
      },
    ),
  ];
  writeJson(fileName, title, dataList);
}

// ---------- 3. 单据审批(3张): descriptions 公共主表 + table 明细子表 ----------
const docForms = await load("/src/sample/quality/data/documentForms.ts");
const docSpecs = [
  ["异常反馈单.json", "异常反馈单", docForms.abnormalFeedbackForm],
  ["停线整改通知单.json", "停线整改通知单", docForms.stoplineNoticeForm],
  ["返工通知书.json", "返工通知书", docForms.reworkNoticeForm],
];

for (const [fileName, title, form] of docSpecs) {
  const headerField = form.fieldList.fieldList.find(
    (f) => f.containerType === "descriptions",
  );
  const detailField = form.fieldList.fieldList.find(
    (f) => f.containerType === "table",
  );
  const dataList = [
    buildDescriptions(
      "公共信息",
      [{title: "公共信息", fields: headerField.containerFields[0].fieldList}],
      {
        column: 3,
        descItemLabelWidth: "110px",
        dataIndex: headerField.preps?.dataIndex,
        direction: headerField.preps?.direction,
      },
    ),
  ];
  // 有子表时追加 table 容器
  if (detailField) {
    dataList.push(
      buildTable(
        detailField.containerFields[0].title,
        detailField.containerFields[0].fieldList,
        {dataIndex: detailField.preps?.dataIndex},
      ),
    );
  }
  writeJson(fileName, title, dataList);
}

// ---------- 4. 台账统计(4张): descriptions 公共主表 + table 记录子表 ----------
const ledgerMod = await load("/src/sample/quality/data/ledgerData.ts");
const ledgerSpecs = [
  ["IPQC稽核问题一览表.json", ledgerMod.ledgerForms[0]],
  ["过程首件确认一览表.json", ledgerMod.ledgerForms[1]],
  ["点胶抽查记录表.json", ledgerMod.ledgerForms[2]],
  ["检出率考核状况表.json", ledgerMod.ledgerForms[3]],
];

for (const [fileName, form] of ledgerSpecs) {
  const headerField = form.fieldList.fieldList.find(
    (f) => f.containerType === "descriptions",
  );
  const rowField = form.fieldList.fieldList.find(
    (f) => f.containerType === "table",
  );
  const dataList = [
    buildDescriptions(
      "公共信息",
      [{title: "公共信息", fields: headerField.containerFields[0].fieldList}],
      {
        column: 2,
        descItemLabelWidth: "100px",
        dataIndex: headerField.preps?.dataIndex,
        direction: headerField.preps?.direction,
      },
    ),
    buildTable(rowField.containerFields[0].title, rowField.containerFields[0].fieldList, {
      dataIndex: rowField.preps?.dataIndex,
    }),
  ];
  writeJson(fileName, form.title, dataList);
}

console.log("=== 完成");
await vite.close();