using DevToolkit.Domain.Entities;

namespace DevToolkit.Application.Interfaces;

public interface IHttpClientProxy
{
    Task<ProxyResponse> SendAsync(ProxyRequest request);
}
