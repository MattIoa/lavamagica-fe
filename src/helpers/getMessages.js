export const getMessagesIT = () => {
    return {
        allDay: 'Tutto il giorno',
        previous: '<',
        next: '>',
        today: 'Oggi',
        month: 'Mese',
        week: 'Settimana',
        day: 'Giorno',
        agenda: 'Agenda',
        date: 'Data',
        time: 'Ora',
        event: 'Evento',
        noEventsInRange: 'Nessun evento in questo intervallo',
        showMore: (total) => `+ Mostra di più (${total})`,
    };
};