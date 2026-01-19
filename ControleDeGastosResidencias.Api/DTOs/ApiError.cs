namespace ControleDeGastosResidencias.Api.DTOs
{
    // Representa o formato padrão de erro retornado pela API
    public class ApiError
    {
        public int Status { get; init; }
        public string Message { get; init; } = "";
        public string Path { get; init; } = "";
        public string TraceId { get; init; } = "";
    }
}
