namespace DevToolkit.Application.DTOs;

public record ProxyRequestDto(
    string Method,
    string Url,
    Dictionary<string, string>? Headers,
    string? Body,
    int TimeoutMs
);
