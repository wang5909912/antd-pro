import { getchanneltoken } from '../services/user';
import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';

export default {
  namespace: 'login',

  state: {
    isloading: false,
    status: false,
    rendermessage: undefined,
  },

  effects: {
    *getToken({ payload }, { call, put }) {
      const response = yield call(getchanneltoken, payload);
      let currentAuthority = '';
      if (response.code == 0) {
        window.localStorage.setItem('token', 'Bear ' + response.body.token);
        window.localStorage.setItem('username', response.body.username);
        currentAuthority = 'admin';
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            currentAuthority,
          },
        });
        reloadAuthorized();   //更新权限
        yield put(routerRedux.push('/'));
      } else {
        currentAuthority = 'guest';
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: true,
            currentAuthority,
            rendermessage: response.message
          },
        });
      }
    },
    *logout(_, { call, put, select }) {
      try {
        // get location pathname
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        // add the parameters in the url
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
        window.localStorage.removeItem('token');
      } finally {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            currentAuthority: '',
          },
        });
        reloadAuthorized();
        yield put(routerRedux.push('/user/login'));
      }

    },

  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        ...payload,
      };
    },

  },
};
