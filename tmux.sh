# Session Name
session="NPT"

# Start New Session with our name
tmux new-session -d -s $session

# Name first Window
tmux rename-window -t 0 'npt'

# Setup Snowpack window
tmux split-window -h
tmux select-pane -t 0
tmux split-window -v
tmux select-pane -t 2
tmux split-window -v
tmux select-pane -t 2

tmux send-keys -t "$session:npt.0" "npm run start" C-m
tmux send-keys -t "$session:npt.1" 'jupyter notebook' C-m
tmux send-keys -t "$session:npt.2" 'source ./nptenv/bin/activate' C-m
tmux send-keys -t "$session:npt.2" 'npm run startapp' C-m
tmux send-keys -t "$session:npt.3" 'wsl-open http://localhost:50001/' C-m
tmux send-keys -t "$session:npt.3" 'wsl-open http://localhost:8888/notebooks/test-notebook.ipynb' C-m

tmux attach -t $session