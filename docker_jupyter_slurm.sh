#!/bin/bash                                                                                                                                                            

#SBATCH --job-name=jupyterVF                                                                                                                                           
#SBATCH --partition=gpu                                                                                                                                                
#SBATCH --qos=normal                                                                                                                                                   
#SBATCH --mem-per-cpu=1gb                                                                                                                                              
#SBATCH -t 00-16:00:00                                                                                                                                                 
#SBATCH --gres=gpu:1                                                                                                                                                   
#SBATCH --error=/rdma/flash/vferrera/slurm_error_logs/error_%j.err                                                                                                     
#SBATCH --output=/rdma/flash/vferrera/slurm_output_logs/log_%j.out                                                                                                     


docker run --gpus=1 -p 7557:9995 -p 8848:8888 -v /rdma/flash/vferrera:/home/vferrera -v /xcitelab/backup/DOT/data/:/home/vferrera/image-classifica
tion-tool/DOT -v /xcitelab/backup/ny511/data/:/home/vferrera/image-classification-tool/ny511 -e GRANT_SUDO=yes -e JUPYTER_ENABLE_LAB=yes -e NB_UID
="$(id -u)" -e NB_GID=1711 -w "/home/vferrera" --user root cschranz/gpu-jupyter:v1.4_cuda-11.2_ubuntu-20.04_python-only
