import {
  getCopyerOperationStore,
  getDesignFormStore,
} from "@/store/StoreManager";
import { computed, reactive } from "vue";
import { uuid } from "@/api/system";
import { DynamicNode } from "@/components/types/DynamicNode";
import { i18n } from "@/lang";
import camelcase from "camelcase";

const copyerAction = getCopyerOperationStore();
let designForm = getDesignFormStore();
const compList = computed(() => designForm.compList);
const currentItemId = computed(() => designForm.currentItemId);
let currentSubItem = computed(() => designForm.currentSubItem);
const pasteDisplay = computed(() => {
  const action = getCopyerOperationStore().action;
  return !!action;
});

export function getParentComp(parentField: any) {
  return parentField &&
    (parentField.itemType == "box" ||
      parentField.itemType == "tab" ||
      parentField.itemType == "dytable" ||
      parentField.itemType == "table")
    ? "container"
    : "item";
}

/**
 * 选中组件
 * @param index
 * @param currentItems
 * @param elements
 * @param parentType
 */
const selectItem = (
  index: number,
  currentItems: Array<any>,
  elements: Array<any>,
  parentType: string,
) => {
  let item: any;
  if (currentItems.length > 0) {
    item = currentItems[currentItems.length - 1];
  } else {
    let element = elements[index - 1];
    if (!element?.items?.length) {
      element = elements[index + 1];
    }
    item = element?.items[element.items?.length - 1];
  }
  if (item && Object.keys(item).length > 0) {
    getDesignFormStore().selectItem(item, item.itemType, parentType);
  }
};

/**
 * 从舞台删除组件
 * @param isEdit
 * @param formItem
 * @param parentField
 */
export function removeItem(isEdit: boolean, formItem: any, parentField: any) {
  if (!isEdit) {
    return;
  }
  const parentItemType = parentField?.itemType;
  const dataList = compList.value;
  if (
    parentItemType == "tab" ||
    parentItemType == "table" ||
    parentItemType == "card" ||
    parentItemType == "collapse"
  ) {
    const elements = parentField!.preps.elements;
    for (let i = 0; i < elements.length; i++) {
      const items = elements[i].items;
      for (let j = 0; j < items.length; j++) {
        if (formItem.id === items[j]?.id) {
          items.splice(j, 1);

          selectItem(i, items, elements, parentItemType);
          return;
        }
      }
    }
  } else if (parentItemType == "box" || parentItemType == "dytable") {
    const elements = parentField!.preps.elements;
    for (const sdataTemp of elements) {
      if (sdataTemp.columns.length > 0) {
        for (let i = 0; i < sdataTemp.columns.length; i++) {
          const items = sdataTemp.columns[i].items;
          for (let j = 0; j < items.length; j++) {
            if (formItem.id === items[j].id) {
              items.splice(j, 1);
              selectItem(i, items, sdataTemp.columns, parentItemType);
              return;
            }
          }
        }
      }
    }
  } else {
    for (let i = 0; i < dataList.length; i++) {
      if (formItem.id === dataList[i].id) {
        const item = dataList[i - 1] || dataList[0];
        dataList.splice(i, 1);
        if (item && Object.keys(item).length > 0) {
          getDesignFormStore().selectItem(item, item.itemType, parentItemType);
        }
        return;
      }
    }
  }
}

/**
 * 上移组件
 * @param isEdit
 * @param formItem
 * @param parentField
 */
