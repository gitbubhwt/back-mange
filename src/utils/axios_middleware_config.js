// import * as commonAction from 'actions/common_action'
import Ajax from "Ajax";
import { browserHistory } from "react-router";

export default {
  //请求出错时返回Promise reject
  returnRejectedPromiseOnError: true,
  //拦截器
  interceptors: {
    request: [
      {
        //处理成功请求
        success: ({ getState, dispatch, getSourceAction }, config) => {
          let user = window.localStorage.getItem("user");
          let authorization = JSON.parse(user).access_token;
          //在每次请求前添加cancelKey,cancel请求
          config.reqId = new Date().getTime();
          config.cancelToken = Ajax.addRequest(config.reqId);
          config.headers.Authorization = "Bearer " + authorization;
          //   config.headers.Authorization = "Bearer " + 1289990890564;
          // config.headers.USER = `{"vccId":"123","vccCode":"1024","userSub":"ad","userName":"aa"}`; //配置请求头
          // dispatch(commonAction.optLoading('正在操作'));
          //如果是jsonp，则设置适配器来处理请求
          if (config.jsonp) {
            config.adapter = config => {
              return Ajax.jsonp(config);
            };
          }
          return config;
        },
        //处理失败请求
        error: ({ getState, dispatch, getSourceAction }, error) => {
          return Promise.reject(error);
        }
      }
    ],
    response: [
      {
        //处理成功返回
        success: ({ getState, dispatch, getSourceAction }, res) => {
          // 设置拦截器，当返回401，则推出登陆，跳转到登陆页
          if (res.data.code == "401") {
            window.localStorage.setItem("user", "");
            manager.signoutRedirect().then(() => {
              browserHistory.push("/oauth");
            });
          } else {
            //请求完成,移除cencel栈
            Ajax.removeRequest(res.config.reqId);
            const source = getSourceAction(res.config);
            const data = res.data;
            //判断服务端返回状态是否正确
            const isSuccess = data && data.status == "success";
            const msg = data && data.info;
            if (isSuccess) {
              // dispatch(commonAction.optSuccess(msg))
            } else {
              // dispatch(commonAction.optError(msg))
            }
            return res;
          }
        },
        //处理失败返回
        error: ({ getState, dispatch, getSourceAction }, error) => {
          //取消操作错误不发出
          if (Ajax.axios.isCancel(error)) {
            console.log("Request canceled", error.message);
          } else {
            // dispatch(commonAction.optError('网络异常'));
            return Promise.reject(error);
          }
        }
      }
    ]
  }
};
