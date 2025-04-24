import { getRequest, postRequest } from '@/api/star_horse_apis.ts';

/**
 * 获取角色菜单
 * @param idRolesinfo
 */
export async function loadRolesMenus(idRolesinfo: number) {
  let roleMenus: any = [];
  await getRequest(`/system-config/system/rolesinfoEntity/roleAuthorityPageList/${idRolesinfo}`)
    .then((res) => {
      if (res.data.code != 0) {
        console.warn(res.data.cnMessage);
      } else {
        roleMenus = res.data.data;
      }
    })
    .catch((err) => console.error(err));
  return roleMenus;
}

/**
 * 分配角色菜单
 * @param roleId
 * @param menuIds
 */
export function submitMenus(roleId: string, menuIds: Array<string>) {
  postRequest(`/system-config/system/rolesMenusinfo/roleMenuAuthority/${roleId}`, menuIds).then((res) => {
    if (res.data.data) {
    }
  });
}
