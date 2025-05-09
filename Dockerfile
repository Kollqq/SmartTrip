# ======== Stage 1: Build Frontend ========
FROM node:18-alpine as frontend-build

WORKDIR /app

# Копируем package.json и package-lock.json и ставим зависимости
COPY frontend/package*.json ./
RUN npm install

# Копируем весь фронтенд и собираем его
COPY frontend /app
RUN npm run build

# ======== Stage 2: Build Backend ========
FROM python:3.9-alpine3.16 as backend-build

WORKDIR /backend

# 🔍 Копируем зависимости
COPY requirements.txt /backend/

# 🔍 Создаем виртуальное окружение
RUN python3 -m venv /backend/venv

# 🔍 Устанавливаем зависимости в виртуальное окружение
RUN /bin/sh -c "source /backend/venv/bin/activate && pip install --no-cache-dir -r /backend/requirements.txt"

# 🔍 Копируем исходный код
COPY backend /backend

# ======== Stage 3: Final Image ========
FROM python:3.9-alpine3.16

WORKDIR /SmartTrip/backend

# 🔍 Копируем всё из предыдущей стадии
COPY --from=backend-build /backend /SmartTrip/backend

# 🔍 🔥 **Важное изменение:** Устанавливаем зависимости напрямую
RUN pip install --no-cache-dir -r /SmartTrip/backend/requirements.txt

# 🔍 Копируем статику фронтенда
COPY --from=frontend-build /app/build /SmartTrip/backend/static

# 🔍 Копируем index.html в папку шаблонов Django
RUN mkdir -p /SmartTrip/backend/templates
COPY --from=frontend-build /app/build/index.html /SmartTrip/backend/templates/index.html

# 🔍 Настраиваем переменные окружения
ENV DJANGO_SETTINGS_MODULE=apps.settings
ENV PYTHONUNBUFFERED=1
ENV PATH="/SmartTrip/backend/venv/bin:$PATH"
ENV PYTHONPATH="/SmartTrip/backend"

# 🔍 Меняем директорию на /SmartTrip/backend для корректного запуска
WORKDIR /SmartTrip/backend

# Открываем порт приложения
EXPOSE 8000

# 🔍 Применяем миграции, собираем статику, создаем суперпользователя
CMD ["sh", "-c", "python manage.py migrate && python manage.py collectstatic --noinput && python manage.py runserver 0.0.0.0:8000"]
