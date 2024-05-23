import React from 'react';
import Modal from 'react-modal';
import { useUiStore } from '../../hooks/useUiStore';
import { useForm } from '../../hooks/useForm';
import { useCalendarStore } from '../../hooks/useCalendarStore';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

Modal.setAppElement('#root');

export const ApartmentModal = () => {
    const { isApartmentModalOpen, closeApartmentModal } = useUiStore();
    const { formState, onInputChange, onResetForm } = useForm({
        name: '',
        address: '',
        rooms: 0,
        bathrooms: 0,
        price: 0,
        availableFrom: '',
        availableTo: '',
    });
    const { startSavingApartment } = useCalendarStore();

    const { name, address, rooms, bathrooms, price, availableFrom, availableTo } = formState;

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        await startSavingApartment(formState);
        closeApartmentModal();
    };

    return (
        <Modal
            isOpen={isApartmentModalOpen}
            onRequestClose={closeApartmentModal}
            style={customStyles}
            contentLabel="Example Modal"
            className="modal"
            overlayClassName="modal-fondo"
            closeTimeoutMS={200}
        >
            <h1> Nuovo Appartamento </h1>
            <hr />
            <form className="container" onSubmit={handleSubmitForm}>
                <div className="form-group">
                    <label>Nome</label>
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={name}
                        onChange={onInputChange}
                    />
                </div>
                <div className="form-group">
                    <label>Indirizzo</label>
                    <input
                        type="text"
                        className="form-control"
                        name="address"
                        value={address}
                        onChange={onInputChange}
                    />
                </div>
                <div className="form-group">
                    <label>Camere</label>
                    <input
                        type="number"
                        className="form-control"
                        name="rooms"
                        value={rooms}
                        onChange={onInputChange}
                    />
                </div>
                <div className="form-group">
                    <label>Bagni</label>
                    <input
                        type="number"
                        className="form-control"
                        name="bathrooms"
                        value={bathrooms}
                        onChange={onInputChange}
                    />
                </div>
                <button
                    type="submit"
                    className="btn btn-outline-primary btn-block"
                >
                    <i className="far fa-save"></i>
                    <span> Salva</span>
                </button>
            </form>
        </Modal>
    );
};
