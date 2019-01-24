import React from 'react';
import { Input, Icon, Img } from 'antd';
import styles from './index.less';
// import mainIcon from '../../../assets/icon/mail.png'

const map = {
  UserName: {
    component: Input,
    props: {
      size: 'large',
      prefix: <img src={require('../../assets/icon/mail.png')} />,
      placeholder: '邮箱地址/用户名',
    },
    rules: [{
      required: true, 
      message: '请输入账户名！',
    },
    // {
    //   type: 'email',
    //   message: '邮箱地址格式错误！',
    // }
  ],
  },
  Password: {
    component: Input,
    props: {
      size: 'large',
      prefix: <img src={require('../../assets/icon/lock.png')} />,
      type: 'password',
      placeholder: '密码',
    },
    rules: [{
      required: true, message: '请输入密码！',
    }],
  }
};

export default map;
