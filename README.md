# MBDSCoteIvoireAPI

### Developers :
[1]. kambel kouame
[2]. Paterne Ablin


## Lunch on local env (develop environment)

[1]'nodemon / npm start'
### web service build on container  
[1] build
sudo docker build . -t 08074105a/webService
[2] run container
sudo docker run -p 8010:3009 -d 08074105a/webService
[3] stop container
sudo docker stop  
[4] pushing  images
4.1. login
sudo docker login -u 08074105a
4.2. push
sudo docker push 08074105a/webService

    exple:     sudo docker push 08074105a/webService


[5] pulling images
sudo docker pull 08074105a/webService

  exple:     sudo docker pull 08074105a/webService


[6] exec docker
[a] sudo  docker exec -it  sh
//monitoring of app
[a] sudo  docker exec -it  pm2 monit	// Monitoring CPU/Usage of each process
[b] sudo  docker exec -it  pm2 list	// Listing managed processes
[c] sudo docker exec -it  pm2 show	// Get more information about a process
[d] sudo docker exec -it  pm2 reload all	// 0sec downtime reload all applications

important
for all developpers
use
[$] 'loggers' functions (info, warn, error) for log application
[$] 'respond' function to return data and success traitement
[$] 'resject' function to return data and fail traitmement

setup application

kambel.k
mbds cote d'ivoire
dataScientist

