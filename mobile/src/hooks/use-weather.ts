import { useEffect, useState } from 'react';
import { useLocation } from '@/hooks/use-location';

type Weather = {isDay: boolean, rain: number};

const api = 'https://weather-service-gufbatf9dph6a9ge.westus3-01.azurewebsites.net/api/GetWeather';

export function useWeather() {
    const{coords, error: locationError} = useLocation();
    const[weather, setWeather] = useState<Weather | null>(null);
    const[error, setError] = useState<string | null>(null);

    const loading = !weather && !locationError && !error;

    useEffect(() => {
        if(!coords) return;

        const controller = new AbortController();

        (async () => {
            try {
                const url = `${api}?latitude=${coords.latitude}&longitude=${coords.longitude}`;
                const response = await fetch(url, {signal: controller.signal});

                if(!response.ok) {
                    throw new Error("Erro ao obter informações sobre o clima");
                }

                const data: Weather = await response.json();
                setWeather(data);
            } catch (e: any) {
                if(e?.name === 'AbortError') return;
                setError(e?.message ?? 'Erro ao obter informações sobre o clima');
            }
        })();

        return () => controller.abort();
    }, [coords]);

    return {weather, loading, error: locationError ?? error};
}