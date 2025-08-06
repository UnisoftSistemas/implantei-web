FROM node:24.5.0-slim

WORKDIR /app

# Copiar arquivos de dependências
COPY package.json yarn.lock* ./

# Instalar dependências
RUN yarn install

# Copiar o resto dos arquivos
COPY . .

# Build da aplicação
RUN yarn build

# A variável PORT é injetada pelo Railway
ENV NODE_ENV=production

# Expor a porta que o Railway vai usar
EXPOSE ${PORT}

# Usar a variável de ambiente PORT fornecida pelo Railway
CMD ["sh", "-c", "yarn preview --host 0.0.0.0 --port ${PORT:-3000} --no-open"]