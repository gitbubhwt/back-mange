import React from "react"; // 引入react
import { Route, IndexRoute, browserHistory, IndexRedirect } from "react-router"; // 引入react路由
import app from "./containers/app";
import Error from "./containers/error";
import Main from "./containers/main";

import VideoManage from "./containers/videomanage";
import VideoList from "./containers/admin/video/index.js";
import CreateVideo from "./containers/admin/video/create.js";
import DetailVideo from "./containers/admin/video/detail.js";
import UpdateVideo from "./containers/admin/video/update.js";

import Login from "./containers/admin/login.js";

const requireAuth = (nextState, replace) => {
  let user = window.sessionStorage.getItem("user");
  console.log(user);
  if (user == null || user == "") {
    replace("/login"); //重定向
  }
};

const validErrorRoute = (nextState, replace) => {
  replace(`${$PATH}/error`);
};

export default (
  //注意：带参数的路径一般要写在路由规则的底部
  //因为route匹配到匹配路由后，将不会再向下匹配
  //TODO
  <Route path="/">
    <Route path="login" component={Login} />
    <Route path="" component={app} onEnter={requireAuth}>
      <IndexRedirect to="main" />

      <Route path="error" component={Error} />
      <Route path="main" component={Main}>
        <IndexRedirect to="videomanage" />

        <Route component={VideoManage} path="videomanage">
          <IndexRedirect to="videolist" />
          <Route path="videolist" component={VideoList} />
          <Route path="createvideo" component={CreateVideo} />
          <Route path="detailVideo/:id" component={DetailVideo} />
          <Route path="updateVideo/:id" component={UpdateVideo} />
        </Route>
      </Route>
      <Route path="*" onEnter={validErrorRoute} />
    </Route>
  </Route>
);
