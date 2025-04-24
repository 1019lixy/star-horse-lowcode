/**
 * 初始化fieldList参数
 * @param {object} data 数据源
 * @param {object} rule 规则 eq lk
 */
export const initFieldList = (data: any, rule: any = {}) => {
  // 如果不是对象直接返回空数组
  if (Object.prototype.toString.call(data) !== '[object Object]') return [];
  return Object.keys(data).reduce((prev: any, key: string) => {
    const operator = rule[key] || 'eq';
    prev.push({ propertyName: key, operation: operator, value: data[key] });
    return prev;
  }, []);
};
/**
 * 数组组合成
 * @param {tree} data tree
 * @returns any[]
 */
/**
 * 构建树形结构数据
 * @param {*} data
 * @param users
 */
export const buildCascaderDept = (data: any, users: any) => {
  const res = [];
  // 找出所有根节点
  for (const item of data) {
    /** 首先遍历data */
    if (item.parentid === '2') {
      const id = item.id;
      let b = [];
      data = data.filter((b: any) => b.id !== id);
      item.children = getNode1(item.id, item);
      if (item.department_leader) {
        b =
          users
            .filter((u: any) => u?.department?.includes(item.id))
            ?.map((item: any) => {
              const o = { ...item };
              o.label = item.name;
              o.value = `${id}_${item.userid}`;
              return o;
            }) || [];
        item.children.unshift(...b);
      }
      item.selectable = false;
      item.value = id;
      item.label = item.name;
      res.push(item);
    }
  }

  // 传入根节点id 递归查找所有子节点
  function getNode1(id: any, _temp: any) {
    const node = [];
    for (const d of data) {
      if (+d.parentid === +id) {
        /** 如果有部门负责人就直接复制children */
        // const b:Array<any> = [];
        d.children = getNode1(d.id, d);
        if (d.id) {
          const a =
            loopData(users, d.id, true)?.map((item: any) => {
              const o = { ...item };
              o.label = item.name;
              o.value = `${d.id}_${item.userid}`;
              return o;
            }) || [];
          const userids = d.children.map((item: any) => item.userid);
          const s = a.filter((a: any) => !userids.includes(a.userid));
          d.children.unshift(...s);
        }
        d.selectable = false;
        d.label = d.name;
        d.value = d.id;
        node.push(d);
      }
    }
    if (node.length === 0) {
      return loopData(users, id, true);
    }
    return node;
  }

  return res;
};

function loopData(data: any, ids: any, flag: boolean) {
  let arr = [];
  if (flag) {
    arr = data.filter((item: any) => item.mainDepartment.includes(ids));
    return arr.map((item: any) => {
      const o = { ...item };
      o.value = `${ids}_${item.userid}`;
      o.label = item.name;
      return o;
    });
  }
  return data.filter((item: any) => ids.includes(item.userid));
}
