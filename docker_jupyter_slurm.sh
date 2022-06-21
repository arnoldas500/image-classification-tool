#!/bin/bash                                                                                                                                                            

#SBATCH --job-name=jupyterVF                                                                                                                                           
#SBATCH --partition=gpu                                                                                                                                                
#SBATCH --qos=normal                                                                                                                                                   
#SBATCH --mem-per-cpu=1gb                                                                                                                                              
#SBATCH -t 00-16:00:00                                                                                                                                                 
#SBATCH --gres=gpu:1                                                                                                                                                   
#SBATCH --error=/rdma/flash/vferrera/slurm_error_logs/error_%j.err                                                                                                     
#SBATCH --output=/rdma/flash/vferrera/slurm_output_logs/log_%j.out                                                                                                     


docker run --rm -v /rdma/flash/vferrera:/home/vferrera -v /xcitelab/backup/DOT:/home/vferrera/DOT -v /xcitelab/backup/ny511:/home/vferrera/ny511 -u root -e NB_USER=vf\
errera -e NB_UID="$(id -u)" -e NB_GID="$(id -g)" -e CHOWN_HOME=yes -e CHOWN_HOME_OPTS="-R" -w "/home/${NB_USER}" --runtime=nvidia --gpus=1 -p 7995:8888 jupyter/minima\
l-notebook
