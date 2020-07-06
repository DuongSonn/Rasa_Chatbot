const express = require('express');
const app = express();
const http = require('http').createServer(app);
const path = require('path');
// Socket.io
const io = require('socket.io')(http);
// ytdl
const readline = require('readline');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
// ytsr
const ytsr = require('ytsr');
// request
const request = require('request');
// dotenv
const dotenv = require('dotenv');
dotenv.config();
// fs
const fs = require('fs');

const PORT = process.env.PORT || 3000;

const options = {
    limit: 1,
}

const uri_rasa = "http://localhost:5005/webhooks/rest/webhook";
const uri_rasa_nlu = "http://localhost:5005/model/parse";
const uri_youtube_search = "https://www.googleapis.com/youtube/v3/search";

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

app.use(express.static(path.join(__dirname, '/public/')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/index.html'));
});

io.on('connection', (socket) => {
    console.log('Connected...');
    socket.on('message', (msg) => {
        request.post(uri_rasa_nlu, {
            json: {
                "text": msg.message
            }
        }, (error, res, body) => {
            if (error) {
              throw error;
            }
            let id = null;
            console.log(body.entities);
            if (body.intent.name == "user_song") {
                if (msg.audio) {
                    socket.emit('message', {user: "Bot", message: "Sorry, there is a song playing, i can't play another song"});
                } else {
                    songName = body.entities[0].value.toString();

                    socket.emit('message', {user: "Bot", message: "I am preparing your song. Please wait :)"});
                    
                    console.log(process.env.GOOGLE_API_KEY);
                    var params = {part: 'snippet', q: songName, type: 'video', key :process.env.GOOGLE_API_KEY};
                    request({url:uri_youtube_search, qs:params}, function(err, response, body) {
                        if (err) throw err;
                        
                        let jsonBody = JSON.parse(body);

                        console.log("Get body: " + JSON.parse(body).items);
                        if (jsonBody.items.length > 0) {
                            id = jsonBody.items[0].id.videoId.toString();
                            console.log(id);
                            downloadMusic(id, socket);
                        } else {
                            socket.emit('message', {user: "Bot", message: "Sorry I can't find your song :("});
                        }
                    });
                }
            }
            else {
                request.post(uri_rasa, {
                    json: {
                        "sender" : msg.user,
                        "message": msg.message,
                    }
                }, (error, res, body) => {
                    if (error) {
                        throw error;
                    }
                    console.log(body[0]);
                    if (body[0].recipient_id == msg.user) {
                        socket.emit('message', {user: "Bot", message: body[0].text});
                    }

                    if (body[0].text == "Sorry to hear that. I will find a song that suit your mood :(") {
                        songName = "bad day"

                        socket.emit('message', {user: "Bot", message: "I am preparing your song. Please wait :("});
                        
                        console.log(process.env.GOOGLE_API_KEY);
                        var params = {part: 'snippet', q: songName, type: 'video', key :process.env.GOOGLE_API_KEY};
                        request({url:uri_youtube_search, qs:params}, function(err, response, body) {
                            if (err) throw err;
                            
                            let jsonBody = JSON.parse(body);

                            console.log("Get body: " + JSON.parse(body).items);
                            if (jsonBody.items.length > 0) {
                                id = jsonBody.items[0].id.videoId.toString();
                                console.log(id);
                                downloadMusic(id, socket);
                            } else {
                                socket.emit('message', {user: "Bot", message: "Sorry I can't find your song :("});
                            }
                        });
                    } else if (body[0].text == "Glad to hear that. Hope you like this song :)") {
                        songName = "happy"

                        socket.emit('message', {user: "Bot", message: "I am preparing your song. Please wait :)"});
                        
                        console.log(process.env.GOOGLE_API_KEY);
                        var params = {part: 'snippet', q: songName, type: 'video', key :process.env.GOOGLE_API_KEY};
                        request({url:uri_youtube_search, qs:params}, function(err, response, body) {
                            if (err) throw err;
                            
                            let jsonBody = JSON.parse(body);

                            console.log("Get body: " + JSON.parse(body).items);
                            if (jsonBody.items.length > 0) {
                                id = jsonBody.items[0].id.videoId.toString();
                                console.log(id);
                                downloadMusic(id, socket);
                            } else {
                                socket.emit('message', {user: "Bot", message: "Sorry I can't find your song :("});
                            }
                        });
                    }
                })
            }
        })
    });
});

function downloadMusic(id, socket) {
    if (id != null) {
        try {
            fs.unlinkSync(`${__dirname}/public/music/song.mp3`);
            //file removed
        } catch(err) {
            console.error(err);
        }

        let stream = ytdl(id, {
            quality: 'highestaudio',
        });

        ffmpeg(stream)
        .audioBitrate(128)
        .save(`${__dirname}/public/music/`+ id +`.mp3`)
        .on('progress', p => {
            readline.cursorTo(process.stdout, 0);
            process.stdout.write(`${p.targetSize}kb downloaded`);
        })
        .on('end', () => {
            socket.emit('message', {user: "Bot", message: "Your song is ready. Enjoy!", id: id});
        });
    }
}