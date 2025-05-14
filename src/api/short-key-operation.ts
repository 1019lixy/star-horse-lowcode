import { ModuleEnums } from '@/components/enums/ModuleEnums';
import {
  dyAltDown,
  dyAltLeft,
  dyAltRight,
  dyAltUp,
  dyBackspace,
  dyCopy,
  dyCtrlDown,
  dyCtrlLeft,
  dyCtrlRight,
  dyCtrlUp,
  dyCut,
  dyDelete,
  dyDeleteAll,
  dyDown,
  dyEnter,
  dyEscape,
  dyExchange,
  dyFind,
  dyGroup,
  dyLeft,
  dyNew,
  dyOpen,
  dyPaste,
  dyPreview,
  dyPrint,
  dyRedo,
  dyReturn,
  dyRight,
  dySave,
  dySelectAll,
  dyTab,
  dyUndo,
  dyUnGroup,
  dyUp
} from '@/api/dyform-short-key-operation';

/**
 * 复制
 * @param model 模块
 */
const copyFun = (model: ModuleEnums) => {
  switch (model) {
    case ModuleEnums.DYNAMIC_FORM:
      dyCopy();
      break;
    case ModuleEnums.DYNAMIC_PAGE:
      break;
  }
  console.log('copy', model);
};
const cutFun = (model: ModuleEnums) => {
  switch (model) {
    case ModuleEnums.DYNAMIC_FORM:
      dyCut();
      break;
    case ModuleEnums.DYNAMIC_PAGE:
      break;
  }
  console.log('cut', model);
};
const pasteFun = (model: ModuleEnums) => {
  switch (model) {
    case ModuleEnums.DYNAMIC_FORM:
      dyPaste();
      break;
    case ModuleEnums.DYNAMIC_PAGE:
      break;
  }
  console.log('paste', model);
};
const enterFun = (model: ModuleEnums) => {
  switch (model) {
    case ModuleEnums.DYNAMIC_FORM:
      dyEnter();
      break;
    case ModuleEnums.DYNAMIC_PAGE:
      break;
  }
  console.log('enterFun', model);
};
const tabFun = (model: ModuleEnums) => {
  switch (model) {
    case ModuleEnums.DYNAMIC_FORM:
      dyTab();
      break;
    case ModuleEnums.DYNAMIC_PAGE:
      break;
  }
  console.log('tab', model);
};
const escapeFun = (model: ModuleEnums) => {
  switch (model) {
    case ModuleEnums.DYNAMIC_FORM:
      dyEscape();
      break;
    case ModuleEnums.DYNAMIC_PAGE:
      break;
  }
  console.log('escapeFun', model);
};
const backspaceFun = (model: ModuleEnums) => {
  switch (model) {
    case ModuleEnums.DYNAMIC_FORM:
      dyBackspace();
      break;
    case ModuleEnums.DYNAMIC_PAGE:
      break;
  }
  console.log('backspaceFun', model);
};

