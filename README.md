# Tên hệ thống: Rasa music bot
## Mục tiêu:
Tạo một chat bot có tác dụng bật nhạc theo yêu cầu của người dùng và bật nhạc theo tâm trạng người dùng
## Công nghệ sử dụng
* Tạo chat bot sử dụng: [Rasa Open Source](rasa.com)
* Tạo website sửa dụng: ExpressJS, Javascript, Html, CSS, SocketIO
## Hướng dẫn cài đặt
Clone project:
>git clone https://github.com/DuongSonn/Rasa_Chatbot.git

Mở foler src: 
> cd src

Cài đặt package của Nodejs: 
> npm install

Mở folder rasa: 
> cd rasa

Tạo virtualenv: 
> virtualenv .env

Bật virtualenv: 
> .env\Scripts\activate

Cài đặt rasa: 
> pip install rasa

## Hướng dẫn sử dụng
Bật server:
> nodemon app.js

Bật rasa api server
> cd rasa

> .env\Scripts\activate

> rasa run  --enable-api

Bật rasa action server
> cd rasa

> .env\Scripts\activate

> rasa run actions --actions actions --v

## Demo video

