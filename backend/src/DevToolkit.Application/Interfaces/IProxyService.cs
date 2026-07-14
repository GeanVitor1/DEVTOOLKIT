using DevToolkit.Application.DTOs;

namespace DevToolkit.Application.Interfaces;

public interface IProxyService
{
    Task<ProxyResponseDto> ExecuteAsync(ProxyRequestDto request);
}
