// Годинник
function startTime() {
    var today = new Date();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var seconds = today.getSeconds();
    document.getElementById('time').innerHTML =
        hours + ":" + minutes + ":" + seconds;
    var t = setTimeout(startTime, 1000);
}

// Конвертер
$(document).ready(function() {
    $('select').on('change', function() {
        convert();
    });

    $('input').on('blur', function() {
        convert();
    });
});

function convert() {
    var fromCurrency = $('#fromCurrency').val();
    var toCurrency = $('#toCurrency').val();
    var amount = parseFloat($('input[name="inputbox"]').val());

    if (isNaN(amount)) {
        $('#convertedResult').html('Введіть коректну суму.');
        return;
    }

    $.ajax({
        url: 'https://api.exchangerate-api.com/v4/latest/' + fromCurrency,
        dataType: 'json',
        success: function(data) {
            var exchangeRate = data.rates[toCurrency];
            var result = amount * exchangeRate;
            $('#convertedResult').html(result);
        },
        error: function() {
            $('#convertedResult').html('Помилка під час отримання даних курсу валют.');
        }
    });
}