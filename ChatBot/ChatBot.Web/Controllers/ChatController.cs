using ChatBot.Web.Models;
using ChatBot.Web.Services;
using Microsoft.AspNetCore.Mvc;

namespace ChatBot.Web.Controllers;

[Route("api/chat")]
[ApiController]
public class ChatController(ICustomChatService customChatService) : Controller
{
    private readonly ICustomChatService _customChatService = customChatService;

    [HttpPost]
    public async Task<IActionResult> PostChat(List<CustomChatResponse> messages)
    {
        var response = await _customChatService.ChatAsync(messages);
        return Ok(response);
    }
}