FROM node:22.19

WORKDIR /red_tetris

#EXPOSE 3000

COPY . .

RUN npm install
RUN npm run build

CMD [ "npm", "run", "srv-dev" ]
