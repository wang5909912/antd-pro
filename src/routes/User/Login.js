import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Checkbox, Alert, Icon } from 'antd';
import Login from '../../components/Login';
import styles from './Login.less';

const { UserName, Password, Mobile, Captcha, Submit } = Login;

@connect(({ login }) => ({
  login
}))
export default class LoginPage extends Component {
  state = {
    type: 'account',
  }

  onTabChange = (type) => {
    this.setState({ type });
  }

  handleSubmit = (err, values) => {
    if (!err) {
      this.props.dispatch({
        type: 'login/getToken',
        payload: {
          ...values,
        },
      });
    }
  }


  renderMessage = (content) => {
    return (
      <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
    );
  }

  render() {
    const { login, submitting } = this.props;
    const { type } = this.state;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
        >
          <div key="account" >
            {
              login.status &&
              !login.submitting &&
              this.renderMessage(login.rendermessage)
            }
            <UserName name="username" placeholder=" 请输入邮箱地址" />
            <Password name="password" placeholder=" 请输入密码" />
          </div>
          <Submit loading={submitting}>登录</Submit>
        </Login>
      </div>
    );
  }
}
