/*
    视频详情
*/
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Form, Card, Row, Col, Divider } from "antd";
import axios from "../../../AxiosInterceptors.jsx";
import Const from "../../../constants/const.js";
import ContentTitle from "../../../components/title";

const { Meta } = Card;
export default class VideoDetail extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      data: {}
    };
  }
  componentWillMount() {
    this.init();
  }
  initDetail() {
    this.setState({ data: obj });
  }
  //初始化
  init() {
    let id = this.props.params.id;
    if (id == null || id == "") {
      console.log("params is empty,id:", id);
      return;
    }
    this.props.dispatch(Detail(id, this.initDetail.bind(this)));
    this.setState({ loading: true });
    let url = Const.ADMIN_VIDEO_GET + "?id=" + id;
    axios({
      method: "get",
      url: url
    }).then(res => {
      this.setState({ loading: false });
      if (res == null) {
        return;
      }
      let obj = new Object();
      obj.cover = Const.HEAD + "/" + res.cover;
      obj.name = res.name;
      obj.info = res.info;
      obj.classify = res.classify;
      obj.path = Const.HEAD + "/" + res.path[0].path;
      this.setState({ data: obj });
    });
  }

  render() {
    return (
      <div className="videolist">
        <ContentTitle contenttitle="视频详情" />
        <Row>
          <Col span={12}>
            <video
              style={{ width: 580, height: 360 }}
              controls
              poster={this.state.data.cover}
              src={this.state.data.path}
            />
            <Divider orientation="left" style={{ width: 580 }}>
              {this.state.data.name}
            </Divider>
          </Col>
          <Col span={12}>
            <Row>
              <Col span={24}>
                <Card title="分类">
                  <p>{this.state.data.classify}</p>
                </Card>
              </Col>
              <Col span={24}>
                <Card title="描述">
                  <p>{this.state.data.info}</p>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}
VideoDetail.contextTypes = {
  router: PropTypes.object
};
VideoDetail = Form.create()(VideoDetail);
const mapStateToProps = VideoDetail => VideoDetail;
module.exports = connect(mapStateToProps)(VideoDetail);
