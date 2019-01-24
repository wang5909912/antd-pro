FROM registry.islide.cc/k8s/hello:app-v1
COPY . /data
WORKDIR /var/www/html