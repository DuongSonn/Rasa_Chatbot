const socket = io();

let name;
let textarea = document.getElementById('textarea');
let messageArea = document.getElementById('message-area');
let music = document.getElementById('music');

while(!name) {
    name = prompt('Please enter your name: ');
}

textarea.addEventListener('keyup', (e) => {
    if(e.key === 'Enter') {
        if (music.hasChildNodes()) {
            audioStatus = true;
        } else {
            audioStatus = false;
        }
        sendMessage(e.target.value, audioStatus);
    }
})

function sendMessage(message, audioStatus) {
    let msg = {
        user: name,
        message: message.trim(),
        audio: audioStatus,
    };
    // Append 
    appendMessage(msg, 'outgoing');
    textarea.value = '';
    scrollToBottom();

    // Send to server 
    socket.emit('message', msg);
}

function appendMessage(msg, type) {
    let mainDiv = document.createElement('div');
    let className = type;
    mainDiv.classList.add(className, 'message');

    let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
    `
    mainDiv.innerHTML = markup;
    messageArea.appendChild(mainDiv);
}

// Recieve messages 
socket.on('message', (msg) => {
    if (msg.message == "Your song is ready. Enjoy!") {
        if (music.hasChildNodes()) {
            music.innerHTML = '';
            var audio = document.createElement("audio");
            audio.setAttribute("src", "music/song.mp3");
            audio.setAttribute("type", "audio/mpeg");
            audio.setAttribute("onended", "songEnded()");
            music.appendChild(audio);
            audio.play();
        } else {
            var audio = document.createElement("audio");
            audio.setAttribute("src", "music/song.mp3");
            audio.setAttribute("type", "audio/mpeg");
            audio.setAttribute("onended", "songEnded()");
            music.appendChild(audio);
            audio.play();
        }
        appendMessage(msg, 'incoming');
        scrollToBottom();
    } else if (msg.message == "-again") {
        music.innerHTML = '';
        var audio = document.createElement("audio");
        audio.setAttribute("src", "music/song.mp3");
        audio.setAttribute("type", "audio/mpeg");
        audio.setAttribute("onended", "songEnded()");
        music.appendChild(audio);
        audio.play();
    } else {
        appendMessage(msg, 'incoming');
        scrollToBottom();
    }
})

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight;
}

function songEnded() {
    music.innerHTML = '';

    let msg = {
        user: name,
        message: "Done playing"
    };

    socket.emit('message', msg);
}