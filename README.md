## Tech Stacks
Our web application leverages a robust and scalable tech stack to deliver a seamless user experience. The key components of our tech stack include:

- **Backend** - DOT NET CORE WEB API 8.0 with Dapper, Entity Framework Core for database interactions
- **Database** - SQL Server 2019 with indexing for optimal query performance, leveraging built-in ACID compliance for data integrity.
- **Frontend** - Angular 18.1.4 with Material, primeng, bootstrap for building responsive and visually appealing UI components, utilizing Webpack and Babel for efficient code
management.
- **Cloud Infrastructure:** AWS with EC2 instances, RDS for databases, and S3 for storage.

## Libraries & Frameworks:
- **Real-time Communication:** SignalR for real-time chat and live updates, utilizing OpenTok for scalable and secure communication.
- **Authentication & Authorization:** JWT tokens for secure authentication, leveraging IdentityServer for robust authorization mechanisms.
- **OpenTok**: Scalable and secure real-time communication platform.

## Development Tools:
Our development team relies on the following tools to streamline our workflow:

- **Visual Studio Code**: Integrated Development Environment (IDE) with code completion, debugging, and version control integration for frontend development.
- **Visual Studio 2022**: Integrated Development Environment (IDE) with code completion, debugging, and version control integration for backend development.
- **Git**: As Source control and code versioning.

## OpenTokApp
This is Angular Application with version 18.1.4. This Application having following components

- Communication - This module contains all OpenTok related implementation wrapped in it. Having feature support for Chat, Invitations, Screen Sharing, Recordings etc.
- Modules - This module contains all references of Angular Material related modules.
- Core-services - This module contains Infrastructure related services like guards, pipes, interceptors, storage services, data security services, crypto services etc.
- Factories - For providing environment settings to the portal

## OpenTokWebApp
This is DOT NET CORE WEB API 8.0 Application. This application follows Clean Architecture Pattern.

- Domain - Contains all bussiness entities
- App.Common - This layer contains all non-bussiness resources which will be commonly used in application.
- App.Core - This layer contains all bussiness logic and resources which will be used in application.
- Infrastructure - This layer provide all kind of infrastructure services along with external parties injected.
- WebUI - This is presentation layers exposing APIs to be consumed by Frontend applications.

## ClinicalAssetsApp
This is Angular Application with version 18.1.4. This Application having following components.

- Clinical Assets - This module defines the dynamic questions and resposes to be filled at the time of patients clinical assessments.
- Modules - This module contains all references of Angular Material related modules.
- Core-services - This module contains Infrastructure related services like guards, pipes, interceptors, storage services, data security services, crypto services etc.
- Factories - For providing environment settings to the portal.
