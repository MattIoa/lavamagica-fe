import { createSlice } from '@reduxjs/toolkit';

export const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        isDateModalOpen: false,
        isApartmentModalOpen: false,
    },
    reducers: {
        onOpenDateModal: (state) => {
            state.isDateModalOpen = true;
        },
        onCloseDateModal: (state) => {
            state.isDateModalOpen = false;
        },
        onOpenApartmentModal: (state) => {
            state.isApartmentModalOpen = true;
        },
        onCloseApartmentModal: (state) => {
            state.isApartmentModalOpen = false;
        },
    }
});

export const { onOpenDateModal, onCloseDateModal, onOpenApartmentModal, onCloseApartmentModal } = uiSlice.actions;
