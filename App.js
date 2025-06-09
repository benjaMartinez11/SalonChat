// App.js (o un componente principal)
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
import io from 'socket.io-client';
import AvatarCustomizer from './components/AvatarCustomizer';
import ChatMessage from './components/ChatMessage';
import Avatar from './components/Avatar'; // Componente para renderizar el avatar animado

const SOCKET_SERVER_URL = 'http://localhost:3000'; // Ajusta esto a la IP de tu servidor

export default function App() {
    const [isAvatarCustomized, setIsAvatarCustomized] = useState(false);
    const [myAvatarConfig, setMyAvatarConfig] = useState(null);
    const [username, setUsername] = useState('');
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [connectedUsers, setConnectedUsers] = useState([]);
    const socket = useRef(null);
    const scrollViewRef = useRef(null);

    useEffect(() => {
        if (isAvatarCustomized && myAvatarConfig && username) {
            socket.current = io(SOCKET_SERVER_URL);

            socket.current.on('connect', () => {
                console.log('Conectado al servidor WebSocket');
                socket.current.emit('joinChat', { userId: socket.current.id, username, avatarConfig: myAvatarConfig });
            });

            socket.current.on('receiveMessage', (message) => {
                setMessages((prevMessages) => [...prevMessages, message]);
            });

            socket.current.on('userJoined', (user) => {
                setConnectedUsers((prevUsers) => [...prevUsers, user]);
                setMessages((prevMessages) => [...prevMessages, { type: 'system', content: `${user.username} se ha unido al chat.` }]);
            });

            socket.current.on('userLeft', (userId) => {
                setConnectedUsers((prevUsers) => prevUsers.filter(user => user.userId !== userId));
                setMessages((prevMessages) => [...prevMessages, { type: 'system', content: `Un usuario ha abandonado el chat.` }]);
            });

            socket.current.on('triggerReaction', ({ userId, reaction }) => {
                // Lógica para que el avatar del userId especificado realice la animación 'reaction'
                // Esto podría actualizar el estado de los avatares en los mensajes o en la lista de usuarios.
                console.log(`Avatar de ${userId} debe reaccionar con: ${reaction}`);
                setMessages(prevMessages => prevMessages.map(msg => {
                    if (msg.senderId === userId) {
                        return { ...msg, triggeredReaction: reaction };
                    }
                    return msg;
                }));
            });

            return () => {
                socket.current.disconnect();
            };
        }
    }, [isAvatarCustomized, myAvatarConfig, username]);

    useEffect(() => {
        // Desplazarse al final del ScrollView cuando se añade un nuevo mensaje
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (currentMessage.trim() && socket.current) {
            socket.current.emit('sendMessage', { content: currentMessage });
            setCurrentMessage('');
            // Opcional: Animar mi propio avatar al enviar un mensaje (saludo)
            // Esto se manejaría dentro del componente Avatar o ChatMessage
        }
    };

    if (!isAvatarCustomized) {
        return (
            <AvatarCustomizer
                onCustomizeComplete={(config, user) => {
                    setMyAvatarConfig(config);
                    setUsername(user);
                    setIsAvatarCustomized(true);
                }}
            />
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Bienvenido al Chat, {username}!</Text>
            <ScrollView ref={scrollViewRef} style={styles.chatContainer}>
                {messages.map((msg, index) => (
                    <ChatMessage key={index} message={msg} isMyMessage={msg.senderId === socket.current.id} />
                ))}
            </ScrollView>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={currentMessage}
                    onChangeText={setCurrentMessage}
                    placeholder="Escribe un mensaje..."
                />
                <Button title="Enviar" onPress={handleSendMessage} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 50, paddingHorizontal: 10 },
    header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    chatContainer: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 10 },
    inputContainer: { flexDirection: 'row', alignItems: 'center' },
    input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 8, marginRight: 10 },
});