let memoryUsage: number[] = [];

export const startPerfMonitor = () => {
  setInterval(() => {
    // @ts-ignore
    const memory = performance.memory;
    if (memory) {
      memoryUsage.push(memory.usedJSHeapSize);
      if (memoryUsage.length > 60) {
        memoryUsage.shift();
      }
      
      if (memory.usedJSHeapSize > 500_000_000) { // 500MB阈值
        console.warn('内存使用过高:', memory);
      }
    }
  }, 5000);
};
