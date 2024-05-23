import { createSlice } from '@reduxjs/toolkit';

export const calendarSlice = createSlice({
    name: 'calendar',
    initialState: {
        events: [],
        activeEvent: null,
        apartments: [], // Inizializza come array vuoto
    },
    reducers: {
        onSetActiveEvent: (state, { payload }) => {
            state.activeEvent = payload;
        },
        onAddNewEvent: (state, { payload }) => {
            state.events.push(payload);
        },
        onUpdateEvent: (state, { payload }) => {
            state.events = state.events.map(event =>
                (event.id === payload.id) ? payload : event
            );
        },
        onDeleteEvent: (state) => {
            if (state.activeEvent) {
                state.events = state.events.filter(event => event.id !== state.activeEvent.id);
                state.activeEvent = null;
            }
        },
        onLoadEvents: (state, { payload = [] }) => {
            state.events = payload;
        },
        onLoadApartments: (state, { payload = [] }) => {
            state.apartments = payload;
        },
        onLogoutCalendar: (state) => {
            state.events = [];
            state.activeEvent = null;
            state.apartments = []; // Pulisci anche gli appartamenti
        }
    }
});

export const {
    onSetActiveEvent,
    onAddNewEvent,
    onUpdateEvent,
    onDeleteEvent,
    onLoadEvents,
    onLoadApartments,
    onLogoutCalendar
} = calendarSlice.actions;
