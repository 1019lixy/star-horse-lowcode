import { ElMessageBox } from "element-plus";
import Message from "vue-m-message";
import "vue-m-message/dist/style.css";
import { i18n } from "@/lang";
import { isMobile } from "@/api/device";

export const operationConfirm = (msg: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    ElMessageBox.confirm(msg, i18n("message.warning"), {
      confirmButtonText: i18n("message.confirm"),
      cancelButtonText: i18n("message.cancel"),
      type: "warning",
    })
      .then(() => {
        resolve(true);
      })
      .catch(() => {
        reject(false);
      });
  });
};
/**
 * 消息提
 * @param msg 消息内容
 * @param type 类型
 * @param duration 持续时间
 * @param title 标题
 * @param position 位置
 */
export const message = (
  msg: string,
  type: any = "info",
  duration: number = 2000,
  title: string = i18n("message.prompt"),
  position: any = "top-right",
) => {
  Message({
    message: msg,
    type: type ?? "info",
    duration: duration,
    title: title,
    position: position,
    closable: true,
    collapsable: true,
    isCollapsed: false,
    supportHTML: true,
    width: "350px",
    stopTimerOnHover: true,
  });
};
/**
 * 成功提示
 * @param msg 消息内容
 */
export const success = (msg: string) => {
  message(
    msg,
    "success",
    3000,
    i18n("message.success"),
    isMobile ? "top-right" : "bottom-right",
  );
};
/**
 * 警告提示
 * @param msg 消息内容
 */
export const warning = (msg: string) => {
  message(
    msg,
    "warning",
    3000,
    i18n("message.warning"),
    isMobile ? "top-right" : "bottom-right",
  );
};
/**
 * 错误提示
 * @param msg 消息内容
 */
export const error = (msg: string) => {
  message(
    msg,
    "error",
    3000,
    i18n("message.error"),
    isMobile ? "top-right" : "bottom-right",
  );
};
