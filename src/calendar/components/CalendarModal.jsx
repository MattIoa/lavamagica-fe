
import {useMemo, useState, useEffect} from 'react';
import { addHours, differenceInSeconds } from 'date-fns';

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import Modal from 'react-modal';

import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { useCalendarStore , useUiStore } from '../../hooks';
import './CalendarModal.css'


import it from 'date-fns/locale/it';
registerLocale( 'it',it);


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



export const CalendarModal = () => {

    const  { isDateModalOpen , closeDateModal} =  useUiStore();

    const { activeEvent , startSavingEvent  } = useCalendarStore();
    

    const [ formSubmitted, setFormSubmitted ] = useState(false);

    const [formValues, setFormValues] = useState({
        title: 'ciao',
        notes: 'ciao',
        start: new Date(),
        end: addHours( new Date(), 2),
    });

    const titleClass = useMemo(() => {
        if ( !formSubmitted ) return '';

        return ( formValues.title.length > 0 )
            ? ''
            : 'is-invalid';

    }, [ formValues.title, formSubmitted ])


    useEffect(() => {
        if ( activeEvent !== null ) {
            setFormValues({ ...activeEvent });
        }    
        
      }, [ activeEvent ])

    const onInputChanged = ({ target }) => {
        setFormValues({
            ...formValues,
            [target.name]: target.value
        })
    }

    const onDateChanged = ( event, changing ) => {
        setFormValues({
            ...formValues,
            [changing]: event
        })
    }

    const onCloseModal = () => {
        console.log('cerrando modal');
        closeDateModal();
    }

    const onSubmit = async( event ) => {
        event.preventDefault();
        setFormSubmitted(true);

        const difference = differenceInSeconds( formValues.end, formValues.start );
        
        if ( isNaN( difference ) || difference <= 0 ) {
            Swal.fire('Fechas incorrectas','Revisar las fechas ingresadas','error');
            console.log('Error en fechas');
            return;
        }

        if ( formValues.title.length <= 0 ) return;
        
        console.log(formValues);
        await startSavingEvent( formValues );
        closeDateModal();                   
        setFormSubmitted(false);

    }    

  return (
    <Modal  
        isOpen={ isDateModalOpen }
        onRequestClose={ onCloseModal }
        style={ customStyles }
        className="modal"
        overlayClassName="modal-fondo"
        closeTimeoutMS={200}
        
    >
        <h1> Nuovo Evento </h1>
<hr />
<form className="container" onSubmit= {onSubmit}>

    <div className="form-group mb-2">
        <label className='check-label'>Check-in</label>
        <DatePicker
         selected={ formValues.start }
         onChange={ (event) => onDateChanged(event, 'start') }
         className="form-control"
         dateFormat="Pp"
         showTimeSelect
         locale="it"
         timeCaption="Hora"
        />
    </div>

    <div className="form-group mb-2">
        <label className='check-label'>Check-out</label>
        <DatePicker
        minDate={ formValues.start }
        selected={ formValues.end}
         onChange={ (event) => onDateChanged(event, 'end') }
         className="form-control"
         dateFormat="Pp"
         showTimeSelect
         locale="it"
         timeCaption="Hora"
        />
    </div>

    <hr />
    <div className="form-group mb-2">
        <label>Appartamento</label>
        <input 
            type="text" 
            className={`form-control ${ titleClass }`}
            name="title"
            autoComplete="off"
            value={formValues.title}
            onChange={onInputChanged}
        />
        <small id="emailHelp" className="form-text text-muted">Note</small>
    </div>

    <div className="form-group mb-2">
        <textarea 
            type="text" 
            className="form-control"
            placeholder="Note"
            rows="5"
            name="notes"
            value={formValues.notes}
            onChange={onInputChanged}
        ></textarea>
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
  )
}