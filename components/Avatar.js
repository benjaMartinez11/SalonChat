// components/Avatar.js
import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native'; // Asegúrate de instalar 'lottie-react-native'

// Aquí simularíamos diferentes animaciones de Lottie
// En un proyecto real, tendrías diferentes archivos .json de Lottie
const laughAnimation = require('../assets/lottie/laugh.json'); // Asegúrate de tener estos archivos
const heartAnimation = require('../assets/lottie/heart.json');
const defaultAvatarAnimation = require('../assets/lottie/default_avatar.json');
const waveAnimation = require('../assets/lottie/wave.json');

export default function Avatar({ config, triggeredReaction, isSending }) {
    const animationRef = useRef(null);

    useEffect(() => {
        if (triggeredReaction && animationRef.current) {
            animationRef.current.play();
            // Opcional: detener después de un ciclo o un tiempo determinado
            // animationRef.current.play(0, 1); // Reproducir solo una vez
        } else if (isSending && animationRef.current) {
            animationRef.current.play();
            // Similar, reproducir animación de saludo
        } else if (animationRef.current) {
            // Reproducir animación por defecto si no hay reacción activa o envío
            animationRef.current.play();
        }
    }, [triggeredReaction, isSending]);

    const getAnimationSource = () => {
        if (triggeredReaction === 'laugh') {
            return laughAnimation;
        }
        if (triggeredReaction === 'heart') {
            return heartAnimation;
        }
        if (isSending) {
            return waveAnimation;
        }
        return defaultAvatarAnimation; // Animación por defecto del avatar
    };

    return (
        <View style={[styles.avatarContainer, { backgroundColor: config?.color || 'gray' }]}>
            {/* Aquí puedes renderizar la lógica visual de tu avatar (formas, accesorios) */}
            {/* Si usas Lottie para todo el avatar, la lógica sería diferente */}
            <LottieView
                ref={animationRef}
                source={getAnimationSource()}
                autoPlay={true}
                loop={true} // Por defecto, el avatar podría tener una animación idle en loop
                style={styles.lottieAvatar}
            />
            {/* Pequeño texto o elemento para el accesorio, si no está en Lottie */}
            {config?.accessory === 'hat' && <Text style={styles.accessory}>🎩</Text>}
            {config?.accessory === 'glasses' && <Text style={styles.accessory}>👓</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    avatarContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden', // Para que la animación no se salga de los bordes
    },
    lottieAvatar: {
        width: '100%',
        height: '100%',
    },
    accessory: {
        position: 'absolute',
        fontSize: 18,
    },
});