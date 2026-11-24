import { Text as RNText, TextProps as RNTextProps} from 'react-native';
import { text } from '@/styles/text';

type TextVariant = keyof typeof text.typography;

interface CustomTextProps extends RNTextProps {
    variant?: TextVariant;
}

export function AppText ({style, variant = 'title', ...props}: CustomTextProps){
    const textStyle = [
        text.typography[variant], style
    ];

    return <RNText style={textStyle}{...props}/>
}