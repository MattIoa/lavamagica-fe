import React, { useState } from "react";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";

export const ExportEventsButton = () => {
    const { events } = useSelector((state) => state.calendar);
    const [selectedMonth, setSelectedMonth] = useState(""); // Stato per il mese selezionato
    const [unitCosts, setUnitCosts] = useState({
        cleanCost: 0,
        guest: 0,
        doubleBed: 0,
        singleBed: 0,
        duvetCover: 0,
        pillowCase: 0,
    }); // Costi unitari
    const [isModalOpen, setIsModalOpen] = useState(false); // Stato della modale

    const getFilteredEvents = () => {
        if (!selectedMonth) return events.sort((a, b) => new Date(a.end) - new Date(b.end));

        return events
            .filter((event) => {
                const eventMonth = new Date(event.end).getMonth() + 1; // Mesi in JavaScript: 0-11
                return eventMonth === parseInt(selectedMonth, 10);
            })
            .sort((a, b) => new Date(a.end) - new Date(b.end)); // Ordina per data crescente
    };

    const handleCostChange = (e) => {
        const { name, value } = e.target;
        setUnitCosts((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    };

    const exportToExcel = () => {
        const filteredEvents = getFilteredEvents();

        // Ordina gli eventi per data di inizio
        const sortedEvents = filteredEvents.sort((a, b) => new Date(a.start) - new Date(b.start));

        // Preparazione dei dati per il foglio di calcolo Excel
        const data = sortedEvents.map((event, index) => {
            const nextEvent = sortedEvents[index + 1]; // Ottieni l'evento successivo

            // Se esiste un evento successivo, utilizza i suoi dati
            const cleanCost = nextEvent ? unitCosts.cleanCost : 0;
            const guestCost = nextEvent ? (nextEvent.guest || 0) * unitCosts.guest : 0;
            const doubleBedCost = nextEvent ? (nextEvent.doubleBed || 0) * unitCosts.doubleBed : 0;
            const singleBedCost = nextEvent ? (nextEvent.singleBed || 0) * unitCosts.singleBed : 0;
            const duvetCoverCost = nextEvent ? (nextEvent.duvetCover || 0) * unitCosts.duvetCover : 0;
            const pillowCaseCost = nextEvent ? (nextEvent.pillowCase || 0) * unitCosts.pillowCase : 0;

            // Quantità dall'evento successivo
            const guestQuantity = nextEvent ? nextEvent.guest || 0 : 0;
            const doubleBedQuantity = nextEvent ? nextEvent.doubleBed || 0 : 0;
            const singleBedQuantity = nextEvent ? nextEvent.singleBed || 0 : 0;
            const duvetCoverQuantity = nextEvent ? nextEvent.duvetCover || 0 : 0;
            const pillowCaseQuantity = nextEvent ? nextEvent.pillowCase || 0 : 0;

            const totalCost = cleanCost + guestCost + doubleBedCost + singleBedCost + duvetCoverCost + pillowCaseCost;

            return {
                'Data Pulizia': new Date(event.end).toLocaleDateString("it-IT"),
                'Pulizia': cleanCost,
                'Ospiti (Q.tà)': guestQuantity,
                'Ospiti (€)': guestCost.toFixed(2),
                'Letti Matr (Q.tà)': doubleBedQuantity,
                'Letti Matr (€)': doubleBedCost.toFixed(2),
                'Letti Sing (Q.tà)': singleBedQuantity,
                'Letti Sing (€)': singleBedCost.toFixed(2),
                'Copri Piumino (Q.tà)': duvetCoverQuantity,
                'Copri Piumino (€)': duvetCoverCost.toFixed(2),
                'Federe (Q.tà)': pillowCaseQuantity,
                'Federe (€)': pillowCaseCost.toFixed(2),
                'Costo Totale (€)': totalCost.toFixed(2),
            };
        });

        // Calcolo del totale di tutti i totali
        const grandTotal = data.reduce(
            (acc, item) => acc + parseFloat(item["Costo Totale (€)"]),
            0
        );

        // Aggiungi una riga finale con il totale
        data.push({
            'Data Pulizia': "TOTALE",
            'Pulizia': "",
            'Ospiti (Q.tà)': "",
            'Ospiti (€)': "",
            'Letti Matr (Q.tà)': "",
            'Letti Matr (€)': "",
            'Letti Sing (Q.tà)': "",
            'Letti Sing (€)': "",
            'Copri Piumino (Q.tà)': "",
            'Copri Piumino (€)': "",
            'Federe (Q.tà)': "",
            'Federe (€)': "",
            'Costo Totale (€)': grandTotal.toFixed(2),
        });

        // Creazione di un nuovo workbook e di un worksheet
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);

        // Aggiunta del worksheet al workbook
        XLSX.utils.book_append_sheet(wb, ws, "Eventi");

        // Creazione del file Excel
        const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

        function s2ab(s) {
            const buf = new ArrayBuffer(s.length);
            const view = new Uint8Array(buf);
            for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
            return buf;
        }

        // Salva il file sul computer dell'utente
        const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Eventi.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Chiudi la modale
        setIsModalOpen(false);
    };




    const modalStyles = {
        modal: {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
        },
        modalContent: {
            backgroundColor: "#fff",
            padding: "20px 30px",
            borderRadius: "8px",
            width: "90%",
            maxWidth: "400px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            position: "relative",
        },
        modalActions: {
            display: "flex",
            justifyContent: "space-between",
            marginTop: "20px",
        },
    };

    return (
        <div>
            <label htmlFor="month-select">Seleziona il mese:</label>
            <select
                id="month-select"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
            >
                <option value="">Tutti i mesi</option>
                {[...Array(12).keys()].map((month) => (
                    <option key={month + 1} value={month + 1}>
                        {new Date(0, month).toLocaleString("it-IT", { month: "long" })}
                    </option>
                ))}
            </select>

            <button onClick={() => setIsModalOpen(true)} className="export-button">
                Export to Excel
            </button>

            {isModalOpen && (
                <div style={modalStyles.modal}>
                    <div style={modalStyles.modalContent}>
                        <h2>Inserisci i costi unitari (€)</h2>
                        <label>
                            Pulizia:
                            <input
                                type="number"
                                name="cleanCost"
                                value={unitCosts.cleanCost || ''}
                                onChange={handleCostChange}
                            />
                        </label>
                        <label>
                            Ospiti:
                            <input
                                type="number"
                                name="guest"
                                value={unitCosts.guest || ''}
                                onChange={handleCostChange}
                            />
                        </label>
                        <label>
                            Letti Matrimoniali:
                            <input
                                type="number"
                                name="doubleBed"
                                value={unitCosts.doubleBed || ''}
                                onChange={handleCostChange}
                            />
                        </label>
                        <label>
                            Letti Singoli:
                            <input
                                type="number"
                                name="singleBed"
                                value={unitCosts.singleBed || ''}
                                onChange={handleCostChange}
                            />
                        </label>
                        <label>
                            Copri Piumino:
                            <input
                                type="number"
                                name="duvetCover"
                                value={unitCosts.duvetCover || ''}
                                onChange={handleCostChange}
                            />
                        </label>
                        <label>
                            Federe:
                            <input
                                type="number"
                                name="pillowCase"
                                value={unitCosts.pillowCase || ''}
                                onChange={handleCostChange}
                            />
                        </label>

                        <div style={modalStyles.modalActions}>
                            <button onClick={exportToExcel}>Esporta</button>
                            <button onClick={() => setIsModalOpen(false)}>Annulla</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
