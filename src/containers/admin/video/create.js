/*
    视频添加 - 添加
*/
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ContentTitle from "../../../components/title";
import {
  Form,
  Card,
  Button,
  Input,
  Row,
  Col,
  Alert,
  Select,
  Icon,
  Upload
} from "antd";
const { TextArea } = Input;
const Option = Select.Option;
const FormItem = Form.Item;
import Const from "../../../constants/const.js";
import axios from "../../../AxiosInterceptors.jsx";

export default class VideoAdd extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      timeDomChange: true,
      classifyAllData: [],
      token: {},
      fileList: []
    };
    this.classifyDom = "";
  }

  componentWillMount() {
    this.init();
  }

  submit() {
    let params = {};
    const self = this;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values);
      }
    });
  }

  // 页面初始化
  init() {
    //初始化token
    let userInfo = window.sessionStorage.getItem("user");
    if (userInfo != null && userInfo != "") {
      let user = JSON.parse(userInfo);
      let obj = new Object();
      obj.userId = user.userId;
      obj.token = user.token;
      this.setState({ token: obj });
    }
    //初始化分类
    axios({
      method: "get",
      url: Const.ADMIN_CLASSIFY_ALL
    }).then(res => {
      console.log(res);
      if (res == null) {
        return;
      }
      this.setState({ classifyAllData: res });
    });
  }

  uploadResult() {}

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 16 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 16 },
        sm: { span: 8 }
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 16,
          offset: 0
        },
        sm: {
          span: 8,
          offset: 4
        }
      }
    };
    const { getFieldDecorator } = this.props.form;

    const fileList = [
      {
        uid: -1,
        name: "xxx.png",
        status: "done",
        url:
          "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
        thumbUrl:
          "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      }
    ];

    // var object = new Object();
    // object.token = "";
    // object.userId = "";

    const props = {
      action: "/cloud/admin/uploadFile",
      headers: this.state.token,
      defaultFileList: this.state.fileList,
      className: "upload-list-inline",
      onChange({ file, fileList }) {
        if (file.status !== "uploading") {
          console.log(file, fileList);
          let obj = new Object();
          obj.uid = this.state.fileList.length + 1;
          // obj.name =
        }
      }
    };
    this.classifyDom = this.state.classifyAllData.map(function(item, index) {
      return (
        <Option value={item.id} key={index}>
          {item.name}
        </Option>
      );
    });

    return (
      <div className="videolist">
        <ContentTitle contenttitle="创建视频" />

        <Form style={{ marginTop: "15px" }}>
          <FormItem label="名称" {...formItemLayout}>
            {getFieldDecorator("name", {
              rules: [
                {
                  required: true,
                  message: "请输入名称"
                }
              ]
            })(<Input placeholder="请输入名称" />)}
          </FormItem>

          <FormItem label="分类" {...formItemLayout}>
            {getFieldDecorator("classify", {
              rules: [
                {
                  required: true,
                  message: "请选择分类"
                }
              ]
            })(
              <Select placeholder="请选择分类" showSearch>
                {this.classifyDom}
              </Select>
            )}
          </FormItem>

          <FormItem label="描述" {...formItemLayout}>
            {getFieldDecorator("info")(
              <TextArea rows={4} placeholder="请输入描述" />
            )}
          </FormItem>

          <FormItem label="文件" {...formItemLayout}>
            {getFieldDecorator("info")(
              <Upload {...props}>
                <Button>
                  <Icon type="upload" /> 上传文件
                </Button>
              </Upload>
            )}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button type="primary" onClick={this.submit.bind(this)}>
              提交
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
VideoAdd.contextTypes = {
  router: PropTypes.object
};
VideoAdd = Form.create()(VideoAdd);
const mapStateToProps = VideoAdd => VideoAdd;
module.exports = connect(mapStateToProps)(VideoAdd);
