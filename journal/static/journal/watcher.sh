#!/bin/bash
./node_modules/node-sass/bin/node-sass scss -w -r -o dist/ &
webpack --watch --progress &
inotifywait -mq -e modify dist/bundle.js | while read file; do (notify-send "Assets Compiled" "$file" -t 200&) done
