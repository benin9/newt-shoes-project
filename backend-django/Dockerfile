FROM python:3.11

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install dependency untuk MySQL dan PostgreSQL
RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    build-essential \
    pkg-config \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Jalankan migrasi dan init users, lalu start server
CMD python manage.py migrate --noinput && \
    python manage.py shell -c "exec(open('init_users.py').read())" && \
    exec gunicorn core.wsgi:application --bind 0.0.0.0:$PORT --workers 1 --preload --timeout 300 --access-logfile - --error-logfile -

