#!/bin/sh
tmux start-server
tmux new-session -d -s soitgoes
tmux new-window -tsoitgoes:0 -n SoItGoes

tmux split-window -d -v -tsoitgoes:0
tmux split-window -d -h -tsoitgoes:0
tmux send-keys -tsoitgoes:0.0 'workon soitgoes; DEV=true python manage.py runserver' Enter
tmux send-keys -tsoitgoes:0.1 'cd journal/static/journal; ./watcher.sh' Enter
tmux send-keys -tsoitgoes:0.2 'workon soitgoes' Enter

tmux select-window -tsoitgoes:0
tmux selectp -tsoitgoes:0.2
tmux attach-session -d -tsoitgoes
