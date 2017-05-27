var endpoint = 'http://api.trackcar.ciawn.com.br/';

var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

jQuery(document).ready(function($){
    var isLateralNavAnimating = false;
    
    //open/close lateral navigation
    $('.cd-nav-trigger').on('click', function(event){
        event.preventDefault();
        //stop if nav animation is running 
        if( !isLateralNavAnimating ) {
            if($(this).parents('.csstransitions').length > 0 ) isLateralNavAnimating = true; 
            
            $('body').toggleClass('navigation-is-open');
            $('.cd-navigation-wrapper').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
                //animation is over
                isLateralNavAnimating = false;
            });
        }
    });
});

function loginByForm() 
{
    var email = $('#email-signin').val();
    var senha = $('#senha-signin').val();

    url = endpoint + 'users/' + email + '/' + senha;

    $.ajax({
        url: url,
        method: 'GET',
        dataType: 'JSON',
        success: function(data) {
            if (data['status'])
            {
                window.location.href = 'index2.html';
            }
        },
        error:  function(xhr, status, error) {
          var err = eval("(" + xhr.responseText + ")");
          alert(err.Message);
        }
    });
}

function getHistory()
{
    html = '';

    url = endpoint + 'lastlocations/user/1';
    
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            console.log(data);
            
            html = '';
            for (i in data) {
                html += '<tr>';
                html += '  <td  style="padding: 25px;">'+ data[i]['id'] +'</td>';
                html += '  <td style="font-size: 14px;">'+ data[i]['latitude'] +'</td>';
                html += '  <td style="font-size: 14px;">'+ data[i]['logitude'] +'</td>';
                html += '  <td>';
                html += '    <a target="_blank" style="width: 70px;padding-left: 10px;" href="http://maps.google.com/maps?z=12&q=loc:'+ data[i]['latitude'] +'+'+ data[i]['logitude'] +'" class="waves-effect waves-light btn">';
                html += '      <p>MAPS</p>';
                html += '    </a>';
                html += '  </td>';
                html += '</tr>';
            }

            $('#locations').html(html);
        },
        error:  function(xhr, status, error) {
          var err = eval("(" + xhr.responseText + ")");
          console.log(err);
        }
    });

    $('#historico').html(html);
}

function number_format (number, decimals, dec_point, thousands_sep) {
    // Strip all characters but numerical ones.
    number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;
        };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}

getHistory();