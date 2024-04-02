import React from 'react';
import { useSelector } from 'react-redux';
import Papa from 'papaparse';

export const ExportEventsButton = () => {
    const { events } = useSelector(state => state.calendar);

    const exportToCsv = () => {

        const csv = Papa.unparse({

            column: ["title", "start", "end", "description"],
            data: events.map(event => ({
                title: event.title, // Colonna 'title'
                start: event.start, // Colonna 'start'
                end: event.end, // Colonna 'end'
                description: event.description // Colonna 'description'
            }))
        });

        // Il resto del codice per creare e scaricare il file CSV rimane invariato
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'eventi.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <button onClick={exportToCsv} className="export-button">Export</button>
    );
};