export function moveUpItem(isEdit: boolean, formItem: any, parentField: any) {
  if (!isEdit) {
    return;
  }
  //这个数据解析好麻烦
  const dataList = compList.value;
  if (parentField?.itemType == "tab") {
    const elements = parentField!.preps.elements;
    for (let i = 0; i < elements.length; i++) {
      const items = elements[i].items;
      for (let j = 0; j < items.length; j++) {
        if (formItem.id === items[j]?.id && j > 0) {
          const temp = items[j];
          items[j] = items[j - 1];
          items[j - 1] = temp;
          return;
        }
      }
    }
  } else if (parentField?.itemType == "box") {
    // box 类型暂不处理
  }
  const compType = parentField.compType ?? getParentComp(parentField);
  if (compType === "item") {
    for (let i = 0; i < dataList.length; i++) {
      if (formItem.id === dataList[i].id && i > 0) {
        const temp = dataList[i];
        dataList[i] = dataList[i - 1];
        dataList[i - 1] = temp;
        break;
      }
    }
  } else {
    for (let i = 0; i < dataList.length; i++) {
      const dataTemp = dataList[i];
      if (dataTemp.compType !== "container") {
        continue;
      }
      const elements = dataTemp.preps.elements;
      for (const sdataTemp of elements) {
        if (sdataTemp.columns.length > 0) {
          for (let i = 0; i < sdataTemp.columns.length; i++) {
            const items = sdataTemp.columns[i].items;
            for (let j = 0; j < items.length; j++) {
              if (formItem.id === items[j].id && j > 0) {
                const temp = items[j];
                items[j] = items[j - 1];
                items[j - 1] = temp;
                break;
              }
            }
          }
        }
      }
    }
  }
}

export function moveDownItem(isEdit: boolean, formItem: any, parentField: any) {
  if (!isEdit) {
    return;
  }
  const dataList = compList.value;
  if (parentField?.itemType == "tab") {
    const elements = parentField!.preps.elements;
    for (let i = 0; i < elements.length; i++) {
      const items = elements[i].items;
      for (let j = 0; j < items.length; j++) {
        if (formItem.id === items[j]?.id && j < items.length - 1) {
          const temp = items[j];
          items[j] = items[j + 1];
          items[j + 1] = temp;
          return;
        }
      }
    }
  }
  const compType = parentField.compType ?? getParentComp(parentField);
  if (compType === "item") {
    for (let i = 0; i < dataList.length; i++) {
      if (formItem.id === dataList[i].id && i < dataList.length - 1) {
        const temp = dataList[i];
        dataList[i] = dataList[i + 1];
        dataList[i + 1] = temp;
        break;
      }
    }
  } else {
    for (let i = 0; i < dataList.length; i++) {
      const dataTemp = dataList[i];
      if (dataTemp.compType !== "container") {
        continue;
      }
      const elements = dataTemp.preps.elements;
      for (const sdataTemp of elements) {
        if (sdataTemp.columns.length > 0) {
          for (let i = 0; i < sdataTemp.columns.length; i++) {
            const items = sdataTemp.columns[i].items;
            for (let j = 0; j < items.length; j++) {
              if (formItem.id === items[j].id && j < items.length - 1) {
                const temp = items[j];
                items[j] = items[j + 1];
                items[j + 1] = temp;
                break;
              }
            }
          }
        }
      }
    }
  }
}

// const fieldIndex = ref<number>(200);
const complexFields = (items: Array<any>, isCut: boolean = false) => {
  for (const item of items) {
    if (item?.compType == "container") {
      const sitems = item?.preps?.elements;
      for (const sitem of sitems) {
        complexFields(sitem?.items);
      }
    } else {
      item.id = uuid();
      item["preps"]["id"] = item.id;
      if (!isCut) {
        // fieldIndex.value++;
        item.preps.name = camelcase(["field", item.id.substring(0, 6)]);
      }
    }
  }
};
/**
 * 拷贝容器
 * @param parentComp
 * @param currentContainer
 * @param isCut
 */
