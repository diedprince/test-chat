const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let messages = []; // Массив для хранения сообщений

// Статическая папка для отдачи файлов (HTML, CSS, JS)
app.use(express.static('public'));

// Обработка новых подключений
io.on('connection', (socket) => {
    console.log('New user connected:', socket.id);

    // Отправка истории сообщений при подключении
    socket.emit('chat-history', messages);

    // Обработка отправки сообщения
    socket.on('send-message', (messageData) => {
        const { message, senderName, browserInfo } = messageData;
        const newMessage = { senderName, message, browserInfo, time: new Date().toISOString() };
        
        // Сохраняем сообщение
        messages.push(newMessage);

        // Отправляем всем пользователям новое сообщение
        io.emit('new-message', newMessage);
    });

    // Удаление истории чата
    socket.on('delete-history', (password) => {
        if (password === 'sardorsultimate') {
            messages = []; // Очистить историю сообщений
            io.emit('chat-history', messages); // Отправить пустую историю всем
        } else {
            socket.emit('error', 'Неверный пароль');
        }
    });

    // Отключение пользователя
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Запуск сервера
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
