#!/bin/bash

echo "ACCOUNT_URL_PREFIX": $ACCOUNT_URL_PREFIX

sed -i 's/-dev/'$ACCOUNT_URL_PREFIX'/g' index.html
nginx -c /nginx/conf/nginx.conf && tail -f /var/log/nginx/access.log
