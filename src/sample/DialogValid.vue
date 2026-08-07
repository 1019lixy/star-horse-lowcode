<script setup lang="ts">
import {ref} from "vue";
import {StarHorseDialog, StarHorseForm} from "@/components/comp";
import {PageFieldInfo} from "@/components/types/PageFieldInfo";

defineOptions({name: "DialogValid"});

const visible = ref(false);

const fieldList = ref<PageFieldInfo>({
  fieldList: [
    {
      label: "数字",
      fieldName: "testnum",
      type: "number",
      preps: {
        "formula": {
          "enable": true,
          "type": "condition",
          "sourceFields": ["fieldSh3C9D"],
          "expression": "",
          "branches": [{"when": "${fieldSh3C9D}==\"windows\"", "then": "3389"}, {
            "when": "${fieldSh3C9D}==\"linux\"",
            "then": "22"
          }],
          "defaultValue": "23"
        }
      }
    },
    {
      label: "选择数据",
      fieldName: "fieldSh3C9D",
      type: "select",
      preps: {
        "values": [{"name": "Windows", "value": "windows", "xh": 1}, {
          "name": "Linux",
          "value": "linux",
          "xh": 2,
          "starHorseEditing": "no"
        }]
      }
    },
    {
      label: "选择树数据",
      fieldName: "fieldSh4C9D",
      type: "tselect",
      preps: {
        "values": [{
          "name": "Windows",
          "value": "windows",
          children: [{name: "window7", value: "window7"}, {name: "window8", value: "window8"}, {
            name: "window10",
            value: "window10"
          }]
        }, {
          "name": "Linux",
          "value": "linux",
          children: [{name: "centos", value: "centos"}, {name: "fedora", value: "fedora"}, {
            name: "ubuntu",
            value: "ubuntu"
          }]
        }]
      }
    },
    {
      label: "穿梭框",
      fieldName: "fieldSh4C0D",
      type: "transfer",
      preps: {
        "data": [{
          "name": "Windows",
          "value": "windows",
          children: [{name: "window7", value: "window7"}, {name: "window8", value: "window8"}, {
            name: "window10",
            value: "window10"
          }]
        }, {
          "name": "Linux",
          "value": "linux",
          children: [{name: "centos", value: "centos"}, {name: "fedora", value: "fedora"}, {
            name: "ubuntu",
            value: "ubuntu"
          }]
        }]
      }
    },
    {
      label: "选择树数据",
      fieldName: "fieldSh5C9D",
      type: "datapicker",
      preps: {
        "data": [{
          "name": "Windows",
          "value": "windows",
          children: [{name: "window7", value: "window7"}, {name: "window8", value: "window8"}, {
            name: "window10",
            value: "window10"
          }]
        }, {
          "name": "Linux",
          "value": "linux",
          children: [{name: "centos", value: "centos"}, {name: "fedora", value: "fedora"}, {
            name: "ubuntu",
            value: "ubuntu"
          }]
        }]
      }
    },
    {label: "计算A", fieldName: "calcA", type: "number", preps: {defaultValue: 10}},
    {label: "计算B", fieldName: "calcB", type: "number", preps: {defaultValue: 5}},
    {
      label: "计算结果(calc)",
      fieldName: "calcResult",
      type: "number",
      preps: {
        formula: {
          enable: true,
          type: "calc",
          sourceFields: ["calcA", "calcB"],
          expression: "${calcA}-20+${calcB}*5/8",
          precision: 2
        }
      }
    },
    {label: "角度", fieldName: "trigAngle", type: "number", preps: {defaultValue: 30}},
    {
      label: "正弦sin(calc)",
      fieldName: "trigSin",
      type: "number",
      preps: {
        formula: {
          enable: true,
          type: "calc",
          sourceFields: ["trigAngle"],
          expression: "Math.sin(${trigAngle}*Math.PI/180)",
          precision: 4
        }
      }
    },
    {
      label: "余弦cos(calc)",
      fieldName: "trigCos",
      type: "number",
      preps: {
        formula: {
          enable: true,
          type: "calc",
          sourceFields: ["trigAngle"],
          expression: "Math.cos(${trigAngle}*Math.PI/180)",
          precision: 4
        }
      }
    },
    {label: "被除数", fieldName: "modA", type: "number", preps: {defaultValue: 17}},
    {label: "除数", fieldName: "modB", type: "number", preps: {defaultValue: 5}},
    {
      label: "求余%(calc)",
      fieldName: "modResult",
      type: "number",
      preps: {
        formula: {
          enable: true,
          type: "calc",
          sourceFields: ["modA", "modB"],
          expression: "${modA}%${modB}",
          precision: 2
        }
      }
    },
    {label: "拼接A", fieldName: "concatA", type: "input", preps: {defaultValue: "Hello"}},
    {label: "拼接B", fieldName: "concatB", type: "input", preps: {defaultValue: "World"}},
    {
      label: "拼接结果(concat)",
      fieldName: "concatResult",
      type: "input",
      preps: {
        formula: {
          enable: true,
          type: "concat",
          sourceFields: ["concatA", "concatB"],
          expression: "${concatA}-${concatB}"
        }
      }
    },
    {
      label: "查找键(lookup)",
      fieldName: "lookupKey",
      type: "select",
      preps: {values: [{name: "Windows", value: "win", xh: 1}, {name: "Linux", value: "linux", xh: 2}]}
    },
    {label: "查找-端口", fieldName: "lkPort", type: "number"},
    {
      label: "查找-名称(lookup触发)",
      fieldName: "lkName",
      type: "input",
      preps: {
        formula: {
          enable: true,
          type: "lookup",
          sourceFields: ["lookupKey"],
          lookupMappings: [{key: "win", values: {lkPort: 3389, lkName: "Windows"}}, {
            key: "linux",
            values: {lkPort: 22, lkName: "Linux"}
          }]
        }
      }
    },
    {label: "开始日期", fieldName: "dcStart", type: "date", preps: {type: "date", subType: "date", clearable: true}},
    {label: "结束日期", fieldName: "dcEnd", type: "date", preps: {type: "date", subType: "date", clearable: true}},
    {
      label: "日期差-天(dateCalc)",
      fieldName: "dcDiff",
      type: "number",
      preps: {
        formula: {
          enable: true,
          type: "dateCalc",
          sourceFields: ["dcStart", "dcEnd"],
          expression: "${dcStart}~${dcEnd}",
          dateMode: "diff",
          dateUnit: "day"
        }
      }
    },
    {label: "金额", fieldName: "fmtMoney", type: "number", preps: {defaultValue: 1234567}},
    {
      label: "千分位(format)",
      fieldName: "fmtThousands",
      type: "input",
      preps: {
        formula: {
          enable: true,
          type: "format",
          sourceFields: ["fmtMoney"],
          expression: "${fmtMoney}",
          formatType: "thousands"
        }
      }
    },
    {label: "比率", fieldName: "fmtRate", type: "number", preps: {defaultValue: 3.14159}},
    {
      label: "保留两位(format)",
      fieldName: "fmtFixed",
      type: "input",
      preps: {
        formula: {
          enable: true,
          type: "format",
          sourceFields: ["fmtRate"],
          expression: "${fmtRate}",
          formatType: "toFixed",
          formatArg: 2
        }
      }
    },
    {label: "分数", fieldName: "tnScore", type: "number", preps: {defaultValue: 85}},
    {
      label: "及格判定(ternary)",
      fieldName: "tnResult",
      type: "input",
      preps: {
        formula: {
          enable: true,
          type: "ternary",
          sourceFields: ["tnScore"],
          expression: "${tnScore}>=60?'及格':'不及格'"
        }
      }
    },
    {label: "color", fieldName: "color", type: "color"},
    {label: "signature", fieldName: "signature"},
    {
      label: "年",
      fieldName: "fieldYear",
      type: "date",
      preps: {type: "year", subType: "year", clearable: true, id: "Idsh558a4f0c-03bd-42f4-b58d-75f992fdffb9"}
    },
    {
      label: "月",
      fieldName: "fieldMonth",
      type: "date",
      preps: {type: "month", subType: "month", clearable: true, id: "sh2957db9e-529b-4ddd-bb30-1edcda8bc067"}
    },
    {
      label: "日期",
      fieldName: "fieldDate",
      type: "date",
      preps: {type: "date", subType: "date", clearable: true, id: "sh06253fc6-acb5-4a7b-bad9-cd7e3045531e"}
    },
    {
      label: "周",
      fieldName: "fieldWeek",
      type: "date",
      preps: {type: "week", subType: "week", clearable: true, id: "she4d316d5-91af-409f-82d0-83a1581941c3"}
    },
    {
      label: "日期时间",
      fieldName: "fieldDatetime",
      type: "datetime",
      preps: {type: "datetime", subType: "datetime", id: "Idsh43140b9f-7de3-4aaf-b1a9-6733843067bb"}
    },
    {label: "时间选择", fieldName: "fieldTime", type: "time", preps: {id: "Idshae4eeb44-c837-40da-ac18-dabe0c5d74c4"}},
    {
      label: "时间选择器",
      fieldName: "fieldTimepicker",
      type: "time-picker",
      preps: {id: "Idsh7a174647-9e49-4434-bc01-286f480b5c3b"}
    },
    {
      label: "时间选择器范围",
      fieldName: "fieldTimerange",
      type: "time-picker",
      preps: {type: "timerange", isRange: true, id: "sh49951813-8fa8-4638-b2e9-af9f0090ab5c"}
    },
  ],
});
</script>

<template>
  <star-horse-dialog
      v-model="visible"
      @closeAction="visible = false"
      box-height="80%"
      :selfFunc="true"
      :compSize="'default'"
      :title="'NormalFormValid 配置测试'"
  >
    <star-horse-form :field-list="fieldList" form-size="default"/>
  </star-horse-dialog>
  <el-button type="primary" @click="visible = true">打开 NormalFormValid 弹窗(38字段)</el-button>
</template>
