#!/bin/sh

echo "Running Django migrations..."
python manage.py migrate --noinput

echo "Initializing default users..."
python manage.py shell -c "exec(open('init_users.py').read())"

echo "Starting server..."
exec gunicorn core.wsgi:application --bind 0.0.0.0:$PORT --workers 3
