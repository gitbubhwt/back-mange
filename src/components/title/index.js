import React from 'react';
import style from './index.less';
import {Icon} from 'antd';
import { browserHistory } from 'react-router';
class ContentTitle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    goBack(){
        browserHistory.go(-1);
    }
    render() {
        return (
            <div className="content-title">
                <span className="content-title-line"></span>
                <span className="content-title-name">{this.props.contenttitle}</span>
                <span className="content-title-back" onClick={this.goBack} style={this.props.show?{display:'block'}:{display:'none'}}><i className="iconfont icon-fanhui" style={{color:"#a3a9b0",marginRight:"5px"}}></i>返回</span>
            </div>
        )
    }
}
export default ContentTitle; 