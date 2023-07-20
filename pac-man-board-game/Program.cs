using DAL.Database.Service;
using pacMan.Interfaces;
using pacMan.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllersWithViews();
builder.Services
    .AddSingleton<IWebSocketService, WebSocketService>()
    .AddSingleton<GameService>()
    .AddScoped<UserService>()
    .AddTransient<IActionService, ActionService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseWebSockets();

app.MapControllerRoute(
    "default",
    "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.Run();
