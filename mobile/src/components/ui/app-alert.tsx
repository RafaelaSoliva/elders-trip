import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { AppText } from '../app-text';

interface AppAlertProps {
    visible: boolean,
    title: string,
    message: string,
    confirmText: string,
    onConfirm: () => void;
    cancelText?: string,
    onCancel?: () => void;
}

export function AppAlert ({
    visible,
    title,
    message,
    confirmText,
    onConfirm,
    cancelText,
    onCancel,
}: AppAlertProps) {
    return (
        <Modal
            transparent
            animationType="fade"
            visible={visible}
            onRequestClose={onConfirm || onCancel}
        >
            <View style={styles.overlay}>
                <View style={styles.box}>
                    <View style={styles.titleContainer}>
                        <AppText variant='alertTitle'>{title}</AppText>
                    </View>
                    <View style={styles.messageContainer}>
                        <AppText variant='alertBody'>{message}</AppText>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={onConfirm}>
                            <AppText variant='alertButton'>{confirmText}</AppText>
                        </TouchableOpacity>

                        {cancelText && onCancel && (
                            <TouchableOpacity style={styles.button} onPress={onCancel}>
                                <AppText variant='alertButton'>{cancelText}</AppText>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create ({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.88)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    box: {
        height: 235,
        width: 330,
        borderRadius: 15,
        backgroundColor: '#FFFFFF',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    titleContainer: {
        height: 75,
        marginHorizontal: 20,
        borderColor: '#00000060',
        borderBottomWidth: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    messageContainer: {
        flex: 1,
        marginHorizontal: 25,
        paddingTop: 15,
        alignItems: 'center',
    },
    buttonContainer: {
        height: 50,
        flexDirection: 'row',
    },
    button: {
        flex: 1,
        borderColor: '#00000060',
        borderWidth: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
})