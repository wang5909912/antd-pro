import React, { PureComponent } from 'react';
import { Table, Alert } from 'antd';
import styles from './index.less';

class StandardTable extends PureComponent {
  // 当在React class中需要设置state的初始值或者绑定事件时需要加上constructor(){} 必须加上super()
  constructor(props) {
    super(props);
    const { columns } = props;

    this.state = {
      selectedRowKeys: [],
    };
  }

  //componentWillReceiveProps 状态改变检测机制
  componentWillReceiveProps(nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      this.setState({
        selectedRowKeys: [],
      });
    }
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    // @selectedRows 选中的复选框
    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRowKeys);
    }

    this.setState({ selectedRowKeys });
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  }

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  }

  render() {
    const { selectedRowKeys } = this.state;
    const { data: { list }, loading, columns } = this.props;
    const listData = list.data;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: list.meta && Number(list.meta.currentPage),
      pageSize: list.meta && Number(list.meta.perPage),
      total: list.meta && Number(list.meta.total),
    };
    const rowSelection = {
      //通过rowSelection.selectedRowKeys 来控制选中项
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disable,
      }),
    };

    return (
      <div className={styles.standardTable}>
        {
          selectedRowKeys.length > 0 && (
            <div className={styles.tableAlert}>
              <Alert
                message={(
                  <div>
                    已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
              </div>
                )}
                type="info"
              />
            </div>
          )
        }
        {/* 
        * @rowSelection 联动的选择框
        * @columns 每列
        * @dataSource 表格数据
        */}
        <Table
          loading={loading}
          rowKey={record => record.id}
          rowSelection={rowSelection}
          dataSource={listData}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default StandardTable;
