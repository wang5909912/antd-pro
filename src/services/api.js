import { stringify } from 'qs';
import request from '../utils/request';
import { adminUrl } from '../utils/utils'

//主码列表
export async function maincodelist(params) {
  return request(`${adminUrl}/promos?${stringify(params)}`, {
    method: 'GET',
  });
}
//子码列表
export async function subcodelist(params) {
  return request(`${adminUrl}/promos/${params.mainCodeId}/sub-codes?${stringify(params.request)}`, {
    method: 'GET',
  });
}
//子码备注
export async function subcoderemarks(params) {
  return request(`${adminUrl}/sub-codes/${params.subCodeId}/remark`, {
    method: 'PATCH',
    body: params.request
  });
}
//提现列表
export async function getwithdrawslist(params) {
  return request(`${adminUrl}/withdraws?${stringify(params)}`, {
    method: 'GET',
  });
}
//优惠码使用情况统计
export async function maincodecount(params) {
  return request(`${adminUrl}/promos/summaries`, {
    method: 'GET',
  });
}
//优惠子码使用情况统计
export async function subcodecount(params) {
  return request(`${adminUrl}/promos/${params.mainCodeId}/summaries`, {
    method: 'GET',
  });
}
//提现列表使用情况统计
export async function withdrawscount(params) {
  return request(`${adminUrl}/withdraws/summaries`, {
    method: 'GET',
  });
}

//优惠码详情
export async function maincodedetials(params) {
  return request(`${adminUrl}/promos/${params.mainCodeId}`, {
    method: 'GET',
  });
}



