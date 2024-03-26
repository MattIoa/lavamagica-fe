import { useDispatch , useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { convertEventsToDateEvents } from '../helpers';
import {  onAddNewEvent , onDeleteEvent, onSetActiveEvent, onUpdateEvent, onLoadEvents} from '../store';
import { calendarApi } from '../api';

export const useCalendarStore = () => {

    const dispatch = useDispatch();
    const { events, activeEvent, filteredEvents } = useSelector( state => state.calendar );
    const { user } = useSelector( state => state.auth );

    const setActiveEvent = ( calendarEvent ) => {
        dispatch( onSetActiveEvent( calendarEvent ) )
    }

    const startSavingEvent = async( calendarEvent ) => {
        // TODO: Update evenet

        try {
                // Todo bien
            if( calendarEvent.id ) {
                // Actualizando
                await calendarApi.put(`/events/${ calendarEvent.id }`, calendarEvent );
                dispatch( onUpdateEvent({ ...calendarEvent }) );
                return;
            }
                // Creando
                const { data } = await calendarApi.post('/events', calendarEvent );
                dispatch( onAddNewEvent({ ...calendarEvent, id: data.evento.id, user }) );

        } catch (error) {
            console.log(error);
            Swal.fire('Error al guardar', error.response.data.msg, 'error');

        }


    }

    const startDeletingEvent = async () => {
       // Todo: Llegar al backend
       try {
        await calendarApi.delete(`/events/${ activeEvent.id }` );
        dispatch( onDeleteEvent() );
    } catch (error) {
        console.log(error);
        Swal.fire("Errore nell'eliminazione", error.response.data.msg, 'error');
    }
    }


    const startLoadingEvents = async(username) => {
        try {
            const { data } = await calendarApi.get('/events');
            const events = convertEventsToDateEvents(data.eventos);

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
    }
}