// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

var chatService = {
    init: function () {
        fetch('api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([
                {
                    role: 1,
                    text: 'Tell me about Bangladesh.'
                }
            ])
        })
        .then(response => {
            console.log('Raw response:', response);
            return response.json();  // Ensure this is returned
        })
        .then(data => {
            console.log('Success:',  data);
            $('#chat-window').text(data.text);
        })
        .catch(error => console.error('Error:', error));
    }
};