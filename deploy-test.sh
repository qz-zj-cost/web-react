#!/bin/bash

yarn build:dev
scp -P 50022 -i ~/.ssh/id_rsa -r ./dist/* root@42.192.80.181:/data/static/cost
