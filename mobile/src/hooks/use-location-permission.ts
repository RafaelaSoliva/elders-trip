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
    const isChecking = useRef(false);
    const callbacks = useRef({ onPermissionLost, onPermissionGranted });
    callbacks.current = { onPermissionLost, onPermissionGranted };

    const check = useCallback(async () => {
        if(isChecking.current) return;
        isChecking.current = true;

        try {
            let { status, granted, canAskAgain } = await Location.getForegroundPermissionsAsync();

            if(status === Location.PermissionStatus.UNDETERMINED) {
                ({ status, granted, canAskAgain } = await Location.requestForegroundPermissionsAsync());
            }

            if(status === Location.PermissionStatus.UNDETERMINED) return;

            if(lastGranted.current === granted) return;
            lastGranted.current = granted;

            if(granted) {
                callbacks.current.onPermissionGranted?.();
            } else {
                callbacks.current.onPermissionLost(status, canAskAgain);
            }
        } catch (error) {
            console.warn("Não foi possível verificar a permissão de localização", error);
        } finally {
            isChecking.current = false;
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

    return { reCheck: check };
}