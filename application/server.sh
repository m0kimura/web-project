#!/bin/sh
cd $HOME/web-project/nodejs/application

sudo cp $HOME/.forever/web.log $HOME/web-project/local/web.log
sudo rm -f $HOME/.forever/web.log

sudo forever -a --uid "web" --minUptime 1000ms --spinSleepTime 1000ms start server.js $1
