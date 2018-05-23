//获取指定hash值
export function getHashParameter(key){
    const arr = (location.hash || "").replace(/^\#/,'').split("&");
    const params = {};
    for(let i=0; i<arr.length; i++){
        let data = arr[i].split("=");
        if(data.length == 2){
             params[data[0]] = data[1];
        }
    }
    return params[key];
}