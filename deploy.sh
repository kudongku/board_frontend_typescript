#!/bin/bash

# env
APP_NAME="board-front"
IMAGE_NAME="kudongku/board-front-image"
IMAGE_TAG="latest"
DEPLOYMENT_NAME="board-front"
SERVICE_NAME="board-front-service"
PORT="3000"

# build docker image
echo "1. build docker image..."
docker build -t ${IMAGE_NAME}:${IMAGE_TAG} . || { echo "build docker image failed!"; exit 1; }

# push docker image to hub
echo "2. push docker image to hub..."
docker push ${IMAGE_NAME}:${IMAGE_TAG} || { echo "push docker image to hub failed!"; exit 1; }

# deploy new image to kubernetes
echo "3. deploy new image to kubernetes..."
kubectl set image deployment/${DEPLOYMENT_NAME} ${APP_NAME}=${IMAGE_NAME}:${IMAGE_TAG} || { echo "deploy new image to kubernetes failed!"; exit 1; }

# check roll out status
echo "4. check roll out status..."
kubectl rollout status deployment/${DEPLOYMENT_NAME} || { echo "check roll out status failed!"; exit 1; }

function port_forward(){
    # port forwarding
    echo "finish. port-forwarding ${PORT}..."
    kubectl port-forward service/${SERVICE_NAME} ${PORT}:${PORT} || { echo "port-forwarding failed!"; exit 1; }
}

if [ "$1" == "port-forward" ]; then
    port_forward
fi
