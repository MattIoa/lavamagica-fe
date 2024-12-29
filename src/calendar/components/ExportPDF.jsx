import jsPDF from "jspdf";
import "jspdf-autotable";

const exportToPdf = () => {
    const filteredEvents = getFilteredEvents();

    // Ordina gli eventi per data di inizio
    const sortedEvents = filteredEvents.sort((a, b) => new Date(a.start) - new Date(b.start));

    // Preparazione dei dati per il PDF
    const data = sortedEvents.map((event, index) => {
        const nextEvent = sortedEvents[index + 1] || getFirstEventOfNextMonth(event);

        // Dati e quantità dall'evento successivo
        const cleanCost = nextEvent ? unitCosts.cleanCost : 0;
        const guestQuantity = nextEvent ? nextEvent.guest || 0 : 0;
        const guestCost = nextEvent ? guestQuantity * unitCosts.guest : 0;
        const doubleBedQuantity = nextEvent ? nextEvent.doubleBed || 0 : 0;
        const doubleBedCost = nextEvent ? doubleBedQuantity * unitCosts.doubleBed : 0;
        const singleBedQuantity = nextEvent ? nextEvent.singleBed || 0 : 0;
        const singleBedCost = nextEvent ? singleBedQuantity * unitCosts.singleBed : 0;
        const duvetCoverQuantity = nextEvent ? nextEvent.duvetCover || 0 : 0;
        const duvetCoverCost = nextEvent ? duvetCoverQuantity * unitCosts.duvetCover : 0;
        const pillowCaseQuantity = nextEvent ? nextEvent.pillowCase || 0 : 0;
        const pillowCaseCost = nextEvent ? pillowCaseQuantity * unitCosts.pillowCase : 0;

        const totalCost = cleanCost + guestCost + doubleBedCost + singleBedCost + duvetCoverCost + pillowCaseCost;

        return [
            new Date(event.end).toLocaleDateString("it-IT"), // Data Pulizia
            cleanCost.toFixed(2), // Pulizia
            guestQuantity, // Ospiti (Q.tà)
            guestCost.toFixed(2), // Ospiti (€)
            doubleBedQuantity, // Letti Matr (Q.tà)
            doubleBedCost.toFixed(2), // Letti Matr (€)
            singleBedQuantity, // Letti Sing (Q.tà)
            singleBedCost.toFixed(2), // Letti Sing (€)
            duvetCoverQuantity, // Copri Piumino (Q.tà)
            duvetCoverCost.toFixed(2), // Copri Piumino (€)
            pillowCaseQuantity, // Federe (Q.tà)
            pillowCaseCost.toFixed(2), // Federe (€)
            totalCost.toFixed(2), // Costo Totale (€)
        ];
    });

    // Calcolo del totale di tutti i totali
    const grandTotal = data.reduce((acc, row) => acc + parseFloat(row[12]), 0);

    // Aggiungi una riga finale con il totale
    data.push([
        "TOTALE",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        grandTotal.toFixed(2),
    ]);

    // Generazione del PDF
    const doc = new jsPDF();
    doc.text("Resoconto Eventi", 14, 20);

    // Intestazioni delle colonne
    const headers = [
        [
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

    // Aggiungi la tabella al PDF
    doc.autoTable({
        head: headers,
        body: data,
        startY: 30,
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    });

    // Salva il PDF
    doc.save("Resoconto_Eventi.pdf");
};
