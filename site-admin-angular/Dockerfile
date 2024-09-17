FROM node:20.17.0-alpine as build

WORKDIR /app
COPY . .

RUN npm i -g @angular/cli
RUN npm i
RUN npm run build:prod

FROM nginx:1.25.1-alpine

EXPOSE 80

COPY ./nginx_conf_d/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/bookflix/browser /usr/share/nginx/html
