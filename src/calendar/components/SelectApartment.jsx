import React, { useEffect } from 'react';
import { useCalendarStore } from '../../hooks/useCalendarStore';

export const SelectApartment = ({ selectedApartment, handleApartmentSelect }) => {
    const { apartments, startLoadingApartments } = useCalendarStore();

    useEffect(() => {
        startLoadingApartments();
    }, []);

    return (
        <select
            className="form-select form-select-sm me-2"
            style={{ width: "auto", display: "inline-block" }}
            value={selectedApartment}
            onChange={handleApartmentSelect}
        >
            <option value="">Seleziona un appartamento</option>
            {apartments && apartments.map(apartment => (
                <option key={apartment.id} value={apartment.id}>
                    {apartment.address}
                </option>
            ))}
        </select>
    );
};
