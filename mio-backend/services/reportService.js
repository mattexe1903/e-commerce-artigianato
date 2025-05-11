const reportModel = require('../models/reportModel');

const sendArtisanRequest = async (nome, cognome, tipo_artigiano, iban) => {
  const titolo = 'Nuova registrazione artigiano';
  const messaggio = `Richiesta approvazione per l'artigiano ${nome} ${cognome}. Tipo: ${tipo_artigiano}, IBAN: ${iban}`;
  const stato = 6; 
  
  await reportModel.createReport(null, titolo, messaggio, stato);
};

module.exports = {
  sendArtisanRequest
};
