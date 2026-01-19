using ControleDeGastosResidencias.Api.DTOs;
using System.Text.Json;

namespace ControleDeGastosResidencias.Api.Middlewares
{
    // Middleware global para tratamento de exceções.
    // Intercepta erros não tratados, mapeia para códigos HTTP
    // e retorna um payload de erro padronizado para a API.
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
                // Executa o próximo middleware da pipeline.
                // Qualquer exceção lançada abaixo será capturada aqui.
                await _next(httpContext);
            } catch (Exception ex) {
                // Mapeia a exceção para status HTTP e mensagem amigável.
                var (status, message) = MapException(ex);

                // Monta o payload de erro padronizado da API.
                var error = new ApiError
                {
                    Status = status,
                    Message = message,
                    Path = httpContext.Request.Path,
                    TraceId = httpContext.TraceIdentifier
                };

                // Define status e retorna erro em JSON para o cliente.
                httpContext.Response.StatusCode = status;
                httpContext.Response.ContentType = "application/json";

                var json = JsonSerializer.Serialize(error);
                await httpContext.Response.WriteAsync(json);
            }
        }

        // Converte exceções da aplicação em códigos HTTP e mensagens de erro.
        // Exceções de domínio/validação retornam 400 ou 404.
        // Exceções não mapeadas retornam 500 (erro interno).
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
