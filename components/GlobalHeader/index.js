import React, { PureComponent } from 'react';
import { Layout, Menu, Icon, Spin, Tag, Dropdown, Avatar, Divider } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import Debounce from 'lodash-decorators/debounce';
import { Link } from 'dva/router';
// import NoticeIcon from '../NoticeIcon';
// import HeaderSearch from '../HeaderSearch';
import styles from './index.less';

const { Header } = Layout;

export default class GlobalHeader extends PureComponent {
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }

  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  }
  @Debounce(600)
  triggerResizeEvent() { // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  render() {
    const { collapsed, isMobile, logo, onNoticeClear } = this.props;

    return (
      <Header className={styles.header}>
        {isMobile && (
          [
            (
              <Link to="/" className={styles.logo} key="logo">
                <img src={logo} alt="logo" width="32" />
              </Link>
            ),
            <Divider type="vertical" key="line" />,
          ]
        )}
        <Icon
          className={styles.trigger}
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.toggle}
        />
        <div className={styles.right}>
          {window.localStorage.getItem('username') ? (

            <span className={`${styles.action} ${styles.account}`}>
              <span>渠道商名称: {window.localStorage.getItem('username')}</span>
            </span>

          ) : <Spin size="small" style={{ marginLeft: 8 }} />}
          <span className={`${styles.action} ${styles.account}`} onClick={onNoticeClear} >
            <Icon type="logout" />
            <span className={styles.name} style={{ verticalAlign: 'middle' }}>退出</span>
          </span>
        </div>
      </Header >
    );
  }
}
