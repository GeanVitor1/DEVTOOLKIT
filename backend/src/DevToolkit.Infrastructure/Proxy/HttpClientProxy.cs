using System.Diagnostics;
using System.Net;
using System.Net.Http.Headers;
using DevToolkit.Application.Interfaces;
using DevToolkit.Domain.Entities;

namespace DevToolkit.Infrastructure.Proxy;

public class HttpClientProxy : IHttpClientProxy
{
    private readonly HttpClient _httpClient;
    private static readonly string[] BlockedHosts = ["127.0.0.1", "localhost", "::1"];
    private static readonly string[] BlockedRanges = ["10.", "172.16.", "172.17.", "172.18.", "172.19.",
        "172.20.", "172.21.", "172.22.", "172.23.", "172.24.", "172.25.", "172.26.", "172.27.",
        "172.28.", "172.29.", "172.30.", "172.31.", "192.168."];

    public HttpClientProxy(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<ProxyResponse> SendAsync(ProxyRequest request)
    {
        ValidateUrl(request.Url);

        var uri = new Uri(request.Url);
        var method = new HttpMethod(request.Method.ToUpperInvariant());
        var message = new HttpRequestMessage(method, uri);

        if (request.Headers != null)
        {
            foreach (var header in request.Headers)
            {
                if (string.Equals(header.Key, "Host", StringComparison.OrdinalIgnoreCase)) continue;
                message.Headers.TryAddWithoutValidation(header.Key, header.Value);
            }
        }

        if (request.Body != null && method != HttpMethod.Get && method != HttpMethod.Head)
        {
            message.Content = new StringContent(request.Body);
            if (request.Headers != null && request.Headers.TryGetValue("Content-Type", out var contentType))
            {
                message.Content.Headers.ContentType = MediaTypeHeaderValue.Parse(contentType);
            }
        }

        var cts = new CancellationTokenSource(TimeSpan.FromMilliseconds(request.TimeoutMs));
        var sw = Stopwatch.StartNew();

        try
        {
            using var response = await _httpClient.SendAsync(message, cts.Token);
            sw.Stop();

            var body = await response.Content.ReadAsStringAsync(cts.Token);
            var headers = new Dictionary<string, string>();
            foreach (var h in response.Headers)
            {
                headers[h.Key] = string.Join(", ", h.Value);
            }
            foreach (var h in response.Content.Headers)
            {
                headers[h.Key] = string.Join(", ", h.Value);
            }

            var bodyBytes = System.Text.Encoding.UTF8.GetByteCount(body ?? "");

            return new ProxyResponse
            {
                StatusCode = (int)response.StatusCode,
                Headers = headers,
                Body = body,
                TimingMs = sw.ElapsedMilliseconds,
                SizeBytes = bodyBytes
            };
        }
        catch (TaskCanceledException)
        {
            sw.Stop();
            return new ProxyResponse
            {
                StatusCode = 408,
                Body = "Request timed out",
                TimingMs = request.TimeoutMs,
                SizeBytes = 0
            };
        }
        catch (HttpRequestException ex)
        {
            sw.Stop();
            return new ProxyResponse
            {
                StatusCode = 502,
                Body = $"Proxy error: {ex.Message}",
                TimingMs = sw.ElapsedMilliseconds,
                SizeBytes = 0
            };
        }
    }

    private static void ValidateUrl(string url)
    {
        if (!Uri.TryCreate(url, UriKind.Absolute, out var uri))
            throw new ArgumentException("Invalid URL");

        var host = uri.Host.ToLowerInvariant();
        if (BlockedHosts.Contains(host))
            throw new ArgumentException("Requests to localhost are not allowed");

        if (BlockedRanges.Any(prefix => host.StartsWith(prefix)))
            throw new ArgumentException("Requests to internal IP ranges are not allowed");

        if (IPAddress.TryParse(host, out var ip))
        {
            if (IPAddress.IsLoopback(ip))
                throw new ArgumentException("Requests to loopback addresses are not allowed");

            if (ip.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork)
            {
                var bytes = ip.GetAddressBytes();
                if (bytes[0] == 10) throw new ArgumentException("Requests to private IP ranges are not allowed");
                if (bytes[0] == 172 && bytes[1] >= 16 && bytes[1] <= 31) throw new ArgumentException("Requests to private IP ranges are not allowed");
                if (bytes[0] == 192 && bytes[1] == 168) throw new ArgumentException("Requests to private IP ranges are not allowed");
            }
        }
    }
}
