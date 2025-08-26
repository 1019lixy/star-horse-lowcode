// Benchmark to compare performance improvements
function benchmark() {
  // Create a test dataset
  const createTestData = () => {
    const data: any[] = [];
    for (let i = 0; i < 1000; i++) {
      data.push({
        fieldName: `field_${i}`,
        defaultValue: i % 2 === 0 ? `value_${i}` : { nested: { key: i } },
        aliasName: i % 10 === 0 ? `alias_${i}` : undefined,
        actions: i % 50 === 0 ? { change: () => {} } : undefined
      });
    }
    return data;
  };

  // Test Object.assign vs object spreading
  const testData = createTestData();
  
  // Test object spreading (original approach)
  console.time('Object Spreading');
  for (let i = 0; i < 100; i++) {
    const result: any = {};
    testData.forEach(item => {
      if (item.defaultValue && typeof item.defaultValue === 'object' && !Array.isArray(item.defaultValue)) {
        const spread = { ...result, ...item.defaultValue };
        Object.keys(spread).forEach(key => {
          result[key] = spread[key];
        });
      }
    });
  }
  console.timeEnd('Object Spreading');
  
  // Test Object.assign (optimized approach)
  console.time('Object.assign');
  for (let i = 0; i < 100; i++) {
    const result: any = {};
    testData.forEach(item => {
      if (item.defaultValue && typeof item.defaultValue === 'object' && !Array.isArray(item.defaultValue)) {
        Object.assign(result, item.defaultValue);
      }
    });
  }
  console.timeEnd('Object.assign');
  
  // Test for...in vs for...of with index
  const largeArray = new Array(10000).fill(0).map((_, i) => i);
  
  console.time('for...in');
  let sum1 = 0;
  for (const key in largeArray) {
    sum1 += largeArray[key];
  }
  console.timeEnd('for...in');
  
  console.time('for...of with index');
  let sum2 = 0;
  for (let i = 0; i < largeArray.length; i++) {
    sum2 += largeArray[i];
  }
  console.timeEnd('for...of with index');
  
  console.log('Benchmark completed');
}

benchmark();