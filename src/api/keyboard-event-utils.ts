import { ref } from 'vue';
import { ShortKey } from '@/components/types/ShortKey';
import { ModuleEnums } from '@/components/enums/ModuleEnums.ts';
import {
  altDownFun,
  altLeftFun,
  altRightFun,
  altUpFun,
  backspaceFun,
  copyFun,
  ctrlDownFun,
  ctrlLeftFun,
  ctrlRightFun,
  ctrlUpFun,
  cutFun,
  deleteAllFun,
  deleteFun,
  downFun,
  enterFun,
  escapeFun,
  exchangeFun,
  findFun,
  groupFun,
  leftFun,
  newFun,
  openFun,
  pasteFun,
  previewFun,
  printFun,
  redoFun,
  returnFun,
  rightFun,
  saveFun,
  selectAllFun,
  tabFun,
  undoFun,
  unGroupFun,
  upFun
} from '@/api/short-key-operation.ts';

const ctrlKey = ref<boolean>(false);
const altKey = ref<boolean>(false);
const shiftKey = ref<boolean>(false);
/**
 * 重置ctrlKey
 */
export const resetCtrlKey = (evt: KeyboardEvent) => {
  if (evt.key == 'Control') {
    ctrlKey.value = false;
  }
  if (evt.key == 'Alt') {
    altKey.value = false;
  }
  if (evt.key == 'Shift') {
    shiftKey.value = false;
  }
};
const shortKeyList = (model: ModuleEnums) => {
  const keyboardEventMap: ShortKey[] = [
    {
      key: 'Enter',
      action: 'enter',
      handler: () => enterFun(model)
    },
    {
      key: 'Escape',
      action: 'escape',
      handler: () => escapeFun(model)
    },
    {
      key: 'Tab',
      action: 'tab',
      handler: () => tabFun(model)
    },
    {
      key: 'Backspace',
      action: 'backspace',
      handler: () => backspaceFun(model)
    },
    {
      key: 'Delete',
      action: 'delete',
      handler: () => deleteFun(model)
    },

    {
      key: '1',
      alt: true,
      action: 'leftPanel'
    },
    {
      key: '2',
      alt: true,
      action: 'rightPanel'
    },
    {
      key: 'z',
      action: 'undo',
      ctrl: true,
      handler: () => undoFun(model)
    },
    {
      key: 'y',
      action: 'redo',
      ctrl: true,
      handler: () => redoFun(model)
    },
    {
      key: 'c',
      action: 'copy',
      ctrl: true,
      handler: () => copyFun(model)
    },
    {
      key: 'x',
      action: 'cut',
      ctrl: true,
      handler: () => cutFun(model)
    },
    {
      key: 'v',
      action: 'paste',
      ctrl: true,
      handler: () => pasteFun(model)
    },
    {
      key: 'v',
      action: 'valid',
      alt: true
    },
    {
      key: 'n',
      action: 'new',
      ctrl: true,
      alt: true,
      handler: () => newFun(model)
    },
    {
      key: 's',
      action: 'save',
      ctrl: true,
      alt: true,
      handler: () => saveFun(model)
    },
    {
      key: 'o',
      action: 'open',
      ctrl: true,
      handler: () => openFun(model)
    },
    {
      key: 'd',
      action: 'delete',
      ctrl: true,
      handler: () => deleteFun(model)
    },
    {
      key: 'a',
      action: 'selectAll',
      ctrl: true,
      handler: () => selectAllFun(model)
    },
    {
      key: 'd',
      action: 'deleteAll',
      ctrl: true,
      alt: true,
      handler: () => deleteAllFun(model)
    },
    {
      key: 'f',
      action: 'find',
      ctrl: true,
      handler: () => findFun(model)
    },
    {
      key: 'm',
      action: 'exchange',
      ctrl: true,
      alt: true,
      handler: () => exchangeFun(model)
    },
    {
      key: 'g',
      action: 'group',
      ctrl: true,
      handler: () => groupFun(model)
    },
    {
      key: 'g',
      action: 'unGroup',
      ctrl: true,
      alt: true,
      handler: () => unGroupFun(model)
    },
    {
      key: 'p',
      action: 'print',
      ctrl: true,
      handler: () => printFun(model)
    },
    {
      key: 'p',
      action: 'preview',
      alt: true,
      handler: () => previewFun(model)
    },
    {
      key: 'r',
      action: 'goBack',
      ctrl: true,
      handler: () => returnFun(model)
    },
    {
      key: 'ArrowUp',
      action: 'up',
      handler: () => upFun(model)
    },
    {
      key: 'ArrowDown',
      action: 'down',
      handler: () => downFun(model)
    },
    {
      key: 'ArrowLeft',
      action: 'left',
      handler: () => leftFun(model)
    },
    {
      key: 'ArrowRight',
      action: 'right',
      handler: () => rightFun(model)
    },
    {
      key: 'ArrowUp',
      action: 'altUp',
      alt: true,
      handler: () => altUpFun(model)
    },
    {
      key: 'ArrowDown',
      action: 'altDown',
      alt: true,
      handler: () => altDownFun(model)
    },
    {
      key: 'ArrowLeft',
      action: 'altLeft',
      alt: true,
      handler: () => altLeftFun(model)
    },
    {
      key: 'ArrowRight',
      action: 'altRight',
      alt: true,
      handler: () => altRightFun(model)
    },
    {
      key: 'ArrowUp',
      action: 'ctrlUp',
      ctrl: true,
      handler: () => ctrlUpFun(model)
    },
    {
      key: 'ArrowDown',
      action: 'ctrlDown',
      ctrl: true,
      handler: () => ctrlDownFun(model)
    },
    {
      key: 'ArrowLeft',
      action: 'ctrlLeft',
      ctrl: true,
      handler: () => ctrlLeftFun(model)
    },
    {
      key: 'ArrowRight',
      action: 'ctrlRight',
      ctrl: true,
      handler: () => ctrlRightFun(model)
    }
  ];
  return keyboardEventMap;
};

