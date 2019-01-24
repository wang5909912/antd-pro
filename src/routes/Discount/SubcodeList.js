import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import moment from 'moment';
import { Row, Col, Card, Form, Select, Button, Table, Badge, Input, DatePicker } from 'antd';
import PageHeader from '../../components/PageHeader/index';
import DescriptionList from '../../components/DescriptionList';
import { adminUrl } from '../../utils/utils'
import styles from './SubcodeList.less';

const FormItem = Form.Item;
const { Option } = Select;
const { Description } = DescriptionList;
const RangePicker = DatePicker.RangePicker;

const statusMap = {
  locked: 'warning',
  usable: 'success',
  disable: 'error',
  used: 'default'
};
const status = {
  usable: '未使用',
  locked: '锁定',
  disable: '禁用',
  used: '已使用'
};


@connect(({ discount, statistics, loading }) => ({
  discount,
  statistics,
  loading: loading.effects['discount/getsubcode'],
}))
@Form.create()
export default class Subdiscount extends PureComponent {

  state = {
    list: {},
    current: 1,
    pageSize: 10,
  };

  componentDidMount() {

    this.getsublist();
    this.props.dispatch({
      type: 'statistics/getsubcodecount',
      payload: {
        mainCodeId: this.props.location.search.split('=')[1],
      }
    })
  }

  getsublist = (value = this.state.list) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'discount/getsubcode',
      payload: {
        mainCodeId: this.props.location.search.split('=')[1],
        request: {
          code: value.code || '',
          status: value.status || '',
          beginAt: value.beginAt || '',
          endAt: value.endAt || '',
          perPage: this.state.pageSize,
          page: this.state.current
        }
      }
    });
  }

  handleChange = (pagination, filtersArg, sorter) => {
    this.setState({
      current: pagination.current,
      pageSize: pagination.pageSize
    }, () => this.getsublist())
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      list: {},
      current: 1,
      pageSize: 10,
    }, () => {
      this.getsublist();
    })
  }

  handleSearch = (e) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields(['code', 'status', 'time'], (err, values) => {
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
        this.getsublist();
      })
    });
  }

  excelList = () => {
    window.location.href = `${adminUrl}/promos/${this.props.location.search.split('=')[1]}/sub-codes/dump?Authorization=${window.localStorage.getItem('token')}`
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form className={styles.searchform} onSubmit={this.handleSearch}>
        <Row gutter={24}>
          <Col span={6}>
            <FormItem label="状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="usable">未使用</Option>
                  <Option value="locked">锁定</Option>
                  <Option value="disable">禁用</Option>
                  <Option value="used">已使用</Option> 
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="子码">
              {getFieldDecorator('code')(
                <Input placeholder="请选择" style={{ width: '100%' }} />
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
        <Row gutter={24}>
          <Col span={24}>
            <span className={styles.submitButtons} style={{ marginLeft: 100 }}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { discount: { subcode }, loading, statistics: { subcount } } = this.props;

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
        title: '子码',
        dataIndex: 'code',
        key: 'code',
        align: 'center',
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
        title: '使用时间',
        dataIndex: 'updated_at',
        key: 'updated_at',
        align: 'center',
        render: val => {
          if (val < 1000000000) {
            return <span>-</span>
          } else {
            return <span>{moment(Number(val) * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>
          }
        }
      },
      {
        title: '备注',
        dataIndex: 'comment',
        key: 'comment',
        align: 'center',
      },
      {
        title: '操作',
        align: 'center',
        render: val => (
          <Link to={`/Discount/Editorsnote?mainCodeId=${this.props.location.search.split('=')[1]}&subCodeId=${val.code}`} style={{ color: '#1890FF', cursor: 'pointer' }} >编辑备注</Link>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div><Button type="primary" onClick={this.excelList}>导出列表</Button></div>
              <div>
                <span >促销主码: <span style={{ color: '#cc4a4b', marginRight: 16 }}>{subcount && subcount.promos.mainCode}</span></span>
                <span >子码发送总数:<span style={{ color: '#cc4a4b', marginRight: 16 }}>{subcount && subcount.promos.total}</span></span>
                <span >使用总数:<span style={{ color: '#cc4a4b', marginRight: 16 }}>{subcount && subcount.promos.used}</span></span>
                <span >未使用总数:<span style={{ color: '#cc4a4b', marginRight: 16 }}>{subcount && subcount.promos.usable}</span></span>
                <span >总分成:<span style={{ color: '#cc4a4b', marginRight: 16 }}>&yen;{subcount && subcount.reward/100}</span></span>
              </div>
            </div>
            <Table
              loading={loading}
              rowKey={record => record.id}
              dataSource={subcode && subcode.items}
              columns={columns}
              pagination={{ current: this.state.current, pageSize: this.state.pageSize, showQuickJumper: true, total: subcode && subcode.meta.total }}
              onChange={this.handleChange}
            />
          </div>
        </Card>
      </Fragment>
    );
  }
}
