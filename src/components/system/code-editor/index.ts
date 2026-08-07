export type {FileNode, TabInfo, MenuItemDef, IdeTheme} from "./types";
export {IDE_THEMES, getThemeByValue, applyThemeVars} from "./theme";
export {
    LANG_MAP,
    FILE_ICONS,
    FOLDER_ICONS,
    getFileExt,
    detectLanguage,
    getFileIcon,
} from "./constants";
export {useFileTree} from "./useFileTree";
export {useFileApi} from "./useFileApi";
export type {ContextMenuItem} from "./ContextMenu.vue";
export {default as StarHorseDiffEditor} from "../StarHorseDiffEditor.vue";
