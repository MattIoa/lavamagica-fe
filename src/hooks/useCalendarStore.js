import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { convertEventsToDateEvents } from '../helpers';
import { onAddNewEvent, onDeleteEvent, onSetActiveEvent, onUpdateEvent, onLoadEvents } from '../store';
import { calendarApi } from '../api';

export const useCalendarStore = () => {
    const dispatch = useDispatch();
    const { events, activeEvent, filteredEvents } = useSelector(state => state.calendar);
    const { user } = useSelector(state => state.auth);

    const setActiveEvent = (calendarEvent) => {
        dispatch(onSetActiveEvent(calendarEvent));
    };

    const startSavingEvent = async (calendarEvent) => {
        // Validation for event start date
        const currentDate = new Date();
        const startDate = new Date(calendarEvent.start);
        const timeDifference = startDate.getTime() - currentDate.getTime();
        const hoursDifference = timeDifference / (1000 * 60 * 60);

        if (hoursDifference < 48) {
            Swal.fire('Error', 'Contattare il numero 3758717797 o 32720007515 per aggiungere un check-in con meno di 48 ore di anticipo.', 'error');
            return;
        }

        try {
            // Todo bien
            if (calendarEvent.id) {
                // Actualizando
                await calendarApi.put(`/events/${calendarEvent.id}`, calendarEvent);
                dispatch(onUpdateEvent({ ...calendarEvent }));
                return;
            }
            // Creando
            const { data } = await calendarApi.post('/events', calendarEvent);
            dispatch(onAddNewEvent({ ...calendarEvent, id: data.evento.id, user }));
        } catch (error) {
            console.log(error);
            Swal.fire('Error al guardar', error.response.data.msg, 'error');
        }
    };

    const startDeletingEvent = async () => {
        // Todo: Llegar al backend
        try {
            await calendarApi.delete(`/events/${activeEvent.id}`);
            dispatch(onDeleteEvent());
        } catch (error) {
            console.log(error);
            Swal.fire("Errore nell'eliminazione", error.response.data.msg, 'error');
        }
    };

    const startLoadingEvents = async (username) => {
        if (localStorage.getItem('selectedView') === '' || !localStorage.getItem('selectedView')) {
            try {
                const { data } = await calendarApi.get('/events');
                const events = convertEventsToDateEvents(data.eventos);
                console.log(events);

                if (username) {
                    const filteredEvents = events.filter(event => event.user.name === username);
                    dispatch(onLoadEvents(filteredEvents));
                } else if (user.name === 'Admin') {
                    dispatch(onLoadEvents(events));
                } else {
                    const userEvents = events.filter(event => event.user.name === user.name);
                    dispatch(onLoadEvents(userEvents));
                }
            } catch (error) {
                console.log('Errore nel caricamento degli eventi');
                console.log(error);
            }
        } else if ((localStorage.getItem('selectedView') === 'filterStartEvents')) {
            try {
                const { data } = await calendarApi.get('/events');
                const events = convertEventsToDateEvents(data.eventos);

                // Aggiorna la data di fine degli eventi per essere un'ora dopo la data di inizio
                const updatedEvents = events.map(event => ({
                    ...event,
                    end: new Date(new Date(event.start).getTime()) // Aggiunge un'ora
                }));

                if (username) {
                    const filteredEvents = updatedEvents.filter(event => event.user.name === username);
                    dispatch(onLoadEvents(filteredEvents));
                } else if (user.name === 'Admin') {
                    dispatch(onLoadEvents(updatedEvents));
                } else {
                    const userEvents = updatedEvents.filter(event => event.user.name === user.name);
                    dispatch(onLoadEvents(userEvents));
                }
            } catch (error) {
                console.log('Errore nel caricamento degli eventi');
                console.log(error);
            }
        } else {
            try {
                const { data } = await calendarApi.get('/events');
                const events = convertEventsToDateEvents(data.eventos);

                const updatedEvents = events.map(event => ({
                    ...event,
                    start: new Date(new Date(event.end).getTime()) // Aggiunge un'ora
                }));

                if (username) {
                    const filteredEvents = updatedEvents.filter(event => event.user.name === username);
                    dispatch(onLoadEvents(filteredEvents));
                } else if (user.name === 'Admin') {
                    dispatch(onLoadEvents(updatedEvents));
                } else {
                    const userEvents = updatedEvents.filter(event => event.user.name === user.name);
                    dispatch(onLoadEvents(userEvents));
                }
            } catch (error) {
                console.log('Errore nel caricamento degli eventi');
                console.log(error);
            }
        }
    };

    const filterStartEvents = async (username) => {
        try {
            const { data } = await calendarApi.get('/events');
            const events = convertEventsToDateEvents(data.eventos);

            // Aggiorna la data di fine degli eventi per essere un'ora dopo la data di inizio
            const updatedEvents = events.map(event => ({
                ...event,
                end: new Date(new Date(event.start).getTime()) // Aggiunge un'ora
            }));

            if (username) {
                const filteredEvents = updatedEvents.filter(event => event.user.name === username);
                dispatch(onLoadEvents(filteredEvents));
            } else if (user.name === 'Admin') {
                dispatch(onLoadEvents(updatedEvents));
            } else {
                const userEvents = updatedEvents.filter(event => event.user.name === user.name);
                dispatch(onLoadEvents(userEvents));
            }
        } catch (error) {
            console.log('Errore nel caricamento degli eventi');
            console.log(error);
        }
    };

    const filterEndEvents = async (username) => {
        try {
            const { data } = await calendarApi.get('/events');
            const events = convertEventsToDateEvents(data.eventos);

            const updatedEvents = events.map(event => ({
                ...event,
                start: new Date(new Date(event.end).getTime()) // Aggiunge un'ora
            }));

            if (username) {
                const filteredEvents = updatedEvents.filter(event => event.user.name === username);
                dispatch(onLoadEvents(filteredEvents));
            } else if (user.name === 'Admin') {
                dispatch(onLoadEvents(updatedEvents));
            } else {
                const userEvents = updatedEvents.filter(event => event.user.name === user.name);
                dispatch(onLoadEvents(userEvents));
            }
        } catch (error) {
            console.log('Errore nel caricamento degli eventi');
            console.log(error);
        }
    };

    return {
        //* Propiedades
        activeEvent,
        events,
        filteredEvents,
        hasEventSelected: !!activeEvent,

        //* Métodos
        startDeletingEvent,
        setActiveEvent,
        startSavingEvent,
        startLoadingEvents,
        filterStartEvents,
        filterEndEvents,
    };
};
