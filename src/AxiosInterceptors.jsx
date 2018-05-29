import axios from "axios";
import qs from "qs";
import createError from "axios/lib/core/createError";
import { message } from "antd";
import { hashHistory } from "react-router";

const isURLRegex = /^(?:\w+:)\/\//;
axios.interceptors.request.use(config => {
  console.log("request", config);
  if (config.headers["Content-Type"] == "application/x-www-form-urlencoded") {
    config.data = qs.stringify(config.data);
  }
  let userInfo = window.sessionStorage.getItem("user");
  if (userInfo != null && userInfo != "") {
    let user = JSON.parse(userInfo);
    config.headers["userId"] = user.userId;
    config.headers["token"] = user.token;
  }
  return config;
});

axios.interceptors.response.use(response => {
  console.log("interceptors", response);
  let redata = "";
  if (response.data.hasOwnProperty("data")) {
    redata = response.data.data;
  } else if (response.hasOwnProperty("data")) {
    redata = response.data;
  } else {
    redata = response;
  }

  if (response.data.hasOwnProperty("code") && response.data.code != 0) {
    if (response.data.code == -1) {
      //token invalid
      console.log("token invalid", response.data);
      window.sessionStorage.clear("user");
      window.location.href = "/#/login";
      return null;
    }else if(response.data.code==401 || response.data.code==402 || response.data.code==403){
      message.warn(response.data.data);
      return null;
    }else {
      message.error(response.data.data);

      let error = new createError(
        response.data.code,
        response.data.data
      );
      return Promise.reject(error);
    } 
  }
  return redata;
});

export default axios;
