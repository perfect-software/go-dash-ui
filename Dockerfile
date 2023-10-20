# node block
FROM node:alpine3.16 as nodework
WORKDIR /go-dash-ui
COPY package.json .
RUN npm install
COPY . . 
RUN npm run build

#nginx block
FROM nginx:1.23-alpine
COPY --from=nodework /go-dash-ui/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
ENTRYPOINT ["nginx", "-g", "daemon off;"]