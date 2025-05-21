const reportModel = require('../models/reportModel');
const userModel = require('../models/userModel');

const sendArtisanRequest = async (user_id, nome, cognome, tipo_artigiano, iban) => {
  const titolo = 'Richiesta registrazione artigiano';
  const messaggio = `Richiesta approvazione per l'artigiano ${nome} ${cognome}. Tipo: ${tipo_artigiano}, IBAN: ${iban}`;
  const stato = 1;

  await reportModel.createReport(user_id, titolo, messaggio, stato);
};

const getArtisanRequest = async () => {
  const reports = await reportModel.getArtisanRequests();

  return reports.map(report => ({
    id: report.report_id,
    titolo: report.title,
    messaggio: report.report_message,
    stato: report.report_state,
    data_creazione: report.sent_date
  }));

}

const updateArtisanRequest = async (id, stato) => {
  await reportModel.updateReportState(id, stato);

  if (stato === 'accettato' || stato === 'rifiutato') {
    const artisanId = await reportModel.getArtisanIdByReportId(id);

    if (artisanId) {
      ;
      await userModel.updateArtisanState(artisanId, stato);
    }
  }
};

const sendSignal = async (userId, titolo, messaggio, stato) => {
  await reportModel.insertSignal(userId, titolo, messaggio, stato);
};

const getSignal = async () => {
  const signals = await reportModel.getSignals();
  return signals.map(signal => ({
    id: signal.report_id,
    titolo: signal.title,
    messaggio: signal.report_message,
    stato: signal.report_state,
    data_creazione: signal.sent_date,
    email: signal.email
  }));
};

module.exports = {
  sendArtisanRequest,
  getArtisanRequest,
  updateArtisanRequest,
  sendSignal,
  getSignal
};