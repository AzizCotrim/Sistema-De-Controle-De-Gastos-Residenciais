namespace ControleDeGastosResidencias.Api.DTOs
{
    public class ApiError
    {
        public int Status { get; init; }
        public string Message { get; init; } = "";
        public string Path { get; init; } = "";
        public string TraceId { get; init; } = "";
    }
}
