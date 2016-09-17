#!/bin/bash
webpack --watch --progress &
inotifywait -mq -e modify dist/ | while read file; do (notify-send "Assets Compiled" "$file" -t 200&) done
