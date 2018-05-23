import React from 'react'
import style from './index.less'
import ContentTitle from '../../components/title'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { createForm } from 'rc-form'
import actions from 'Actions/createtask'
import { Input, Button, Select, Icon, Upload, message, Modal } from 'antd'
import { browserHistory } from 'react-router'
const Option = Select.Option
class CreateTask extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            taskName: "",//任务名称
            wordStrategyId: "",//话术对应的id
            callingNum: [],//主叫号码数组
            dialogList: [],//表单提交的话术列表数组
            callingNumList: [],//主叫列表下拉初始数据
            workTimeList: [],//工作时间数组
            selectedWorktime: [],//已经选择的工作时间
            importId: "",//文件上传后台返回的id
            failList: [],//失败列表
            confirmLoading: false,
            warningShow: false,
            uploading: false,
            fileList: [],
            totalNum: "",
            fileName: "",
            repeat:"",
            btnLoading:false
        }
    }

    componentDidMount() {
        this.init()
    }

    // 页面初始化
    init() {
        let { actions } = this.props
        let params = {}
        // 获取话术列表
        this.props.actions.getDialogList().then(() => {
            this.setState({ loading: false })
            let result = this.props.createtask.dialogList
            this.setState({ dialogList: result })
        })
        // 获取主叫号码列表
        this.props.actions.getCallingNum().then(() => {
            let result = this.props.createtask.callingNumList
            this.setState({ callingNumList: result })
            this.setState({ callingNum: result })
        })
        // 获取工作时间列表
        this.props.actions.getWorktimeList(params).then(() => {
            let result = this.props.createtask.workTimeList
            this.setState({ workTimeList: result })
        })
    }

    // 文件上传之后
    uploadChange(info) {
        if (info.file.response) {
            let res = info.file.response
            if (res.code == "200") {
                this.setState({
                    fileName: info.file.name,
                    fileList: [info.fileList[info.fileList.length - 1]],
                    repeat:res.data.dup,
                    importId: res.data.importId
                })
                if ((res.data.failed && res.data.failed.length > 0)||res.data.dup>0) {
                    if(res.data.total-res.data.failed.length-res.data.dup!==0){
                        this.setState({
                            warningShow: true,
                            failList: res.data.failed,
                            totalNum: res.data.total
                        });
                    }else{
                        let that = this
                        Modal.error({
                            title: '提示',
                            content:'导入的表格无有效数据',
                            onOk() {
                                that.setState({ fileList: [] })
                            },
                        });
                    }
                }
            } else {
                // 当上传失败时，filelist要设空
                this.setState({ fileList: [] })
                message.error(info.file.response.msg)
            }
        } else {
            // filelist只能保留一个
            this.setState({ fileList: [info.fileList[info.fileList.length - 1]] })
        }
    }

    // 上传文件之前判断文件格式是否未xlsx
    beforeUpload(file) {
        const isXlsx = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        if (!isXlsx) {
            message.error('只能上传xlsx文件!')
            this.setState({fileList:[]})
        }
        return isXlsx
    }

    // 选择工作时间
    selectWorkTime(val) {
        this.setState({ selectedWorktime: val })
    }

    // 选择工作名称
    changeName(event) {
        let value = event.target.value
        this.setState({ taskName: value })
    }

    // 选择对应话术列表的id
    changeDialog(val) {
        this.setState({ wordStrategyId: val })
    }

    // 选择主叫号码，多选
    changeNum(val) {
        this.setState({ callingNum: val })
    }

    // 提交整个表单，保存
    saveInfo() {
        let { actions } = this.props
        let numString = ""
        if(!/^[a-zA-Z0-9_\u4e00-\u9fa5]{1,15}$/g.test(this.state.taskName)){
            message.warning('任务名称只能由数字、字母、汉字和下划线组成，且不能大于15个字符！')
            return
        }
        // 把电话号码数组改成拼接的字符串，后台需要
        this.state.callingNum.forEach((item, index) => {
            if (index == (this.state.callingNum.length - 1)) {
                numString += item;
            } else {
                numString += item + ","
            }
        })
       
        // 表单参数
        let params = {
            // "id": 123 // 新增无 修改有
            "taskName": this.state.taskName.trim(),
            "wordStrategyId": this.state.wordStrategyId,
            "callNumber": numString,
            "workTimeId": this.state.selectedWorktime,
            "importId": this.state.importId,//文件上传后返回的字段
            "fileName": this.state.fileName
        }

        // 参数校验
        if (!params.taskName) {
            message.warning('任务名称不能为空！')
            return
        }
        if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(params.taskName)) {
            message.warning('任务名称只能由数字、字母、汉字和下划线组成！')
            return
        }
        if (!params.wordStrategyId) {
            message.warning('请选择话术!')
            return
        }
        if (!params.callNumber) {
            message.warning('主叫号码不能为空！')
            return
        }
        if (this.state.fileList.length == 0) {
            message.warning('请导入客户！')
            return
        }
        if (params.workTimeId.length == 0) {
            message.warning('请选择呼叫时间!')
            return
        }
        this.setState({btnLoading:true})
        // 提交表单
        actions.createTask(params).then((res) => {
            this.setState({btnLoading:false})
            let response = res.payload.data
            if (response.code == '200') {
                message.success('任务提交成功，稍后可到任务列表查看结果')
                browserHistory.push(`${$PATH}/main/taskmanage/tasklist`)
            } else {
                message.error(response.msg)
            }
        })
    }
    // 下载模板文件
    downloadTemplate() {
        window.location.href = "/robot/static/templates/template.xlsx"
    }
    
    // 确认上传
    sureUpload() {
        this.setState({ warningShow: false })
    }
    // 取消上传
    cancelUpload() {
        this.setState({ warningShow: false })
        this.setState({ importId: "" })
        this.setState({ fileList: [] })
        this.setState({ fileName: "" })
    }
   
    render() {
        // 获取access_token
        let user = window.localStorage.getItem("user")
        let authorization = JSON.parse(user).access_token
        //在每次请求前添加cancelKey,cancel请求
        return (
            <div className="createtask">
                <ContentTitle contenttitle="创建任务" />
                <div className="createtask-form">
                    <div className="createtask-form-taskname">
                        <span>任务名称</span>
                        <Input 
                            placeholder="请输入名称" 
                            style={{ width: 400 }} 
                            onChange={this.changeName.bind(this)} 
                            value={this.state.taskName} 
                        />
                    </div>
                    <div>
                        <span>选择话术</span>
                        <Select 
                            style={{ width: 400 }} 
                            onChange={this.changeDialog.bind(this)} 
                            placeholder="请选择"
                        >
                            {this.state.dialogList.map((item, index) => {
                                return (
                                    <Option value={item.strategyId} key={item}>{item.strategyName}</Option>
                                )
                            })}
                        </Select>
                    </div>
                    <div>
                        <span>主叫号码</span>
                        <Select 
                            style={{ width: 400 }}
                            value={this.state.callingNum} 
                            onChange={this.changeNum.bind(this)} 
                            placeholder="请选择" 
                            mode="multiple"
                        >
                            {this.state.callingNumList.map((item, index) => {
                                return (
                                    <Option value={item} key={index}>{item}</Option>
                                )
                            })}
                        </Select>
                    </div>
                    <div>
                        <span>导入客户</span>
                        <Upload
                            name='file'
                            action='/robot/file/importExcel'
                            onChange={this.uploadChange.bind(this)}
                            beforeUpload={this.beforeUpload}
                            headers={{ Authorization: "Bearer " + authorization }}
                            fileList={this.state.fileList}
                        >
                            <Button>
                                <i className="iconfont icon-export" style={{marginRight:'5px'}}></i>
                                选择表格
                            </Button>
                        </Upload>
                        <Button 
                            type="primary" 
                            style={{ marginTop: '10px' }} 
                            onClick={this.downloadTemplate.bind(this)}
                        >
                            <i className="iconfont icon-download" style={{marginRight:'5px'}}></i>
                            下载模板
                        </Button>
                    </div>
                    <div className="createtask-form-worktime">
                        <span>呼叫时间</span>
                        <Select
                            style={{ width: '100%' }}
                            placeholder="请选择"
                            onChange={this.selectWorkTime.bind(this)}
                            style={{ width: 400 }}
                        >
                            {this.state.workTimeList.map((item, index) => {
                                return (
                                    <Option 
                                        key={index}
                                        value={item.workTimeId}
                                    >
                                        {item.workName}
                                    </Option>
                                )
                            })}
                        </Select>
                    </div>
                    <Button 
                        type="primary" 
                        style={{ float: 'left', marginTop: '30px' }} 
                        onClick={this.saveInfo.bind(this)}
                        loading={this.state.btnLoading}
                    >
                        保存
                    </Button>
                </div>
                <Modal title="提醒"
                    visible={this.state.warningShow}
                    onOk={this.sureUpload.bind(this)}
                    confirmLoading={this.state.confirmLoading}
                    onCancel={this.cancelUpload.bind(this)}
                    cancelText="取消导入"
                    okText="确认导入"
                >
                    <p style={{ textAlign: "center", color: "red" }}>
                        提交数据{this.state.totalNum}条，成功数据{this.state.totalNum - this.state.failList.length - this.state.repeat}条，失败数据{this.state.failList.length}条，<span style={this.state.repeat==0?{display:'none'}:{display:'inline-block'}}>重复号码{this.state.repeat}条</span>   
                    </p>
                    <div className="failWrap" style={{ maxHeight: "180px", overflowY: "auto", textAlign: "center" }}>
                        
                        {
                            this.state.failList.map((item, index) => {
                                return (<p key={index}>
                                    {item.name}
                                </p>)
                            })
                        }
                    </div>
                </Modal>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        createtask: state.createtask
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(actions, dispatch),
    }
}

const CreateTaskWraper = createForm()(CreateTask)

export default connect(mapStateToProps, mapDispatchToProps)(CreateTaskWraper)