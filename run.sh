#!/bin/bash

# Go to client directory and run npm run dev in the background
cd client
echo "Starting client..."
npm run dev &
CLIENT_PID=$!

# Go to server directory and run npm run dev in the background
cd ../server
echo "Starting server..."
npm run dev &
SERVER_PID=$!

# Wait for both processes to exit
wait $CLIENT_PID
wait $SERVER_PID
