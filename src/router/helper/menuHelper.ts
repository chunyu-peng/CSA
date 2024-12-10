import { AppRouteModule } from '/@/router/types';
import type { MenuModule, Menu, AppRouteRecordRaw } from '/@/router/types';
import { findPath, treeMap } from '/@/utils/helper/treeHelper';
import { cloneDeep } from 'lodash-es';
import { isUrl } from '/@/utils/is';
import { RouteParams } from 'vue-router';
import { toRaw } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';

export function getAllParentPath<T = Recordable>(treeData: T[], path: string) {
  const menuList = findPath(treeData, (n) => n.path === path) as Menu[];
  return (menuList || []).map((item) => item.path);
}

function joinParentPath(menus: Menu[], parentPath = '') {
  for (let index = 0; index < menus.length; index++) {
    const menu = menus[index];
    // https://next.router.vuejs.org/guide/essentials/nested-routes.html
    // Note that nested paths that start with / will be treated as a root path.
    // This allows you to leverage the component nesting without having to use a nested URL.
    if (!(menu.path.startsWith('/') || isUrl(menu.path))) {
      // path doesn't start with /, nor is it a url, join parent path
      menu.path = `${parentPath}/${menu.path}`;
    }
    if (menu?.children?.length) {
      joinParentPath(menu.children, menu.meta?.hidePathForChildren ? parentPath : menu.path);
    }
  }
}

// Parsing the menu module
export function transformMenuModule(menuModule: MenuModule): Menu {
  const { menu } = menuModule;

  const menuList = [menu];

  joinParentPath(menuList);
  return menuList[0];
}

export function transformRouteToMenu(routeModList: AppRouteModule[], routerMapping = false) {
  const cloneRouteModList = cloneDeep(routeModList);
  const routeList: AppRouteRecordRaw[] = [];

  cloneRouteModList.forEach((item) => {
    if (routerMapping && item.meta.hideChildrenInMenu && typeof item.redirect === 'string') {
      item.path = item.redirect;
    }
    if (item.meta?.single) {
      const realItem = item?.children?.[0];
      realItem && routeList.push(realItem);
    } else {
      routeList.push(item);
    }
  });
  const list = treeMap(routeList, {
    conversion: (node: AppRouteRecordRaw) => {
      const { meta: { title, hideMenu = false } = {} } = node;

      return {
        ...(node.meta || {}),
        meta: node.meta,
        name: title,
        hideMenu,
        alwaysShow: node.alwaysShow || false,
        path: node.path,
        ...(node.redirect ? { redirect: node.redirect } : {}),
      };
    },
  });
  joinParentPath(list);
  return cloneDeep(list);
}

/**
 * config menu with given params
 */
const menuParamRegex = /(?::)([\s\S]+?)((?=\/)|$)/g;
export function configureDynamicParamsMenu(menu: Menu, params: RouteParams) {
  const { path, paramPath } = toRaw(menu);
  let realPath = paramPath ? paramPath : path;
  const matchArr = realPath.match(menuParamRegex);

  matchArr?.forEach((it) => {
    const realIt = it.substr(1);
    if (params[realIt]) {
      realPath = realPath.replace(`:${realIt}`, params[realIt] as string);
    }
  });
  // save original param path.
  if (!paramPath && matchArr && matchArr.length > 0) {
    menu.paramPath = path;
  }
  menu.path = realPath;
  // children
  menu.children?.forEach((item) => configureDynamicParamsMenu(item, params));
}

/**
 * 扁平数组转树结构
 * @private
 * @param {IMenuData[]} menus
 * @param current id
 * @returns {IMenuData[]}
 * @memberof StartupService
 */
export function normalizedTreeByFlatArr(menus: any = [], current: string) {
  const normalizedTree: any = [];
  // 清除权限菜单数据
  // if (this.permissionMenus.size > 0) {
  //   this.permissionMenus.clear();
  // }
  menus.forEach((menu) => {
    // 编辑权限时限制不可选择自身为上级菜单
    if (current && menu.id === current) {
      menu.disabled = true;
    }
    if (menu.parentId === '0' && menu.status.value === 1) {
      menu.component = _asyncRoutes[menu.name] || 'layouts/default/index';
      if (menu.route) {
        // this.permissionMenus.add(menu.route);
      }
      const node = recursiveData(menu, menus);
      normalizedTree.push(node);
    } else {
      /**
       * 动态匹配出组件路径名称
       */
      menu.component = _asyncRoutes[menu.name] || '/sys/exception/Exception.vue';
    }
  });
  normalizedTree.sort((a, b) => {
    if (a.sort === null) {
      return 1;
    }
    if (b.sort === null) {
      return -1;
    }
    return a.sort - b.sort > 0 ? 1 : -1;
  });
  return normalizedTree;
}

/**
 * 递归子节点
 * @private
 * @param {IMenuData} curMenu
 * @param {IMenuData[]} menus
 * @returns
 * @memberof StartupService
 */
export function recursiveData(curMenu: any = {}, menus: any = []) {
  const children = [];
  if (curMenu.cssClass) {
    if (curMenu.cssClass.startsWith('crrc')) {
      curMenu.cssClass = `crrc ${curMenu.cssClass}`;
    } else {
      curMenu.cssClass = `ant-design:${curMenu.cssClass}`;
    }
  }
  curMenu.meta = {
    icon: curMenu?.cssClass,
    title: curMenu.name,
    ignoreRoute: false,
    single: true,
  };
  curMenu.path = curMenu.route;
  if (curMenu.status === 1) {
    curMenu.hidden = true;
  } else {
    curMenu.hidden = false;
  }
  menus.forEach((element: any) => {
    if (element.parentId === curMenu.id && element.status.value === 1) {
      const { route } = element;
      element.path = route;
      recursiveData(element, menus);
      children.push(element);
    }
  });
  if (children.length > 0) {
    curMenu.children = children;
  }
  return curMenu;
}

/**
 * 路由树结构转扁平数组
 * 找出所有页面的组件路由目录
 */
const _asyncRoutes = {};
export function transformAsyncRoutes(asyncRoutes) {
  const { t } = useI18n();
  asyncRoutes.forEach((item: AppRouteRecordRaw) => {
    const { componentUrl = '', meta } = item;
    _asyncRoutes[t(meta.title)] = componentUrl;
    if (item?.children && item?.children.length) {
      transformAsyncRoutes(item.children);
    }
  });
}
