#!/bin/bash
source venv/bin/activate
nohup gunicorn --bind 0.0.0.0:5000 --worker-class eventlet -w 1 --threads 1 OvenSpace:app &