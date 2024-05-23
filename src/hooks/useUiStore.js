import { useDispatch, useSelector } from 'react-redux';
import { onCloseDateModal, onOpenDateModal, onCloseApartmentModal, onOpenApartmentModal } from '../store';

export const useUiStore = () => {
    const dispatch = useDispatch();

    const { isDateModalOpen, isApartmentModalOpen } = useSelector(state => state.ui);

    const openDateModal = () => {
        dispatch(onOpenDateModal());
    };

    const closeDateModal = () => {
        dispatch(onCloseDateModal());
    };

    const toggleDateModal = () => {
        (isDateModalOpen)
            ? closeDateModal()
            : openDateModal();
    };

    const openApartmentModal = () => {
        dispatch(onOpenApartmentModal());
    };

    const closeApartmentModal = () => {
        dispatch(onCloseApartmentModal());
    };

    const toggleApartmentModal = () => {
        (isApartmentModalOpen)
            ? closeApartmentModal()
            : openApartmentModal();
    };

    return {
        //* Propiedades
        isDateModalOpen,
        isApartmentModalOpen,

        //* Métodos
        closeDateModal,
        openDateModal,
        toggleDateModal,
        closeApartmentModal,
        openApartmentModal,
        toggleApartmentModal,
    };
};
