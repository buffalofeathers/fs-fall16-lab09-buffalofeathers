document.addEventListener('DOMContentLoaded', function(){
    $('#chirpButton').attr('disabled',true);
    var newChirp = '';

    $.ajax({
    method: 'GET',
    url: 'http://localhost:3000/api/chirps',
    contentType: 'application/json'
    }).then(function(data){
        for(var i = (data.length - 1); i >= 0; i--){
            var chirp  = (data[i]);
            var chirpDiv = document.createElement('div');
            chirpDiv.className = 'retrievedChirp';
            chirpDiv.innerHTML = 'User: ' + chirp.user + ' Chirp: ' + chirp.message + ' Timestamp: ' + chirp.timestamp;
            $('.allChirps').append(chirpDiv);
        };
    }, console.log);
    
    $('#chirpBox').keyup(function(e){
        if($(this).val().length != 0){
            $('#chirpButton').attr('disabled', false);
        }else{
            $('#chirpButton').attr('disabled', true);
        }
    });

    $('#chirpButton').click(function(){
        var newChirp = $('#chirpBox').val();
        var chirpToSend = {
            message: newChirp,
            user: 'Shantanu',
            timestamp: new Date()
        };

        $.ajax({
            method: 'POST',
            url: `http://localhost:3000/api/chirps`,
            contentType: 'application/json',
            data: JSON.stringify(chirpToSend)
        }).then(showNewChirp, console.log);

        $('#chirpBox').val('');
        $('#chirpButton').attr('disabled', true);
    });

    function showNewChirp(){
        $.ajax({
        method: 'GET',
        url: 'http://localhost:3000/api/chirps',
        contentType: 'application/json'
        }).then(function(data){
            $('.retrievedChirp').remove();
            for(var i = (data.length - 1); i >= 0; i--){
                var chirp  = (data[i]);
                var chirpDiv = document.createElement('div');
                chirpDiv.className = 'retrievedChirp';
                chirpDiv.innerHTML = 'User: ' + chirp.user + ' Chirp: ' + chirp.message + ' Timestamp: ' + chirp.timestamp;
                $('.allChirps').append(chirpDiv);
            };
        }, console.log);
    };
});