C:\Users\trist\Desktop\Programmation\Docker>docker volume create todo-logs
todo-logs

C:\Users\trist\Desktop\Programmation\Docker>docker run -it --name todo-writer -v todo-logs:/data node:22-alpine sh
Unable to find image 'node:22-alpine' locally
22-alpine: Pulling from library/node
Digest: sha256:968df39aedcea65eeb078fb336ed7191baf48f972b4479711397108be0966920
Status: Downloaded newer image for node:22-alpine
/ # cd data
/data # echo "mon premier log" > first_log.log
/data # echo "mon second log: $(date)" > second_log.log
/data # exit

C:\Users\trist\Desktop\Programmation\Docker>docker run -it --name todo-reader -v todo-logs:/data node:22-alpine sh
/ # cat /data/first_log.log
mon premier log
/ # cat /data/second_log.log
mon second log: Wed Jun  3 12:52:02 UTC 2026
/ # exit

C:\Users\trist\Desktop\Programmation\Docker>docker ps -a
CONTAINER ID   IMAGE                COMMAND                  CREATED          STATUS                      PORTS                                         NAMES
69a9659c8c4f   node:22-alpine       "docker-entrypoint.s…"   22 seconds ago   Exited (0) 6 seconds ago                                                  todo-reader
33cf0436d93d   node:22-alpine       "docker-entrypoint.s…"   56 seconds ago   Exited (0) 27 seconds ago                                                 todo-writer
c8d954bc061f   docker-api           "docker-entrypoint.s…"   2 hours ago      Up 2 hours                  0.0.0.0:3000->3000/tcp, [::]:3000->3000/tcp   docker-api-1
7273fd3498de   postgres:15-alpine   "docker-entrypoint.s…"   2 hours ago      Up 2 hours                  0.0.0.0:5432->5432/tcp, [::]:5432->5432/tcp   docker-db-1
9c57c3b48d42   petcare-worker       "/usr/local/bin/dock…"   2 days ago       Exited (137) 2 days ago                                                   petcare-worker-1
383af0f356cb   petcare-frontend     "/docker-entrypoint.…"   2 days ago       Exited (0) 2 days ago                                                     petcare-frontend-1
dd6705e59741   petcare-app          "/usr/local/bin/dock…"   2 days ago       Exited (0) 2 days ago                                                     petcare-app-1
b8843d0b577b   nginx:1.27-alpine    "/docker-entrypoint.…"   2 days ago       Exited (0) 2 days ago                                                     petcare-nginx-1
8860e30c7f79   postgres:16-alpine   "docker-entrypoint.s…"   2 days ago       Exited (0) 2 days ago                                                     petcare-database-1
cc38b786bef7   axllent/mailpit      "/mailpit"               2 days ago       Exited (0) 2 days ago                                                     petcare-mailer-1

C:\Users\trist\Desktop\Programmation\Docker>docker rm todo-writer todo-reader
todo-writer
todo-reader

C:\Users\trist\Desktop\Programmation\Docker>docker run -it --name todo-checker -v todo-logs:/data node:22-alpine sh
/ # cat /data/first_log.log
mon premier log
/ # cat /data/second_log.log
mon second log: Wed Jun  3 12:52:02 UTC 2026
/ # exit

C:\Users\trist\Desktop\Programmation\Docker>docker rm todo-checker
todo-checker

C:\Users\trist\Desktop\Programmation\Docker>docker volume rm todo-logsVous avez dit : C:\Users\trist\Desktop\Programmation\Docker>docker volume create todo-logs
Error response from daemon: get todo-logsVous: no such volume
Error response from daemon: get avez: no such volume
Error response from daemon: get dit: no such volume
Error response from daemon: get :: no such volume
Error response from daemon: get C:\Users\trist\Desktop\Programmation\Docker: no such volume
Error response from daemon: get volume: no such volume
Error response from daemon: get create: no such volume

C:\Users\trist\Desktop\Programmation\Docker>docker volume rm todo-logs                 
Error response from daemon: get todo-logs: no such volume

C:\Users\trist\Desktop\Programmation\Docker>