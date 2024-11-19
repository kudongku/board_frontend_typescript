## Kubernetes

### update kubernetes 에 반영하기

```bash
docker build -t kudongku/board-front-image .
docker push kudongku/board-front-image:latest
kubectl set image deployment/board-front board-front=kudongku/board-front-image:latest # 어플리케이션 새 버전의 이미지 적용
kubectl port-forward service/board-front-service 3000:3000 # port-forward 로 로컬에서 확인
```
