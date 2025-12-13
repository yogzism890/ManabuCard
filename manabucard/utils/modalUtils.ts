import { Alert } from 'react-native';

// Modal State Interface
export interface ModalState {
    visible: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    showConfirmButton?: boolean;
    buttonText?: string;
    confirmButtonText?: string;
    onConfirm?: () => void;
    onClose?: () => void;
}

// Modal Action Types
export type ModalAction = 
    | { type: 'SHOW_SUCCESS'; payload: Omit<ModalState, 'visible' | 'type'> }
    | { type: 'SHOW_ERROR'; payload: Omit<ModalState, 'visible' | 'type'> }
    | { type: 'SHOW_INFO'; payload: Omit<ModalState, 'visible' | 'type'> }
    | { type: 'SHOW_WARNING'; payload: Omit<ModalState, 'visible' | 'type'> }
    | { type: 'HIDE_MODAL' };

// Modal Reducer
export const modalReducer = (state: ModalState, action: ModalAction): ModalState => {
    switch (action.type) {
        case 'SHOW_SUCCESS':
        case 'SHOW_ERROR':
        case 'SHOW_INFO':
        case 'SHOW_WARNING':
            return {
                ...state,
                visible: true,
                type: action.type.replace('SHOW_', '').toLowerCase() as ModalState['type'],
                ...action.payload,
            };
        case 'HIDE_MODAL':
            return { ...state, visible: false };
        default:
            return state;
    }
};

// Initial Modal State
export const initialModalState: ModalState = {
    visible: false,
    title: '',
    message: '',
    type: 'info',
    showConfirmButton: false,
    buttonText: 'Batal',
    confirmButtonText: 'OK',
};

// Alert Wrapper Functions (fallback if CustomModal not available)
export const showAlert = {
    success: (title: string, message: string) => {
        Alert.alert(title, message);
    },
    error: (title: string, message: string) => {
        Alert.alert(title, message);
    },
    info: (title: string, message: string) => {
        Alert.alert(title, message);
    },
    warning: (title: string, message: string) => {
        Alert.alert(title, message);
    },
    confirm: (
        title: string, 
        message: string, 
        onConfirm: () => void, 
        confirmText: string = 'OK',
        cancelText: string = 'Batal'
    ) => {
        Alert.alert(
            title, 
            message, 
            [
                { text: cancelText, style: 'cancel' },
                { text: confirmText, onPress: onConfirm }
            ]
        );
    }
};

// Helper function to determine modal type from alert context
export const getModalTypeFromAlert = (title: string, message: string): ModalState['type'] => {
    const lowerTitle = title.toLowerCase();
    const lowerMessage = message.toLowerCase();
    
    if (lowerTitle.includes('sukses') || lowerMessage.includes('berhasil') || lowerMessage.includes('success')) {
        return 'success';
    }
    if (lowerTitle.includes('gagal') || lowerTitle.includes('error') || lowerMessage.includes('gagal') || lowerMessage.includes('error')) {
        return 'error';
    }
    if (lowerTitle.includes('perhatian') || lowerMessage.includes('perhatian') || lowerMessage.includes('pilih')) {
        return 'warning';
    }
    return 'info';
};

// Map Alert buttons to modal actions
export const mapAlertButtonsToModal = (alertButtons: any[]) => {
    if (!alertButtons || alertButtons.length === 0) {
        return { showConfirmButton: false };
    }
    
    if (alertButtons.length === 1) {
        return { showConfirmButton: false };
    }
    
    if (alertButtons.length === 2) {
        const [cancelButton, confirmButton] = alertButtons;
        return {
            showConfirmButton: true,
            buttonText: cancelButton.text || 'Batal',
            confirmButtonText: confirmButton.text || 'OK',
            onConfirm: confirmButton.onPress
        };
    }
    
    return { showConfirmButton: false };
};
