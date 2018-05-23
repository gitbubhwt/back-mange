import React from "react";
import axios from "../../AxiosInterceptors.jsx";
import style from "./index.less";
import {
  Avatar,
  Icon,
  Button,
  Menu,
  Dropdown,
  message,
  Layout,
  Popover
} from "antd";
const { Header, Sider, Content } = Layout;
import bigImg from "Static/images/big.png";
import smallImg from "Static/images/small.jpg";
import { Link } from "react-router";
import Const from "../../constants/const.js";
const onClick = function({ key }) {
  message.info(`Click on item ${key}`);
};
class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUrl: 1,
      collapsed: true,
      userName: ""
    };
  }
  menu = (
    <Menu>
      <Menu.Item>
        <a
          target="_blank"
          rel="noopener noreferrer"
          onClick={this.logOut.bind(this)}
        >
          <Icon type="poweroff" style={{ marginRight: "6px" }} />
          退出系统
        </a>
      </Menu.Item>
    </Menu>
  );
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };
  logOut() {
    axios({
      method: "get",
      url: Const.ADMIN_LOGIN_OUT
    }).then(res => {
      if (res == null) {
        return;
      }
      window.sessionStorage.clear("user");
      window.location.href = "/#/login";
    });
  }
  componentWillMount() {
    let url = location.pathname;
    let current = url.split("/main")[1];
    let userInfo = window.sessionStorage.getItem("user");
    if (userInfo != null && userInfo != "") {
      let user = JSON.parse(userInfo);
      let userName = user.fullName || "";
      this.setState({ userName: userName });
    }
    let index =
      current.indexOf("videomanage") == 1
        ? 1
        : current.indexOf("setting") ? 2 : 3;
    this.setState({
      currentUrl: index
    });
  }
  render() {
    return (
      <div className="main">
        <Layout>
          <Sider
            trigger={null}
            collapsible
            collapsed={this.state.collapsed}
            collapsedWidth={60}
            width={180}
          >
            <Avatar
              src={bigImg}
              className={this.state.collapsed ? "small-img" : "large-img"}
            />
            <div
              style={
                this.state.collapsed ? (
                  { display: "none" }
                ) : (
                  {
                    display: "block",
                    textAlign: "center",
                    color: "#fff",
                    marginBottom: "25px"
                  }
                )
              }
            >
              {this.state.userName}
            </div>
            <Menu
              theme="dark"
              mode="inline"
              defaultSelectedKeys={[`${this.state.currentUrl}`]}
              style={
                this.state.collapsed ? { width: "60px" } : { width: "180px" }
              }
            >
              <Menu.Item key="1">
                <Link
                  to={`${$PATH}/main/videomanage`}
                  activeStyle={{ color: "#05bff9" }}
                >
                  <Icon
                    type="appstore"
                    style={{ verticalAlign: "-5%", marginLeft: "2px" }}
                  />
                  <span style={this.state.collapsed ? { color: "#fff" } : {}}>
                    视频管理
                  </span>
                </Link>
              </Menu.Item>
              {/*<Menu.Item key="2">
                <Link
                  to={`${$PATH}/main/setting`}
                  activeStyle={{ color: "#05bff9" }}
                >
                  <span style={this.state.collapsed ? { color: "#fff" } : {}}>
                    系统设置
                  </span>
                </Link>
              </Menu.Item>*/}
            </Menu>
          </Sider>
          <Layout>
            <Header style={{ background: "#fff", padding: 0 }}>
              <Icon
                className="trigger"
                type={this.state.collapsed ? "menu-unfold" : "menu-fold"}
                onClick={this.toggle}
                style={{ fontSize: "16px", marginLeft: "18px" }}
              />
              <div className="head-wrap">
                <Avatar src={smallImg} className="head-img" />
                <Dropdown overlay={this.menu} trigger={["click"]}>
                  <a className="ant-dropdown-link" href="#">
                    <span className="avatar-name" style={{ color: "#666666" }}>
                      {this.state.userName}{" "}
                      <Icon
                        type="caret-down"
                        style={{
                          fontSize: "12px",
                          verticalAlign: "12%",
                          marginLeft: "6px"
                        }}
                      />
                    </span>
                  </a>
                </Dropdown>
              </div>
            </Header>
            <Content
              style={{
                margin: "0px 0 0 0",
                padding: 0,
                background: "#fff",
                height: "calc(100vh - 60px)",
                overflowY: "auto"
              }}
            >
              {this.props.children}
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}

export default Main;
