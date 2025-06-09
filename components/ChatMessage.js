// components/ChatMessage.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Avatar from './Avatar'; // Asegúrate de crear este componente

export default function ChatMessage({ message, isMyMessage }) {
    const [triggeredReaction, setTriggeredReaction] = useState(message.triggeredReaction);

    useEffect(() => {
        if (message.triggeredReaction) {
            setTriggeredReaction(message.triggeredReaction);
            // Resetea la reacción después de un tiempo para que pueda activarse de nuevo
            const timer = setTimeout(() => {
                setTriggeredReaction(null);
            }, 2000); // Duración de la animación
            return () => clearTimeout(timer);
        }
    }, [message.triggeredReaction]);

    const messageStyle = isMyMessage ? styles.myMessage : styles.otherMessage;
    const textStyle = isMyMessage ? styles.myMessageText : styles.otherMessageText;

    if (message.type === 'system') {
        return (
            <View style={styles.systemMessageContainer}>
                <Text style={styles.systemMessageText}>{message.content}</Text>
            </View>
        );
    }

    return (
        <View style={[styles.messageContainer, messageStyle]}>
            <Avatar
                config={message.senderAvatarConfig}
                triggeredReaction={triggeredReaction}
                // Pasar una prop para indicar si el avatar debe saludar al enviar
                // isSending={isMyMessage && message.type === 'sent'} // Ajusta esto según cómo manejes el envío
            />
            <View style={styles.messageContent}>
                <Text style={styles.username}>{message.senderUsername}</Text>
                <Text style={textStyle}>{message.content}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
        maxWidth: '80%',
    },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#dcf8c6',
        borderRadius: 10,
        padding: 8,
    },
    otherMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#e0e0e0',
        borderRadius: 10,
        padding: 8,
    },
    messageContent: {
        marginLeft: 5, // Espacio entre avatar y mensaje
    },
    username: {
        fontWeight: 'bold',
        marginBottom: 2,
    },
    myMessageText: {
        color: '#000',
    },
    otherMessageText: {
        color: '#000',
    },
    systemMessageContainer: {
        alignSelf: 'center',
        marginVertical: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: '#f0f0f0',
        borderRadius: 15,
    },
    systemMessageText: {
        fontSize: 12,
        fontStyle: 'italic',
        color: '#555',
    },
});