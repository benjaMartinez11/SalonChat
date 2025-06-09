// server.js
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const PORT = process.env.PORT || 3000;

const connectedUsers = {}; // Almacena usuarios conectados y sus avatares

io.on('connection', (socket) => {
    console.log('Un usuario se ha conectado:', socket.id);

    // Evento para configurar el avatar del usuario al unirse
    socket.on('joinChat', (userData) => {
        connectedUsers[socket.id] = {
            userId: userData.userId, // Podría ser un ID de base de datos o generado
            username: userData.username,
            avatarConfig: userData.avatarConfig
        };
        io.emit('userJoined', connectedUsers[socket.id]); // Notificar a todos que un usuario se unió
        console.log('Usuario unido:', connectedUsers[socket.id].username);
    });

    // Evento para enviar mensajes
    socket.on('sendMessage', (messageData) => {
        const senderInfo = connectedUsers[socket.id];
        if (senderInfo) {
            const fullMessage = {
                senderId: senderInfo.userId,
                senderUsername: senderInfo.username,
                senderAvatarConfig: senderInfo.avatarConfig,
                content: messageData.content,
                timestamp: new Date().toISOString()
            };
            io.emit('receiveMessage', fullMessage); // Enviar mensaje a todos los clientes

            // Lógica para detectar emojis y emitir eventos de reacción
            if (fullMessage.content.includes('😂')) {
                io.emit('triggerReaction', { userId: fullMessage.senderId, reaction: 'laugh' });
            } else if (fullMessage.content.includes('❤️')) {
                io.emit('triggerReaction', { userId: fullMessage.senderId, reaction: 'heart' });
            }
            // Puedes añadir más lógica para otros emojis
        }
    });

    // Evento de desconexión
    socket.on('disconnect', () => {
        const disconnectedUser = connectedUsers[socket.id];
        if (disconnectedUser) {
            delete connectedUsers[socket.id];
            io.emit('userLeft', disconnectedUser.userId); // Notificar a todos que un usuario se fue
            console.log('Un usuario se ha desconectado:', disconnectedUser.username);
        }
    });
});

http.listen(PORT, () => {
    console.log(`Servidor de chat escuchando en el puerto ${PORT}`);
});