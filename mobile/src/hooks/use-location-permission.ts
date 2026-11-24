import * as Location from 'expo-location';
import { useCallback, useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

type Options = {
    onPermissionLost: (status: Location.PermissionStatus, canAskAgain: boolean) => void;
    onPermissionGranted?: () => void;
}

export function useLocationPermission({
    onPermissionLost,
    onPermissionGranted,
}: Options) {
    const lastGranted = useRef<boolean | null>(null);
    const callbacks = useRef({ onPermissionLost, onPermissionGranted});
    callbacks.current = { onPermissionLost, onPermissionGranted };

    const check = useCallback(async () => {
        try {
            const { status, granted, canAskAgain } = await Location.getForegroundPermissionsAsync();

            if(lastGranted.current === granted) return;
            lastGranted.current = granted;

            if(granted) {
                callbacks.current.onPermissionGranted?.();
            } else {
                callbacks.current.onPermissionLost(status, canAskAgain);
            }
        } catch (error) {
            console.warn("Não foi possível verificar a permissão de localização", error);
        }
    }, []);

    useEffect(() => {
        check();

        const subscription = AppState.addEventListener(
            'change',
            (nextState: AppStateStatus) => {
                if(nextState === 'active') check();
            }
        );

        return () => subscription.remove();
    }, [check]);

    return { recheck: check };
}