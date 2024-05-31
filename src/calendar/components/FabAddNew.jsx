import React from 'react'
import { addHours } from 'date-fns';
import { useCalendarStore, useUiStore } from '../../hooks';
export const FabAddNew = () => {

    const style = {
        zIndex: '100'
    }

  const { openDateModal } = useUiStore();
    const { setActiveEvent } = useCalendarStore();

    const handleClickNew = () => {
        setActiveEvent({
            title: '',
            guest: '',
            singleBed: '',
            doubleBed: '',
            note: '',
            duvetCover: '',
            start: new Date(),
            end: addHours( new Date(), 2 ),
            bgColor: '#fafafa',
            user: {
                _id: '123',
                name: 'Fernando'
            }
        });
        openDateModal();
    }
  return (
    <button
        style={{zIndex: '10'}}
        className="btn btn-primary fab"
       onClick={ handleClickNew }
    >
      <i className="fas fa-plus" ></i>

    
    </button>

  )
}
