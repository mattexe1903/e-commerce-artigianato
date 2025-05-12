const reportModel = require('../models/reportModel');

const sendArtisanRequest = async (nome, cognome, tipo_artigiano, iban) => {
  const titolo = 'Richiesta registrazione artigiano';
  const messaggio = `Richiesta approvazione per l'artigiano ${nome} ${cognome}. Tipo: ${tipo_artigiano}, IBAN: ${iban}`;
  const stato = 6;

  await reportModel.createReport(null, titolo, messaggio, stato);
};

const getArtisanRequest = async () => {
  //const stato = 6;
  const reports = await reportModel.getArtisanRequests();

  return reports.map(report => ({
    id: report.report_id,
    titolo: report.title,
    messaggio: report.report_message,
    stato: report.report_state,
    data_creazione: report.sent_date
  }));

}

module.exports = {
  sendArtisanRequest,
  getArtisanRequest
};