export const copyContainer = (
  parentComp: any,
  currentContainer: any,
  isCut: boolean = false,
) => {
  if (!currentContainer) {
    return;
  }
  const containerType = currentContainer.itemType;
  const container = JSON.parse(JSON.stringify(currentContainer));
  container.id = uuid();
  //box和dytable 有列属性
  if (containerType == "box" || containerType == "dytable") {
    const rows = container.preps.elements;
    for (const row of rows) {
      row.id = uuid();
      for (const col of row.columns) {
        col.id = uuid();
        complexFields(col.items, isCut);
      }
    }
  } else {
    const rows = container.preps.elements;
    for (const row of rows) {
      row.id = uuid();
      complexFields(row.items, isCut);
    }
  }
  if (Array.isArray(parentComp)) {
    parentComp.push(container);
  } else if (parentComp) {
    parentComp.items?.push(container);
  } else {
    //将拷贝的新数据添加到当前容器的下一个下标
    const index = compList.value.indexOf(currentContainer);
    compList.value.splice(index + 1, 0, container);
  }
  getDesignFormStore().selectItem(container, containerType, "");
};

/**
 * 操作接口
 * @param act
 * @param item
 * @param parentItem
 */
export function contextOperation(act: string, item: any, parentItem: any) {
}

export function cut(item: any, parentItem: any) {
  copyerAction.operation("cut", parentItem, item);
}

export function copy(item: any, parentItem: any) {
  copyerAction.operation("copy", parentItem, item);
}

export function paste(parentItem: any) {
  let copyerData = copyerAction.copyerData;
  if (!copyerData || Object.keys(copyerData).length == 0) {
    return;
  }
  if (parentItem && Object.keys(parentItem).length > 0) {
    // let action = copyerAction.action;
    copyContainer(parentItem!.preps?.elements, copyerData);
  } else {
    //拷贝容器
    if (getParentComp(copyerData) == "container") {
      const parentContainer = copyerAction.parentContainer;
      copyContainer(
        parentContainer ? parentContainer!.preps?.elements : compList.value,
        copyerData,
      );
    } else {
      copyerData = JSON.parse(JSON.stringify(copyerData));
      copyerData.id = uuid();
      copyerData.fieldName = camelcase([
        "field",
        copyerData.id.substring(0, 6),
      ]);
      copyerData.preps.id = copyerData.id;
      //如果选中了某个单元格
      if (currentSubItem.value) {
        if (!currentSubItem.value.items) {
          currentSubItem.value.items = [];
        }
        currentSubItem.value.items.push(copyerData);
      } else {
        compList.value.push(copyerData);
      }
    }
  }
}

/**
 *
 * @param item
 * @param parentItem
 * @param flag scene 场景 container 容器 item 组件
 * @param recall
 */
