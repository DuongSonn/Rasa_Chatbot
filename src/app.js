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

const PORT = process.env.PORT || 3000;

const options = {
    limit: 1,
}

const uri_rasa = "http://localhost:5005/webhooks/rest/webhook";
const uri_rasa_nlu = "http://localhost:5005/model/parse";

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
            console.log(body.entities);
            if (body.intent.name == "user_song") {
                songName = body.entities[0].value.toString();

                socket.emit('message', {user: "Bot", message: "I am preparing your song. Please wait :)"});
    
                let id = null;
    
                ytsr(songName, options, function(err, searchResult) {
                    if (err) throw err;
                    id = searchResult.items[0].link.replace("https://www.youtube.com/watch?v=", "").toString();
    
                    console.log(id);
                    let stream = ytdl(id, {
                    quality: 'highestaudio',
                    });
    
                    ffmpeg(stream)
                    .audioBitrate(128)
                    .save(`${__dirname}/public/music/song.mp3`)
                    .on('progress', p => {
                        readline.cursorTo(process.stdout, 0);
                        process.stdout.write(`${p.targetSize}kb downloaded`);
                    })
                    .on('end', () => {
                        socket.emit('message', {user: "Bot", message: "Your song is ready. Enjoy!"});
                    });
                });
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

                    if (body[0].text == "Sory to hear that. I will find a song that suit your mood :(") {
                        songName = "bad day";

                        socket.emit('message', {user: "Bot", message: "I am preparing your song. Please wait :("});
            
                        let id = null;
            
                        ytsr(songName, options, function(err, searchResult) {
                            if (err) throw err;
                            id = searchResult.items[0].link.replace("https://www.youtube.com/watch?v=", "").toString();
            
                            console.log(id);
                            let stream = ytdl(id, {
                            quality: 'highestaudio',
                            });
            
                            ffmpeg(stream)
                            .audioBitrate(128)
                            .save(`${__dirname}/public/music/song.mp3`)
                            .on('progress', p => {
                                readline.cursorTo(process.stdout, 0);
                                process.stdout.write(`${p.targetSize}kb downloaded`);
                            })
                            .on('end', () => {
                                socket.emit('message', {user: "Bot", message: "Your song is ready. Enjoy!"});
                            });
                        });
                    } else if (body[0].text == "Glad to hear that. Hope you like this song :)") {
                        songName = "happy";

                        socket.emit('message', {user: "Bot", message: "I am preparing your song. Please wait :)"});
            
                        let id = null;
            
                        ytsr(songName, options, function(err, searchResult) {
                            if (err) throw err;
                            id = searchResult.items[0].link.replace("https://www.youtube.com/watch?v=", "").toString();
            
                            console.log(id);
                            let stream = ytdl(id, {
                            quality: 'highestaudio',
                            });
            
                            ffmpeg(stream)
                            .audioBitrate(128)
                            .save(`${__dirname}/public/music/song.mp3`)
                            .on('progress', p => {
                                readline.cursorTo(process.stdout, 0);
                                process.stdout.write(`${p.targetSize}kb downloaded`);
                            })
                            .on('end', () => {
                                socket.emit('message', {user: "Bot", message: "Your song is ready. Enjoy!"});
                            });
                        });
                    }
                })
            }
        })
    });
});