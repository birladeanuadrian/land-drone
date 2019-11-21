FROM ubuntu:18.04

LABEL maintainer="Manraj Singh Grover <manrajsinghgrover@gmail.com>"

# Install basic CLI tools etc.
RUN apt-get update && apt-get install -y --fix-missing --no-install-recommends \
        build-essential \
        curl \
        git-core \
        iputils-ping \
        pkg-config \
        rsync \
        software-properties-common \
        unzip \
        wget

# Install NodeJS
RUN curl --silent --location https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install --yes nodejs

# Install yarn
RUN npm install -g yarn

# Install tfjs-node
RUN yarn add @tensorflow/tfjs
RUN yarn add @tensorflow/tfjs-node

# Clean up commands
RUN apt-get autoremove -y && apt-get clean && \
    rm -rf /usr/local/src/*

RUN apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR "/root/project"
CMD ["/bin/bash"]
