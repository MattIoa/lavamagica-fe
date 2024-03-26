import React, { createContext, useContext, useState } from 'react';

const CalendarFilterContext = createContext();

export const useCalendarFilter = () => useContext(CalendarFilterContext);

export const CalendarFilterProvider = ({ children }) => {
    const [filter, setFilter] = useState({ username: '' });

    return (
        <CalendarFilterContext.Provider value={{ filter, setFilter }}>
            {children}
        </CalendarFilterContext.Provider>
    );
};
