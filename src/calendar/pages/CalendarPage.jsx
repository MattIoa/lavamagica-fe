import React, { useState, useEffect } from 'react';
import { Calendar } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Navbar, CalendarEvent, CalendarModal, FabAddNew, FabDelete } from '../';
import { localizer, getMessagesIT } from '../../helpers';
import { useUiStore, useCalendarStore, useAuthStore } from '../../hooks';
import { ExportEventsButton } from '../components/ExportEventsButton.jsx';
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

export const CalendarPage = () => {

    const { user } = useAuthStore();
    const { openDateModal } = useUiStore();
    const { events, setActiveEvent, startLoadingEvents } = useCalendarStore();
    const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'week');
    const [excelData, setExcelData] = useState([]);

    const eventStyleGetter = (event, start, end, isSelected) => {
        const isMyEvent = (user.uid === event.user._id) || (user.uid === event.user.uid);
        const style = {
            backgroundColor: isMyEvent ? '#347CF7' : '#465660',
            borderRadius: '0px',
            opacity: 0.8,
            color: 'white',
            fontSize: window.innerWidth < 1280 ? '10px' : '16px',
        };
        return { style };
    };

    const onDoubleClick = (event) => {
        openDateModal();
    };

    const onSelect = (event) => {
        setActiveEvent(event);
    };

    const onViewChanged = (event) => {
        localStorage.setItem('lastView', event);
        setLastView(event);
    };

    useEffect(() => {
        localStorage.setItem('isSavingConditionEnabled', 'true');
        const selectedUsername = localStorage.getItem('selectedUsername');
        if (selectedUsername) {
            startLoadingEvents(selectedUsername);
        } else {
            startLoadingEvents();
        }
    }, []);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                setExcelData(jsonData);
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const exportXlsxToPdf = () => {
        if (excelData.length === 0) {
            alert("Carica un file Excel prima di generare il PDF!");
            return;
        }

        const doc = new jsPDF();

        // Ottieni il mese e l'anno corrente per il titolo
        const currentDate = new Date();
        const monthNames = [
            "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
            "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
        ];
        const currentMonth = monthNames[currentDate.getMonth()];
        const currentYear = currentDate.getFullYear();

        doc.text(`Resoconto Novembre`, 14, 20);

        // Intestazioni basate sulle chiavi del primo oggetto
        const headers = [Object.keys(excelData[0])];

        // Corpo della tabella
        const body = excelData.map((row) => Object.values(row));

        doc.autoTable({
            head: headers,
            body: body,
            startY: 30,
            styles: { fontSize: 8, cellPadding: 2 },
            headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        });

        doc.save(`Resoconto_${currentMonth}_${currentYear}.pdf`);
    };

    const exportToPdf = () => {
        const doc = new jsPDF();
        doc.text("Resoconto Eventi", 14, 20);

        // Intestazioni della tabella, aggiungi "Nome Evento"
        const headers = [
            [
                "App.",
                "Data Pulizia",
                "Pulizia (€)",
                "Ospiti (Q.tà)",
                "Ospiti (€)",
                "Letti Matr (Q.tà)",
                "Letti Matr (€)",
                "Letti Sing (Q.tà)",
                "Letti Sing (€)",
                "Copri Piumino (Q.tà)",
                "Copri Piumino (€)",
                "Federe (Q.tà)",
                "Federe (€)",
                "Costo Totale (€)",
            ],
        ];

        // Corpo della tabella, includi il titolo dell'evento
        const body = events.map(event => [
            event.title || "", // Nome Evento
            new Date(event.end).toLocaleDateString("it-IT"),
            event.cleanCost || 0,
            event.guest || 0,
            event.guestCost || 0,
            event.doubleBed || 0,
            event.doubleBedCost || 0,
            event.singleBed || 0,
            event.singleBedCost || 0,
            event.duvetCover || 0,
            event.duvetCoverCost || 0,
            event.pillowCase || 0,
            event.pillowCaseCost || 0,
            event.totalCost || 0,
        ]);

        doc.autoTable({
            head: headers,
            body,
            startY: 30,
            styles: { fontSize: 8, cellPadding: 2 },
            headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        });

        doc.save("Resoconto_Eventi.pdf");
    };


    return (
        <>
            <Navbar />
            <div>
                {user.name === 'Admin' && (
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <ExportEventsButton />
                        <button onClick={exportToPdf} className="export-button">Export Eventi PDF</button>
                        <div>
                            <input type="file" accept=".xlsx" onChange={handleFileUpload} />
                            <button onClick={exportXlsxToPdf} className="export-button">Export Excel to PDF</button>
                        </div>
                    </div>
                )}
            </div>
            <Calendar
                culture='it'
                localizer={localizer}
                events={events}
                defaultView={['month']}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 'calc( 100vh - 80px )' }}
                messages={getMessagesIT()}
                eventPropGetter={eventStyleGetter}
                components={{
                    event: CalendarEvent
                }}
                onDoubleClickEvent={onDoubleClick}
                onSelectEvent={onSelect}
                onView={onViewChanged}
            />
            <CalendarModal />
            <FabAddNew />
            <FabDelete />
        </>
    );
};
