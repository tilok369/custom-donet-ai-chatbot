using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ChatBot.Web.Models;
using Microsoft.Extensions.AI;

namespace ChatBot.Web.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private readonly IServiceProvider _serviceProvider;

    public HomeController(ILogger<HomeController> logger, IServiceProvider serviceProvider)
    {
        _logger = logger;
        _serviceProvider = serviceProvider;
    }

    public async Task<IActionResult> Index()
    {
        var chatClient = _serviceProvider.GetRequiredService<IChatClient>();
        var chatMessages = new List<ChatMessage> { new ChatMessage(ChatRole.User, "What is .NET?") };
        var chatCompletion = await chatClient.GetResponseAsync(chatMessages);
        ViewBag.ChatMessages = chatCompletion.Message.Text;
        return View();
    }

    public IActionResult Privacy()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}