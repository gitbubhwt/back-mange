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

export default class VideoUpdate extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      timeDomChange: true,
      classifyAllData: [],
      token: {},
      fileList: [],
      data: {}
    };
    this.classifyDom = ""; //分类
    this.id=0;//视频id
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
        let resdata = this.state.data;
        if (resdata.cover.length == 0) {
          message.info("请上传封面");
          return;
        }
        if (resdata.paths.length == 0) {
          message.info("请至少上传一个文件");
          return;
        }
        let cover = resdata.cover[0].response.data.path;
        let path = [];
        for (let i = 0; i < resdata.paths.length; i++) {
          let p=resdata.paths[i].response.data;
          p.number=i+1;
          path.push(p);
        }
        console.log(cover, path);
        this.setState({ loading: true });
        axios({
          method: "post",
          url: Const.ADMIN_VIDEO_UPDATE,
          data: {
            name: values.name,
            info: values.info,
            cover: cover,
            classifyId: values.classifyId,
            path: path,
            key:this.id
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

    //初始化分类和详情
    let id = this.props.params.id;
    if (id == null || id == "") {
      console.log("params is empty,id:", id);
      return;
    }
    this.id=parseInt(this.props.params.id);
    this.setState({ loading: true });
    let url = Const.ADMIN_VIDEO_GET + "?id=" + id;
    axios
      .all([axios.get(Const.ADMIN_CLASSIFY_ALL), axios.get(url)])
      .then(res => {
        this.setState({ loading: false });
        console.log(res);
        this.setState({ classifyAllData: res[0] });
        let obj = new Object();
        obj.name = res[1].name;
        obj.info = res[1].info;
        obj.classifyId = res[1].classifyId;
        let tempCover = [
          {
            path: res[1].cover,
            number: 0,
            createTime: new Date().getTime()
          }
        ];
        obj.cover = this.getFileObj(tempCover);
        obj.paths = this.getFileObj(res[1].path);
        console.log(obj);
        this.setState({ data: obj });
      });
  }

  getFileObj(res) {
    console.log(res);
    let arr = [];
    for (let i = 0; i < res.length; i++) {
      let path = res[i].path;
      let number = res[i].number;
      let createTime = res[i].createTime;
      let te = {
        uid: "" + number,
        name: path,
        status: "done",
        response: {
          code: 0,
          data: {
            path: path,
            createTime: createTime,
            number: number
          }
        }
      };
      arr.push(te);
    }
    return arr;
  }

  //文件上传事件更新
  uploadChange = info => {
    let file = info.file;
    let data = this.state.data;
    if (file.status == "uploading") {
      data.paths = info.fileList;
      this.setState({ data: data });
    } else if (file.status == "done") {
      let index = data.paths.length - 1;
      data.paths[index].uid = index + "";
      this.setState({ data: data });
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
        data.paths = info.fileList;
        console.log(data.paths);
        this.setState({ data: data });
      });
    }
  };

  //封面文件上传
  coveruploadChange = info => {
    let file = info.file;
    let data = this.state.data;
    if (file.status == "uploading") {
      data.cover = info.fileList;
      this.setState({ data: data });
    } else if (file.status == "done") {
      let index = data.paths.length - 1;
      data.cover[index].uid = index + "";
      this.setState({ data: data });
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
        data.cover = info.fileList;
        this.setState({ data: data });
      });
    }
  };

  //封面上传之前校验
  coverBeforeUpload = file => {
    let count = this.state.data.cover.length;
    console.log("cover",count)
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
        <ContentTitle contenttitle="编辑视频" />

        <Form style={{ marginTop: "15px" }}>
          <FormItem label="名称" {...formItemLayout}>
            {getFieldDecorator("name", {
              rules: [
                {
                  required: true,
                  message: "请输入名称"
                }
              ],
              initialValue: this.state.data.name
            })(<Input placeholder="请输入名称" />)}
          </FormItem>

          <FormItem label="分类" {...formItemLayout}>
            {getFieldDecorator("classifyId", {
              rules: [
                {
                  required: true,
                  message: "请选择分类"
                }
              ],
              initialValue: this.state.data.classifyId
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
              ],
              initialValue: this.state.data.info
            })(<TextArea rows={4} placeholder="请输入描述" />)}
          </FormItem>

          <FormItem label="封面" {...formItemLayout}>
            {getFieldDecorator("cover", {
              rules: [
                {
                  required: true,
                  message: "请上传封面"
                }
              ],
              initialValue: this.state.data.cover
            })(
              <Upload {...coverprops} fileList={this.state.data.cover}>
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
              ],
              initialValue: this.state.data.paths
            })(
              <Upload {...props} fileList={this.state.data.paths}>
                <Button>
                  <Icon type="upload" /> 上传文件
                </Button>
              </Upload>
            )}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button type="primary" onClick={this.submit.bind(this)}>
              修改
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
VideoUpdate.contextTypes = {
  router: PropTypes.object
};
VideoUpdate = Form.create()(VideoUpdate);
const mapStateToProps = VideoUpdate => VideoUpdate;
module.exports = connect(mapStateToProps)(VideoUpdate);