export function dynamicFormContextMenuData(
  item: any,
  parentItem: any,
  flag: string = "scene",
  recall?: Function,
) {
  const menus = reactive<Array<any>>([]);
  if (flag == "scene") {
    menus.push({
      type: "button",
      text: i18n("context.new"),
      icon: "new",
      display: !!recall,
      handler: () => {
        recall && recall("new");
      },
    });
  }
  menus.push(
    {
      type: "button",
      text: i18n("context.cut"),
      icon: "cut",
      display: true,
      handler: () => {
        if (recall) {
          recall("cut");
        } else {
          cut(item, parentItem);
        }
      },
    },
    {
      type: "button",
      text: i18n("context.copy"),
      icon: "copy",
      display: true,
      handler: () => {
        if (recall) {
          recall("copy");
        } else {
          copy(item, parentItem);
        }
      },
    },
    {
      type: "button",
      text: i18n("context.paste"),
      icon: "paste",
      display: pasteDisplay,
      handler: () => {
        if (recall) {
          recall("paste");
        } else {
          paste(parentItem);
        }
      },
    },
    {
      type: "divider",
      direction: "horizontal",
      display: () => true,
    },
  );
  if (flag == "scene") {
    menus.push(
      {
        type: "button",
        text: i18n("context.selectAll"),
        icon: "select-all",
        display: !!recall,
        handler: () => {
          recall && recall("select-all");
        },
      },
      {
        type: "button",
        text: i18n("context.clear"),
        icon: "dustbin",
        display: !!recall,
        handler: () => {
          recall && recall("dustbin");
        },
      },
      {
        type: "divider",
        direction: "horizontal",
        display: true,
      },
      {
        type: "button",
        text: i18n("context.preview"),
        icon: "preview",
        display: !!recall,
        handler: () => {
          recall && recall("preview");
        },
      },
    );
  }
  if (flag == "container") {
    menus.push({
      type: "button",
      text: i18n("context.addComponent"),
      icon: "new",
      display: true,
      handler: () => {
        getDesignFormStore().setComponentVisible(true);
      },
    });
    menus.push({
      type: "button",
      text: i18n("context.selectContainer"),
      icon: "select-parent",
      display: currentItemId.value != item.id,
      handler: () => {
        getDesignFormStore().selectItem(item, item?.itemType, "");
      },
    });
  }
  menus.push(
    {
      type: "button",
      text: i18n("context.undo"),
      icon: "undo",
      display: !!recall,
      handler: () => {
        recall && recall("undo");
      },
    },
    {
      type: "divider",
      direction: "horizontal",
      display: true,
    },
    {
      type: "button",
      text: i18n("context.delete"),
      icon: "delete",
      display: !!recall,
      handler: () => {
        recall && recall("delete");
      },
    },
    {
      type: "divider",
      direction: "horizontal",
      display: true,
    },
    {
      type: "button",
      text: i18n("context.properties"),
      icon: "prep",
      display: !!recall,
      handler: () => {
        recall && recall("prep");
      },
    },
  );

  return menus;
}

/**
 * 动态页面上下文菜单数据
 * @param node
 * @param recallFunction
 */
export function dynamicPageContextMenuData(
  node: DynamicNode,
  recallFunction: Function,
) {
  if (!node.styles) {
    node.styles = {};
  }
  return [
    {
      type: "button",
      text: i18n("context.centerHorizontally"),
      icon: "center",
      display: !!recallFunction,
      handler: () => {
        recallFunction && recallFunction("center", node);
      },
    },
    {
      type: "button",
      text: i18n("context.copy"),
      icon: "copy",
      display: !!recallFunction,
      handler: () => {
        recallFunction && recallFunction("copy", node);
      },
    },
    {
      type: "divider",
      direction: "horizontal",
      display: true,
    },
    {
      type: "button",
      text: i18n("context.moveUpLayer"),
      icon: "up-layer",
      display: true,
      handler: () => {
        node.styles.zIndex = (node.styles.zIndex || 100) + 1;
      },
    },
    {
      type: "button",
      text: i18n("context.moveDownLayer"),
      icon: "down-layer",
      display: node.styles.zIndex && node.styles.zIndex > 100,
      handler: () => {
        node.styles.zIndex =
          node.styles.zIndex && node.styles.zIndex > 100
            ? node.styles.zIndex - 1
            : 100;
      },
    },
    {
      type: "button",
      text: i18n("context.bringToFront"),
      icon: "to-top",
      display: !!recallFunction,
      handler: () => {
        recallFunction && recallFunction("toTop", node);
      },
    },
    {
      type: "button",
      text: i18n("context.sendToBack"),
      icon: "to-bottom",
      display: node.styles.zIndex && node.styles.zIndex > 100,
      handler: () => {
        node.styles.zIndex = 100;
      },
    },

    {
      type: "divider",
      direction: "horizontal",
      display: true,
    },
    {
      type: "button",
      text: i18n("context.delete"),
      icon: "delete",
      display: !!recallFunction,
      handler: () => {
        recallFunction && recallFunction("delete", node);
      },
    },
    {
      type: "divider",
      direction: "horizontal",
      display: true,
    },
    {
      type: "button",
      icon: "empty_setting",
      text: i18n("context.clearGuides"),
      display: !!recallFunction,
      handler: () => {
        recallFunction && recallFunction("empty_setting", node);
      },
    },
  ];
}
