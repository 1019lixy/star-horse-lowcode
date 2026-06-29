/**
 * ImagePreview - 可配置的图片预览工具
 * 支持淡入淡出、3D翻转等过渡动画，支持丰富的配置项
 */

import { i18n } from "@/lang";

/** 过渡动画类型 */
export type ImageTransition = "fade" | "slide" | "zoom" | "flip3d" | "none";

/** 图片预览配置 */
export interface ImagePreviewOptions {
  /** 过渡动画类型，默认 fade */
  transition?: ImageTransition;
  /** 过渡动画时长(ms)，默认 300 */
  transitionDuration?: number;
  /** 背景色，默认 rgba(0,0,0,0.85) */
  overlayBackground?: string;
  /** 是否显示工具栏，默认 true */
  showToolbar?: boolean;
  /** 是否显示缩略图栏，默认 true（多图时） */
  showThumbnails?: boolean;
  /** 是否显示左右箭头，默认 true（多图时） */
  showArrows?: boolean;
  /** 是否启用键盘导航，默认 true */
  keyboardNavigation?: boolean;
  /** 是否启用鼠标滚轮缩放，默认 true */
  wheelZoom?: boolean;
  /** 是否启用拖拽平移，默认 true */
  draggable?: boolean;
  /** 初始索引，默认 0 */
  initialIndex?: number;
  /** 缩略图高度(px)，默认 48 */
  thumbnailSize?: number;
  /** 箭头大小(px)，默认 52 */
  arrowSize?: number;
  /** 关闭回调 */
  onClose?: () => void;
  /** 切换回调 */
  onSwitch?: (index: number) => void;
}

const DEFAULT_OPTIONS: ImagePreviewOptions = {
  transition: "fade",
  transitionDuration: 300,
  overlayBackground: "rgba(0,0,0,0.85)",
  showToolbar: true,
  showThumbnails: true,
  showArrows: true,
  keyboardNavigation: true,
  wheelZoom: true,
  draggable: true,
  initialIndex: 0,
  thumbnailSize: 48,
  arrowSize: 52,
};

export class ImagePreview {
  private images: string[];
  private options: ImagePreviewOptions;
  private currentIndex = 0;
  private scale = 1;
  private rotation = 0;
  private translateX = 0;
  private translateY = 0;
  private isDragging = false;
  private dragStartX = 0;
  private dragStartY = 0;
  private isTransitioning = false;

  private overlay!: HTMLDivElement | HTMLImageElement | HTMLSpanElement;
  private imgWrap!: HTMLDivElement | HTMLImageElement | HTMLSpanElement;
  private img!: HTMLDivElement | HTMLImageElement | HTMLSpanElement;
  private imgBack!: HTMLDivElement | HTMLImageElement | HTMLSpanElement;
  private toolbar!: HTMLDivElement | HTMLImageElement | HTMLSpanElement;
  private thumbBar!: HTMLDivElement | HTMLImageElement | HTMLSpanElement;
  private counter!: HTMLSpanElement;
  private arrowLeft!: HTMLDivElement | HTMLImageElement | HTMLSpanElement;
  private arrowRight!: HTMLDivElement | HTMLImageElement | HTMLSpanElement;
  private prevBtn!: HTMLButtonElement;
  private nextBtn!: HTMLButtonElement;
  private thumbs: (HTMLDivElement | HTMLImageElement | HTMLSpanElement)[] = [];

  private boundOnMouseMove: (e: MouseEvent) => void;
  private boundOnMouseUp: () => void;
  private boundOnKeydown: (e: KeyboardEvent) => void;

  constructor(images: string | string[], options?: ImagePreviewOptions) {
    this.images = Array.isArray(images) ? images : [images];
    if (this.images.length === 0) return;
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.currentIndex = this.options.initialIndex || 0;

    this.boundOnMouseMove = this.onMouseMove.bind(this);
    this.boundOnMouseUp = this.onMouseUp.bind(this);
    this.boundOnKeydown = this.onKeydown.bind(this);

    this.build();
    this.bindEvents();
    this.loadImage(this.currentIndex, false);
    document.body.appendChild(this.overlay);
  }

  /** 关闭预览 */
  close() {
    this.cleanup();
    this.overlay.remove();
    this.options.onClose?.();
  }

  /** 切换到指定索引 */
  goTo(index: number) {
    if (index < 0 || index >= this.images.length || index === this.currentIndex)
      return;
    this.loadImage(index);
  }

