using Microsoft.Extensions.AI;

namespace ChatBot.Web.Models;

public record CustomChatResponse(int Role, string Text, string OriginalText);