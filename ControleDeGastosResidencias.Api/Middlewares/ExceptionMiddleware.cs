using ControleDeGastosResidencias.Api.DTOs;
using System.Text.Json;

namespace ControleDeGastosResidencias.Api.Middlewares
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;

        public ExceptionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            try {

                await _next(httpContext);

            } catch (Exception ex) {
                var (status, message) = MapException(ex);

                var error = new ApiError
                {
                    Status = status,
                    Message = message,
                    Path = httpContext.Request.Path,
                    TraceId = httpContext.TraceIdentifier
                };

                httpContext.Response.StatusCode = status;
                httpContext.Response.ContentType = "application/json";

                var json = JsonSerializer.Serialize(error);
                await httpContext.Response.WriteAsync(json);

            }
        }

        public static (int status, string message) MapException(Exception ex)
        {
            return ex switch
            {
                KeyNotFoundException => (StatusCodes.Status404NotFound, ex.Message),
                InvalidOperationException => (StatusCodes.Status400BadRequest, ex.Message),
                ArgumentException => (StatusCodes.Status400BadRequest, ex.Message),

                _ => (StatusCodes.Status500InternalServerError, "Erro inesperado - " + ex.Message)
            };
        }

    }

}
