import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAuthStore } from "../../hooks/useAuthStore";
import { useCalendarStore } from "../../hooks/useCalendarStore";
import { SelectApartment } from './SelectApartment';

export const Navbar = () => {
    const { startLogout, user } = useAuthStore();
    const { startLoadingEvents, filterEndEvents, filterStartEvents } = useCalendarStore();

    const { events } = useSelector(state => state.calendar);

    const usernames = Array.from(new Set(events.map(event => event.user?.name))).filter(Boolean);

    const [selectedUsername, setSelectedUsername] = useState('');
    const [selectedView, setSelectedView] = useState('');
    const [selectedApartment, setSelectedApartment] = useState('');

    const handleUserSelect = async (event) => {
        setSelectedUsername(event.target.value);
        await startLoadingEvents(event.target.value);
        localStorage.setItem('selectedUsername', event.target.value);
        window.location.reload();
    };

    const handleApartmentSelect = (event) => {
        setSelectedApartment(event.target.value);
    };

    const changeViewEvents = async (event) => {
        const view = event.target.value;
        setSelectedView(view);
        switch (view) {
            case 'filterStartEvents':
                await filterStartEvents(selectedUsername);
                break;
            case 'filterEndEvents':
                await filterEndEvents(selectedUsername);
                break;
            default:
                await startLoadingEvents(selectedUsername);
                break;
        }
        localStorage.setItem('selectedView', view);
        window.location.reload();
    };

    useEffect(() => {
        const selectedUsername = localStorage.getItem('selectedUsername');
        if (selectedUsername) {
            setSelectedUsername(selectedUsername);
        }

        const selectedView = localStorage.getItem('selectedView');
        if (selectedView) {
            setSelectedView(selectedView);
        }
    }, []);

    return (
        <div className="navbar navbar-dark bg-dark mb-4 px-4">
            <span className="navbar-brand">
                <i className="fas fa-calendar-alt"></i>
                &nbsp;
                {user.name}
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
            {user.name === "Admin" && (
                <select
                    className="form-select form-select-sm me-2"
                    style={{ width: "auto", display: "inline-block" }}
                    value={selectedView}
                    onChange={changeViewEvents}
                >
                    <option value="">Mostra Tutto</option>
                    <option value="filterStartEvents">Check-in</option>
                    <option value="filterEndEvents">Check-out</option>
                </select>
            )}
                <SelectApartment
                    selectedApartment={selectedApartment}
                    handleApartmentSelect={handleApartmentSelect}
                />
            <button className="btn btn-outline-danger" onClick={startLogout}>
                <i className="fas fa-sign-out-alt"></i>
                &nbsp;
                <span>Exit</span>
            </button>
        </div>
    );
};
