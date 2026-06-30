FROM node:18-alpine AS builder

WORKDIR /app
COPY . .

RUN rm -rf build dist

ENV REACT_APP_API_PATH="/vie-mp3/api"
ENV GENERATE_SOURCEMAP=false

RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]