  /** 上一张 */
  prev() {
    if (this.images.length <= 1) return;
    this.goTo(
      (this.currentIndex - 1 + this.images.length) % this.images.length,
    );
  }

  /** 下一张 */
  next() {
    if (this.images.length <= 1) return;
    this.goTo((this.currentIndex + 1) % this.images.length);
  }

  // ========== 构建 DOM ==========

  private build() {
    const opts = this.options;
    const isMulti = this.images.length > 1;

    // 遮罩层
    this.overlay = this.el(
      "div",
      `
            position:fixed;inset:0;z-index:99999;
            background:${opts.overlayBackground};
            display:flex;align-items:center;justify-content:center;
            font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
            user-select:none;cursor:default;
            opacity:0;transition:opacity 0.25s ease;
        `,
    );
    requestAnimationFrame(() => {
      this.overlay.style.opacity = "1";
    });

    // 图片容器
    this.imgWrap = this.el(
      "div",
      `
            position:relative;display:flex;align-items:center;justify-content:center;
            width:100%;height:100%;overflow:hidden;
            perspective:1200px;
        `,
    );

    // 主图
    this.img = this.el(
      "img",
      `
            max-width:90vw;max-height:85vh;object-fit:contain;
            cursor:grab;pointer-events:auto;
            position:absolute;transition:transform 0.15s ease, opacity 0s;
        `,
    );

    // 3D翻转用的背面图
    this.imgBack = this.el(
      "img",
      `
            max-width:90vw;max-height:85vh;object-fit:contain;
            position:absolute;backface-visibility:hidden;
            pointer-events:none;opacity:0;
        `,
    );

    this.imgWrap.append(this.img, this.imgBack);

    // 工具栏
    if (opts.showToolbar) {
      this.buildToolbar(isMulti);
    }

    // 缩略图
    if (opts.showThumbnails && isMulti) {
      this.buildThumbnails();
    }

    // 箭头
    if (opts.showArrows && isMulti) {
      this.buildArrows();
    }

    this.overlay.append(this.imgWrap);
    if (this.toolbar) this.overlay.appendChild(this.toolbar);
    if (this.thumbBar) this.overlay.appendChild(this.thumbBar);
    if (this.arrowLeft) this.overlay.append(this.arrowLeft, this.arrowRight);
  }

  private buildToolbar(isMulti: boolean) {
    this.toolbar = this.el(
      "div",
      `
            position:absolute;top:12px;left:50%;transform:translateX(-50%);
            display:flex;gap:4px;z-index:10;background:rgba(0,0,0,0.6);
            border-radius:6px;padding:4px 8px;
        `,
    );

    this.prevBtn = this.createBtn(i18n("image.preview.prev"), "‹", () =>
      this.prev(),
    );
    this.counter = this.el(
      "span",
      "color:#fff;font-size:14px;padding:0 8px;min-width:60px;text-align:center;",
    );
    this.nextBtn = this.createBtn(i18n("image.preview.next"), "›", () =>
      this.next(),
    );

    if (!isMulti) {
      this.prevBtn.style.display = "none";
      this.nextBtn.style.display = "none";
      this.counter.style.display = "none";
    }

    const zoomInBtn = this.createBtn(i18n("image.preview.zoomIn"), "+", () => {
      this.scale = Math.min(this.scale + 0.25, 5);
      this.updateImgTransform();
    });
    const zoomOutBtn = this.createBtn(
      i18n("image.preview.zoomOut"),
      "−",
      () => {
        this.scale = Math.max(this.scale - 0.25, 0.1);
        this.updateImgTransform();
      },
    );
    const rotateBtn = this.createBtn(i18n("image.preview.rotate"), "↻", () => {
      this.rotation += 90;
      this.updateImgTransform();
    });
    const fitBtn = this.createBtn(i18n("image.preview.fitWindow"), "⊡", () => {
      this.resetTransform();
    });
    const downloadBtn = this.createBtn(
      i18n("image.preview.download"),
      "⤓",
      () => {
        this.downloadImage();
      },
    );
    const closeBtn = this.createBtn(i18n("image.preview.close"), "✕", () =>
      this.close(),
    );

    this.toolbar.append(
      this.prevBtn,
      this.counter,
      this.nextBtn,
      zoomInBtn,
      zoomOutBtn,
      rotateBtn,
      fitBtn,
      downloadBtn,
      closeBtn,
    );
  }

