# Build from repository `backend/` directory as context.
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY src/DevToolkit.Domain/DevToolkit.Domain.csproj src/DevToolkit.Domain/
COPY src/DevToolkit.Application/DevToolkit.Application.csproj src/DevToolkit.Application/
COPY src/DevToolkit.Infrastructure/DevToolkit.Infrastructure.csproj src/DevToolkit.Infrastructure/
COPY src/DevToolkit.API/DevToolkit.API.csproj src/DevToolkit.API/

RUN dotnet restore src/DevToolkit.API/DevToolkit.API.csproj

COPY src/ src/
RUN dotnet publish src/DevToolkit.API/DevToolkit.API.csproj -c Release -o /publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

ENV ASPNETCORE_URLS=http://0.0.0.0:8080
ENV ASPNETCORE_ENVIRONMENT=Production

COPY --from=build /publish .

EXPOSE 8080
ENTRYPOINT ["dotnet", "DevToolkit.API.dll"]
