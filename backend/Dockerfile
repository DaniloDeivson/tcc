FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5000

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["NestFin.API.csproj", "./"]
RUN dotnet restore "NestFin.API.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "NestFin.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "NestFin.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "NestFin.API.dll"] 