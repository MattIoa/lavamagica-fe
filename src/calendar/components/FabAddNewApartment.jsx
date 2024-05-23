import React from 'react';
import { useUiStore } from '../../hooks';

export const FabAddNewApartment = () => {
    const { openApartmentModal } = useUiStore(); //

    const handleClickNew = () => {
        openApartmentModal();
    }

    return (
        <button
            className="btn btn-primary fab"
            onClick={handleClickNew}
        >
            <i className="fas fa-plus"></i>
            <span> Nuovo Appartamento</span>
        </button>
    )
}
