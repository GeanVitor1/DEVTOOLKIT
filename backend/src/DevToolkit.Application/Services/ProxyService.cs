using DevToolkit.Application.DTOs;
using DevToolkit.Application.Interfaces;
using DevToolkit.Domain.Entities;

namespace DevToolkit.Application.Services;

public class ProxyService : IProxyService
{
    private readonly IHttpClientProxy _httpClientProxy;

    public ProxyService(IHttpClientProxy httpClientProxy)
    {
        _httpClientProxy = httpClientProxy;
    }

    public async Task<ProxyResponseDto> ExecuteAsync(ProxyRequestDto request)
    {
        var domainRequest = new ProxyRequest
        {
            Method = request.Method,
            Url = request.Url,
            Headers = request.Headers,
            Body = request.Body,
            TimeoutMs = Math.Min(request.TimeoutMs, 30000)
        };

        var domainResponse = await _httpClientProxy.SendAsync(domainRequest);

        return new ProxyResponseDto(
            domainResponse.StatusCode,
            domainResponse.Headers,
            domainResponse.Body,
            domainResponse.TimingMs,
            domainResponse.SizeBytes
        );
    }
}
