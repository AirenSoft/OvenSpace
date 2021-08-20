#!/bin/bash
PID=`ps -eaf | grep "OvenSpace" | grep -v grep | awk '{print $2}'`
if [[ "" !=  "$PID" ]]; then
  echo "killing $PID"
  sudo kill -9 $PID
fi

./run.sh