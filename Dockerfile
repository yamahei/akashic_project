FROM node:lts-alpine

WORKDIR /akashic/prj

RUN npm install -g @akashic/akashic-cli

EXPOSE 3300
EXPOSE 3000

CMD ["/bin/sh"]
