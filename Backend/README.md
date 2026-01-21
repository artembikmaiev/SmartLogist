# SmartLogist Backend

## 🏗️ Clean Architecture Structure

Цей проект використовує Clean Architecture з 4 шарами:

```
Backend/
├── src/
│   ├── SmartLogist.WebAPI/          # 🌐 Presentation Layer
│   ├── SmartLogist.Application/     # 💼 Business Logic Layer
│   ├── SmartLogist.Domain/          # 🏛️ Domain Layer
│   └── SmartLogist.Infrastructure/  # 🔧 Infrastructure Layer
│
└── tests/
    ├── SmartLogist.UnitTests/
    └── SmartLogist.IntegrationTests/
```

---

## 📁 Детальна структура

### SmartLogist.WebAPI (API Layer)
- **Controllers/** - REST API endpoints
- **Middleware/** - Custom middleware (error handling, JWT, logging)
- **Filters/** - Action filters (validation, authorization)
- **Extensions/** - Service collection extensions

### SmartLogist.Application (Business Logic)
- **Services/** - Business logic services
  - **Interfaces/** - Service interfaces
- **DTOs/** - Data Transfer Objects
  - **Auth/** - Authentication DTOs
  - **Trip/** - Trip management DTOs
  - **Driver/** - Driver management DTOs
  - **Vehicle/** - Vehicle management DTOs
  - **Analytics/** - Analytics DTOs
- **Validators/** - FluentValidation validators
  - **Auth/** - Auth validators
  - **Trip/** - Trip validators
  - **Driver/** - Driver validators
- **Mappings/** - AutoMapper profiles
- **Exceptions/** - Custom exceptions

### SmartLogist.Domain (Domain Models)
- **Entities/** - Domain entities (User, Trip, Vehicle, etc.)
- **Enums/** - Enumerations (UserRole, TripStatus, etc.)
- **Interfaces/** - Repository interfaces
- **ValueObjects/** - Value objects (Coordinates, Address, etc.)

### SmartLogist.Infrastructure (Data Access)
- **Data/** - Database context and configurations
  - **Configurations/** - Entity configurations
  - **Migrations/** - EF Core migrations
  - **Seed/** - Data seeding
- **Repositories/** - Repository implementations
- **Services/** - External services
  - **External/** - OSRM, Nominatim, Email services
- **Hubs/** - SignalR hubs

### Tests
- **SmartLogist.UnitTests/** - Unit tests
  - **Services/** - Service tests
- **SmartLogist.IntegrationTests/** - Integration tests
  - **Controllers/** - API controller tests

---

## 🛠️ Technology Stack

- **Framework:** ASP.NET Core 9.0
- **Database:** PostgreSQL + Entity Framework Core
- **Authentication:** JWT Bearer Tokens
- **Validation:** FluentValidation
- **Mapping:** AutoMapper
- **Real-time:** SignalR
- **Logging:** Serilog
- **Testing:** xUnit + Moq
- **API Docs:** Swagger/OpenAPI

---

## 🚀 Getting Started

### Prerequisites
- .NET 9.0 SDK
- PostgreSQL 14+
- Visual Studio 2022 / Rider / VS Code

### Setup
1. Create projects (see implementation plan)
2. Install NuGet packages
3. Configure appsettings.json
4. Run migrations
5. Start the application

---

## 📝 Next Steps

1. ✅ Folder structure created
2. ⏳ Create .NET projects
3. ⏳ Add NuGet packages
4. ⏳ Implement Domain entities
5. ⏳ Create DbContext
6. ⏳ Implement Repositories
7. ⏳ Add Services
8. ⏳ Create Controllers
9. ⏳ Configure JWT
10. ⏳ Add Swagger

---

## 📚 Documentation

See `backend_implementation_plan.md` for detailed implementation guide.