/**
 * 键盘事件
 * @param evt
 * @param actions 回调函数
 * @param params 参数
 */
export const keyboardEvent = (evt: KeyboardEvent, actions: Function, module: ModuleEnums, ...params: any) => {
  //ctrlKey
  if (evt.key == 'Control') {
    ctrlKey.value = true;
  }
  //altKey
  if (evt.key == 'Alt') {
    altKey.value = true;
  }
  //shiftKey
  if (evt.key == 'Shift') {
    shiftKey.value = true;
  }
  let keyInfo;
  if (ctrlKey.value && altKey.value && shiftKey.value) {
    keyInfo = shortKeyList(module).find((item) => item.key == evt.key && item.ctrl && item.alt && item.shift);
  } else if (ctrlKey.value && altKey.value) {
    keyInfo = shortKeyList(module).find((item) => item.key == evt.key && item.ctrl && item.alt);
  } else if (ctrlKey.value && shiftKey.value) {
    keyInfo = shortKeyList(module).find((item) => item.key == evt.key && item.ctrl && item.shift);
  } else if (altKey.value && shiftKey.value) {
    keyInfo = shortKeyList(module).find((item) => item.key == evt.key && item.alt && item.shift);
  } else if (ctrlKey.value) {
    keyInfo = shortKeyList(module).find((item) => item.key == evt.key && item.ctrl);
  } else if (altKey.value) {
    keyInfo = shortKeyList(module).find((item) => item.key == evt.key && item.alt);
  } else if (shiftKey.value) {
    keyInfo = shortKeyList(module).find((item) => item.key == evt.key && item.shift);
  } else {
    keyInfo = shortKeyList(module).find((item) => item.key == evt.key && !item.ctrl && !item.alt && !item.shift);
  }
  if (keyInfo) {
    //执行方法
    keyInfo.handler && keyInfo.handler();
    actions && actions(keyInfo.action, ...params);
  }
};
const windowBlur = () => {
  altKey.value = false;
  shiftKey.value = false;
  ctrlKey.value = false;
};
//初始化键盘事件
export const initKeyboardEvent = (actions: Function, module: ModuleEnums, ...params: any) => {
  removeKeyboardEvent(actions, module, params);
  window.addEventListener('keydown', (evt: KeyboardEvent) => keyboardEvent(evt, actions, module, params), true);
  window.addEventListener('keyup', (evt: KeyboardEvent) => resetCtrlKey(evt), true);
  window.addEventListener('blur', windowBlur, false);
};
//移除键盘事件
export const removeKeyboardEvent = (actions: Function, module: ModuleEnums, ...params: any) => {
  window.removeEventListener('keydown', (evt: KeyboardEvent) => keyboardEvent(evt, actions, module, params), true);
  window.removeEventListener('keyup', (evt: KeyboardEvent) => resetCtrlKey(evt), true);
  window.removeEventListener('blur', windowBlur, false);
};
