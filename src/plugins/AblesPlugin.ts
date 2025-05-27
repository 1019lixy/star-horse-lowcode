import {useCopyerOperationStore} from '@/store/CopyerOperation';
import piniaInstance from '@/store';
import {computed, reactive, ref} from 'vue';
import {useDesignFormStore} from '@/store/DesignForm';
import {uuid} from '@/api/system';
import {DynamicNode} from '@/components/types/DynamicNode';
import {useDesignPageStore} from '@/store/DesignPage';

const copyerAction = useCopyerOperationStore(piniaInstance);
const designForm = useDesignFormStore(piniaInstance);
const designPage = useDesignPageStore(piniaInstance);
const compList = computed(() => designForm.compList);
const currentItemId = computed(() => designForm.currentItemId);
const pasteDisplay = computed(() => {
  const action = copyerAction.action;
  return !!action;
});
export function getParentComp(parentField: any) {
  return parentField &&
    (parentField.itemType == 'box' ||
      parentField.itemType == 'tab' ||
      parentField.itemType == 'dytable' ||
      parentField.itemType == 'table')
    ? 'container'
    : 'item';
}

/**
 * 选中组件
 * @param index
 * @param currentItems
 * @param elements
 * @param parentType
 */
const selectItem = (index: number, currentItems: Array<any>, elements: Array<any>, parentType: string) => {
  let item: any = {};
  if (currentItems.length > 0) {
    item = currentItems[currentItems.length - 1];
  } else {
    const element = elements[index - 1] || elements[0];
    item = element?.items[element.items?.length - 1];
  }
  if (item && Object.keys(item).length > 0) {
    designForm.selectItem(item, item.itemType, parentType);
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
    parentItemType == 'tab' ||
    parentItemType == 'table' ||
    parentItemType == 'card' ||
    parentItemType == 'collapse'
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
  } else if (parentItemType == 'box' || parentItemType == 'dytable') {
    const elements = parentField!.preps.elements;
    for (const index in elements) {
      const sdataTemp = elements[index];
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
          designForm.selectItem(item, item.itemType, parentItemType);
        }
        return;
      }
    }
  }
}

/**
 * 上移组件
 * @param formItem
 * @param parentField
 */
