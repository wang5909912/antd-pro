import { maincodelist, subcodelist, subcoderemarks, getwithdrawslist, maincodedetials } from '../services/api';
import { routerRedux } from 'dva/router';
import { message } from 'antd';

export default {
  namespace: 'discount',

  state: {
    loading: false,
    detailscode: undefined,
    maincode: {
      meta: {},
      items: [],
    },
    subcode: {
      meta: {},
      items: [],
    },
    withdrawslist: {
      meta: {},
      items: [],
    },
  },

  effects: {
    *getmaincode({ payload }, { call, put }) {   //获取主码
      const response = yield call(maincodelist, payload);
      yield put({
        type: 'savemaincode',
        payload: response
      })
    },
    *codedetails({ payload }, { call, put }) {
      const response = yield call(maincodedetials, payload);
      yield put({
        type: 'savecodedetails',
        payload: response
      })
    },
    *getsubcode({ payload }, { call, put }) {   //获取子码
      const response = yield call(subcodelist, payload);
      yield put({
        type: 'savesubcode',
        payload: response
      })
    },
    *subremark({ payload, callback }, { call }) {   //子码备注
      const response = yield call(subcoderemarks, payload);
      callback(response);
    },
    *withdraws({ payload }, { call, put }) {   //提现列表
      const response = yield call(getwithdrawslist, payload);
      yield put({
        type: 'savewithdraws',
        payload: response
      })
    },


  },

  reducers: {
    savemaincode(state, { payload }) {
      return {
        ...state,
        maincode: payload.body,
      };
    },
    savedetials(state, { payload }) {
      return {
        ...state,
        detailsmaincode: payload.body,
      };
    },
    savecodedetails(state, { payload }) {
      return {
        ...state,
        detailscode: payload.body,
      };
    },
    savesubcode(state, { payload }) {
      return {
        ...state,
        subcode: payload.body,
      };
    },
    savewithdraws(state, { payload }) {
      return {
        ...state,
        withdrawslist: payload.body,
      };
    },
  },
};
