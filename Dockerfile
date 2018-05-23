FROM centos
MAINTAINER zhanghao@icsoc.net
RUN /usr/bin/yum install -y epel-release && yum clean all
RUN /usr/bin/yum install -y nginx
RUN mkdir -p /www && rm -rf /etc/nginx/nginx.conf && mkdir -pv /nginx/conf
WORKDIR /etc/nginx
WORKDIR /www
ADD ./build/* ./
EXPOSE 8080 
env ACCOUNT_URL_PREFIX="-dev"
#ENTRYPOINT  nginx -c /nginx/conf/nginx.conf && tail -f /var/log/nginx/access.log
COPY run.sh /run.sh
RUN chmod a+x /run.sh
RUN /bin/cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo 'Asia/Shanghai' >/etc/timezone
CMD ["/run.sh"]
