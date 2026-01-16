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

            } catch (KeyNotFoundException ex) {
                
                httpContext.Response.StatusCode = 404;
                await httpContext.Response.WriteAsync(ex.Message);

            } catch (InvalidOperationException ex) {

                httpContext.Response.StatusCode = 400;
                await httpContext.Response.WriteAsync(ex.Message);

            }
        }
    }

}
