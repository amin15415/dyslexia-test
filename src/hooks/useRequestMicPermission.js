import { useState } from 'react';

export const useRequestMicPermission = (stream) => {
    const [hasMicPermission, setHasMicPermission] = useState(false);

    const requestMicPermission = async () => {
        try {
            if (!stream.current) {
                stream.current = await navigator.mediaDevices.getUserMedia({ 
                    audio: { 
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100
                    }});
            }

            // await navigator.mediaDevices.getUserMedia({ audio: true });
            if (stream.current) setHasMicPermission(true);
            // if (stream) {
            //     setHasMicPermission(true);
            //     stream.getTracks().forEach((track) => track.stop());
            // }
        } catch (err) {
            console.error('Error getting microphone access:', err);
            alert('No microphone detected. Please connect a microphone to use this app.');
        }
    };
    
    return [hasMicPermission, requestMicPermission];
};
