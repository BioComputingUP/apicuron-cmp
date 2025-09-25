FROM node:jod-bookworm AS dev

WORKDIR /home/node/app

ARG UID=1000
ARG GID=1000

RUN groupmod -g $GID node && \
    usermod -u $UID -g $GID node

USER node

CMD ["npm", "run", "start:dev"]