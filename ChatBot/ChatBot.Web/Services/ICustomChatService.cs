using ChatBot.Web.Models;
using Microsoft.Extensions.AI;

namespace ChatBot.Web.Services;

public interface ICustomChatService
{
    public Task<CustomChatResponse> ChatAsync(List<CustomChatResponse> messages);
}