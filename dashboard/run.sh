#!/bin/bash
# Script to update npm packages, fix issues, and run server.js

APP_DIR="./"   # <-- change to your project folder
NODE_BIN="$(which node)"         # auto-detect node path


echo "🚀 Starting server.js..."
$NODE_BIN server.js



