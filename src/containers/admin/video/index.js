import React from "react";
import style from "./index.less";
import PropTypes from "prop-types";
import ContentTitle from "../../../components/title";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { createForm } from "rc-form";
import axios from "../../../AxiosInterceptors.jsx";
import { Form, Table, Icon, Divider, Button } from "antd";
import Const from "../../../constants/const.js";
import moment from "moment";
const columns = [
  {
    title: "名称",
    key: "name",
    dataIndex: "name"
  },
  {
    title: "描述",
    key: "info",
    dataIndex: "info"
  },
  {
    title: "分类",
    key: "classify",
    dataIndex: "classify"
  },
  {
    title: "创建时间",
    key: "createTime",
    dataIndex: "createTime",
    render: (text, record, index) => {
      return (text = moment(text * 1000).format("YYYY-MM-DD HH:mm:ss"));
    }
  },
  {
    title: "操作人",
    key: "updateUser",
    dataIndex: "updateUser"
  },
  {
    title: "操作时间",
    key: "updateTime",
    dataIndex: "updateTime",
    render: (text, record, index) => {
      return (text = moment(text * 1000).format("YYYY-MM-DD HH:mm:ss"));
    }
  }
];
class VideoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: false,
      order: 0
    };
  }
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
  start = () => {
    this.setState({ loading: true });
    // ajax request after empty completing
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false
      });
    }, 1000);
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
    return (
      <div className="videolist">
        <ContentTitle contenttitle="视频列表" />
        <div className="videolist-content">
          <Table
            rowSelection={rowSelection}
            columns={columns}
            loading={this.state.loading}
            dataSource={this.state.data}
            scroll={{ x: 1100 }}
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
          />
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
