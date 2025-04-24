import {useDesignFormStore} from '@/store/DesignForm.ts';
import {useCopyerOperationStore} from '@/store/CopyerOperation.ts';
import piniaInstance from '@/store';
import {computed} from 'vue';
import {operationConfirm, warning} from '@/utils/message.ts';
import {ModuleEnums} from '@/components/enums/ModuleEnums.ts';
import {copyContainer, moveDownItem, moveUpItem, removeItem} from '@/plugins/AblesPlugin.ts';
import {uuid} from '@/api/system.ts';

const designForm = useDesignFormStore(piniaInstance);
const copyerOperation = useCopyerOperationStore(piniaInstance);

const list = computed(() => designForm.compList);
const currentComp = computed(() => designForm.currentComp);
const action = computed(() => copyerOperation.action);
const shortKeyDisabled = computed(() => designForm.shortKeyDisabled);
const parentContainer = computed(() => copyerOperation.parentContainer);
const copyerData = computed(() => copyerOperation.copyerData);
/**
 * 复制
 */
const dyCopy = () => {
    if (shortKeyDisabled.value) {
        return;
    }
    const item: any = currentComp.value;
    if (!item || Object.keys(item).length === 0) {
        warning('请先选择要复制的组件');
        return;
    }
    const copyItem: any = JSON.parse(JSON.stringify(item));
    copyerOperation.keyboardOperation('copy', ModuleEnums.DYNAMIC_FORM, {}, copyItem);
};
/**
 * 剪切
 */
const dyCut = () => {
    if (shortKeyDisabled.value) {
        return;
    }
    const item: any = currentComp.value;
    if (!item || Object.keys(item).length === 0) {
        warning('请先选择要剪切的组件');
        return;
    }
    const copyItem: any = JSON.parse(JSON.stringify(item));
    copyerOperation.keyboardOperation('cut', ModuleEnums.DYNAMIC_FORM, {}, copyItem);
};
/**
 * 粘贴
 */
const dyPaste = () => {
    if (shortKeyDisabled.value) {
        return;
    }
    const copyItem: any = JSON.parse(JSON.stringify(copyerData.value));
    if (!copyItem || Object.keys(copyItem).length === 0) {
        return;
    }
    const compType = copyItem.compType;
    const itemType = copyItem.itemType;
    if (action.value === 'cut') {
        removeItem(list.value, currentComp.value, parentContainer.value);
    }
    if (compType == 'container') {
        copyContainer(list.value, copyItem, action.value === 'cut');
    } else {
        copyItem.id = uuid();
        copyItem.preps.id = copyItem.id;

        copyItem.preps.label = copyItem.preps.label + '(复制)';
        //判断copyItem.preps.name是否以数字结尾，如果是，则去掉数字，然后加上formInfo.value["dataIndex"]
        let name = copyItem.preps.name;
        if (name.match(/\d+$/)) {
            name = name.replace(/\d+$/, '');
        }
        copyItem.preps.name = name + designForm.getFieldDataIndex();
        list.value.push(copyItem);
    }
    designForm.selectItem(copyItem, itemType, '');
};
const dyEnter = () => {
    console.log('enter');
};
/**
 * tab
 */
const dyTab = () => {
    console.log('tab');
};
/**
 * 撤销
 */
const dyEscape = () => {
    console.log('escape');
};
const dyBackspace = () => {
    console.log('backspace');
};

const dyRedo = () => {
    //已有实现接口
    // designForm.redo();
};
const dyUndo = () => {
    //已有实现接口
    // designForm.undo();
    console.log('undo');
};
const dyNew = () => {
    //已有实现接口
    // if (list.value.length > 0) {
    //     confirm("新建后表单，已设置的数据会丢失，是否需要保存").then(() => {
    //         dySave();
    //     }).catch(() => {
    //         designForm.clearAll();
    //     });
    // }
};
const dySave = () => {
    //已有实现接口
    // designForm.setBatchEditFieldVisible(true);
    console.log('save');
};
const dyOpen = () => {
    console.log('open');
};
const dyDelete = () => {
    operationConfirm('确定要删除所选组件吗？').then(() => {
        console.log('delete');
    });
};
const dySelectAll = () => {
    console.log('selectAll');
};
const dyDeleteAll = () => {
    operationConfirm('确定要删除所有组件吗？').then(() => {
        designForm.clearAll();
    });
    console.log('deleteAll');
};
const dyFind = () => {
    console.log('find');
};
const dyExchange = () => {
    designForm.setComponentVisible(true);
    console.log('exchange');
};
const dyGroup = () => {
    console.log('group');
};
const dyUnGroup = () => {
    console.log('unGroup');
};
const dyPrint = () => {
    console.log('print');
};
const dyPreview = () => {
    //已有实现接口
    // designForm.setPreviewVisible(true);
    // designForm.setIsEdit(false);
};
const dyReturn = () => {
    //已有实现接口
    // router.push({
    //     path: "/dyform/DynamicFormUi",
    //     componentName: "DynamicFormUi",
    // });
};
const dyUp = () => {
    moveUpItem(true, currentComp.value, {});
    console.log('up');
};
const dyDown = () => {
    moveDownItem(true, currentComp.value, {});
    console.log('down');
};
const dyLeft = () => {
    console.log('left');
};
const dyRight = () => {
    console.log('right');
};
const dyAltUp = () => {
    console.log('altUp');
};
const dyAltDown = () => {
    console.log('altDown');
};
const dyAltLeft = () => {
    console.log('altLeft');
};
const dyAltRight = () => {
    console.log('altRight');
};
const dyCtrlUp = () => {
    console.log('ctrlUp');
};
const dyCtrlDown = () => {
    console.log('ctrlDown');
};
const dyCtrlLeft = () => {
    console.log('ctrlLeft');
};
const dyCtrlRight = () => {
    console.log('ctrlRight');
};
export {
    dyCopy,
    dyCut,
    dyPaste,
    dyEnter,
    dyEscape,
    dyBackspace,
    dyTab,
    dyRedo,
    dyUndo,
    dyNew,
    dySave,
    dyOpen,
    dyDelete,
    dySelectAll,
    dyDeleteAll,
    dyFind,
    dyExchange,
    dyGroup,
    dyUnGroup,
    dyPrint,
    dyPreview,
    dyReturn,
    dyUp,
    dyDown,
    dyLeft,
    dyRight,
    dyAltUp,
    dyAltDown,
    dyAltLeft,
    dyAltRight,
    dyCtrlDown,
    dyCtrlUp,
    dyCtrlLeft,
    dyCtrlRight
};
