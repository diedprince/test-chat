const socket = io();
const userNameElement = document.getElementById('user-name');
const deleteChatBtn = document.getElementById('delete-chat-btn');
const passwordModal = document.getElementById('password-modal');
const passwordInput = document.getElementById('password-input');
const confirmPasswordBtn = document.getElementById('confirm-password-btn');
const errorMessage = document.getElementById('error-message');
const messageInput = document.getElementById('message-input');
const sendMessageBtn = document.getElementById('send-message-btn');
const chatHistory = document.getElementById('chat-history');

// Генерация случайного имени
function generateRandomName() {
    const randomNames = ['Алекс', 'Денис', 'Марина', 'Ирина', 'Евгений', 'Тимур', 'София'];
    return randomNames[Math.floor(Math.random() * randomNames.length)];
}

const userName = generateRandomName();
userNameElement.textContent = userName;

// Получаем историю сообщений при подключении
socket.on('chat-history', (messages) => {
    chatHistory.innerHTML = '';
    messages.forEach(msg => displayMessage(msg));
});

// Отправка сообщения
sendMessageBtn.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message) {
        const browserInfo = navigator.userAgent;
        socket.emit('send-message', { message, senderName: userName, browserInfo });
        messageInput.value = ''; // Очищаем поле ввода
    }
});

// Получение нового сообщения
socket.on('new-message', (messageData) => {
    displayMessage(messageData);
});

// Отображение сообщений в чате
function displayMessage({ senderName, message, browserInfo, time