  private buildThumbnails() {
    const size = this.options.thumbnailSize || 48;
    this.thumbBar = this.el(
      "div",
      `
            position:absolute;bottom:12px;left:50%;transform:translateX(-50%);
            display:flex;gap:6px;z-index:10;padding:6px 10px;
            background:rgba(0,0,0,0.5);border-radius:6px;max-width:90vw;overflow-x:auto;
        `,
    );

    this.thumbs = this.images.map((url, i) => {
      const t = this.el(
        "img",
        `
                width:${size}px;height:${size}px;object-fit:cover;border-radius:4px;
                border:2px solid transparent;cursor:pointer;opacity:0.6;
                transition:all 0.15s;flex-shrink:0;
            `,
      );
      t.src = url;
      t.onclick = () => this.goTo(i);
      t.onmouseenter = () => {
        t.style.opacity = "1";
      };
      t.onmouseleave = () => {
        t.style.opacity = i === this.currentIndex ? "1" : "0.6";
      };
      this.thumbBar!.appendChild(t);
      return t;
    });
  }

  private buildArrows() {
    const size = this.options.arrowSize || 52;
    const fontSize = Math.round(size * 0.6);

    const createArrow = (direction: "left" | "right", onClick: () => void) => {
      const arrow = this.el(
        "div",
        `
                position:absolute;top:50%;${direction === "left" ? "left:20px" : "right:20px"};
                transform:translateY(-50%);z-index:10;
                width:${size}px;height:${size}px;border-radius:50%;
                background:rgba(0,0,0,0.45);color:#fff;font-size:${fontSize}px;
                display:flex;align-items:center;justify-content:center;
                cursor:pointer;transition:background 0.2s;
                user-select:none;line-height:1;
            `,
      );
      arrow.innerHTML = direction === "left" ? "&#10094;" : "&#10095;";
      arrow.onmouseenter = () => {
        arrow.style.background = "rgba(0,0,0,0.8)";
      };
      arrow.onmouseleave = () => {
        arrow.style.background = "rgba(0,0,0,0.45)";
      };
      arrow.onclick = (e) => {
        e.stopPropagation();
        onClick();
      };
      return arrow;
    };

    this.arrowLeft = createArrow("left", () => this.prev());
    this.arrowRight = createArrow("right", () => this.next());
  }

  // ========== 图片加载与过渡 ==========

  private loadImage(index: number, animate = true) {
    if (this.isTransitioning) return;
    const isMulti = this.images.length > 1;
    const direction = index > this.currentIndex ? 1 : -1;
    const oldIndex = this.currentIndex;
    this.currentIndex = index;

    if (!animate || this.options.transition === "none" || oldIndex === index) {
      this.img.src = this.images[index];
      this.resetTransform();
      this.updateUI();
      return;
    }

    const transition = this.options.transition || "fade";
    const duration = this.options.transitionDuration || 300;

    switch (transition) {
      case "fade":
        this.transitionFade(index, duration);
        break;
      case "slide":
        this.transitionSlide(index, duration, direction);
        break;
      case "zoom":
        this.transitionZoom(index, duration);
        break;
      case "flip3d":
        this.transitionFlip3d(index, duration, direction);
        break;
      default:
        this.img.src = this.images[index];
        this.resetTransform();
        this.updateUI();
    }
  }

  /** 淡入淡出 */
  private transitionFade(index: number, duration: number) {
    this.isTransitioning = true;
    this.img.style.transition = `opacity ${duration / 2}ms ease`;
    this.img.style.opacity = "0";

    setTimeout(() => {
      this.img.src = this.images[index];
      this.resetTransform();
      this.img.style.opacity = "1";
      this.updateUI();
      setTimeout(() => {
        this.img.style.transition = "transform 0.15s ease, opacity 0s";
        this.isTransitioning = false;
      }, duration / 2);
    }, duration / 2);
  }

  /** 滑动切换 */
  private transitionSlide(index: number, duration: number, direction: number) {
    this.isTransitioning = true;
    const vw = window.innerWidth;

    this.img.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;
    this.img.style.transform = `translateX(${-direction * vw}px)`;
    this.img.style.opacity = "0";

    setTimeout(() => {
      this.img.src = this.images[index];
      this.resetTransform();
      this.img.style.transition = "none";
      this.img.style.transform = `translateX(${direction * vw}px)`;
      this.img.style.opacity = "0";

      requestAnimationFrame(() => {
        this.img.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;
        this.img.style.transform = "translate(0,0) scale(1) rotate(0deg)";
        this.img.style.opacity = "1";
        this.updateUI();
        setTimeout(() => {
          this.img.style.transition = "transform 0.15s ease, opacity 0s";
          this.isTransitioning = false;
        }, duration);
      });
    }, duration);
  }

