using Microsoft.AspNetCore.SignalR;

namespace Infrastructure.Hubs
{
    /// <summary>
    /// This class is responsible for establising communication via
    /// backend api and front end code and vice versa.
    /// From frontend plain API call will be done to API end points.
    /// From backend this class is accessed via context and frontend
    /// clients will get notified using its context implementation.
    /// </summary>
    public class ChatHub : Hub
    {
    }
}
