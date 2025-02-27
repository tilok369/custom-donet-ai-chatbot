// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

let chatService = {
    interval: null,
    chatHistory: [],
    localChatHistory: [],
    init: function () {
        $('#chat-box').keypress(function (event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                chatService.initChat();
            }
        });
    },
    initChat: function () {
        if (!$('#chat-box').val()) {
            return;
        }
        let chatText = chatService.showUserChat();
        chatService.startThinking();
        
        chatService.chatHistory.push({
            role: 1,
            text: chatText,
            originalText: chatText
        });
        
        fetch('api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(chatService.chatHistory)
        })
            .then(response => {
                console.log('Raw response:', response);
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
                chatService.chatHistory.push({
                    role: 2,
                    text: data.text,
                    originalText: data.originalText
                })
                chatService.stopThinking();
                chatService.showChat(chatService.chatHistory.length, data.text);
            })
            .catch(error => console.error('Error:', error));
    },

    showChat: function (index, text) {
        $('#chat-window').append(`<div class="row justify-content-end">
                                        <div id="item-${index}" class="col-lg-8 col-md-8 col-sm-11 chat-item-container-ai">
                                        </div>
                                    </div>`);

        let words = text.split(' ');
        let showLength = 1;
        let interval =setInterval(function () {
            let text='';
            for(let i = 0; i < showLength; i++) {
                text += words[i] + ' ';
            }
            $(`#item-${index}`).html('');
            $(`#item-${index}`).append(`${text}`);
            showLength++;
            if(showLength === words.length + 1) {
                clearInterval(interval);
            }
            if(showLength % 2 === 0) {
                $('#chat-window').scrollTop($('#chat-window')[0].scrollHeight);
            }
        }, 50);
    },

    showUserChat: function () {
        let chatText = $('#chat-box').val();
        $('#chat-box').val('');
        $('#chat-window').append(`<div class="row">
                                    <div class="col-lg-8 col-md-8 col-sm-11 chat-item-container-user">
                                        ${chatText}
                                    </div>
                                </div>`);

        $('#chat-window').scrollTop($('#chat-window')[0].scrollHeight);
        return chatText;
    },

    clearChat: function () {
        chatService.chatHistory= [];
        $('#chat-window').html('');
        $('#chat-box').val('');
    },
    
    preserveChatHistory: function () {
        chatService.localChatHistory.push({
            text: $('#chat-window').html()
        });
        
        return chatService.localChatHistory.length - 1;
    },

    ShowChatHistory: function (historyIndex) {
        chatService.clearChat();
        $('#chat-window').html(chatService.localChatHistory[historyIndex].text);
    },

    startNewChat: function () {
        let chatTitle = $('#chat-window .row .chat-item-container-user:first').text().trim();
        var chatHistoryIndex = chatService.preserveChatHistory();
        chatService.clearChat();
        $('#chat-history-container').append(`<li onclick="chatService.ShowChatHistory(${chatHistoryIndex})" class="list-group-item chat-history-item">${chatTitle}</li>`);
    },
    
    startThinking: function () {
        let dots = 0;
        chatService.interval = setInterval(function () {
            dots = (dots + 1) % 4; // Cycle through 0, 1, 2, 3
            $("#thinking-lbl").text("Thinking" + ".".repeat(dots));
        }, 500);
    },
    stopThinking: function () {
        if (chatService.interval) {
            clearInterval(chatService.interval);
            $("#thinking-lbl").text(null);
        }
    }
};