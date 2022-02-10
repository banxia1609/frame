import request from '@/request/';

/** 登录接口 **/
export function userInfo (data) {
    return request({
      url: '/passport/login',
      method: 'post',
      data
    })
  }