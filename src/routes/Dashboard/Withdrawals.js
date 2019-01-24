import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Select, Button, Table, Badge, Input } from 'antd';
import PageHeader from '../../components/PageHeader/index';
import DescriptionList from '../../components/DescriptionList';
import styles from './Withdrawals.less';

const FormItem = Form.Item;
const { Option } = Select;
const { Description } = DescriptionList;

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');



@connect(({ discount, statistics, loading }) => ({
  discount,
  statistics,
  loading: loading.effects['discount/withdraws'],
}))
@Form.create()
export default class Withdrawals extends PureComponent {
  state = {
    current: 1,
    pageSize: 10,
  };

  componentDidMount() {
    this.getwithdrawslist();
    this.props.dispatch({
      type: 'statistics/getwithdrawscount'
    })
  }

  getwithdrawslist = () => {   //获取list
    const { dispatch } = this.props;
    dispatch({
      type: 'discount/withdraws',
      payload: {
        perPage: this.state.pageSize,
        page: this.state.current
      }
    });
  }

  handleChange = (pagination, filtersArg, sorter) => {
    this.setState({
      current: pagination.current,
      pageSize: pagination.pageSize
    }, () => this.getwithdrawslist())
  }


  render() {
    const { loading, discount: { withdrawslist }, statistics: { withcount } } = this.props;

    const breadcrumbList = [{
      title: '',
    }];

    const columns = [
      {
        title: '#',
        dataIndex: 'key',
        align: 'center',
        render: (text, record, index) => {
          return (this.state.current - 1) * this.state.pageSize + index + 1
        }
      },
      {
        title: 'ID',
        dataIndex: 'id',
        align: 'center',
      },
      {
        title: '渠道商ID',
        dataIndex: 'channel_id',
        align: 'center',
      },
      {
        title: '提现金额',
        align: 'center',
        render: val => <span>{val.value / 100}{val.currency}</span>
      },
      {
        title: '提现方式',
        dataIndex: 'method',
        align: 'center',
      },
      {
        title: '提现时间',
        dataIndex: 'time',
        align: 'center',
        render: val => {
          if (val < 1000000000) {
            return <span>-</span>
          } else {
            return <span>{moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>
          }
        }
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        align: 'center',
        render: val => {
          if (val < 1000000000) {
            return <span>-</span>
          } else {
            return <span>{moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>
          }
        }
      },
      {
        title: '备注',
        dataIndex: 'comment',
        align: 'center',
      },
    ];

    return (
      <Fragment>
        <PageHeader title="提现列表" breadcrumbList={breadcrumbList} className={styles.pageheaderbox} />
        <Card bordered={false}>
          <div className={styles.tableList}>
            <Row>
              <Col md={8} offset={16}>
                <DescriptionList size="large" col="2" style={{ marginBottom: 32 }}>
                  <Description term="余额" ><span style={{ color: '#00CC00' }}>&yen;{withcount && withcount.balances.cny / 100}(&#36;{withcount && withcount.balances.usd / 100})</span></Description>
                  <Description term="已提现"><span style={{ color: '#1890FF' }}>&yen;{withcount && withcount.withdrawal.cny / 100}(&#36;{withcount && withcount.withdrawal.usd / 100})</span></Description>
                </DescriptionList>
              </Col>
            </Row>
            <Table
              loading={loading}
              rowKey={record => record.id}
              dataSource={withdrawslist && withdrawslist.items}
              columns={columns}
              pagination={{ current: this.state.current, pageSize: this.state.pageSize, showQuickJumper: true, total: withdrawslist && withdrawslist.meta.total }}
              onChange={this.handleChange}
            />
          </div>
        </Card>
      </Fragment>
    );
  }
}
