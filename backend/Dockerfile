FROM python:3.9-alpine3.16

# Создаем рабочую директорию
WORKDIR /backend

# Копируем requirements.txt из корня проекта
COPY ../requirements.txt /temp/requirements.txt

# Копируем весь backend-код
COPY . /backend

# Устанавливаем зависимости
RUN pip install --no-cache-dir -r /temp/requirements.txt

# Создаем пользователя и переключаемся на него
RUN adduser --disabled-password backend-user

USER backend-user

EXPOSE 8000
