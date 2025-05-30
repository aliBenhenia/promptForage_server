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



JWT_SECRET="770c488038d1507c4dfa710bf677b921dfcf1a3dab0f12f1ee091954d2215d4a9f246cc780d6382c973ba2a8e0f08edbb699d7c4bb4ba5324a320910492000bc"
MONGO_URI="mongodb+srv://alibenhenia1:3TkEK63GFAfL8ZZf@cluster0.l3xb1ca.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
OPENROUTER_KEY="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";


#email service
EMAILJS_USER_ID="HRa2xzL12pjZCYuPU"
EMAILJS_SERVICE_ID="service_yai5d8o"
EMAILJS_TEMPLATE_ID="template_j87teza"
EMAILJS_PUBLIC_KEY="HRa2xzL12pjZCYuPU"
# service_2i3n1no
MAILGUN_API_KEY="2f933aac556c49f2f9ba4cc46b3e5172-e71583bb-cbf7ce5d"
MAILGUN_DOMAIN="sandbox3e15de5ca70d49b19eefc89318e34ff2.mailgun.org"



dev= true