export function moveUpItem(isEdit: boolean, formItem: any, parentField: any) {
  if (!isEdit) {
    return;
  }
  //这个数据解析好麻烦
  const dataList = compList.value;
  if (parentField?.itemType == 'tab') {
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
  } else if (parentField?.itemType == 'box') {
  }
  const compType = getParentComp(parentField);
  if (compType === 'item') {
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
      if (dataTemp.compType !== 'container') {
        continue;
      }
      const elements = dataTemp.preps.elements;
      for (const index in elements) {
        const sdataTemp = elements[index];
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
  if (parentField?.itemType == 'tab') {
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
  } else if (parentField?.itemType == 'box') {
  }
  const compType = getParentComp(parentField);
  if (compType === 'item') {
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
      if (dataTemp.compType !== 'container') {
        continue;
      }
      const elements = dataTemp.preps.elements;
      for (const index in elements) {
        const sdataTemp = elements[index];
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

const fieldIndex = ref<number>(200);
const complexFields = (items: Array<any>, isCut: boolean = false) => {
  for (const index in items) {
    const item = items[index];
    if (item.compType == 'container') {
      const sitems = item.preps.elements;
      for (const sindex in sitems) {
        complexFields(sitems[sindex].items);
      }
    } else {
      item.id = uuid();
      item['preps']['id'] = item.id;
      if (!isCut) {
        fieldIndex.value++;
        item.preps.name = item.preps.name + fieldIndex.value;
        item.preps.label = item.preps.label + '(复制)';
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
export const copyContainer = (parentComp: Array<any>, currentContainer: any, isCut: boolean = false) => {
  if (!currentContainer) {
    return;
  }
  const containerType = currentContainer.itemType;
  const container = JSON.parse(JSON.stringify(currentContainer));
  container.id = uuid();
  //box和dytable 有列属性
  if (containerType == 'box' || containerType == 'dytable') {
    const rows = container.preps.elements;
    for (const index in rows) {
      const row = rows[index];
      for (const cIndex in row.columns) {
        const col = row.columns[cIndex];
        col._uuid = uuid();
        col.id = col._uuid;
        complexFields(col.items, isCut);
      }
    }
  } else {
    const rows = container.preps.elements;
    for (const index in rows) {
      complexFields(rows[index].items, isCut);
    }
  }
  parentComp.push(container);
  designForm.selectItem(container, containerType, '');
};

/**
 * 操作接口
 * @param act
 * @param item
 * @param parentItem
 */
export function contextOperation(act: string, item: any, parentItem: any) {
  console.log(act, item, parentItem);
}

export function cut(item: any, parentItem: any) {
  copyerAction.operation('cut', parentItem, item);
}

export function copy(item: any, parentItem: any) {
  copyerAction.operation('copy', parentItem, item);
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
    if (getParentComp(copyerData) == 'container') {
      const parentContainer = copyerAction.parentContainer;
      copyContainer(parentContainer ? parentContainer!.preps?.elements : compList.value, copyerData);
    } else {
      copyerData = JSON.parse(JSON.stringify(copyerData));
      copyerData.id = uuid();
      copyerData.preps.id = copyerData.id;
      compList.value.push(copyerData);
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
export function dynamicFormContextMenuData(item: any, parentItem: any, flag: string = 'scene', recall?: Function) {
  const menus = reactive<Array<any>>([]);
  if (flag == 'scene') {
    menus.push({
      type: 'button',
      text: '新建',
      icon: 'new',
      display: true,
      handler: () => {
        if (recall) {
          recall('new');
        } else {
        }
      }
    });
  }
  menus.push(
    {
      type: 'button',
      text: '剪切',
      icon: 'cut',
      display: true,
      handler: () => {
        if (recall) {
          recall('cut');
        } else {
          cut(item, parentItem);
        }
      }
    },
    {
      type: 'button',
      text: '复制',
      icon: 'copy',
      display: true,
      handler: () => {
        if (recall) {
          recall('copy');
        } else {
          copy(item, parentItem);
        }
      }
    },
    {
      type: 'button',
      text: '粘贴',
      icon: 'paste',
      display: pasteDisplay,
      handler: () => {
        if (recall) {
          recall('paste');
        } else {
          paste(parentItem);
        }
      }
    },
    {
      type: 'divider',
      direction: 'horizontal',
      display: () => true
    }
  );
  if (flag == 'scene') {
    menus.push(
      {
        type: 'button',
        text: '全选',
        icon: 'select-all',
        display: true,
        handler: () => {
          if (recall) {
            recall('select-all');
          } else {
          }
        }
      },
      {
        type: 'button',
        text: '清空',
        icon: 'dustbin',
        display: true,
        handler: () => {
          if (recall) {
            recall('dustbin');
          } else {
          }
        }
      },
      {
        type: 'divider',
        direction: 'horizontal',
        display: true
      },
      {
        type: 'button',
        text: '预览',
        icon: 'preview',
        display: true,
        handler: () => {
          if (recall) {
            recall('preview');
          } else {
          }
        }
      }
    );
  }
  if (flag == 'container') {
    menus.push({
      type: 'button',
      text: '添加组件',
      icon: 'new',
      display: true,
      handler: () => {
        designForm.setComponentVisible(true);
      }
    });
    menus.push({
      type: 'button',
      text: '选中容器',
      icon: 'select-parent',
      display: currentItemId.value != item.id,
      handler: () => {
        designForm.selectItem(item, item?.itemType, '');
      }
    });
  }
  menus.push(
    {
      type: 'button',
      text: '撤销',
      icon: 'undo',
      display: true,
      handler: () => {
        if (recall) {
          recall('undo');
        } else {
        }
      }
    },
    {
      type: 'divider',
      direction: 'horizontal',
      display: true
    },
    {
      type: 'button',
      text: '删除',
      icon: 'delete',
      display: () => true,
      handler: () => {
        if (recall) {
          recall('delete');
        } else {
        }
      }
    },
    {
      type: 'divider',
      direction: 'horizontal',
      display: true
    },
    {
      type: 'button',
      text: '属性',
      icon: 'prep',
      display: true,
      handler: () => {
        if (recall) {
          recall('prep');
        } else {
        }
      }
    }
  );

  return menus;
}

export function dynamicPageContextMenuData(node: DynamicNode) {
  let contentMenuData: Array<any> = [];
  contentMenuData = [
    {
      type: 'button',
      text: '水平居中',
      icon: 'center',
      display: true,
      handler: () => {}
    },
    {
      type: 'button',
      text: '复制',
      icon: 'copy',
      display: true,
      handler: () => {
        const temp = JSON.parse(JSON.stringify(node));
        temp.id = uuid();
        temp.name = temp.name + '复制';
        designPage.addNode(temp);
      }
    },
    {
      type: 'divider',
      direction: 'horizontal',
      display: true
    },
    {
      type: 'button',
      text: '上移一层',
      icon: 'up-layer',
      display: true,
      handler: () => {
        node.zIndex = (node.zIndex || 100) + 1;
      }
    },
    {
      type: 'button',
      text: '下移一层',
      icon: 'down-layer',
      display: node.zIndex && node.zIndex > 100,
      handler: () => {
        node.zIndex = node.zIndex && node.zIndex > 100 ? node.zIndex - 1 : 100;
      }
    },
    {
      type: 'button',
      text: '置顶',
      icon: 'to-top',
      display: true,
      handler: () => {
        node.zIndex = designPage.maxZIndex() + 1;
      }
    },
    {
      type: 'button',
      text: '置底',
      icon: 'to-bottom',
      display: node.zIndex && node.zIndex > 100,
      handler: () => {
        node.zIndex = 100;
      }
    },

    {
      type: 'divider',
      direction: 'horizontal',
      display: true
    },
    {
      type: 'button',
      text: '删除',
      icon: 'delete',
      display: true,
      handler: () => {
        designPage.removeNode(node.id);
      }
    },
    {
      type: 'divider',
      direction: 'horizontal',
      display: true
    },
    {
      type: 'button',
      icon: 'empty_setting',
      text: '清空参考线',
      display: true,
      handler: () => {}
    }
  ];
  return contentMenuData;
}
