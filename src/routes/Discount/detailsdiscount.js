import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Button, Input, message, Tooltip, Icon } from 'antd';
import PageHeader from '../../components/PageHeader/index';
import DescriptionList from '../../components/DescriptionList';
import styles from './Editorsnote.less';
import { routerRedux, Link } from 'dva/router';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Description } = DescriptionList;

@connect(({ discount }) => ({
  discount,
}))
@Form.create()
export default class Detailsdiscount extends PureComponent {
  state = {

  }

  componentDidMount() {
    const { dispatch, location: { search } } = this.props;
    dispatch({
      type: 'discount/codedetails',
      payload: {
        mainCodeId: search.split('=')[1],
      }
    })
  }

  render() {
    const { discount: { detailscode } } = this.props
    const breadcrumbList = [{
      title: '',
    }];
    console.log(detailscode)
    return (
      <Fragment>
        <PageHeader title="详情" breadcrumbList={breadcrumbList} className={styles.pageheaderbox} />
        <Card title="优惠码详情" style={{ marginBottom: 24 }} bordered={false}>
          <DescriptionList style={{ marginBottom: 24 }} col={2}>
            <Description term="渠道分成(￥)"><span>{detailscode && (detailscode.currency == 'cny' ? detailscode.channel_sharing / 100 : 0)}</span></Description>
            <Description term="渠道分成($)"><span>{detailscode && (detailscode.currency == 'cny' ? 0 : detailscode.channel_sharing / 100)}</span></Description>
            <Description term="用户优惠(￥)"><span>{detailscode && (detailscode.currency == 'cny' ? detailscode.user_price / 100 : 0)}</span></Description>
            <Description term="用户优惠($)"><span>{detailscode && (detailscode.currency == 'cny' ? 0 : detailscode.user_price / 100)}</span></Description>
            <Description term="类型"><span>{detailscode && detailscode.type}</span></Description>
            <Description term="延时(天)"><span>{detailscode && detailscode.period}</span></Description>
            <Description term="截至时间"><span>{detailscode && (detailscode.end_at < 100000000 ? '-' : moment(detailscode.end_at).format('YYYY-MM-DD HH:mm:ss'))}</span></Description>
            <Description term="总库存"><span>{detailscode && detailscode.total_inventory}</span></Description>
          </DescriptionList>
          <DescriptionList style={{ marginBottom: 24 }} col={1}>
            <Description term="描述"><span>{detailscode && detailscode.describe}</span></Description>
            <Description term="状态"><span>{detailscode && (detailscode.status == 'normal' ? '开启' : '关闭')}</span></Description>
          </DescriptionList>
          <Button><Link to='/Discount/DiscountAdministration'>返回</Link></Button>
        </Card>
      </Fragment>
    )
  }
}