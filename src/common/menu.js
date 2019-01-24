import { isUrl } from '../utils/utils';

const menuData = [
  // {
  // name: '概述',
  // path: 'Summary',
  // icon: 'dot-chart',
  // },
  // {
  // name: '试用组',
  // icon: 'user',
  // path: 'trial',
  // children: [{
  //   name: '试用组管理',
  //   path: 'trialManagement',
  // },
  //   // {
  //   // name: '用户列表',
  //   // path: 'userlist',
  //   //   }
  //   ],
  // },
  {
    name: '优惠码',
    icon: 'calendar',
    path: 'Discount',
    children: [{
      name: '优惠码管理',
      path: 'DiscountAdministration',
    },
      // {
      // name: '子码列表',
      // path: 'SubcodeList',
      //   }
    ],
  },
  // {
  // name: '试用查看详情',
  // icon: 'pay-circle-o',
  // path: 'trial/viewDetails',
  // },
  // {
  // name: '优惠编辑备注',
  // icon: 'pay-circle-o',
  // path: 'Discount/Editorsnote',
  // },
  {
    name: '提现列表',
    icon: 'pay-circle-o',
    path: 'Withdrawals',
  },
  {
    name: '账户',
    icon: 'user',
    path: 'user',
    authority: 'guest',
    children: [{
      name: '登录',
      path: 'login',
    }],
  }
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map((item) => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
