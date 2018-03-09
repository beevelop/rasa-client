#!/bin/bash

echo "Launching Rasa core HTTP server"

python -m rasa_core.server -d models/dialogue -u models/nlu/current -o out.log