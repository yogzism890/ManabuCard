
import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

interface CustomModalProps {
    visible: boolean;
    title: string;
    message: string;
    onClose: () => void;
    onConfirm?: () => void;
    buttonText?: string;
    confirmButtonText?: string;
    type?: 'success' | 'error' | 'info' | 'warning';
    showConfirmButton?: boolean;
}

const { width } = Dimensions.get('window');

const CustomModal: React.FC<CustomModalProps> = ({
    visible,
    title,
    message,
    onClose,
    onConfirm,
    buttonText = 'Batal',
    confirmButtonText = 'OK',
    type = 'info',
    showConfirmButton = false,
}) => {
    
    const getTypeConfig = () => {
        switch (type) {
            case 'success':
                return {
                    headerColor: '#10B981',
                    iconColor: '#10B981',
                    buttonColor: '#10B981',
                    icon: '✓'
                };
            case 'error':
                return {
                    headerColor: '#EF4444',
                    iconColor: '#EF4444',
                    buttonColor: '#EF4444',
                    icon: '✕'
                };
            case 'warning':
                return {
                    headerColor: '#F59E0B',
                    iconColor: '#F59E0B',
                    buttonColor: '#F59E0B',
                    icon: '!'
                };
            default: // info
                return {
                    headerColor: '#3B82F6',
                    iconColor: '#3B82F6',
                    buttonColor: '#3B82F6',
                    icon: 'i'
                };
        }
    };

    const config = getTypeConfig();

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={[styles.modalView, { borderTopColor: config.headerColor, borderTopWidth: 4 }]}>
                    
                    {/* Icon */}
                    <View style={[styles.iconContainer, { backgroundColor: config.iconColor + '20' }]}>
                        <Text style={[styles.icon, { color: config.iconColor }]}>{config.icon}</Text>
                    </View>

                    {/* Title */}
                    <Text style={styles.modalTitle}>{title}</Text>

                    {/* Message */}
                    <Text style={styles.modalMessage}>{message}</Text>

                    {/* Buttons */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                        >
                            <Text style={styles.cancelButtonText}>{buttonText}</Text>
                        </TouchableOpacity>
                        
                        {showConfirmButton && (
                            <TouchableOpacity
                                style={[styles.button, styles.confirmButton, { backgroundColor: config.buttonColor }]}
                                onPress={onConfirm || onClose}
                            >
                                <Text style={styles.confirmButtonText}>{confirmButtonText}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};


const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Backdrop gelap
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        width: width * 0.85,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        overflow: 'hidden',
        alignItems: 'center',
        padding: 20,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    icon: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: 10,
    },
    modalMessage: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 25,
        paddingHorizontal: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
    button: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: '#E5E7EB',
        marginRight: 8,
    },
    confirmButton: {
        marginLeft: 8,
    },
    cancelButtonText: {
        color: '#374151',
        fontSize: 16,
        fontWeight: '600',
    },
    confirmButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default CustomModal;