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
  Upload,
  message
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
    this.classifyDom = ""; //分类
    this.coverCount = 1;
    this.coverPath = []; //封面文件路径
    this.filePath = []; //文件路径
  }

  componentWillMount() {
    this.init();
  }

  //提交数据
  submit() {
    let params = {};
    const self = this;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (this.coverPath.length == 0) {
          message.info("请上传封面");
          return;
        }
        if (this.filePath.length == 0) {
          message.info("请至少上传一个文件");
          return;
        }
        let cover = this.coverPath[0].path;
        let path = this.filePath;
        console.log(cover, path);
        this.setState({ loading: true });
        axios({
          method: "post",
          url: Const.ADMIN_VIDEO_ADD,
          data: {
            name: values.name,
            info: values.info,
            cover: cover,
            classify: values.classify,
            path: path
          }
        }).then(res => {
          this.setState({ loading: false });
          if (res == null) {
            return;
          }
          message.success(res);
        });
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

  pushPath(data, i) {
    let obj = new Object();
    obj.path = data.path;
    obj.order = i;
    obj.createTime = data.createTime;
    return obj;
  }

  removePath(paths, key) {
    let index = -1;
    for (let i = 0; i < paths.length; i++) {
      if (paths[i].path == key) {
        index = i;
        break;
      }
    }
    return index;
  }

  //文件上传事件更新
  uploadChange = info => {
    let file = info.file;
    if (file.status == "done") {
      const code = file.response.code;
      if (code != 0) {
        console.log("上传失败,code:", code);
        return;
      }
      let data = file.response.data;
      //填充数据
      this.filePath.push(this.pushPath(data, this.filePath.length + 1));
    } else if (file.status == "removed") {
      const code = file.response.code;
      if (code != 0) {
        console.log("删除失败,code:", code);
        return;
      }
      this.setState({ loading: true });
      let path = file.response.data.path;
      let url = Const.ADMIN_DEL_FILE + "?path=" + path;
      axios({
        method: "get",
        url: url
      }).then(res => {
        this.setState({ loading: false });
        if (res == null) {
          return;
        }
        message.success(res);
        let index = this.removePath(this.filePath, path);
        this.filePath.splice(index);
      });
    }
  };

  //封面文件上传
  coveruploadChange = info => {
    info.fileList.slice(1);
    let file = info.file;
    if (file.status == "done") {
      const code = file.response.code;
      if (code != 0) {
        console.log("上传失败,code:", code);
        return;
      }
      let data = file.response.data;
      //填充数据
      this.coverPath.push(this.pushPath(data, this.coverPath.length + 1));
    } else if (file.status == "removed") {
      const code = file.response.code;
      if (code != 0) {
        console.log("删除失败,code:", code);
        return;
      }
      this.setState({ loading: true });
      let path = file.response.data.path;
      let url = Const.ADMIN_DEL_FILE + "?path=" + path;
      axios({
        method: "get",
        url: url
      }).then(res => {
        this.setState({ loading: false });
        if (res == null) {
          return;
        }
        message.success(res);
        let index = this.removePath(this.coverPath, path);
        this.coverPath.splice(index);
      });
    }
  };

  //封面上传之前校验
  coverBeforeUpload = file => {
    let count = this.coverPath.length;
    if (count >= 1) {
      message.warn("抱歉,封面只能上传一张");
      return false;
    }
    let fileType = "";
    if (file.name.indexOf(".") != -1) {
      fileType = file.name.split(".")[1];
    }
    if (fileType == "png" || fileType == "jpg") {
      return true;
    }
    message.warn("请上传png或者jpg格式图片");
    return false;
  };

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

    //const files = [
    // {
    //   uid: -1,
    //   name: "xxx.png",
    //   status: "done",
    //   url:
    //     "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    //   thumbUrl:
    //     "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
    // }
    // ];

    const props = {
      action: Const.ADMIN_UPLOAD_FILE,
      headers: this.state.token,
      className: "upload-list-inline",
      onChange: this.uploadChange,
      beforeUpload(file) {
        let fileType = "";
        if (file.name.indexOf(".") != -1) {
          fileType = file.name.split(".")[1];
        }
        if (fileType == "mp4") {
          return true;
        }
        message.warn("请上传mp4格式文件");
        return false;
      }
    };
    const coverprops = {
      action: Const.ADMIN_UPLOAD_FILE,
      headers: this.state.token,
      className: "upload-list-inline",
      onChange: this.coveruploadChange,
      beforeUpload: this.coverBeforeUpload
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
            {getFieldDecorator("info", {
              rules: [
                {
                  required: true,
                  message: "请输入描述"
                }
              ]
            })(<TextArea rows={4} placeholder="请输入描述" />)}
          </FormItem>

          <FormItem label="封面" {...formItemLayout}>
            {getFieldDecorator("cover", {
              rules: [
                {
                  required: true,
                  message: "请上传封面"
                }
              ]
            })(
              <Upload {...coverprops}>
                <Button>
                  <Icon type="upload" /> 上传文件
                </Button>
              </Upload>
            )}
          </FormItem>

          <FormItem label="文件" {...formItemLayout}>
            {getFieldDecorator("path", {
              rules: [
                {
                  required: true,
                  message: "请至少上传一个文件"
                }
              ]
            })(
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
