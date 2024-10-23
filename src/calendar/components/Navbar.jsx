import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAuthStore } from "../../hooks/useAuthStore";
import { useCalendarStore } from "../../hooks/useCalendarStore";

export const Navbar = () => {
    const { startLogout, user } = useAuthStore();
    const { startLoadingEvents, filterEndEvents, filterStartEvents } = useCalendarStore();

    const { events } = useSelector(state => state.calendar);

    const usernames = Array.from(new Set(events.map(event => event.user?.name))).filter(Boolean);

    const [selectedUsername, setSelectedUsername] = useState('');
    const [selectedView, setSelectedView] = useState('');
    const [isSavingConditionEnabled, setIsSavingConditionEnabled] = useState(true);

    const handleUserSelect = async (event) => {
        setSelectedUsername(event.target.value);
        await startLoadingEvents(event.target.value);
        localStorage.setItem('selectedUsername', event.target.value);
        window.location.reload();
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

    const handleToggleChange = () => {
        const newToggleState = !isSavingConditionEnabled;
        setIsSavingConditionEnabled(newToggleState);
        localStorage.setItem('isSavingConditionEnabled', newToggleState.toString());
    };

    useEffect(() => {
        const storedSelectedUsername = localStorage.getItem('selectedUsername');
        if (storedSelectedUsername) {
            setSelectedUsername(storedSelectedUsername);
        }

        const storedSelectedView = localStorage.getItem('selectedView');
        if (storedSelectedView) {
            setSelectedView(storedSelectedView);
        }

        const storedToggleState = localStorage.getItem('isSavingConditionEnabled');
        if (storedToggleState !== null) {
            setIsSavingConditionEnabled(storedToggleState === 'true');
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
            {user.name === "Admin" && (
            <div className="form-check form-switch text-light">
                <input
                    className="form-check-input"
                    type="checkbox"
                    checked={isSavingConditionEnabled}
                    onChange={handleToggleChange}
                />
                <label className="form-check-label">
                    Condizione di salvataggio 24 ore
                </label>
            </div>
            )}
            <button className="btn btn-outline-danger" onClick={startLogout}>
                <i className="fas fa-sign-out-alt"></i>
                &nbsp;
                <span>Exit</span>
            </button>
        </div>
    );
}
