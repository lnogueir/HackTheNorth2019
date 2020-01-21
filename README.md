# Senses
For Hack the North 2019, in under 24 hours, we created a mobile app that lets you take a photo and receive a quick audio and text response of the content of the photo in the language of your choice. View more about it on: [Youtube](https://www.youtube.com/watch?v=sIyQeOB-pRg&feature=youtu.be&t=64) and on [Devpost.](https://devpost.com/software/senses-ps5gwm)

![Senses main page](https://github.com/lnogueir/HackTheNorth2019/blob/master/app/assets/senses_main_screen.jpeg)

## How to Run the App

Notes:
It is assumed that you have node, git, npm, python and pip installed on your machine.
Besides that, this app uses [Expo Client](https://expo.io/learn), therefore in order to run it, you will need to have the Expo App downloaded on your phone. 
It is also required that the phone which you will run the app on and the computer which you are running the app from are under the same network.

### Steps

1. git clone https://github.com/lnogueir/HackTheNorth2019.git
2. Open two terminal windows and cd into HackTheNorth2019
3. Follow the server and app setup

#### Server Setup
On the first terminal window, assuming you are under HackTheNorth2019 directory:
1. cd server
2. pip install -r requirements.txt
3. Open server.py on line 12 edit variable "host" to your computer ip (unfortunately, the phone can't access the endpoints with localhost as the host)
4. python server.py

#### App Setup
On the other terminal window, assuming you are under HackTheNorth2019 directory:
1. cd app
2. sudo npm install
3. Open App.js and on line 10 edit "USER_IP" variable to your computer ip. 
4. npm start
5. Scan QR Code displayed on terminal window

The app should be now running on your phone.


## About

We wanted to give people a new way to learn languages. Since we both come from international families, we believed in something that would help new people in a foreign country.

Having just met this weekend, we were able to form a team and finish the complete project within 24 hours. This was a great experience for our first hackathon!

## How we built it
The app is built using the javascript framework for mobile apps, react-native. We used a flask server as well as the google apis (vision, speech, translate) to process the user requests from the app.


## Technologies
* React Native
* Python Flask
* Google Apis

## Authors
* [**Lucas Nogueira**](https://github.com/lnogueir)
* [**Sergio Sanchez**](https://github.com/SergioSanchez12)

