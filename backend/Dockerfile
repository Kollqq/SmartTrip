FROM python:3.9-alpine3.16

WORKDIR /backend

COPY ./backend/requirements.txt /temp/requirements.txt

COPY ./backend /backend

RUN pip install --no-cache-dir -r /temp/requirements.txt

RUN adduser --disabled-password backend-user
USER backend-user

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
