import React from "react";
import style from "./index.less";
import { Link } from "react-router";
import { Menu } from "antd";
const SubMenu = Menu.SubMenu;
class VideoManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUrl: 1
    };
  }

  componentDidMount() {
    let url = location.pathname;
    let current = url.split("/videomanage")[1];
    let index =
      current == "/videolist" ? 1 : current == "/createvideo" ? 2 : "";
    this.setState({
      currentUrl: index
    });
  }

  // 选择nav的menu，绑定key
  onSelected(item, key, keypath) {
    this.setState({ currentUrl: item.key });
  }

  // 截取路径，绑定key值到 nav的menu上
  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname.split("videomanage/")[1] == "videolist") {
      this.setState({ currentUrl: 1 });
    }
    if (nextProps.location.pathname.split("videomanage/")[1] == "createvideo") {
      this.setState({ currentUrl: 2 });
    }
  }

  render() {
    return (
      <div className="videomanage">
        <div className="videomanage-nav">
          <div className="videomanage-nav-title">视频管理</div>
          <Menu
            selectedKeys={[`${this.state.currentUrl}`]}
            onClick={this.onSelected.bind(this)}
          >
            <Menu.Item key="1">
              <Link
                to={`${$PATH}/main/videomanage/videolist`}
                activeStyle={{ color: "rgba(0, 0, 0, 0.65)" }}
              >
                视频列表
              </Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link
                to={`${$PATH}/main/videomanage/createvideo`}
                activeStyle={{ color: "rgba(0, 0, 0, 0.65)" }}
              >
                创建视频
              </Link>
            </Menu.Item>
          </Menu>
        </div>
        <div className="videomanage-content">{this.props.children}</div>
      </div>
    );
  }
}
export default VideoManage;
