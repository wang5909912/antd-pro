import request from '../utils/request';
import { adminUrl } from '../utils/utils'
import { stringify } from 'qs';


/*
获取token */
export async function getchanneltoken(params) {
  return request(`${adminUrl}/token`, {
    method: 'POST',
    body: params
  });
}