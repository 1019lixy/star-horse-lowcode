/**
 * PDF 签章状态管理
 * 单一职责：管理签名列表、签名采集
 */
import { reactive, ref } from "vue";
import type { PdfSignatureInfo } from "../types";

export const usePdfSigner = (initial?: { signatures?: PdfSignatureInfo[] }) => {
    const signatures = reactive<PdfSignatureInfo[]>(initial?.signatures ? JSON.parse(JSON.stringify(initial.signatures)) : []);
    const selectedSignatureId = ref<string | null>(null);

    const penColor = ref("#000000");
    const penWidth = ref(2);
    const enableCertificate = ref(false);

    const selectedSignature = ref<PdfSignatureInfo | null>(null);

    /** 添加签名 */
    const addSignature = (info: Partial<PdfSignatureInfo>): PdfSignatureInfo => {
        const sig: PdfSignatureInfo = {
            id: `sig_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            signer: info.signer ?? "",
            imageDataUrl: info.imageDataUrl,
            signedAt: new Date().toISOString(),
            x: info.x ?? 20,
            y: info.y ?? 20,
            width: info.width ?? 100,
            height: info.height ?? 40,
            page: info.page ?? 1,
            certificate: info.certificate,
        };
        signatures.push(sig);
        selectedSignatureId.value = sig.id;
        selectedSignature.value = sig;
        return sig;
    };

    /** 更新签名 */
    const updateSignature = (id: string, updates: Partial<PdfSignatureInfo>) => {
        const sig = signatures.find((s) => s.id === id);
        if (!sig) return;
        Object.assign(sig, updates);
    };

    /** 删除签名 */
    const removeSignature = (id: string) => {
        const idx = signatures.findIndex((s) => s.id === id);
        if (idx < 0) return;
        signatures.splice(idx, 1);
        if (selectedSignatureId.value === id) {
            selectedSignatureId.value = null;
            selectedSignature.value = null;
        }
    };

    /** 选中签名 */
    const selectSignature = (id: string | null) => {
        selectedSignatureId.value = id;
        selectedSignature.value = id ? signatures.find((s) => s.id === id) ?? null : null;
    };

    /** 移动签名 */
    const moveSignature = (id: string, x: number, y: number) => {
        const sig = signatures.find((s) => s.id === id);
        if (!sig) return;
        sig.x = x;
        sig.y = y;
    };

    /** 获取签名数据 */
    const getData = () => ({
        signatures: JSON.parse(JSON.stringify(signatures)),
        enableCertificate: enableCertificate.value,
        penColor: penColor.value,
        penWidth: penWidth.value,
    });

    /** 加载 */
    const loadData = (data: { signatures: PdfSignatureInfo[]; enableCertificate?: boolean; penColor?: string; penWidth?: number }) => {
        signatures.splice(0, signatures.length, ...JSON.parse(JSON.stringify(data.signatures)));
        enableCertificate.value = data.enableCertificate ?? false;
        penColor.value = data.penColor ?? "#000000";
        penWidth.value = data.penWidth ?? 2;
        selectedSignatureId.value = null;
        selectedSignature.value = null;
    };

    return {
        signatures,
        selectedSignatureId,
        selectedSignature,
        penColor,
        penWidth,
        enableCertificate,
        addSignature,
        updateSignature,
        removeSignature,
        selectSignature,
        moveSignature,
        getData,
        loadData,
    };
};

export type PdfSigner = ReturnType<typeof usePdfSigner>;
