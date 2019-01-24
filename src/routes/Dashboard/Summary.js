import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Tabs, DatePicker } from 'antd';
import numeral from 'numeral';
import { ChartCard, yuan, Bar } from '../../components/Charts';
import PageHeader from '../../components/PageHeader/index';
import { getTimeDistance } from '../../utils/utils';
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts';
import { DataSet } from '@antv/data-set';
import styles from './Summary.less';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

@connect(({ chart, loading }) => ({
  chart,
  loading: loading.effects['chart/fetch'],
}))
export default class Summary extends Component {
  state = {
    rangePickerValue: getTimeDistance('today'),
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'chart/fetch',
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
  }

  handleRangePickerChange = (rangePickerValue) => {
    this.setState({
      rangePickerValue,
    });

    this.props.dispatch({
      type: 'chart/fetchSalesData',
    });
  };

  selectDate = (type) => {
    this.setState({
      rangePickerValue: getTimeDistance(type),
    });

    this.props.dispatch({
      type: 'chart/fetchSalesData',
    });
  };

  isActive(type) {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return;
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }
  }

  render() {
    const { rangePickerValue } = this.state;
    const { chart, loading } = this.props;
    // const {
    //   salesData,
    // } = chart;
    const salesExtra = (
      <div className={styles.salesExtraWrap}>
        <div className={styles.salesExtra}>
          <a className={this.isActive('today')} onClick={() => this.selectDate('today')}>
            今日
          </a>
          <a className={this.isActive('week')} onClick={() => this.selectDate('week')}>
            本周
          </a>
          <a className={this.isActive('month')} onClick={() => this.selectDate('month')}>
            本月
          </a>
        </div>
        <RangePicker
          value={rangePickerValue}
          onChange={this.handleRangePickerChange}
          style={{ width: 256 }}
        />
      </div>
    );

    const topColResponsiveProps = {
      xs: 24,
      sm: 24,
      md: 12,
      lg: 12,
      xl: 8,
      style: { marginBottom: 24 },
    };
    const data = [
      { name: 'London', 'Jan.': 18.9, 'Feb.': 28.8, 'Mar.': 39.3, 'Apr.': 81.4, 'May.': 47, 'Jun.': 20.3, 'Jul.': 24, 'Aug.': 35.6 },
      { name: 'Berlin', 'Jan.': 12.4, 'Feb.': 23.2, 'Mar.': 34.5, 'Apr.': 99.7, 'May.': 52.6, 'Jun.': 35.5, 'Jul.': 37.4, 'Aug.': 42.4 },
    ];
    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.transform({
      type: 'fold',
      fields: ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'Jun.', 'Jul.', 'Aug.'], // 展开字段集
      key: '月份', // key字段
      value: '月均降雨量', // value字段
    });

    const breadcrumbList = [{
      title: '',
    }];
    return (
      <Fragment>
        <PageHeader title="概述" breadcrumbList={breadcrumbList} className={styles.pageheaderbox} />
        <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
          <div className={styles.salesCard}>
            <Tabs tabBarExtraContent={salesExtra} size="large" tabBarStyle={{ marginBottom: 24 }}>
              <TabPane tab="分成总览" key="total">
                <div className={styles.salesBar}>
                  <Chart height={430} data={dv} forceFit>
                    <Axis name="月份" />
                    <Axis name="月均降雨量" />
                    <Legend />
                    <Tooltip crosshairs={{ type: "y" }} />
                    <Geom type='interval' position="月份*月均降雨量" color={'name'} adjust={[{ type: 'dodge', marginRatio: 1/32}]} />
                  </Chart>
                </div>
              </TabPane>
              <TabPane tab="优惠码分成" key="Concession">
                <div className={styles.salesBar}>
                  {/* <Bar height={430} data={salesData} /> */}
                </div>
              </TabPane>
              <TabPane tab="试用组分成" key="trial">
                <div className={styles.salesBar}>
                  {/* <Bar height={430} data={salesData} /> */}
                </div>
              </TabPane>
            </Tabs>
          </div>
        </Card>

        <Card loading={loading} bordered={false} bodyStyle={{ marginTop: '24px' }}>
          <div>
            <Tabs size="large" tabBarStyle={{ marginBottom: 24 }}>
              <TabPane tab="收益总览" key="saleslook">
                <Row gutter={24}>
                  <Col {...topColResponsiveProps}>
                    <ChartCard
                      title="总收益"
                      total={`&yen; ${numeral(65416).format('0,0')}(&#36; ${numeral(65465).format('0,0')})`}
                      contentHeight={46}
                    />
                  </Col>
                  <Col {...topColResponsiveProps}>
                    <ChartCard
                      title="已提现"
                      total={`&yen; ${numeral(65416).format('0,0')}(&#36; ${numeral(65465).format('0,0')})`}
                      contentHeight={46}
                    />
                  </Col>
                  <Col {...topColResponsiveProps}>
                    <ChartCard
                      title="待提现"
                      total={`&yen; ${numeral(65416).format('0,0')}(&#36; ${numeral(65465).format('0,0')})`}
                      contentHeight={46}
                    />
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="优惠码概览" key="viewslook">
                <Row gutter={24}>
                  <Col {...topColResponsiveProps}>
                    <ChartCard
                      title="总发放"
                      total={`&yen; ${numeral(65416).format('0,0')}(&#36; ${numeral(65465).format('0,0')})`}
                      contentHeight={46}
                    />
                  </Col>
                  <Col {...topColResponsiveProps}>
                    <ChartCard
                      title="已使用"
                      total={numeral(8846).format('0,0')}
                      contentHeight={46}
                    />
                  </Col>
                  <Col {...topColResponsiveProps}>
                    <ChartCard
                      title="分成总收益"
                      total={numeral(6560).format('0,0')}
                      contentHeight={46}
                    />
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="试用组概览" key="triallook">
                <Row gutter={24}>
                  <Col {...topColResponsiveProps}>
                    <ChartCard
                      title="总发放"
                      total={`&yen; ${numeral(65416).format('0,0')}(&#36; ${numeral(65465).format('0,0')})`}
                      contentHeight={46}
                    />
                  </Col>
                  <Col {...topColResponsiveProps}>
                    <ChartCard
                      title="已使用"
                      total={numeral(8846).format('0,0')}
                      contentHeight={46}
                    />
                  </Col>
                  <Col {...topColResponsiveProps}>
                    <ChartCard
                      title="分成总收益"
                      total={`&yen; ${numeral(65416).format('0,0')}(&#36; ${numeral(65465).format('0,0')})`}
                      contentHeight={46}
                    />
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </div>
        </Card>
      </Fragment>
    );
  }
}
