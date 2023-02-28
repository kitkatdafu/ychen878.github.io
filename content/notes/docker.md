---
title: "Docker"
date: 2023-02-25T22:49:32-06:00
tags: ["big data"]
---

# Virtualization

Virtualization is the illusion of private resources, provided by the software. We have virtual memory, virtual machine (hardware), virtual machine (languages), virtual operating system (container).
- Each process using a virtual address space is not aware of other processes using memory (illusion of private memory).
- Virtualized resources include CPU, RAM, disks, network devices, etc. VMs rarely use all their allocated resources, so overbooking is possible. If each program is deployed to a different VM, operating system overheads dominate.
- JVM or PVM runs Java Bytecode and Python Bytecode. Programs written in Java and Python are compiled to their corresponding byte code instead of a specific machine code.
- Virtual operating systems, or a containers, are run on a some flavor of Linux.  You can have a container of Ubuntu and a container on Debian (but not Windows, since they are running on top of Linux). Containers are more efficient than virtual machines, but less flexible.

Containers and Virtual Machines are Sandboxes. 

# Docker Containers

Containers are lightweight alternative to virtual machines. Virtual machines form a cluster. Resources of the cluster are limited to those of a single VM that runs there containers.

# Registries, Images, Containers, and Dockerfiles

The Images and the Containers are going to be on your VM. The images are pulled from the Registries (dockerhub, for example). Images are snapshots of installed software. From these images, we can run them to start a container. We can also build our own images and run them later.

# Docker Commands

1. `docker images`: to list all the images I currently have.
2. `docker pull IMAGENAME`: to pull an image. If the image is not installed, it will try to pull it first.
3. `docker tag IMAGE:TAG NEW_TAG`: to create a new tag for an existing image.
4. `docker run TAG COMMAND`: to run a container and let the container runs the command.
5. `docker run -it TAG COMMAND`: to run a container with the command interactively.
6. `docker ps`: to show all running containers
7. `docker ps -a`: to show all containers
8. `docker ps -a -q`: to show containers with ID only
9. `docker rm $(docker ps -a -q)`: to delete all containers
10. `docker rmi IMAGE`: to remove an image
11. `docker run -d IMAGE COMMADN`: to run a docker container in a deamon mode.
12. `docker logs CONTAINER_ID`: to show the output of a container
13. `docker exec [-it] CONTAINER_ID`: to jump into an existing running container
14. `docker build DIRECTORY -t TAG`: make a container from the dockerfile (in the current directory) and save it into DIRECTORY with a TAG.
15. `docker run -d -p 127.0.0.1:300:80 IMAGE`: redirect incoming data from port 300 to port 80

# Dockerfile instructions

1. `FROM`: run which image
2. `RUN`: run which command
3. `COPY`: copy a program on my computer into the image
4. `CMD`: default command you want to run

```Dockerfile
 FROM ubuntu:22.10
 RUN apt-get update
 RUN apt-get install -y python3 python3-pip curl lsof
 RUN pip3 install jupyterlab==3.4.5 MarkupSafe==2.0.1
 CMD [python3, -m, jupyterlab, --no-browser, --ip=0.0.0.0, --port=80, --allow-root, --NotebookApp.token='']
```

# SSH port forwarding

`ssh USER@VM -L localhost:5000:localhost:300`
client side listens to port 5000
sshd redirects data to port 300 on the server side.

# Container Orchestration

Orchestration lets you deploy many cooperating containers across a cluster of Docker workers. Kubernetes is the most well known. Docker compose is a simpler too that lets you deploy cooperating containers to a single worker.

```yaml
services:
  jupyter:
    image: myimg
    deploy:
      replicas: 3
```

1. `docker compose up`: compose containers using the yaml file in the current directory.
2. `docker compose ps`: show the containers created withe the yaml config file in the current directory.
3. `docker compose logs`: show the outputs of these containers.
4. `docker compose down`: remove composed containers.
