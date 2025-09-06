# Imagem base
FROM python:3.11-slim

# Definir diretório de trabalho
WORKDIR /code

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    build-essential \
    default-libmysqlclient-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copiar dependências
COPY ./backend/requirements.txt /code/requirements.txt

# Instalar dependências Python
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copiar código do backend
COPY ./backend /code

# Expor porta do FastAPI
EXPOSE 8000

# Comando padrão
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
