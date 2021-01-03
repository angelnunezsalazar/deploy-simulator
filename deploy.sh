#!/bin/bash
APPLICATION=$1
TAG_NAME=$APPLICATION-cache

echo "Force Building container (don't use cache) ..."
date +%s > /home/ec2-user/$APPLICATION/force-build.txt

echo "Building Container ..."

docker build --build-arg ENVIRONMENT=test -t $TAG_NAME /home/ec2-user/$APPLICATION

echo "Stoping existing container ..."

for runName in `docker ps | grep "$TAG_NAME" | awk '{print $1}'`
do
    if [ "$runName" != "" ]
    then
        docker stop $runName
    fi
done

echo "Executing container ..."

case $APPLICATION in
katu-portal) docker run --name $TAG_NAME --rm -d -p 80:3000 $TAG_NAME ;;
test) docker run --name $TAG_NAME --rm -d -p 90:8080 $TAG_NAME ;;
*)echo "Application doesn't exist"; exit 1 ;;
esac

