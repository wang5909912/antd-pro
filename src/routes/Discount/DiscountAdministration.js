import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import moment from 'moment';
import { Row, Col, Card, Form, Select, Button, Table, Badge, DatePicker, Input, Divider } from 'antd';
import PageHeader from '../../components/PageHeader/index';
import DescriptionList from '../../components/DescriptionList';
import Ellipsis from '../../components/Ellipsis/index';
import styles from './DiscountAdministration.less';

const FormItem = Form.Item;
const { Option } = Select;
const { Description } = DescriptionList;
const RangePicker = DatePicker.RangePicker;

const statusMap = {
  normal: 'success',
  disable: 'error',
};
const status = {
  normal: '开启',
  disable: '禁用',
};

@connect(({ discount, statistics, loading }) => ({
  discount,
  statistics,
  loading: loading.effects['discount/getmaincode'],
}))
@Form.create()
export default class DiscountAdministration extends PureComponent {

  state = {
    list: {},
    current: 1,
    pageSize: 10,
  };

  componentDidMount() {
    this.getmaincodelist();
    this.props.dispatch({
      type: 'statistics/getmaincodecount'
    })
  }

  getmaincodelist = (value = this.state.list) => {   //获取list
    const { dispatch } = this.props;
    dispatch({
      type: 'discount/getmaincode',
      payload: {
        id: value.id || '',
        mainCode: value.mainCode || '',
        subCode: value.subCode || '',
        status: value.status || '',
        beginAt: value.beginAt || '',
        endAt: value.endAt || '',
        perPage: this.state.pageSize,
        page: this.state.current

      }
    });
  }

  handleChange = (pagination, filtersArg, sorter) => {   //table换页码
    this.setState({
      current: pagination.current,
      pageSize: pagination.pageSize
    }, () => this.getmaincodelist())
  }

  handleFormReset = () => {   //重置
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      list: {},
      current: 1,
      pageSize: 10,
    }, () => {
      this.getmaincodelist();
    })
  }

  handleSearch = (e) => {   //搜索
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields(['id', 'mainCode', 'subCode', 'status', 'time'], (err, values) => {
      if (err) return;
      if (values.time == undefined || values.time.length == 0) {
        values.beginAt = '';
        values.endAt = '';
      } else {
        values.beginAt = values.time[0].unix();
        values.endAt = values.time[1].unix();
      }
      delete values.time;
      this.setState({
        list: values,
        current: 1,
        pageSize: 10,
      }, () => {
        this.getmaincodelist();
      })
    });
  }


  renderSimpleForm() {    //搜索栏
    const { getFieldDecorator } = this.props.form;
    return (
      <Form className={styles.searchform} onSubmit={this.handleSearch} >
        <Row gutter={24}>
          <Col span={6}>
            <FormItem label="ID">
              {getFieldDecorator('id')(
                <Input placeholder="请选择" style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="促销主码">
              {getFieldDecorator('mainCode')(
                <Input placeholder="请选择" style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="子码">
              {getFieldDecorator('subCode')(
                <Input placeholder="请选择" style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="normal">开启</Option>
                  <Option value="disable">关闭</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="创建时间">
              {getFieldDecorator('time')(
                <RangePicker style={{ width: '100%' }} showTime={{
                  defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                }} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ marginLeft: 100 }}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { discount: { maincode }, loading, statistics: { maincount } } = this.props;

    const breadcrumbList = [{
      title: '',
    }];

    const columns = [
      {
        title: '#',
        align: 'center',
        key: '#',
        render: (text, record, index) => {
          return (this.state.current - 1) * this.state.pageSize + index + 1
        }
      },
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: '创建者',
        dataIndex: 'creator.name',
        key: 'creator.name',
        align: 'center',
      },
      {
        title: '描述',
        dataIndex: 'describe',
        key: 'describe',
        align: 'center',
        render: val => <Ellipsis tooltip length={6}>{val}</Ellipsis>
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]} />;
        },
      },
      {
        title: '促销主码',
        dataIndex: 'code',
        key: 'code',
        align: 'center',
      },
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        align: 'center',

      },
      {
        title: '优惠',
        dataIndex: 'user_price',
        key: 'user_price',
        align: 'center',
        render: val => val / 100
      },
      {
        title: '延时(天)',
        dataIndex: 'period',
        key: 'period',
        align: 'center',
      },
      {
        title: '库存',
        dataIndex: 'total_inventory',
        key: 'total_inventory',
        align: 'center',
      },
      {
        title: '已使用',
        dataIndex: 'summaries.used',
        key: 'summaries.used',
        align: 'center',
      },
      {
        title: '未使用',
        dataIndex: 'summaries.usable',
        key: 'summaries.usable',
        align: 'center',
      },
      {
        title: '截止时间',
        dataIndex: 'end_at',
        key: 'end_at',
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
        title: '提成单价',
        dataIndex: 'channel_price',
        key: 'channel_price',
        align: 'center',
        render: val => val / 100
      },
      // {
      //   title: '提成总价',
      //   dataIndex: 'callNo4',
      //   key: 'callNo4',
      //   align: 'center',
      // },
      {
        title: '操作',
        align: 'center',
        render: val => (
          <Fragment>
            <Link to={`/Discount/detailsdiscount?mainCodeId=${val.id}`} style={{ color: '#FF0000', cursor: 'pointer' }}>详情</Link>
            <Divider type="vertical" />
            <Link to={`/Discount/SubcodeList?mainCodeId=${val.id}`} style={{ color: '#1890FF', cursor: 'pointer' }}> 子码列表</Link >
          </Fragment>
        ),
      },
    ];

    return (
      <Fragment>
        <PageHeader title="优惠码管理" breadcrumbList={breadcrumbList} className={styles.pageheaderbox} />
        <Card>
          {this.renderSimpleForm()}
        </Card>
        <Card bordered={false} style={{ marginTop: 16 }}>
          <div className={styles.tableList}>
            <Row>
              <Col md={8} sm={24} offset={16}>
                <DescriptionList size="large" style={{ marginBottom: 16 }} col={4}>
                  <Description term="总发放"><span style={{ color: '#cc4a4b' }}>{maincount && maincount.promos.total}</span></Description>
                  <Description term="已使用"><span style={{ color: '#cc4a4b' }}>{maincount && maincount.promos.used}</span></Description>
                  <Description term="未使用"><span style={{ color: '#cc4a4b' }}>{maincount && maincount.promos.usable}</span></Description>
                  <Description term="总分成"><span style={{ color: '#cc4a4b' }}>&yen;{maincount && maincount.reward / 100}</span></Description>
                </DescriptionList>
              </Col>
            </Row>
            <Table
              loading={loading}
              rowKey={record => record.id}
              dataSource={maincode && maincode.items}
              columns={columns}
              pagination={{ current: this.state.current, pageSize: this.state.pageSize, showQuickJumper: true, total: maincode && maincode.meta.total }}
              onChange={this.handleChange}
            />
          </div>
        </Card>
      </Fragment>
    );
  }
}
