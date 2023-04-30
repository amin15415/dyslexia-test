import { useState } from 'react';

export const useRequestMicPermission = () => {
    const [hasMicPermission, setHasMicPermission] = useState(false);

    const requestMicPermission = async () => {
        try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (stream) {
            setHasMicPermission(true);
            stream.getTracks().forEach((track) => track.stop());
        }
        } catch (err) {
        console.error('Error getting microphone access:', err);
        alert('No microphone detected. Please connect a microphone to use this app.');
        }
    };
    
    return [hasMicPermission, requestMicPermission];
};