const redoFun = (model: ModuleEnums) => {
  switch (model) {
    case ModuleEnums.DYNAMIC_FORM:
      dyRedo();
      break;
    case ModuleEnums.DYNAMIC_PAGE:
      break;
  }
  console.log('redoFun', model);
};
const undoFun = (model: ModuleEnums) => {
  switch (model) {
    case ModuleEnums.DYNAMIC_FORM:
      dyUndo();
      break;
    case ModuleEnums.DYNAMIC_PAGE:
      break;
  }
  console.log('undoFun', model);
};
const newFun = (model: ModuleEnums) => {
  switch (model) {
    case ModuleEnums.DYNAMIC_FORM:
      dyNew();
      break;
    case ModuleEnums.DYNAMIC_PAGE:
      break;
  }
  console.log('newFun', model);
};
const saveFun = (model: ModuleEnums) => {
  switch (model) {
    case ModuleEnums.DYNAMIC_FORM:
      dySave();
      break;
    case ModuleEnums.DYNAMIC_PAGE:
      break;
  }
  console.log('saveFun', model);
};
const openFun = (model: ModuleEnums) => {
  switch (model) {
    case ModuleEnums.DYNAMIC_FORM:
      dyOpen();
      break;
    case ModuleEnums.DYNAMIC_PAGE:
      break;
  }
  console.log('openFun', model);
};
const deleteFun = (model: ModuleEnums) => {
  switch (model) {
    case ModuleEnums.DYNAMIC_FORM:
      dyDelete();
      break;
    case ModuleEnums.DYNAMIC_PAGE:
      break;
  }
  console.log('deleteFun', model);
};
const selectAllFun = (model: ModuleEnums) => {
  switch (model) {
    case ModuleEnums.DYNAMIC_FORM:
      dySelectAll();
      break;
    case ModuleEnums.DYNAMIC_PAGE:
      break;
  }
  console.log('selectAllFun', model);
};
const deleteAllFun = (model: ModuleEnums) => {
  switch (model) {
    case ModuleEnums.DYNAMIC_FORM:
      dyDeleteAll();
      break;
    case ModuleEnums.DYNAMIC_PAGE:
      break;
  }
  console.log('deleteAllFun', model);
};
const findFun = (model: ModuleEnums) => {
  switch (model) {
    case ModuleEnums.DYNAMIC_FORM:
      dyFind();
      break;
    case ModuleEnums.DYNAMIC_PAGE:
      break;
  }
  console.log('findFun', model);
};
const exchangeFun = (model: ModuleEnums) => {
  switch (model) {
    case ModuleEnums.DYNAMIC_FORM:
      dyExchange();
      break;
    case ModuleEnums.DYNAMIC_PAGE:
      break;
  }
  console.log('exchangeFun', model);
};
const groupFun = (model: ModuleEnums) => {
  switch (model) {
    case ModuleEnums.DYNAMIC_FORM:
      dyGroup();
      break;
    case ModuleEnums.DYNAMIC_PAGE:
      break;
  }
  console.log('groupFun', model);
};
const unGroupFun = (model: ModuleEnums) => {
  switch (model) {
    case ModuleEnums.DYNAMIC_FORM:
      dyUnGroup();
      break;
    case ModuleEnums.DYNAMIC_PAGE:
      break;
  }
  console.log('unGroupFun', model);
};
const printFun = (model: ModuleEnums) => {
  switch (model) {
    case ModuleEnums.DYNAMIC_FORM:
      dyPrint();
      break;
    case ModuleEnums.DYNAMIC_PAGE:
      break;
  }
  console.log('printFun', model);
};
const previewFun = (model: ModuleEnums) => {
  switch (model) {
    case ModuleEnums.DYNAMIC_FORM:
      dyPreview();
      break;
    case ModuleEnums.DYNAMIC_PAGE:
      break;
  }
  console.log('previewFun', model);
};
const returnFun = (model: ModuleEnums) => {
  switch (model) {
    case ModuleEnums.DYNAMIC_FORM:
      dyReturn();
      break;
    case ModuleEnums.DYNAMIC_PAGE:
      break;
  }
  console.log('returnFun', model);
};
const upFun = (model: ModuleEnums) => {
  switch (model) {
    case ModuleEnums.DYNAMIC_FORM:
      dyUp();
      break;
    case ModuleEnums.DYNAMIC_PAGE:
      break;
  }
  console.log('upFun', model);
};
const downFun = (model: ModuleEnums) => {
  switch (model) {
    case ModuleEnums.DYNAMIC_FORM:
      dyDown();
      break;
    case ModuleEnums.DYNAMIC_PAGE:
      break;
  }
  console.log('downFun', model);
};
const leftFun = (model: ModuleEnums) => {
  switch (model) {
    case ModuleEnums.DYNAMIC_FORM:
      dyLeft();
      break;
    case ModuleEnums.DYNAMIC_PAGE:
      break;
  }
  console.log('leftFun', model);
};
const rightFun = (model: ModuleEnums) => {
  switch (model) {
    case ModuleEnums.DYNAMIC_FORM:
      dyRight();
      break;
    case ModuleEnums.DYNAMIC_PAGE:
      break;
  }
  console.log('rightFun', model);
};
const altUpFun = (model: ModuleEnums) => {
  switch (model) {
    case ModuleEnums.DYNAMIC_FORM:
      dyAltUp();
      break;
    case ModuleEnums.DYNAMIC_PAGE:
      break;
  }
  console.log('altUpFun', model);
};
const altDownFun = (model: ModuleEnums) => {
  switch (model) {
    case ModuleEnums.DYNAMIC_FORM:
      dyAltDown();
      break;
    case ModuleEnums.DYNAMIC_PAGE:
      break;
  }
  console.log('altDownFun', model);
};
const altLeftFun = (model: ModuleEnums) => {
  switch (model) {
    case ModuleEnums.DYNAMIC_FORM:
      dyAltLeft();
      break;
    case ModuleEnums.DYNAMIC_PAGE:
      break;
  }
  console.log('altLeftFun', model);
};
const altRightFun = (model: ModuleEnums) => {
  switch (model) {
    case ModuleEnums.DYNAMIC_FORM:
      dyAltRight();
      break;
    case ModuleEnums.DYNAMIC_PAGE:
      break;
  }
  console.log('altRightFun', model);
};
const ctrlUpFun = (model: ModuleEnums) => {
  switch (model) {
    case ModuleEnums.DYNAMIC_FORM:
      dyCtrlUp();
      break;
    case ModuleEnums.DYNAMIC_PAGE:
      break;
  }
  console.log('ctrlUpFun', model);
};
const ctrlDownFun = (model: ModuleEnums) => {
  switch (model) {
    case ModuleEnums.DYNAMIC_FORM:
      dyCtrlDown();
      break;
    case ModuleEnums.DYNAMIC_PAGE:
      break;
  }
  console.log('ctrlDownFun', model);
};
const ctrlLeftFun = (model: ModuleEnums) => {
  switch (model) {
    case ModuleEnums.DYNAMIC_FORM:
      dyCtrlLeft();
      break;
    case ModuleEnums.DYNAMIC_PAGE:
      break;
  }
  console.log('ctrlLeftFun', model);
};
const ctrlRightFun = (model: ModuleEnums) => {
  switch (model) {
    case ModuleEnums.DYNAMIC_FORM:
      dyCtrlRight();
      break;
    case ModuleEnums.DYNAMIC_PAGE:
      break;
  }
  console.log('ctrlRightFun', model);
};
export {
  copyFun,
  cutFun,
  pasteFun,
  enterFun,
  escapeFun,
  backspaceFun,
  tabFun,
  redoFun,
  undoFun,
  newFun,
  saveFun,
  openFun,
  deleteFun,
  selectAllFun,
  deleteAllFun,
  findFun,
  exchangeFun,
  groupFun,
  unGroupFun,
  printFun,
  previewFun,
  returnFun,
  upFun,
  downFun,
  leftFun,
  rightFun,
  altUpFun,
  altDownFun,
  altLeftFun,
  altRightFun,
  ctrlUpFun,
  ctrlDownFun,
  ctrlLeftFun,
  ctrlRightFun
};
