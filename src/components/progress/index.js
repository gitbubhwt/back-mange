import React from 'react';
import style from './index.less';
class Progress extends React.Component{
   constructor(props){
       super(props);
   }
    render(){
        return(
            <div className="progress">
                <div className="progress-bar">
                    <span className="progress-num">{this.props.percent}%</span>
                </div>
            </div>
        )
    }
}
export default Progress; 