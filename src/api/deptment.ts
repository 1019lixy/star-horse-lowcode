import { postRequest } from '@/api/star_horse_apis';
import { SelectOption } from '@/components/types/SearchProps';

const deptAndUserTree: string = '/system-config/system/departmentEntity/deptAndUserTree';

/**
 * 获取部门用户
 * @param direct
 * @param params
 */
// @typescript-eslint/no-unused-vars
export async function loadDeptUser(direct: boolean, params: any) {
  let menuDatas: Array<SelectOption> = [];
  await postRequest(deptAndUserTree, {
    fieldList: params
  })
    .then((res) => {
      const redata = res.data;
      if (redata.code != 0) {
        console.warn(redata.cnMessage);
      } else {
        if (direct) {
          menuDatas = redata.data;
        } else {
          //构建用户部门树
          menuDatas = createDeptUserTree(redata.data, '', 'deptName', 'idDepartment');
        }
      }
    })
    .catch((err) => {
      console.error(err);
    });
  return menuDatas;
}

/**
 * 解析部门信息
 * @param datas
 * @param valField
 * @param name
 * @param val
 */
export function createDeptUserTree(datas: any, valField: string, name: string, val: string) {
  const deptUserList: Array<SelectOption> = [];
  datas.forEach((item: any) => {
    const temp: any = {};
    temp['value'] = valField ? item[valField] : parseInt(item[val]);
    temp['name'] = item[name];
    temp['children'] = [];
    const userList = item['userList'];
    if (item.children && item.children.length > 0) {
      temp['children'] = createDeptUserTree(item.children, valField, name, val);
    }
    userList.forEach((item: any) => {
      temp['children'].push({
        name: item.userName + '(' + item.name + ')',
        value: item.idUsersinfo
      });
    });
    deptUserList.push(temp);
  });
  return deptUserList;
}

/**
 * 解析部门信息
 * @param datas
 * @param valField
 * @param name
 * @param val
 */
export function analysisData(datas: any, valField: string, name: string, val: string) {
  const listNames: Array<string> = [],
    listValues: Array<number> = [];
  datas.forEach((item: any) => {
    const temp: any = {};
    temp['value'] = valField ? item[valField] : parseInt(item[val]);
    temp['name'] = item[name];
    listNames.push(temp['name']);
    listValues.push(temp['value']);
    if (item.children && item.children.length > 0) {
      temp['children'] = analysisData(item.children, valField, name, val);
      listNames.push(...temp['children']['listNames']);
      listValues.push(...temp['children']['listValues']);
    }
  });
  return {
    listNames,
    listValues
  };
}
