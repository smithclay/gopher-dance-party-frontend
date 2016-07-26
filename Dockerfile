FROM node:6.2
RUN useradd --user-group --create-home --shell /bin/false app

# Where the app lives inside of the container file system
ENV HOME=/home/app

COPY . /home/app

COPY package.json $HOME
RUN chown -R app:app $HOME/*

# Set user and install npm packages
USER app
WORKDIR $HOME
RUN npm install

# Set non-root permissions
USER root
COPY . $HOME
RUN chown -R app:app $HOME/*
USER app

EXPOSE 3000

# Run the node.js app
CMD ["node app.js"]

