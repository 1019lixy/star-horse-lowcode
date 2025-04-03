/**
 * 客户端生成唯一指纹
 */
import FingerprintJS from '@fingerprintjs/fingerprintjs';
// 初始化 FingerprintJS
const fpPromise = FingerprintJS.load();

function getLocalIp() {
    return new Promise((resolve) => {
        const pc = new RTCPeerConnection({ iceServers: [] });
        pc.createDataChannel('');

        pc.createOffer().then(offer =>
            pc.setLocalDescription(offer)
        ).catch(err => console.error(err));

        pc.onicecandidate = (ice:any) => {
            if (ice.candidate) {
                const ip = ice.candidate.address ||
                    ice.candidate.ip ||
                    /([0-9]{1,3}(\.[0-9]{1,3}){3})/.exec(ice.candidate.candidate)?.[1];
                resolve(ip);
                pc.close();
            }
        };
    });
}

// 获取硬件信息
function getHardwareInfo() {
    const hardwareInfo = {
        cpuCores: navigator.hardwareConcurrency,
        deviceMemory: navigator.deviceMemory,
        screenSize: {width: window.screen.width, height: window.screen.height},
        gpuInfo: {},
    };
    getLocalIp().then(ip => console.log('本地IP:', ip));
    // 获取 GPU 信息
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');
    if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
            hardwareInfo.gpuInfo = {
                vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
                renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
            };
        }
    }
    return hardwareInfo;
}

/**
 * 生成设备 ID
 * @param userIp
 */
export async function generateDeviceId(userIp: string) {
    let browserFinger = "";
    let hardwareInfo = getHardwareInfo();
    if (!userIp) {
        userIp = window.location.hostname;
    }

    // 获取浏览器指纹
    await fpPromise.then(fp => fp.get())
        .then(result => {
            browserFinger = result.visitorId; // 浏览器指纹
            console.log('Browser Fingerprint:', browserFinger);
        });
    const data = {browserFinger, hardwareInfo, userIp}
    let deviceId = btoa(JSON.stringify(data));
    localStorage.setItem('deviceId', deviceId);
    return deviceId; // 使用 Base64 编码生成设备 ID
}

/**
 * 获取设备 ID
 */
export function getFingerId() {
    return localStorage.getItem('deviceId');
}

