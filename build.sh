#!/bin/bash

register=registry.cn-beijing.aliyuncs.com/icsoc/cloud
_tag=`git tag -l "frontend/1.0/*" | awk -F [/] '{print $3;}' | sort -fnr | head -n 1`
echo $_tag 
_new=$((_tag+1))
version=$_new
docker build -t $register-frontend:$version-1.0 .
docker push $register-frontend:$version-1.0

git tag -a frontend/1.0/$version -m '自动发布第$version版本'
git push origin frontend/1.0/$version

cd /etc/ansible/roles/conf-center/cloud/files/deployment
sed -i "s#registry.cn-beijing.aliyuncs.com/icsoc/cloud-frontend:.*#registry.cn-beijing.aliyuncs.com/icsoc/cloud-frontend:$version-1.0#g" cloud-frontend.yaml 

curl 'https://oapi.dingtalk.com/robot/send?access_token=68dca3b4819523cd373702b3ac7b932697954fc8eefea5863496e3eed8b7e883' \
   -H 'Content-Type: application/json' \
   -d '
  {"msgtype": "text", 
    "text": {
        "content": "正在发布cloud-frontend第67-1.0版本"
     }
  }'
TAG=$((version+1))
sed -i "22s/正在发布cloud-frontend第.*-1.0版本/正在发布cloud-frontend第$TAG-1.0版本/" $0
