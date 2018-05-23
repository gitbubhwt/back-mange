/*
    登录
*/
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Form, Icon, Card, Button, Input, Row, Col, Transfer } from "antd";
const FormItem = Form.Item;
import axios from "../../AxiosInterceptors.jsx";
import SHA from "../../utils/sha1.js";
import MD5 from "../../utils/md5.js";
import { hashHistory } from "react-router";
export default class Login extends Component {
  constructor(props, context) {
    super(props, context);
  }
  //登录
  login() {
    let params = {};
    const self = this;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.password = MD5.md5(values.password);
        values.password = SHA.sha1(values.password);
        axios({
          method: "post",
          url: "/cloud/admin/login",
          data: {
            userName: values.userName,
            password: values.password
          },
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }).then(res => {
          if (res == null) {
            return;
          }
          const key = "user";
          let value = JSON.stringify(res);
          window.sessionStorage.setItem(key, value);
          window.location.href = "/#/main";
        });
      }
    });
  }

  render() {
    const formItemLayout = {
      width: "100%"
    };
    const loginBtnStyle = {
      width: "100%"
    };
    const loginForm = {
      marginLeft: "auto",
      marginRight: "auto",
      width: "300px",
      marginTop: "100px"
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="configSearch">
        <Form style={loginForm}>
          <Row>
            <FormItem {...formItemLayout}>
              {getFieldDecorator("userName", {
                rules: [{ required: true, message: "请输入用户名" }]
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="用户名"
                />
              )}
            </FormItem>
          </Row>

          <Row>
            <FormItem {...formItemLayout}>
              {getFieldDecorator("password", {
                rules: [{ required: true, message: "请输入密码" }]
              })(
                <Input
                  prefix={
                    <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  type="password"
                  placeholder="密码"
                />
              )}
            </FormItem>
          </Row>

          <Row>
            <FormItem {...formItemLayout}>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                onClick={this.login.bind(this)}
                style={loginBtnStyle}
              >
                登录
              </Button>
            </FormItem>
          </Row>
        </Form>
      </div>
    );
  }
}
Login.contextTypes = {
  router: PropTypes.object
};
Login = Form.create()(Login);
const mapStateToProps = Login => Login;
module.exports = connect(mapStateToProps)(Login);
