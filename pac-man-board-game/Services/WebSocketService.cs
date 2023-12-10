using System.Net.WebSockets;
using pacMan.Utils;

namespace pacMan.Services;

public interface IWebSocketService
{
    Task Send(WebSocket webSocket, ArraySegment<byte> segment);
    Task<WebSocketReceiveResult> Receive(WebSocket webSocket, byte[] buffer);
    Task Close(WebSocket webSocket, WebSocketCloseStatus closeStatus, string? closeStatusDescription);
}

/// <summary>
///     WebSocketService class provides methods to send, receive and close a WebSocket connection.
/// </summary>
public class WebSocketService(ILogger<WebSocketService> logger) : IWebSocketService
{
    /// <summary>
    ///     Sends the specified byte array as a text message through the WebSocket connection.
    /// </summary>
    /// <param name="webSocket">The WebSocket connection.</param>
    /// <param name="segment">The byte array to send.</param>
    /// <returns>
    ///     A task representing the asynchronous operation of sending the message.
    /// </returns>
    /// <remarks>
    ///     This method sends the specified byte array as a text message through the WebSocket connection.
    ///     It uses the WebSocket.SendAsync method to send the message asynchronously.
    ///     After sending the message, it logs a debug message using the logger provided.
    /// </remarks>
    public async Task Send(WebSocket webSocket, ArraySegment<byte> segment)
    {
        await webSocket.SendAsync(
            segment,
            WebSocketMessageType.Text,
            true,
            CancellationToken.None);

        logger.LogDebug("Message sent through WebSocket");
    }

    /// <summary>
    ///     Receives data from a websocket and logs a debug message.
    /// </summary>
    /// <param name="webSocket">The websocket to receive data from.</param>
    /// <param name="buffer">The buffer to store the received data.</param>
    /// <returns>
    ///     A task representing the asynchronous operation. The result contains the <see cref="WebSocketReceiveResult" />
    ///     which contains information about the received data.
    /// </returns>
    public async Task<WebSocketReceiveResult> Receive(WebSocket webSocket, byte[] buffer)
    {
        var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
        logger.LogDebug(
            "Message \"{}\" received from WebSocket",
            buffer.GetString(result.Count));
        return result;
    }

    /// <summary>
    ///     Closes the WebSocket connection with the specified close status and description.
    /// </summary>
    /// <param name="webSocket">The WebSocket connection to close.</param>
    /// <param name="closeStatus">The status code indicating the reason for the close.</param>
    /// <param name="closeStatusDescription">The optional description explaining the reason for the close.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    public async Task Close(WebSocket webSocket, WebSocketCloseStatus closeStatus, string? closeStatusDescription)
    {
        await webSocket.CloseAsync(
            closeStatus,
            closeStatusDescription,
            CancellationToken.None);

        logger.LogInformation("WebSocket connection closed");
    }
}
