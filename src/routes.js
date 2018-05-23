import React from "react"; // 引入react
import { Route, IndexRoute, browserHistory, IndexRedirect } from "react-router"; // 引入react路由
import app from "./containers/app";
import Error from "./containers/error";
import Main from "./containers/main";
// import Setting from "./containers/setting";
// import WorkTime from "./containers/worktime";
// import DialogList from "./containers/dialoglist";
// import CallingNum from "./containers/callingnum";
// import TaskManage from "./containers/taskmanage";
// import TaskList from "./containers/tasklist";
// import TaskDetail from "./containers/taskdetail";
// import CreateTask from "./containers/createtask";
// import Record from "./containers/record";
// import AddTime from "./containers/addtime";
// import ajax from "Utils/ajax";
// import oauth from "./components/oauth/index.js";
// import refresh from "./components/oauth/refresh.js";

import VideoManage from "./containers/videomanage";
import VideoList from "./containers/admin/video/index.js";
import CreateVideo from "./containers/admin/video/create.js";

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
        </Route>
      </Route>
      <Route path="*" onEnter={validErrorRoute} />
    </Route>
  </Route>
);
