const socket = io();

let name;
let textarea = document.getElementById('textarea');
let messageArea = document.getElementById('message-area');
let audio = document.getElementById('audio');

while(!name) {
    name = prompt('Please enter your name: ');
}

textarea.addEventListener('keyup', (e) => {
    if(e.key === 'Enter') {
        sendMessage(e.target.value);
    }
})

function sendMessage(message) {
    let msg = {
        user: name,
        message: message.trim()
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
        if (audio.src) {
            audio.src = "";
            audio.src = "music/song.mp3";
            audio.load();
            audio.play();
        } else {
            audio.src = "music/song.mp3";
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
        message: "Done playing"
    };

    socket.emit('message', msg);
}