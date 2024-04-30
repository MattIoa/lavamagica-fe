export const CalendarEvent = ({ event }) => {

    const { title, user, guest } = event;

    return (
        <>
            <strong>{ title }</strong>
            <span> - { user.name }</span>
            <span> - Ospiti : {event.guest}</span>

        </>
    )
}