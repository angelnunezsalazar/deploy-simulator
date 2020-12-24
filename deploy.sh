#!/bin/bash

TAG_NAME=katu-portal-cache
docker build -t $TAG_NAME /home/ec2-user/katu-portal

for runName in `docker ps | grep "$TAG_NAME" | awk '{print $1}'`
do
    if [ "$runName" != "" ]
    then
        docker stop $runName
    fi
done
echo "Executing container .."
docker run --name $TAG_NAME --rm -d -p 80:3000 $TAG_NAME