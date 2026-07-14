namespace DevToolkit.Application.DTOs;

public record ProxyResponseDto(
    int StatusCode,
    Dictionary<string, string>? Headers,
    string? Body,
    long TimingMs,
    long SizeBytes
);
