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

export default class VideoAdd extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      timeDomChange: true
    };

    this.WorkAllDom = "";
  }

  cancel() {}
  save() {}

  render() {
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 8 }
    };
    const { getFieldDecorator } = this.props.form;

    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 }
      }
    };

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

    const props = {
      action: "/cloud/admin/uploadFile",
      listType: "picture",
      defaultFileList: [...fileList],
      className: "upload-list-inline"
    };

    return (
      <div className="videolist">
        <ContentTitle contenttitle="创建视频" />
        <Form style={{ marginTop: "15px" }}>
          <Row>
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
              {getFieldDecorator("working_hours", {
                rules: [
                  {
                    required: true,
                    message: "请选择分类"
                  }
                ]
              })(
                <Select placeholder="请选择分类" showSearch>
                  {this.WorkAllDom}
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
          </Row>
        </Form>
        <Row>
          <Col span={1} />
          <Col span={2}>
            <Button type="primary" onClick={this.cancel.bind(this)}>
              &nbsp;取消
            </Button>
          </Col>
          <Col span={1} />
          <Col span={10}>
            <Button type="primary" onClick={this.save.bind(this)}>
              &nbsp;保存
            </Button>
          </Col>
        </Row>
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
