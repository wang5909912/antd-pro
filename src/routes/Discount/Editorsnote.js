import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Button, Input, message } from 'antd';
import PageHeader from '../../components/PageHeader/index';
import DescriptionList from '../../components/DescriptionList';
import styles from './Editorsnote.less';
import { routerRedux } from 'dva/router';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Description } = DescriptionList;

@connect(({ discount }) => ({
  discount,
}))
@Form.create()
export default class Editorsnote extends PureComponent {
  state = {

  }

  componentDidMount() {
    const { dispatch, location: { search } } = this.props;
    const code = this.GetRequest(search);
    dispatch({
      type: 'discount/getsubcode',
      payload: {
        mainCodeId: code.mainCodeId,
        request: {
          code: code.subCodeId,
          status: '',
          beginAt: '',
          endAt: '',
          perPage: 10,
          page: 1
        }
      }
    })
  }

  GetRequest = (url) => {
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
      let str = url.substr(1);
      let strs = str.split("&");
      for (var i = 0; i < strs.length; i++) {
        theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
      }
    }
    return theRequest;
  }


  handleFormReset = () => {
    const { dispatch, location: { search } } = this.props;
    const code = this.GetRequest(search);
    this.props.form.resetFields();
    dispatch(routerRedux.push(`/Discount/SubcodeList?mainCodeId=${code.mainCodeId}`))
  }
  handleSubmit = (e) => {
    e.preventDefault();
    const { dispatch, discount: { subcode: { items } }, location: { search } } = this.props;
    const code = this.GetRequest(search);
    this.props.form.validateFields((err, values) => {
      this.props.dispatch({
        type: 'discount/subremark',
        payload: {
          subCodeId: items.length > 0 && items[0].id,
          request: values
        },
        callback: (data) => {
          if (data.code == 0) {
            dispatch(routerRedux.push(`/Discount/SubcodeList?mainCodeId=${code.mainCodeId}`))
          } else {
            message.error(data.message, 5)
          }
        }
      })
    });
  }

  render() {
    const { discount: { subcode: { items } } } = this.props
    const breadcrumbList = [{
      title: '',
    }];
    const { getFieldDecorator } = this.props.form;

    return (
      <Fragment>
        <PageHeader title="编辑备注" breadcrumbList={breadcrumbList} className={styles.pageheaderbox} />
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={24} sm={24}>
                <DescriptionList size="large" col="1" style={{ marginBottom: 32 }}>
                  <Description term="子码">{items.length > 0 && items[0].code}</Description>
                </DescriptionList>
              </Col>
              <Col md={24} sm={24}>
                <DescriptionList size="large" col="1" style={{ marginBottom: 32 }}>
                  <Description term="状态">{items.length > 0 && (items[0].status == 'usable' ? '未使用' : items[0].status == 'locked' ? '禁用' : items[0].status == 'disable' ? '关闭' : items[0].status == 'used' ? '已使用' : '')}</Description>
                </DescriptionList>
              </Col>
              <Col md={24} sm={24}>
                <DescriptionList size="large" col="1" style={{ marginBottom: 32 }}>
                  <Description term="截止时间">{items.length > 0 && (items[0].updated_at < 1000000000 ? '-' : moment(items[0].updated_at * 1000).format('YYYY-MM-DD HH:mm:ss'))}</Description>
                </DescriptionList>
              </Col>
              <Col md={24} sm={24}>
                <FormItem label="备注">
                  {getFieldDecorator('comment', {
                    initialValue: items.length > 0 && items[0].comment || ''
                  })(
                    <TextArea rows={4} cols={60} style={{ resize: 'none' }} maxLength={100} />
                  )}
                </FormItem>
              </Col>
              <Col md={24} sm={24}>
                <div style={{ margin: '50px 0' }}>
                  <Button type="primary" htmlType="submit">编辑</Button>
                  <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>取消</Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Card>
      </Fragment>
    )
  }
}