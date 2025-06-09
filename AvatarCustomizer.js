// components/AvatarCustomizer.js
import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Picker } from 'react-native';
// Importa tu componente de Avatar para la previsualización

export default function AvatarCustomizer({ onCustomizeComplete }) {
    const [username, setUsername] = useState('');
    const [selectedColor, setSelectedColor] = useState('blue');
    const [selectedAccessory, setSelectedAccessory] = useState('hat');

    const handleSaveAvatar = () => {
        if (username.trim()) {
            const avatarConfig = {
                color: selectedColor,
                accessory: selectedAccessory,
                // Añadir más opciones de personalización
            };
            onCustomizeComplete(avatarConfig, username);
        } else {
            alert('Por favor, ingresa un nombre de usuario.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Personaliza tu Avatar</Text>
            <TextInput
                style={styles.input}
                placeholder="Tu nombre de usuario"
                value={username}
                onChangeText={setUsername}
            />
            <Text>Color del Avatar:</Text>
            <Picker
                selectedValue={selectedColor}
                onValueChange={(itemValue) => setSelectedColor(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Azul" value="blue" />
                <Picker.Item label="Rojo" value="red" />
                <Picker.Item label="Verde" value="green" />
            </Picker>
            <Text>Accesorio:</Text>
            <Picker
                selectedValue={selectedAccessory}
                onValueChange={(itemValue) => setSelectedAccessory(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Sombrero" value="hat" />
                <Picker.Item label="Gafas" value="glasses" />
                <Picker.Item label="Nada" value="none" />
            </Picker>

            {/* Aquí puedes mostrar una previsualización del avatar */}
            {/* <Avatar config={{ color: selectedColor, accessory: selectedAccessory }} /> */}

            <Button title="Guardar y Unirse al Chat" onPress={handleSaveAvatar} />
        </View>
    );
    }

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 24, marginBottom: 20 },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, width: '80%', marginBottom: 15 },
    picker: { height: 50, width: '80%', marginBottom: 15 },
});