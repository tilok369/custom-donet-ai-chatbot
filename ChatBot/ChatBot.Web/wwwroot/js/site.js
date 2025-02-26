// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

let chatService = {
    interval: null,
    init: function () {
        $('#chat-box').keypress(function (event) {
            if (event.keyCode === 13) {
                chatService.initChat();
            }
        });
    },
    initChat: function () {
        if (!$('#chat-box').val()) {
            return;
        }
        let chatText = $('#chat-box').val();
        $('#chat-box').val(null);
        $('#chat-window').append(`<div class="row">
                                    <div class="col-lg-8 col-md-8 col-sm-11 chat-item-container-user">
                                        ${chatText}
                                    </div>
                                </div>`);
        
        chatService.startThinking();
        
        fetch('api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([
                {
                    role: 1,
                    text: chatText
                }
            ])
        })
            .then(response => {
                console.log('Raw response:', response);
                return response.json();  // Ensure this is returned
            })
            .then(data => {
                console.log('Success:', data);
                // $('#chat-window').append(`<div class="row justify-content-end">
                //                         <div class="col-lg-8 col-md-8 col-sm-11 chat-item-container-ai">
                //                             ${data.text}
                //                         </div>
                //                     </div>`);
                // $('#chat-window').scrollTop($('#chat-window')[0].scrollHeight);
                chatService.stopThinking();
                chatService.showChat(data.text);
            })
            .catch(error => console.error('Error:', error));
    },

    startChat: function () {
        let chatTitle = $('#chat-window .row .chat-item-container-user:first').text().trim();
        $('#chat-window').html('');
        $('#chat-box').val(null);
        $('#chat-history-container').append(`<li class="list-group-item">${chatTitle}</li>`);
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
    },
    
    showChat: function (text) {
        $('#chat-window').append(`<div class="row justify-content-end">
                                        <div id="item-1" class="col-lg-8 col-md-8 col-sm-11 chat-item-container-ai">
                                        </div>
                                    </div>`);
        
        let words = text.split(' ');
        let showLength = 1;
        let i =setInterval(function () {
            let text='';
            for(let i = 0; i < showLength; i++) {
                text += words[i] + ' ';
            }
            $('#item-1').html('');
            $('#item-1').append(`${text}`);
            showLength++;
            if(showLength === words.length + 2) {
                clearInterval(i);
            }
            if(showLength % 2 === 0) {
                $('#chat-window').scrollTop($('#chat-window')[0].scrollHeight);
            }
        }, 50);
    }
};