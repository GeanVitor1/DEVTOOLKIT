namespace DevToolkit.Application.DTOs;

public record ProxyRequestDto(
    string Method,
    string Url,
    Dictionary<string, string>? Headers = null,
    string? Body = null,
    int TimeoutMs = 30000
);
