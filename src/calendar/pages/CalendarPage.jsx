import { useState, useEffect } from 'react';
import { Calendar } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CalendarEvent} from '../components/CalendarEvent.jsx'
import { CalendarModal} from '../components/CalendarModal.jsx'
import { FabAddNew} from '../components/FabAddNew.jsx'
import { FabDelete} from '../components/FabDelete.jsx'
import { FabAddNewApartment} from '../components/FabAddNewApartment.jsx'
import { ApartmentModal} from '../components/ApartmentModal.jsx'
import { Navbar} from '../components/Navbar.jsx'

import { localizer, getMessagesIT } from '../../helpers';
import { useUiStore, useCalendarStore, useAuthStore } from '../../hooks';
import { ExportEventsButton } from '../components/ExportEventsButton.jsx';

export const CalendarPage = () => {
    const { user } = useAuthStore();
    const { openDateModal } = useUiStore();
    const { events, setActiveEvent, startLoadingEvents } = useCalendarStore();
    const [key, setKey] = useState(Date.now());
    const [calendarKey, setCalendarKey] = useState(0);
    const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'week');
    const [selectedApartment, setSelectedApartment] = useState(localStorage.getItem('selectedApartment') || '');

    const eventStyleGetter = (event, start, end, isSelected) => {
        const isMyEvent = (user.uid === event.user._id) || (user.uid === event.user.uid);
        const style = {
            backgroundColor: isMyEvent ? '#347CF7' : '#465660',
            borderRadius: '0px',
            opacity: 0.8,
            color: 'white',
            fontSize: window.innerWidth < 1280 ? '10px' : '16px',
        };
        return { style };
    }

    const onDoubleClick = (event) => {
        console.log({ doubleClick: event });
        openDateModal();
    }

    const onSelect = (event) => {
        console.log({ click: event });
        setActiveEvent(event);
    }

    const onViewChanged = (event) => {
        localStorage.setItem('lastView', event);
        setLastView(event);
    }

    useEffect(() => {
        if (selectedApartment) {
            startLoadingEvents(selectedApartment);
        }
    }, [selectedApartment]);

    return (
        <>
            <Navbar />
            <div>
                {user.name === 'Admin' && <ExportEventsButton />}
            </div>
            <Calendar
                culture='it'
                localizer={localizer}
                events={events}
                defaultView={['month']}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 'calc( 100vh - 80px )' }}
                messages={getMessagesIT()}
                eventPropGetter={eventStyleGetter}
                components={{ event: CalendarEvent }}
                onDoubleClickEvent={onDoubleClick}
                onSelectEvent={onSelect}
                onView={onViewChanged}
            />
            <CalendarModal />
            <FabAddNew />
            <FabDelete />
            <FabAddNewApartment />
            <ApartmentModal />
        </>
    );
};
