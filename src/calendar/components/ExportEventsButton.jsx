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

        const sortedEvents = filteredEvents.sort((a, b) => new Date(a.start) - new Date(b.start));

        const data = sortedEvents.map((event) => {
            const cleanCost = unitCosts.cleanCost || 0;
            const guestQuantity = event.guest || 0;
            const guestCost = guestQuantity * unitCosts.guest;
            const doubleBedQuantity = event.doubleBed || 0;
            const doubleBedCost = doubleBedQuantity * unitCosts.doubleBed;
            const singleBedQuantity = event.singleBed || 0;
            const singleBedCost = singleBedQuantity * unitCosts.singleBed;
            const duvetCoverQuantity = event.duvetCover || 0;
            const duvetCoverCost = duvetCoverQuantity * unitCosts.duvetCover;
            const pillowCaseQuantity = event.pillowCase || 0;
            const pillowCaseCost = pillowCaseQuantity * unitCosts.pillowCase;

            const totalCost = cleanCost + guestCost + doubleBedCost + singleBedCost + duvetCoverCost + pillowCaseCost;

            return {
                'App': event.title,
                'Data Pulizia': new Date(event.end).toLocaleDateString("it-IT"),
                'Pulizia': cleanCost,
                'Ospiti (Q.tà)': guestQuantity,
                'Sing (Q.tà)': singleBedQuantity,
                'Matr (Q.tà)': doubleBedQuantity,
                'Rigati (Q.tà)': duvetCoverQuantity,
                'Federe (Q.tà)': pillowCaseQuantity,
                'Ospiti (€)': guestCost.toFixed(2),
                'Letti Matr (€)': doubleBedCost.toFixed(2),
                'Letti Sing (€)': singleBedCost.toFixed(2),
                'Copri Piumino (€)': duvetCoverCost.toFixed(2),
                'Federe (€)': pillowCaseCost.toFixed(2),
                'Costo Totale (€)': totalCost.toFixed(2),
            };
        });

        const grandTotal = data.reduce(
            (acc, item) => acc + parseFloat(item["Costo Totale (€)"]),
            0
        );

        data.push({
            'Nome Evento': "TOTALE",
            'Data Pulizia': "",
            'Pulizia': "",
            'Ospiti (Q.tà)': "",
            'Sing (Q.tà)': "",
            'Matr (Q.tà)': "",
            'Rigati (Q.tà)': "",
            'Federe (Q.tà)': "",
            'Ospiti (€)': "",
            'Letti Matr (€)': "",
            'Letti Sing (€)': "",
            'Copri Piumino (€)': "",
            'Federe (€)': "",
            'Costo Totale (€)': grandTotal.toFixed(2),
        });

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);

        XLSX.utils.book_append_sheet(wb, ws, "Eventi");

        const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

        function s2ab(s) {
            const buf = new ArrayBuffer(s.length);
            const view = new Uint8Array(buf);
            for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
            return buf;
        }
        const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Eventi.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

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
