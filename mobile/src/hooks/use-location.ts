import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

type Coords = { latitude: number, longitude: number };

export function useLocation() {
    const[coords, setCoords] = useState<Coords | null>(null);
    const[error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const position = await Location.getCurrentPositionAsync({});

                setCoords ({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                })
            } catch (e: any) {
                setError(e?.message ?? "Erro ao obter localização");
            }
        })();
    }, []);

    return { coords, error };
}