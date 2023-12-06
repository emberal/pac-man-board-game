using System.Net.WebSockets;
using Microsoft.AspNetCore.Mvc;
using pacMan.Services;

namespace pacMan.Controllers;

/// <summary>
///     Represents a generic controller for handling WebSocket connections.
/// </summary>
public abstract class GenericController(ILogger<GenericController> logger, IWebSocketService webSocketService)
    : ControllerBase
{
    /// <summary>
    ///     Buffer size used for processing data.
    /// </summary>
    private const int BufferSize = 1024 * 4;

    protected readonly ILogger<GenericController> Logger = logger;
    protected WebSocket? WebSocket;

    /// <summary>
    ///     Establishes a WebSocket connection with the client.
    /// </summary>
    /// <remarks>
    ///     This method checks if the HTTP request is a WebSocket request. If it is, it accepts the WebSocket connection, logs
    ///     the connection establishment, and sets the WebSocket property to
    ///     the accepted WebSocket instance.
    ///     After the connection is established, the method calls the Echo method to start echoing messages.
    ///     If the request is not a WebSocket request, it sets the HTTP response status code to 400 (BadRequest).
    /// </remarks>
    /// <returns>
    ///     The task representing the asynchronous operation.
    /// </returns>
    public virtual async Task Connect()
    {
        if (HttpContext.WebSockets.IsWebSocketRequest)
        {
            using var webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
            Logger.LogInformation("WebSocket connection established to {}", HttpContext.Connection.Id);
            WebSocket = webSocket;
            await Echo();
        }
        else
        {
            HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
        }
    }

    /// <summary>
    ///     An asynchronous method that reads data from the WebSocket connection,
    ///     processes it, and sends back the processed data.
    /// </summary>
    /// <returns>A Task representing the asynchronous operation.</returns>
    protected virtual async Task Echo()
    {
        if (WebSocket is null) return;
        try
        {
            WebSocketReceiveResult? result;
            do
            {
                var buffer = new byte[BufferSize];
                result = await webSocketService.Receive(WebSocket, buffer);

                if (result.CloseStatus.HasValue) break;

                var segment = Run(result, buffer);

                Send(segment);
            } while (true);

            var disconnectSegment = Disconnect();
            if (disconnectSegment is not null)
                SendDisconnectMessage((ArraySegment<byte>)disconnectSegment);

            await webSocketService.Close(WebSocket, result.CloseStatus.Value, result.CloseStatusDescription);
        }
        catch (WebSocketException e)
        {
            Logger.LogError("{}", e.Message);
        }
    }

    /// <summary>
    ///     Sends the specified byte segment using the WebSocket connection.
    ///     If the WebSocket connection is null, the method does nothing.
    /// </summary>
    /// <param name="segment">The byte segment to send.</param>
    protected virtual void Send(ArraySegment<byte> segment)
    {
        if (WebSocket is null) return;
        webSocketService.Send(WebSocket, segment);
    }

    protected abstract ArraySegment<byte> Run(WebSocketReceiveResult result, byte[] data);

    protected virtual ArraySegment<byte>? Disconnect() => null;

    protected virtual void SendDisconnectMessage(ArraySegment<byte> segment) { }
}
