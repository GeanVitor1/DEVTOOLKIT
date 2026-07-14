namespace DevToolkit.Domain.Entities;

public class ProxyResponse
{
    public int StatusCode { get; set; }
    public Dictionary<string, string>? Headers { get; set; }
    public string? Body { get; set; }
    public long TimingMs { get; set; }
    public long SizeBytes { get; set; }
}
