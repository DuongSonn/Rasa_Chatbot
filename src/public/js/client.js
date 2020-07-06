const socket = io();

let name;
let textarea = document.getElementById('textarea');
let messageArea = document.getElementById('message-area');
let music = document.getElementById('music');
let audio = document.getElementById('song');

while(!name) {
    name = prompt('Please enter your name: ');
}

textarea.addEventListener('keyup', (e) => {
    if(e.key === 'Enter') {
        if (music.hasChildNodes()) {
            if (audio.currentTime && !audio.paused) {
                audioStatus = true;
            } else {
                audioStatus = false;
            }
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
            id = "music/"+ msg.id +".mp3";
            music.innerHTML = '';
            var audio = document.createElement("audio");
            audio.setAttribute("id", "song");
            audio.setAttribute("src", id);
            audio.setAttribute("type", "audio/mpeg");
            audio.setAttribute("onended", "songEnded()");
            music.appendChild(audio);
            audio.play();
        } else {
            id = "music/"+ msg.id +".mp3";
            var audio = document.createElement("audio");
            audio.setAttribute("id", "song");
            audio.setAttribute("src", id);
            audio.setAttribute("type", "audio/mpeg");
            audio.setAttribute("onended", "songEnded()");
            music.appendChild(audio);
            audio.play();
        }
        appendMessage(msg, 'incoming');
        scrollToBottom();
    } else if (msg.message == "-again") {
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
    let msg = {
        user: name,
        message: "Done playing",
    };

    socket.emit('message', msg);
}