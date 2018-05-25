import React from "react";
import style from "./index.less";
import PropTypes from "prop-types";
import ContentTitle from "../../../components/title";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { createForm } from "rc-form";
import axios from "../../../AxiosInterceptors.jsx";
import {
  Form,
  Table,
  Icon,
  Divider,
  Button,
  Popconfirm,
  Modal,
  Row,
  Col,
  Tooltip
} from "antd";
import Const from "../../../constants/const.js";
import moment from "moment";
import { browserHistory } from "react-router"; // 引入react路由
class VideoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: "",
      data: [],
      loading: false,
      order: 0
    };
  }

  //取消
  handleCancel = () => this.setState({ previewVisible: false });
  //封面点击放大
  handlePreview = url => {
    this.setState({
      previewImage: url,
      previewVisible: true
    });
  };
  //操作
  operate = (key, type) => {
    console.log(key, type);
    if (type == 1) {
      browserHistory.replace("/main/videomanage/detailVideo/" + key);
    } else if (type == 2) {
      browserHistory.replace("/main/videomanage/updateVideo/" + key);
    }
  };

  componentWillMount() {
    this.init();
  }
  // 分页，页数变化时
  pageNumChange(val) {
    this.setState({ pageNum: val }, () => {
      this.searchInfo();
    });
  }

  // 分页，每页显示的条数发生变化时
  pageSizeChange(pageNum, pageSize) {
    this.setState({ pageSize: pageSize, pageNum: 1 }, () => {
      this.searchInfo();
    });
  }

  // 搜索
  searchInfo(onlySearch) {
    this.setState({ loading: true });
    axios({
      method: "post",
      url: Const.ADMIN_VIDEO_LIST,
      data: {
        pageNo: this.state.pageNum,
        pageSize: this.state.pageSize
      }
    }).then(res => {
      if (res == null) {
        return;
      }
      this.setState({
        data: res.rows,
        loading: false,
        total: res.total
      });
    });
  }

  // 页面初始化
  init() {
    this.setState({ loading: true });
    axios({
      method: "post",
      url: Const.ADMIN_VIDEO_LIST
    }).then(res => {
      if (res == null) {
        return;
      }
      this.setState({
        data: res.rows,
        loading: false,
        total: res.total
      });
    });
  }

  state = {
    selectedRowKeys: [], // Check here to configure the default column
    loading: false
  };
  delete = () => {
    let ids = this.state.selectedRowKeys.join(",");
    // if(ids.length==0)
    // console.log(ids.length);
  };
  onSelectChange = selectedRowKeys => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    this.setState({ selectedRowKeys });
  };
  render() {
    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };
    let hasSelected = true;
    if (selectedRowKeys && selectedRowKeys.length > 0) {
      hasSelected = false;
    }
    const columns = [
      {
        title: "操作",
        key: "key",
        dataIndex: "key",
        width: 30,
        render: (text, record, index) => {
          return (
            <Row>
              <Col span={4}>
                <Tooltip placement="top" title={"查看详情"}>
                  <Icon
                    type="search"
                    onClick={this.operate.bind(this, text, 1)}
                    style={{ cursor: "pointer" }}
                  />
                </Tooltip>
              </Col>
              <Col span={4}>
                <Tooltip placement="top" title={"编辑视频"}>
                  <Icon
                    type="edit"
                    onClick={this.operate.bind(this, text, 2)}
                    style={{ cursor: "pointer" }}
                  />
                </Tooltip>
              </Col>
            </Row>
          );
        }
      },
      {
        title: "名称",
        key: "name",
        width: "25%",
        dataIndex: "name"
      },
      {
        title: "分类",
        key: "classify",
        width: 30,
        dataIndex: "classify"
      },
      {
        title: "封面",
        key: "cover",
        width: "5%",
        dataIndex: "cover",
        render: (text, record, index) => {
          return (
            <Tooltip placement="top" title={"查看封面"}>
              <Icon
                type="scan"
                onClick={this.handlePreview.bind(this, Const.HEAD + "/" + text)}
                style={{ cursor: "pointer", width: "30px", height: "20px" }}
              />
            </Tooltip>
          );
        }
      },
      {
        title: "创建时间",
        width: "25%",
        key: "createTime",
        dataIndex: "createTime",
        render: (text, record, index) => {
          return (text = moment(text * 1000).format("YYYY-MM-DD HH:mm:ss"));
        }
      },
      {
        title: "操作人",
        width: "10%",
        key: "updateUser",
        dataIndex: "updateUser"
      },
      {
        title: "操作时间",
        width: "25%",
        key: "updateTime",
        dataIndex: "updateTime",
        render: (text, record, index) => {
          return (text = moment(text * 1000).format("YYYY-MM-DD HH:mm:ss"));
        }
      }
    ];
    return (
      <div className="videolist">
        <ContentTitle contenttitle="视频列表" />
        <div className="videolist-content">
          <Table
            rowSelection={rowSelection}
            columns={columns}
            loading={this.state.loading}
            dataSource={this.state.data}
            scroll={{ x: "120%" }}
            pagination={{
              current: this.state.pageNum,
              total: this.state.total,
              size: "large",
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => {
                return `显示 ${range[0]} 到 ${range[1]} , 共 ${total} 条数据`;
              },
              onChange: this.pageNumChange.bind(this),
              onShowSizeChange: this.pageSizeChange.bind(this)
            }}
            footer={() => (
              <div>
                <Popconfirm
                  placement="top"
                  title={"确认删除吗?"}
                  onConfirm={this.delete.bind(this)}
                  okText="确认"
                  cancelText="放弃"
                >
                  <Button icon="delete" type="primary" disabled={hasSelected}>
                    &nbsp;删除
                  </Button>
                </Popconfirm>
                <span style={{ marginLeft: 8 }}>
                  {!hasSelected ? `已选择 ${selectedRowKeys.length} 项` : ""}
                </span>
              </div>
            )}
          />
        </div>
        <div>
          <Modal
            visible={this.state.previewVisible}
            footer={null}
            onCancel={this.handleCancel}
          >
            <img
              alt="example"
              style={{ width: "100%" }}
              src={this.state.previewImage}
            />
          </Modal>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    videolist: state.videolist
  };
};
// const mapDispatchToProps = dispatch => {
//   return {
//     actions: bindActionCreators(actions, dispatch)
//   };
// };
const VideoListWraper = createForm()(VideoList);
export default connect(mapStateToProps)(VideoListWraper);

// VideoList.contextTypes = {
//   router: PropTypes.object
// };
// VideoList = Form.create()(VideoList);
// const mapStateToProps = VideoList => VideoList;
// module.exports = connect(mapStateToProps)(VideoList);
