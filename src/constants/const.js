const HEAD = "/cloud";
const ADMIN = HEAD + "/admin";
const USER = HEAD + "/user";
const PING = HEAD + "/ping";
const ADMIN_UPLOAD_FILE = ADMIN + "/uploadFile"; //上传文件
const ADMIN_DEL_FILE = ADMIN + "/delFile"; //文件删除
const ADMIN_LOGIN = ADMIN + "/login"; //登录
const ADMIN_LOGIN_OUT = ADMIN + "/loginOut"; //推出登录
const ADMIN_VIDEO_ADD = ADMIN + "/video/add"; //视频添加
const ADMIN_VIDEO_UPDATE = ADMIN + "/video/update"; //视频修改
const ADMIN_VIDEO_GET = ADMIN + "/video/get"; //视频获取
const ADMIN_VIDEO_LIST = ADMIN + "/video/list"; //视频列表
const ADMIN_CLASSIFY_ALL = ADMIN + "/classify/all"; //所有分类
const USER_VIDEO_LIST = USER + "/video/list"; //视频列表

var Const = {
  HEAD: HEAD,
  ADMIN_UPLOAD_FILE: ADMIN_UPLOAD_FILE,
  ADMIN_DEL_FILE: ADMIN_DEL_FILE,
  ADMIN_LOGIN: ADMIN_LOGIN,
  ADMIN_LOGIN_OUT: ADMIN_LOGIN_OUT,
  ADMIN_VIDEO_ADD: ADMIN_VIDEO_ADD,
  ADMIN_VIDEO_UPDATE: ADMIN_VIDEO_UPDATE,
  ADMIN_VIDEO_GET: ADMIN_VIDEO_GET,
  ADMIN_VIDEO_LIST: ADMIN_VIDEO_LIST,
  ADMIN_CLASSIFY_ALL: ADMIN_CLASSIFY_ALL,
  USER_VIDEO_LIST: USER_VIDEO_LIST
};
export default Const;
