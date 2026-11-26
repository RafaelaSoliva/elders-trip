import { useWeather } from '@/hooks/use-weather';
import { AppText } from '@/components/app-text';

function getMessage(isDay: boolean, rain: number) {
    if(rain > 0) return 'Não esqueça o guarda chuva! ☔';
    if(isDay) return 'Não esqueça o filtro solar! 🌞';
    return 'Boa noite! 🌝';
}

export default function Message() {
    const{weather, loading, error} = useWeather();
    let message: string;

    if(error) message = 'Aviso de clima indisponível!';
    else if(loading || !weather) message = 'Carregando informações...';
    else message = getMessage(weather.isDay, weather.rain);

    return (
        <AppText variant='alertBody'>{message}</AppText>
    );
}