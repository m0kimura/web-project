#!/bin/sh
cd $HOME/web-project/nodejs/application

sudo cp $HOME/.forever/com.log $HOME/web-project/local/com.log
sudo rm -f $HOME/.forever/com.log

sudo forever -a --uid "com" --minUptime 1000ms --spinSleepTime 1000ms start communicator.js $1
