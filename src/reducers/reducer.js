import { combineReducers } from "redux";

// import orderList from './orderList'
// import orderDetail from './orderDetail'
// import orderAssign from './orderAssign'
// import orderManage from './orderManage'

//TODO
//添加reducer
const reducers = {
  // order,orderList,orderDetail,orderAssign,orderManage
};

//合并普通reducer和route的reducer
const finalCombineReducers = routerReducer => {
  return combineReducers({
    ...reducers,
    routing: routerReducer
  });
};

export default finalCombineReducers;
