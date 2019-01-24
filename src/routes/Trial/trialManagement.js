import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { doller, yuan } from '../../components/Charts';
import numeral from 'numeral';
import { Row, Col, Card, Form, Select, Button, Table, Badge, Divider } from 'antd';
import PageHeader from '../../components/PageHeader/index';
import DescriptionList from '../../components/DescriptionList';
import styles from './trialManagement.less';

const FormItem = Form.Item;
const { Option } = Select;
const { Description } = DescriptionList;

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];


@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
  
export default class TrialManagement extends PureComponent {
  columns = [
    {
      title: '#',
      dataIndex: 'key',
      width: 100
    },
    {
      title: '创建者',
      dataIndex: 'no',
    },
    {
      title: '标题',
      dataIndex: 'description',
      render: val => `${val} 万`,
    },
    {
      title: '授权周期',
      dataIndex: 'owner',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render(val) {
        return <Badge status={statusMap[val]} text={status[val]} />;
      },
    },
    {
      title: '登录用户',
      dataIndex: 'title',
    },
    {
      title: '付费用户',
      dataIndex: 'updatedAt',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '提成总价',
      dataIndex: 'progress',
      render: (val) => <span>&yen;{val}(&#36;{val})</span>
    },
    {
      title: '操作',
      render: () => (
        <Fragment>
          <span style={{ color: '#1890FF', cursor: 'pointer' }} onClick={this.pushdetails}>查看详情</span>
          <Divider type="vertical" />
          <span style={{ color: '#1890FF',cursor: 'pointer' }} onClick={this.pushlist}>用户列表</span>
        </Fragment>
      ),
    },
  ];
  state = {
    selectedRows: [],
    formValues: {},
  };

  pushdetails = () => {
    this.props.dispatch(routerRedux.push("/trial/viewDetails"));
  }
  pushlist = () => { 
    this.props.dispatch(routerRedux.push("/trial/userlist"))
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'rule/fetch',
      payload: params,
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'rule/fetch',
      payload: {},
    });
  }

  handleSearch = (e) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'rule/fetch',
        payload: values,
      });
    });
  }


  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={4} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { loading } = this.props;
    const { selectedRows } = this.state;
    const breadcrumbList = [{
      title: '',
    }];
    return (
      <Fragment>
        <PageHeader title="试用组管理" breadcrumbList={breadcrumbList} className={styles.pageheaderbox} />
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderSimpleForm()}
            </div>
            <Row>
              <Col md={8} offset={16}>
                <DescriptionList size="large" col={2} style={{ marginBottom: 32 }}>
                  <Description term="授权试用组总数">{3}个</Description>
                  <Description term="启用试用组">{0}个</Description>
                </DescriptionList>
              </Col>
            </Row>
            <Table
              selectedRows={selectedRows}
              loading={loading}
              // dataSource={data.list}
              columns={this.columns}
              pagination={{ pageSize: 10, showQuickJumper: true, total: 50 }}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </Fragment>
    );
  }
}
