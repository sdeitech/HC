using App.Common.Exceptions;
using App.Common.Interfaces;
using App.Common.Models;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Data;
using System.Net;


namespace Infrastructure.Filters
{
    public sealed class AppExceptionFilterAttribute : ExceptionFilterAttribute
    {
        private readonly ILogger<AppExceptionFilterAttribute> _logger;
        private readonly IDapperContext _context;
        private readonly ICurrentUserService _currentUserService;

        public AppExceptionFilterAttribute(
            ILogger<AppExceptionFilterAttribute> logger,
            IDapperContext context,
            ICurrentUserService currentUserService
            )
        {
            _logger = logger;
            _context = context;
            _currentUserService = currentUserService;
        }

        public override void OnException(ExceptionContext context)
        {
            _logger.LogError(context.Exception, context.Exception.StackTrace);

            var errorDetails = new ErrorDetails
            {
                StatusCode = context.HttpContext.Response.StatusCode,
                ErrorDescription = context.Exception?.Message,
                InnerException = context.Exception?.InnerException?.Message,
                ErrorTime = DateTime.UtcNow,
                Source = context.Exception?.Source,
                StackTrace = GetRootException(context.Exception)?.StackTrace,
                UserId = _currentUserService.UserId
            };

            if (context.Exception is UserDefinedException userDefinedException)
            {
                context.HttpContext.Response.ContentType = "application/json";
                context.HttpContext.Response.StatusCode = 499;
                context.Result = new JsonResult(userDefinedException.Errors);

                errorDetails.StatusCode = context.HttpContext.Response.StatusCode;
                LogExceptionInDb(errorDetails, _context, _currentUserService);

                return;
            }

            context.HttpContext.Response.ContentType = "application/json";
            context.HttpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            var exception = GetRootException(context.Exception);

            context.Result = new JsonResult(new Dictionary<string, object>
            {
                { "Error" , exception.Message },
                { "StackTrace", exception.StackTrace }
            });

            errorDetails.StatusCode = context.HttpContext.Response.StatusCode;

            LogExceptionInDb(errorDetails, _context, _currentUserService);
        }

        private static void LogExceptionInDb(ErrorDetails errorDetails, IDapperContext context, ICurrentUserService currentUserService)
        {
            try
            {
                var requestUrl = currentUserService.OriginUrl
                    ?? currentUserService.Referer
                    ?? currentUserService.Origin
                    ?? "Frontend";

                // Appending frontend url for debugging purpose
                errorDetails.StackTrace = !string.IsNullOrWhiteSpace(errorDetails.StackTrace)
                    ? $"{requestUrl} - {errorDetails.StackTrace}"
                    : requestUrl;

                //if (currentUserService.OrganizationId > 0
                //    || !string.IsNullOrWhiteSpace(currentUserService.SubDomain))
                //{
                //    using var connection = context.CreateOrganizationConnection();
                //    PerformErrorLog(connection, DapperConstants.log_SaveErrorLog, errorDetails);
                //}
                //else
                //{
                //    using var connection = context.CreateMasterConnection();
                //    PerformErrorLog(connection, DapperMasterConstants.log_SaveErrorLog, errorDetails);
                //}
            }
            catch
            {
            }
        }

        private static void PerformErrorLog(IDbConnection dbConnection, string procedureName, ErrorDetails errorDetails)
        {
            var dbParams = new
            {
                status_code = errorDetails.StatusCode,
                error_description = errorDetails.ErrorDescription,
                inner_exception = errorDetails.InnerException,
                source = errorDetails.Source,
                stack_trace = errorDetails.StackTrace,
                user_id = errorDetails.UserId
            };

            dbConnection.Execute(procedureName, dbParams, commandType: CommandType.StoredProcedure);
        }

        private static Exception GetRootException(Exception exception)
        {
            if (exception.InnerException != null)
                exception = GetRootException(exception.InnerException);

            return exception;
        }
    }
}
