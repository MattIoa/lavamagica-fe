export const CalendarEvent = ({ event }) => {

    const { title, user, end, start, guest } = event;
    console.log(guest); // <-- Stampa l'intero oggetto event

    return (
        <>
            <strong>{ title }</strong>
            <span> - Check Out : {end.toLocaleDateString("it-IT").toString().slice(0, 10)}</span>
            <span> Guests : { guest }</span>
        </>
    )
}