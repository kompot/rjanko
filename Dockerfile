FROM iojs:1.8.1
ADD . /code
WORKDIR /code
ENV NODE_TLS_REJECT_UNAUTHORIZED 0
RUN npm install