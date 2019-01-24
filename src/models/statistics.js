import { maincodecount, subcodecount, withdrawscount } from '../services/api';
import { routerRedux } from 'dva/router';
import { message } from 'antd';

export default {
  namespace: 'statistics',

  state: {
    loading: false,
    maincount: undefined,
    subcount: undefined,
    withcount: undefined,
  },

  effects: {
    *getmaincodecount(_, { call, put }) {   //获取主码统计
      const response = yield call(maincodecount);
      yield put({
        type: 'savemaincodecount',
        payload: response
      })
    },
    *getsubcodecount({ payload }, { call, put }) {   //获取子码统计
      const response = yield call(subcodecount, payload);
      yield put({
        type: 'savesubcodecount',
        payload: response
      })
    },
    *getwithdrawscount(_, { call, put }) {   //获取提现列表统计
      const response = yield call(withdrawscount);
      yield put({
        type: 'savewithdrawscount',
        payload: response
      })
    },
  },

  reducers: {
    savemaincodecount(state, { payload }) {
      return {
        ...state,
        maincount: payload.body,
      };
    },
    savesubcodecount(state, { payload }) {
      return {
        ...state,
        subcount: payload.body,
      };
    },
    savewithdrawscount(state, { payload }) {
      return {
        ...state,
        withcount: payload.body,
      };
    },
  },
};
