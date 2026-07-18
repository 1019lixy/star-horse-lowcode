/**
 * 协同富文本状态管理
 */
import { reactive, ref } from "vue";
import { DEFAULT_RICHTEXT_CONFIG } from "../constants";
import type { CollabOperation, CollabUser, RichTextConfig } from "../types";

export const useCollabEditor = (initial?: { html?: string; config?: Partial<RichTextConfig> }) => {
    const html = ref(initial?.html ?? "");
    const text = ref("");
    const config = reactive<RichTextConfig>({
        ...DEFAULT_RICHTEXT_CONFIG,
        ...(initial?.config ?? {}),
    });

    const onlineUsers = reactive<CollabUser[]>([]);
    const operations = reactive<CollabOperation[]>([]);
    const currentUser = ref<CollabUser | null>(null);

    /** 设置内容 */
    const setContent = (newHtml: string) => {
        html.value = newHtml;
        // 提取纯文本
        const div = document.createElement("div");
        div.innerHTML = newHtml;
        text.value = div.innerText;
    };

    /** 内容变更 */
    const onContentChange = (newHtml: string) => {
        const prev = html.value;
        setContent(newHtml);
        if (config.enableCollaboration && currentUser.value && prev !== newHtml) {
            operations.push({
                type: "insert",
                userId: currentUser.value.id,
                timestamp: Date.now(),
                content: newHtml,
            });
            if (operations.length > 100) operations.shift();
        }
    };

    /** 加入协同 */
    const joinCollab = (user: CollabUser) => {
        currentUser.value = user;
        if (!onlineUsers.find((u) => u.id === user.id)) {
            onlineUsers.push(user);
        }
    };

    /** 离开协同 */
    const leaveCollab = (userId: string) => {
        const idx = onlineUsers.findIndex((u) => u.id === userId);
        if (idx >= 0) onlineUsers.splice(idx, 1);
        if (currentUser.value?.id === userId) currentUser.value = null;
    };

    /** 接收远程操作 */
    const applyRemoteOperation = (op: CollabOperation) => {
        operations.push(op);
        // 实际协同场景需 OT 算法合并，此处仅记录
    };

    /** 更新配置 */
    const updateConfig = (updates: Partial<RichTextConfig>) => {
        Object.assign(config, updates);
    };

    /** 获取数据 */
    const getData = () => ({
        html: html.value,
        text: text.value,
        onlineUsers: JSON.parse(JSON.stringify(onlineUsers)),
        operations: JSON.parse(JSON.stringify(operations)),
        config: { ...config },
    });

    return {
        html,
        text,
        config,
        onlineUsers,
        operations,
        currentUser,
        setContent,
        onContentChange,
        joinCollab,
        leaveCollab,
        applyRemoteOperation,
        updateConfig,
        getData,
    };
};

export type CollabEditor = ReturnType<typeof useCollabEditor>;
