export const CalendarEvent = ({ event }) => {

    const { title, user, end, start } = event;

    return (
        <>
            <strong>{ title }</strong>
            <span> - { user.name }</span>
            <span> - In : {start.toLocaleDateString("it-IT").toString().slice(0, 10)}</span>
            <span> - Out : {end.toLocaleDateString("it-IT").toString().slice(0, 10)}</span>

        </>
    )
}