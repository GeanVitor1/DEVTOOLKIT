using DevToolkit.API.Middleware;
using DevToolkit.Application.Interfaces;
using DevToolkit.Application.Services;
using DevToolkit.Infrastructure.Proxy;

var builder = WebApplication.CreateBuilder(args);

// Render (and most PaaS) inject PORT — bind 0.0.0.0 so the service is reachable.
var port = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrWhiteSpace(port))
{
    builder.WebHost.UseUrls($"http://0.0.0.0:{port}");
}

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.DictionaryKeyPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

builder.Services.AddScoped<IProxyService, ProxyService>();
builder.Services.AddHttpClient<IHttpClientProxy, HttpClientProxy>(client =>
{
    client.Timeout = TimeSpan.FromSeconds(30);
    client.DefaultRequestHeaders.UserAgent.ParseAdd("DevToolkit-Proxy/1.0");
});

var allowedOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .Get<string[]>()?
    .Where(o => !string.IsNullOrWhiteSpace(o))
    .ToArray() ?? [];

// Fallback: CORS_ORIGINS="https://a.vercel.app,https://b.com"
if (allowedOrigins.Length == 0)
{
    var raw = Environment.GetEnvironmentVariable("CORS_ORIGINS")
              ?? Environment.GetEnvironmentVariable("Cors__AllowedOrigins");
    if (!string.IsNullOrWhiteSpace(raw))
    {
        allowedOrigins = raw
            .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
    }
}

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        if (allowedOrigins.Length > 0)
        {
            policy.WithOrigins(allowedOrigins)
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        }
        else if (builder.Environment.IsDevelopment())
        {
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        }
        else
        {
            // Production without explicit origins: allow Vercel preview/production patterns + localhost.
            policy.SetIsOriginAllowed(origin =>
                  {
                      if (string.IsNullOrEmpty(origin)) return false;
                      if (origin.StartsWith("http://localhost", StringComparison.OrdinalIgnoreCase)) return true;
                      if (origin.EndsWith(".vercel.app", StringComparison.OrdinalIgnoreCase)) return true;
                      return false;
                  })
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        }
    });
});

var app = builder.Build();

app.UseCors("Frontend");
app.UseMiddleware<ExceptionHandlingMiddleware>();

// Lightweight health for Render / uptime checks (no auth).
app.MapGet("/health", () => Results.Ok(new
{
    status = "healthy",
    timestamp = DateTime.UtcNow,
    service = "DevToolkit.API",
    version = "1.0.0"
}));

app.MapGet("/", () => Results.Ok(new
{
    name = "DevToolkit API",
    status = "running",
    health = "/health",
    proxy = "POST /api/proxy"
}));

app.MapControllers();

app.Run();
