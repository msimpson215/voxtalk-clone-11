class VoiceChat {
    constructor() {
        this.ws = null;
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.isRecording = false;
        
        this.micBtn = document.getElementById('micBtn');
        this.statusMessage = document.getElementById('status');
        this.messagesContainer = document.getElementById('messages');
        
        this.initializeWebSocket();
        this.setupEventListeners();
    }

    initializeWebSocket() {
        this.ws = new WebSocket('ws://localhost:3000/ws');
        
        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            switch(data.type) {
                case 'vad':
                    this.updateStatus(data.status);
                    break;
                case 'transcription':
                    this.addMessage('You', data.text);
                    break;
                case 'chat_response':
                    this.addMessage('AI', data.text);
                    break;
                default:
                    console.log('Unknown message type:', data);
            }
        };

        this.ws.onclose = () => {
            this.statusMessage.textContent = 'Disconnected from server. Reconnecting...';
            setTimeout(() => this.initializeWebSocket(), 5000);
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.statusMessage.textContent = 'Error connecting to server';
        };
    }

    setupEventListeners() {
        this.micBtn.addEventListener('click', () => this.toggleRecording());
        this.micBtn.addEventListener('mousedown', () => this.micBtn.classList.add('active'));
        this.micBtn.addEventListener('mouseup', () => this.micBtn.classList.remove('active'));
        this.micBtn.addEventListener('mouseleave', () => this.micBtn.classList.remove('active'));
    }

    toggleRecording() {
        if (this.isRecording) {
            this.stopRecording();
        } else {
            this.startRecording();
        }
    }

    async startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.ws.send(event.data);
                }
            };

            this.mediaRecorder.start(100);
            this.isRecording = true;
            this.micBtn.classList.add('recording');
            this.statusMessage.textContent = 'Recording...';
        } catch (error) {
            console.error('Error starting recording:', error);
            this.statusMessage.textContent = 'Error accessing microphone';
        }
    }

    stopRecording() {
        if (this.mediaRecorder) {
            this.mediaRecorder.stop();
            this.mediaRecorder = null;
        }
        this.isRecording = false;
        this.micBtn.classList.remove('recording');
        this.statusMessage.textContent = 'Click to start speaking';
    }

    updateStatus(status) {
        if (status === 'active') {
            this.statusMessage.textContent = 'Voice detected...';
        } else {
            this.statusMessage.textContent = 'No voice detected';
        }
    }

    addMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender.toLowerCase()}`;
        messageDiv.textContent = text;
        this.messagesContainer.appendChild(messageDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new VoiceChat();
});
