import React, { Component } from "react"; // 引入React
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { browserHistory } from "react-router"; // 引入Link处理导航跳转
import { connect } from "react-redux";
import ajax from "Utils/ajax";
import "./app.less";

class App extends Component {
  componentDidMount() {}

  render() {
    return <div>{this.props.children}</div>;
  }
}

// const mapStateToProps = state => {
//   return {
//     login: state.login
//   };
// };

// const mapDispatchToProps = dispatch => {
//   return {
//     actions: bindActionCreators(actions, dispatch)
//   };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(App);

App.contextTypes = {
  router: PropTypes.object
};
// App = Form.create()(App);
const mapStateToProps = App => App;
module.exports = connect(mapStateToProps)(App);
