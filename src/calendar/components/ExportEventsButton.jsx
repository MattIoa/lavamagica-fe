import React from 'react';
import { useSelector } from 'react-redux';
import * as XLSX from 'xlsx';

export const ExportEventsButton = () => {
    const { events } = useSelector(state => state.calendar);

    const exportToExcel = () => {
        // Preparazione dei dati per il foglio di calcolo Excel
        const data = events.map(event => ({
            "Titolo": event.title,
            "Inizio": event.start.toISOString().slice(0,10),  // Assicurati che la data sia in formato stringa
            "Fine": event.end.toISOString().slice(0, 10),     // Assicurati che la data sia in formato stringa
            "Ospiti": event.guest,
            "Letti Matrimoniali": event.doubleBed,
            "Letti Singoli": event.singleBed
        }));

        // Creazione di un nuovo workbook e di un worksheet
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);

        // Aggiunta del worksheet al workbook
        XLSX.utils.book_append_sheet(wb, ws, "Eventi");

        // Creazione del file Excel
        const wbout = XLSX.write(wb, {bookType:'xlsx', type:'binary'});

        function s2ab(s) {
            const buf = new ArrayBuffer(s.length);
            const view = new Uint8Array(buf);
            for (let i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }

        // Salva il file sul computer dell'utente
        const blob = new Blob([s2ab(wbout)], {type:"application/octet-stream"});
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Eventi.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <button onClick={exportToExcel} className="export-button">Export to Excel</button>
    );
};