  /** 缩放切换 */
  private transitionZoom(index: number, duration: number) {
    this.isTransitioning = true;
    this.img.style.transition = `transform ${duration / 2}ms ease, opacity ${duration / 2}ms ease`;
    this.img.style.transform = "scale(0.3)";
    this.img.style.opacity = "0";

    setTimeout(() => {
      this.img.src = this.images[index];
      this.resetTransform();
      this.img.style.transition = "none";
      this.img.style.transform = "scale(1.3)";
      this.img.style.opacity = "0";

      requestAnimationFrame(() => {
        this.img.style.transition = `transform ${duration / 2}ms ease, opacity ${duration / 2}ms ease`;
        this.img.style.transform = "scale(1)";
        this.img.style.opacity = "1";
        this.updateUI();
        setTimeout(() => {
          this.img.style.transition = "transform 0.15s ease, opacity 0s";
          this.isTransitioning = false;
        }, duration / 2);
      });
    }, duration / 2);
  }

  /** 3D翻转 */
  private transitionFlip3d(index: number, duration: number, direction: number) {
    this.isTransitioning = true;
    const half = duration / 2;
    const rotateY = direction > 0 ? 90 : -90;

    // 准备背面图
    this.imgBack.src = this.images[index];
    this.imgBack.style.opacity = "1";
    this.imgBack.style.transform = `rotateY(${-rotateY}deg)`;

    // 前图翻出
    this.img.style.transition = `transform ${half}ms ease-in, opacity ${half}ms ease-in`;
    this.img.style.transform = `rotateY(${rotateY}deg)`;
    this.img.style.opacity = "0";

    setTimeout(() => {
      // 切换
      this.img.src = this.images[index];
      this.resetTransform();
      this.img.style.transition = "none";
      this.img.style.transform = `rotateY(${-rotateY}deg)`;
      this.img.style.opacity = "0";

      this.imgBack.style.transition = "none";
      this.imgBack.style.transform = `rotateY(${-rotateY}deg)`;

      requestAnimationFrame(() => {
        // 前图翻入
        this.img.style.transition = `transform ${half}ms ease-out, opacity ${half}ms ease-out`;
        this.img.style.transform = "rotateY(0deg)";
        this.img.style.opacity = "1";

        this.imgBack.style.transition = `transform ${half}ms ease-out, opacity ${half}ms ease-out`;
        this.imgBack.style.transform = "rotateY(0deg)";
        this.imgBack.style.opacity = "0";

        this.updateUI();
        setTimeout(() => {
          this.img.style.transition = "transform 0.15s ease, opacity 0s";
          this.imgBack.style.transition = "none";
          this.imgBack.style.opacity = "0";
          this.isTransitioning = false;
        }, half);
      });
    }, half);
  }

  // ========== 交互 ==========

  private bindEvents() {
    if (this.options.draggable) {
      this.imgWrap.onmousedown = (e) => {
        // 只响应左键
        if (e.button !== 0) return;
        this.isDragging = true;
        this.dragStartX = e.clientX - this.translateX;
        this.dragStartY = e.clientY - this.translateY;
        this.img.style.cursor = "grabbing";
        this.img.style.transition = "none";
        e.preventDefault();
      };
      document.addEventListener("mousemove", this.boundOnMouseMove);
      window.addEventListener("mouseup", this.boundOnMouseUp);
    }

    if (this.options.wheelZoom) {
      this.img.onwheel = (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        this.scale = Math.max(0.1, Math.min(5, this.scale + delta));
        this.updateImgTransform();
      };
    }

    if (this.options.keyboardNavigation) {
      document.addEventListener("keydown", this.boundOnKeydown);
    }
  }

  private onMouseMove(e: MouseEvent) {
    if (!this.isDragging) return;
    e.preventDefault();
    this.translateX = e.clientX - this.dragStartX;
    this.translateY = e.clientY - this.dragStartY;
    this.updateImgTransform();
  }

  private onMouseUp() {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.img.style.cursor = "grab";
    this.img.style.transition = "transform 0.15s ease, opacity 0s";
  }

