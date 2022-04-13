FROM keymetrics/pm2:latest-jessie

WORKDIR /app

ENV NPM_CONFIG_LOGLEVEL warn
ENV NODE_ENV=preproduction

COPY package*.json ./
COPY pm2.json ./
COPY ./ /app

RUN npm install
RUN pm2 install pm2-server-monit

EXPOSE 8010

CMD pm2-runtime pm2.json


