#!/bin/bash
set -e
python manage.py migrate --noinput
python manage.py shell -c "exec(open('init_users.py').read())"
exec gunicorn core.wsgi:application --bind 0.0.0.0:$PORT --workers 1 --preload --timeout 300 --access-logfile - --error-logfile -
