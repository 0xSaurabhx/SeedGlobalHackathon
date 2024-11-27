#!/bin/bash
pip install -r requirements.txt
uvicorn api.main:app --reload
