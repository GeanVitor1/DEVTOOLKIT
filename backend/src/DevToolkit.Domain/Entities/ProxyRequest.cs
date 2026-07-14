namespace DevToolkit.Domain.Entities;

public class ProxyRequest
{
    public string Method { get; set; } = "GET";
    public string Url { get; set; } = string.Empty;
    public Dictionary<string, string>? Headers { get; set; }
    public string? Body { get; set; }
    public int TimeoutMs { get; set; } = 30000;
}
