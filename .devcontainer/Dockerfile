# Base Image
FROM nginx


# If the steps of a `Dockerfile` use files that are different from the `context` file, COPY the
# file of each step separately; and RUN the file immediately after COPY
WORKDIR /app
COPY /.devcontainer/nginx.conf /etc/nginx/nginx.conf


# Environment
SHELL [ "/bin/bash", "-c" ]


# Setting-up
RUN apt update && apt -q -y upgrade && apt -y install sudo && \
    sudo apt -y install wget && sudo apt -y install curl && sudo apt -y install unzip && \
    sudo apt -y install vim && \
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "/tmp/awscliv2.zip" && \
    unzip /tmp/awscliv2.zip -d /tmp/ && cd /tmp && sudo ./aws/install && cd /app && \
    echo "$PWD" && echo "$LS"


# Port
EXPOSE 80


# ENTRYPOINT
ENTRYPOINT ["bash"]
