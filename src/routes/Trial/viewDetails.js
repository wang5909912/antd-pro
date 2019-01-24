import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { Card, Button, Input, Divider, message } from 'antd';
import PageHeader from '../../components/PageHeader/index';
import DescriptionList from '../../components/DescriptionList';
import styles from './viewDetails.less';
import logo from '../../assets/islide.png';
import copy from 'copy-to-clipboard';

const { TextArea } = Input;
const { Description } = DescriptionList;

@connect(({ view, loading }) => ({
  view,
  loading: loading.models.view,
}))

export default class ViewDetails extends PureComponent {
  state = {
    link: 'http://www.baidu.com',
  }
  copyLink = () => {
    copy(this.state.link);
    message.success('已成功复制');
  }
  pushlist = () => {
    this.props.dispatch(routerRedux.push("/trial/userlist"))
  }

  render() {
    const breadcrumbList = [{
      title: '',
    }];
    return (
      <Fragment>
        <PageHeader title="试用组详情" breadcrumbList={breadcrumbList} className={styles.pageheaderbox} />
        <Card bordered={false}>
          <DescriptionList size="large" style={{ marginBottom: 32 }}>
            <Description term="试用组标题">1000000000</Description>
            <Description term="创建者">iSlide</Description>
            <Description term="授权周期">1234123421</Description>
          </DescriptionList>
          <DescriptionList size="large" col={1} style={{ marginBottom: 32 }}>
            <Description className={styles.describeArea} term="描述"><TextArea rows={2} style={{ resize: 'none' }} /></Description>
          </DescriptionList>
          <DescriptionList size="large" col={1} style={{ marginBottom: 32 }}>
            <Description term="链接">
              {this.state.link}
              <Button type="primary" className={styles.copyBtn} onClick={this.copyLink}>复制链接</Button>
            </Description>
          </DescriptionList>
          <DescriptionList size="large" col={1} style={{ marginBottom: 32 }}>
            <Description term="二维码"><img style={{ width: '130px', height: '130px' }} src={logo} alt="" /></Description>
          </DescriptionList>
          <DescriptionList size="large" style={{ marginBottom: 32 }}>
            <Description term="登录用户"><span style={{ color: '#1890FF', cursor: 'pointer' }} onClick={this.pushlist}>30</span></Description>
            <Description term="付费用户"><span style={{ color: '#1890FF', cursor: 'pointer' }} onClick={this.pushlist}>5</span></Description>
          </DescriptionList>
          <DescriptionList size="large" style={{ marginBottom: 32 }}>
            <Description term="提成单价">&yen;30</Description>
            <Description term="提成总价">&yen;5</Description>
          </DescriptionList>
          <DescriptionList size="large" style={{ marginBottom: 32 }}>
            <Description term="开始时间">{val => moment(val).format('YYYY-MM-DD HH:mm:ss')}</Description>
            <Description term="结束时间">{val => moment(val).format('YYYY-MM-DD HH:mm:ss')}</Description>
          </DescriptionList>
          <Divider />
        </Card>
      </Fragment>
    )
  }
}