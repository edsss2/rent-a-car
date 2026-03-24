az acr login --name acrlab007edsss

docker tag bff-rent-a-car-local acrlab007edsss.azurecr.io/bff-rent-a-car-local:v1

docker push acrlab007edsss.azurecr.io/bff-rent-a-car-local:v1

az containerapp env create --name bff-rent-a-car-local --resource-group lab007-rent-car --location eastus

az containerapp create --name bff-rent-a-car-local --resource-group lab007-rent-car --environment bff-rent-a-car-local --image acrlab007edsss.azurecr.io/bff-rent-a-car-local:v1 --target-port 3001 --ingress external --registry-server acrlab007edsss.azurecr.io