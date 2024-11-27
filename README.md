# OpenTok Components
This is Sample Application will help to get started with fully functional OpenTok implementation witn ASP.NET CORE WEB API and Angular.

## OpenTokApp
This is Angular Application with version 18.1.4.
This Application having following components

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
