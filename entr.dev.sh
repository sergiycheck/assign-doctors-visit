#!/bin/sh

env

set -e

command yarn run build 

echo $PWD
echo 'listing current directory after a build'
echo $(ls -a)

command yarn run start:prod
