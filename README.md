# SmartLogist 🚚

Інтелектуальна система управління логістикою та автопарком. Проект побудований на базі **.NET 9 (Backend)** та **Next.js (Frontend)** з використанням **PostgreSQL**.

---

## 🛠 Попередні вимоги (Що встановити)

Для успішного запуску проекту на "чистій" системі Windows вам знадобляться:

1.  **Git**: [Завантажити](https://git-scm.com/downloads) — для отримання коду.
2.  **Docker Desktop**: [Завантажити](https://www.docker.com/products/docker-desktop/) — для бази даних. 
    * Прі встановленні виберіть **WSL 2 backend**.
3.  **.NET 9.0 SDK**: [Завантажити](https://dotnet.microsoft.com/download/dotnet/9.0) — для бекенду.
4.  **Node.js (LTS)**: [Завантажити](https://nodejs.org/) — для фронтенду.
5.  **IDE**: Рекомендовано **VS Code** або **Visual Studio 2022**.

---

## 🚀 Швидкий старт

### 1. Клонування проекту
```bash
git clone https://github.com/your-username/SmartLogist.git
cd SmartLogist
```

### 2. Запуск бази даних (Docker)
Ми використовуємо Docker для PostgreSQL, щоб не встановлювати сервер БД безпосередньо в систему.
```bash
docker-compose up -d
```
*Це автоматично створить базу даних `smartlogist`, всі необхідні таблиці та початкові налаштування.*

### 3. Налаштування та запуск Backend
```bash
cd Backend
dotnet restore

# Налаштування секретів підключення
dotnet user-secrets init --project src/SmartLogist.WebAPI
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;Port=5432;Database=smartlogist;Username=postgres;Password=your_password" --project src/SmartLogist.WebAPI
dotnet user-secrets set "JwtSettings:Secret" "SmartLogist-Super-Secret-Key-Change-Me-In-Dev" --project src/SmartLogist.WebAPI

# Запуск
dotnet run --project src/SmartLogist.WebAPI
```
*API буде доступне за адресою: `https://localhost:7196`*

### 4. Налаштування та запуск Frontend
```bash
cd ../Frontend
npm install
npm run dev
```
*Сайт буде доступний за адресою: [http://localhost:3000](http://localhost:3000)*

---

## 👤 Перший вхід (Адміністратор)

При першому переході в панель адміністратора (`/auth/admin`), оскільки в базі ще немає користувачів, система автоматично запропонує вам **створити головного адміністратора**.

1. Перейдіть на [http://localhost:3000/auth/admin](http://localhost:3000/auth/admin).
2. Заповніть форму "Перше налаштування".
3. Використовуйте ці дані для подальшого входу.

---

## 🏗 Структура проекту

*   `/Backend` — Чиста архітектура (Domain, Application, Infrastructure, WebAPI).
*   `/Frontend` — Next.js з використанням Tailwind CSS та TypeScript.
*   `/database` — SQL-скрипти для автоматичної ініціалізації бази.
*   `docker-compose.yml` — Опис інфраструктури (Postgres, Adminer).

---

## ❓ Вирішення проблем
* **Помилка Docker**: Перевірте, чи увімкнена віртуалізація в BIOS.
* **Порт 5432 зайнятий**: Переконайтеся, що на комп'ютері не запущена інша версія PostgreSQL.
* **HTTPS помилки**: Виконайте команду `dotnet dev-certs https --trust`.