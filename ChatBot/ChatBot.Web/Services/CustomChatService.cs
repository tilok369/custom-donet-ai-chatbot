using System.Diagnostics;
using ChatBot.Web.Models;
using Microsoft.Extensions.AI;

namespace ChatBot.Web.Services;

public class CustomChatService(IServiceProvider serviceProvider) : ICustomChatService
{
    private readonly IChatClient _chatClient = serviceProvider.GetRequiredService<IChatClient>();

    public async Task<CustomChatResponse> ChatAsync(List<CustomChatResponse> messages)
    {
        var chatResponses = messages
            .Select(c => new ChatMessage(ToChatRole(c.Role), c.Text)).ToList();

        var chatResponseText = string.Empty;
        await foreach (var message in _chatClient.GetStreamingResponseAsync(chatResponses))
        {
            chatResponseText += message.Text + "\n";
        }

        return new CustomChatResponse(2, chatResponseText);
    }   
    
    private ChatRole ToChatRole(int role) 
    {
        switch(role)
        {
            case 1: return ChatRole.User;
            case 2: return ChatRole.Assistant;
            default: return ChatRole.System;
        }
    }
}