  private onKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      this.close();
    } else if (e.key === "ArrowLeft" && this.images.length > 1) {
      this.prev();
    } else if (e.key === "ArrowRight" && this.images.length > 1) {
      this.next();
    } else if (e.key === "+" || e.key === "=") {
      this.scale = Math.min(this.scale + 0.25, 5);
      this.updateImgTransform();
    } else if (e.key === "-") {
      this.scale = Math.max(this.scale - 0.25, 0.1);
      this.updateImgTransform();
    } else if (e.key === "r" || e.key === "R") {
      this.rotation += 90;
      this.updateImgTransform();
    }
  }

  // ========== 工具方法 ==========

  private resetTransform() {
    this.scale = 1;
    this.rotation = 0;
    this.translateX = 0;
    this.translateY = 0;
    this.updateImgTransform();
  }

  private updateImgTransform() {
    this.img.style.transform = `translate(${this.translateX}px,${this.translateY}px) scale(${this.scale}) rotate(${this.rotation}deg)`;
  }

  private updateUI() {
    const isMulti = this.images.length > 1;
    if (this.counter) {
      this.counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
    }
    if (this.prevBtn)
      this.prevBtn.style.visibility = isMulti ? "visible" : "hidden";
    if (this.nextBtn)
      this.nextBtn.style.visibility = isMulti ? "visible" : "hidden";
    this.updateThumbActive();
    this.options.onSwitch?.(this.currentIndex);
  }

  private updateThumbActive() {
    this.thumbs.forEach((t, i) => {
      t.style.border =
        i === this.currentIndex ? "2px solid #409eff" : "2px solid transparent";
      t.style.opacity = i === this.currentIndex ? "1" : "0.6";
    });
    const activeThumb = this.thumbs[this.currentIndex];
    if (activeThumb) {
      activeThumb.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }

  private downloadImage() {
    const url = this.images[this.currentIndex];
    const filename = url.split("/").pop()?.split("?")[0] || "image.png";

    // 显示下载提示
    const tip = this.el(
      "div",
      `
            position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:100001;
            background:rgba(0,0,0,0.75);color:#fff;padding:16px 28px;border-radius:8px;
            font-size:14px;display:flex;align-items:center;gap:10px;
            pointer-events:none;
        `,
    );
    const spinner = this.el(
      "div",
      `
            width:18px;height:18px;border:2px solid rgba(255,255,255,0.3);
            border-top-color:#fff;border-radius:50%;
            animation:imgPreviewSpin 0.6s linear infinite;
        `,
    );
    const text = this.el("span", "color:#fff;font-size:14px;");
    text.textContent = i18n("image.preview.downloading") || "下载中...";
    tip.append(spinner, text);
    document.body.appendChild(tip);

    // 添加旋转动画
    if (!document.getElementById("img-preview-spin-style")) {
      const style = document.createElement("style");
      style.id = "img-preview-spin-style";
      style.textContent =
        "@keyframes imgPreviewSpin { to { transform: rotate(360deg); } }";
      document.head.appendChild(style);
    }

    try {
      fetch(url, { mode: "cors" })
        .then((res) => {
          if (!res.ok) throw new Error("fetch failed");
          return res.blob();
        })
        .then((blob) => {
          const blobUrl = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = blobUrl;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(blobUrl);
          tip.remove();
        })
        .catch(() => {
          tip.remove();
          window.open(url, "_blank");
        });
    } catch {
      tip.remove();
      window.open(url, "_blank");
    }
  }

  private cleanup() {
    document.removeEventListener("mousemove", this.boundOnMouseMove);
    window.removeEventListener("mouseup", this.boundOnMouseUp);
    document.removeEventListener("keydown", this.boundOnKeydown);
  }

  private el(
    tag: string,
    css: string,
  ): HTMLDivElement | HTMLImageElement | HTMLSpanElement {
    const element = document.createElement(tag);
    element.style.cssText = css;
    return element;
  }

  private createBtn(
    title: string,
    text: string,
    onClick: () => void,
  ): HTMLButtonElement {
    const btn = document.createElement("button");
    btn.title = title;
    btn.textContent = text;
    btn.style.cssText = `
            background:none;border:1px solid rgba(255,255,255,0.3);color:#fff;
            padding:4px 10px;border-radius:4px;cursor:pointer;font-size:14px;
            line-height:1;transition:background 0.15s;
        `;
    btn.onmouseenter = () => {
      btn.style.background = "rgba(255,255,255,0.15)";
    };
    btn.onmouseleave = () => {
      btn.style.background = "none";
    };
    btn.onclick = onClick;
    return btn;
  }
}

/**
 * 兼容旧接口 - 图片预览
 * @param images 图片URL数组或单个URL
 * @param options 预览配置
 */
export function imagesPreview(
  images: Array<string> | string,
  options?: ImagePreviewOptions,
) {
  return new ImagePreview(images, options);
}
