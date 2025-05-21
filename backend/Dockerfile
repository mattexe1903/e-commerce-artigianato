# Usa un'immagine Node leggera
FROM node:20-alpine

# Imposta la cartella di lavoro all'interno del container
WORKDIR /app

# Copia i file di dipendenze separatamente per caching efficiente
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia il resto del codice dell'app
COPY . .

# Se necessario, crea directory come 'images' (se non montata da volume)
RUN mkdir -p images html

# Espone la porta usata dall'app (coerente con process.env.PORT o default 3000)
EXPOSE 3000

# Avvia l'app
CMD ["node", "server.js"]
