FROM ubuntu:20.10

RUN apt update \
    && apt install -y --no-install-recommends python3.8 python3-pip libglib2.0-0 \
    libsm6 libxext6 libxrender-dev \
    && apt autoclean && apt autoremove

RUN pip3 install --no-cache flask numpy tensorflow tensorflow-gpu opencv-python \
    opencv-contrib-python python-socketio[client]


# setup gpu
RUN apt install ubuntu-drivers-common
#RUN ubuntu-drivers autoinstall

RUN wget -O /etc/apt/preferences.d/cuda-repository-pin-600 https://developer.download.nvidia.com/compute/cuda/repos/ubuntu1804/x86_64/cuda-ubuntu1804.pin
RUN sudo apt-key adv --fetch-keys https://developer.download.nvidia.com/compute/cuda/repos/ubuntu1804/x86_64/7fa2af80.pub
RUN sudo add-apt-repository "deb http://developer.download.nvidia.com/compute/cuda/repos/ubuntu1804/x86_64/ /"

# required by tensorflow
RUN sudo apt install cuda-10-1

RUN tar -xzvf cudnn-x.x-linux-x64-v7.x.x.x.tgz \
    && sudo cp cuda/include/cudnn*.h /usr/local/cuda/include \
    && sudo cp cuda/lib64/libcudnn* /usr/local/cuda/lib64 \
    && sudo chmod a+r /usr/local/cuda/include/cudnn*.h /usr/local/cuda/lib64/libcudnn*

RUN mkdir /srv/app
WORKDIR /srv/app

COPY . .
