const reportModel = require('../models/reportModel');

const sendArtisanRequest = async (nome, cognome, tipo_artigiano, iban) => {
  const titolo = 'Nuova registrazione artigiano';
  const messaggio = `Richiesta approvazione per l'artigiano ${nome} ${cognome}. Tipo: ${tipo_artigiano}, IBAN: ${iban}`;
  const stato = 6; 
  
  await reportModel.createReport(null, titolo, messaggio, stato);
};

const getArtisanRequest = async () => {
  //const stato = 6;
  const reports = await reportModel.getArtisanRequest();
  
  return reports.map(report => ({
    id: report.id,
    titolo: report.titolo,
    messaggio: report.messaggio,
    stato: report.stato,
    data_creazione: report.data_creazione
  }));
}

module.exports = {
  sendArtisanRequest, 
  getArtisanRequest
};
