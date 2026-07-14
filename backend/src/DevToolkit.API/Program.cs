using DevToolkit.API.Middleware;
using DevToolkit.Application.Interfaces;
using DevToolkit.Application.Services;
using DevToolkit.Infrastructure.Proxy;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddScoped<IProxyService, ProxyService>();
builder.Services.AddScoped<IHttpClientProxy, HttpClientProxy>();
builder.Services.AddHttpClient<IHttpClientProxy, HttpClientProxy>(client =>
{
    client.Timeout = TimeSpan.FromSeconds(30);
});

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseCors();
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.MapControllers();

app.Run();
