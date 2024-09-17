FROM node:20.17.0-alpine as build

WORKDIR /srv
COPY . .

ENV DATABASE_URL=mysql://root:123@mysqldb:3306/bookflix
ENV SERVER_HOST=0.0.0.0
ENV SERVER_PORT=3000

RUN npm i
RUN npm run build

EXPOSE 3000

CMD [ "/bin/sh", "-c", "ls -la && npx prisma generate && npx prisma migrate deploy && node ./dist/server.js" ]
