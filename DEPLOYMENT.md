# Інструкція з повного налаштування та запуску SmartLogist

Цей документ містить вичерпний план налаштування проекту «з нуля» для нового розробника.

---

## 1. Попередні вимоги (Що встановити)

Для роботи проекту на вашому комп'ютері мають бути встановлені:

1. **.NET 9.0 SDK**: [Завантажити тут](https://dotnet.microsoft.com/download/dotnet/9.0) (для бекенду).
2. **Node.js (версія 18+ або 20+)**: [Завантажити тут](https://nodejs.org/) (для фронтенду).
3. **Docker Desktop**: [Завантажити тут](https://www.docker.com/products/docker-desktop/) (для бази даних).
4. **DBeaver Community**: [Завантажити тут](https://dbeaver.io/download/) (для керування БД).

---

## 2. Перші кроки: Завантаження та інсталяція

### Крок 1: Отримання коду
Склонуйте репозиторій або розпакуйте архів у зручну папку.

### Крок 2: Встановлення залежностей
Відкрийте термінал у корені проекту та виконайте:

**Для бекенду:**
```powershell
cd Backend
dotnet restore
```

**Для фронтенду:**
```powershell
cd ../Frontend
npm install
```

---

## 3. Розгортання бази даних у Docker

Ми використовуємо Docker, щоб не встановлювати PostgreSQL прямо на Windows.

### Запуск контейнера
Відкрийте PowerShell та виконайте:
```bash
docker run --name smartlogist-db `
  -e POSTGRES_PASSWORD=your_password `
  -e POSTGRES_DB=smartlogist `
  -p 5432:5432 `
  -d postgres:latest
```

> [!WARNING]
> Пароль (`your_password`) має бути надійно запам'ятований — він потрібен для наступних кроків.

---

## 4. Підключення та ініціалізація у DBeaver

1. **Створення підключення**: Натисніть **Database** -> **New Connection** -> **PostgreSQL**.
   - Host: `localhost` | Port: `5432` | Database: `smartlogist`
   - Password: ваш пароль із Кроку 3.
2. **Виконання скрипта**:
   - Клацніть правою кнопкою на підключення -> **SQL Editor** -> **New SQL Script**.
   - Вставте код.
   - Натисніть **Alt + X**, щоб створити всі таблиці та заповнити їх початковими даними.

---

## 5. Конфігурація та запуск

### Крок 1: Налаштування User Secrets (Бекенд)
Перейдіть у папку `Backend` та виконайте команди, щоб бекенд знав, як підключитися до вашого Docker-контейнера:
```powershell
dotnet user-secrets init --project src/SmartLogist.WebAPI
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;Port=5432;Database=smartlogist;Username=postgres;Password=your_password" --project src/SmartLogist.WebAPI
```

### Крок 2: Запуск проекту

**Запуск бекенду:**
```powershell
dotnet run --project src/SmartLogist.WebAPI
```
*Бекенд буде доступний за адресою `https://localhost:7196` або `http://localhost:5242`.*

**Запуск фронтенду:**
```powershell
cd ../Frontend
npm run dev
```
*Відкрийте [http://localhost:3000](http://localhost:3000) у вашому браузері.*