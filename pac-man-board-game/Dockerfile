FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build

# Install Node.js TODO use node 18?
RUN curl -fsSL https://deb.nodesource.com/setup_14.x | bash - \
    && apt-get install -y \
        nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /src
COPY ["pac-man-board-game/pac-man-board-game.csproj", "pac-man-board-game/"]
RUN dotnet restore "pac-man-board-game/pac-man-board-game.csproj"
COPY . .
WORKDIR "/src/pac-man-board-game"
RUN dotnet build "pac-man-board-game.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "pac-man-board-game.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "pac-man-board-game.dll"]
