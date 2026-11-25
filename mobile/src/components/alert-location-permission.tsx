import { useState } from 'react';
import { BackHandler, Linking } from 'react-native';
import { useLocationPermission } from '@/hooks/use-location-permission';
import { AppAlert } from '@/components/ui/app-alert';

export function LocationPermissionAlert() {
    const[isVisible, setIsVisible] = useState(false);

    useLocationPermission({
        onPermissionLost: () => setIsVisible(true),
        onPermissionGranted: () => setIsVisible(false),
    });

    return (
        <AppAlert
            visible={isVisible}
            title="Permissão necessária!"
            message="O aplicativo precisa acessar sua localização para continuar"
            confirmText="Configurar"
            onConfirm={() => Linking.openSettings()}
            cancelText="Encerrar"
            onCancel={() => BackHandler.exitApp()}
        />
    );
}