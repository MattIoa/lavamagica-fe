import {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import { useAuthStore } from "../../hooks/useAuthStore";
import { useCalendarStore } from "../../hooks/useCalendarStore";

export const Navbar = () => {
    const { startLogout, user } = useAuthStore();
    const { startLoadingEvents } = useCalendarStore(); // Utilizza la funzione per caricare gli eventi

    const { events } = useSelector(state => state.calendar);

    const usernames = Array.from(new Set(events.map(event => event.user?.name))).filter(Boolean);
    // Stato per tenere traccia dell'utente selezionato

    const [selectedUsername, setSelectedUsername] = useState('');
    const handleUserSelect = async (event) => {
        setSelectedUsername(event.target.value);
        await startLoadingEvents(event.target.value);
        localStorage.setItem('selectedUsername', event.target.value);
        window.location.reload();
    };

    useEffect(() => {
        const selectedUsername = localStorage.getItem('selectedUsername');
        if (selectedUsername) {
            setSelectedUsername(selectedUsername);
        }
    }, []);

    console.log(user)

    return (
        <div className="navbar navbar-dark bg-dark mb-4 px-4">
        <span className="navbar-brand">
            <i className="fas fa-calendar-alt"></i>
            &nbsp;
            { user.name }
        </span>
            {user.name === "Admin" && (
            <select

                className="form-select form-select-sm me-2"
                style={{ width: "auto", display: "inline-block" }}
                value={selectedUsername}
                onChange={handleUserSelect}
            >
                <option value="">Mostra Tutti</option>
                {usernames.map((username, index) => (
                    <option key={index} value={username}>{username}</option>
                ))}
            </select>
                )}
            <button className="btn btn-outline-danger" onClick={ startLogout }>
                <i className="fas fa-sign-out-alt"></i>
                &nbsp;
                <span>Exit</span>
            </button>
        </div>
    );
}
