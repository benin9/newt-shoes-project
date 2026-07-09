FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE $PORT

CMD python manage.py migrate --noinput && \
    python manage.py shell -c "exec(open('init_users.py').read())" && \
    gunicorn core.wsgi:application --bind 0.0.0.0:$PORT --workers 1 --preload --timeout 300 --access-logfile - --error-logfile -


