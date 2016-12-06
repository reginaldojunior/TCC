var endpoint = 'http://31.220.52.41:5000/';

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

    $("body").on("click", "a#loadModelPayment", function(){
        var id = $(this).attr('data-service');
        
        console.log(id);

        $('#modal1').openModal();
    });

});

function showFormSignUp() 
{
    $('#signin').show();
    $('#signup').hide();
}

function showFormSignIn()
{
    $('#signin').hide();
    $('#signup').show();
}

function loginByForm() 
{
    var email = $('#email-signin').val();
    var senha = $('#senha-signin').val();

    $.ajax({
        url: endpoint + 'clients?where={"email": "' + email + '", "password": "' + senha + '"}'  ,
        method: 'GET',
        dataType: 'JSON',
        success: function(data) {
            if (data['_meta']['total'] > 0) 
            {
                $.cookie('email', email, { expires: 7 });
                $.cookie('password', senha, { expires: 7 });
                $.cookie('id', data['_items'][0]['_id'], { expires: 7 });
                
                window.open('index2.html', '_self');           
            } else {
                alert('Dados não encontrados, tente novamente.');
            }
        },
        error:  function(xhr, status, error) {
          var err = eval("(" + xhr.responseText + ")");
          alert(err.Message);
        }
    });
}

function registerByForm()
{
    var data = {
        'firstname': $('#fullname-signup').val(),
        'email': $('#email-signup').val(),
        'password': $("#senha-signup").val(),
        'phone': $('#telefone-signup').val()
    };
    
    $.ajax({
        url: endpoint + "clients",
        method: 'POST',
        dataType: 'JSON',
        data: data,
        success: function(data) {
            if (data['_status'] == "OK")
            {
                $.cookie('email', data['email'], { expires: 7 });
                $.cookie('password', data['password'], { expires: 7 });

                alert('Cadastrado com sucesso!');

                window.open('index2.html', '_self');
            }
            else
            {
                alert('Ocorreu um erro tente novamente!');
            }
        },
        error: function(data) {
            alert('Ocorreu um erro no nosso servidor, tente novamente mais tarde ou ligue para gente.');
        }
    });
}

function requestHelp() {
	id = $.cookie('id');

    if (id == undefined || id == "")
        window.open('index.html', '_self');

	data = {
		'cep': $('#cep').val(),
		'address': $('#address').val(),
		'number': $('#number').val(),
		'neighbohood': $('#neighbohood').val(),
		'city': $('#city').val(),
		'state': $('#state').val(),
		'reference': $('#reference').val(),
		'service': $('#service').val(),
        'paid': false,
		'user_id': id
	};

	var error = false;
	for(val in data) {
		if (data[val] == undefined || data[val] == "") {
			$('#' + val).css('border-color', 'red').focus();
			error = true;
		}
	}

	if (error)
		return;

	$.ajax({
		url: endpoint + 'helps',
		method: 'POST',
        data: data,
        success: function(data) {
            if (data['_status'] == "OK")
            {
                $.cookie('email', data['email'], { expires: 7 });
                $.cookie('password', data['password'], { expires: 7 });

                alert('Seu pedido de socorro foi feito com sucesso! Em dentro de minutos iremos te ligar');

                window.open('index2.html', '_self');
            }
            else
            {
                alert('Ocorreu um erro tente novamente!');
            }
        },
        error: function(data) {
            alert('Ocorreu um erro no nosso servidor, tente novamente mais tarde ou ligue para gente.');
        }
	});
}

function getServices() {
    user_id = $.cookie('id');

    html = '';
 
    $.ajax({
        url: endpoint + 'helps?user_id=' + user_id,
        method: 'GET',
        success: function(data) {
            console.log(data);
            
            for (item in data['_items']) {
                html += '<div class="row">';
                html += '    <div class="col s12 m7">';
                html += '        <div class="card">';
                html += '            <div class="card-image">';

                if (data['_items'][item]['service'] == "lavagem") {
                    html += '            <img src="http://img.dashboard.gestorimobiliaria.com.br/7/imoveis/8484973184947409896432394740.jpg">';
                    html += '            <span class="card-title">Precisei de uma lavagem</span>';
                }

                if (data['_items'][item]['service'] == "pneu") {
                    html += '            <img src="https://thumbs.dreamstime.com/t/car-girl-warning-triangle-broken-38289677.jpg">';
                    html += '            <span class="card-title">Furou um pneu :o</span>';
                }

                if (data['_items'][item]['service'] == "bateria") {
                    html += '            <img src="http://www.autosocorroferreira.com.br/albuns/recarga-de-bateria/eae543a006621787000a6aba8be06a8108012015162007.jpg">';
                    html += '            <span class="card-title">Bateria descarregou :(</span>';
                }

                if (data['_items'][item]['service'] == "guincho") {
                    html += '            <img src="http://img.clasf.com.br/2015/06/27/Servio-De-Guincho-24-Horas-Na-Zona-Leste-20150627121618.jpg">';
                    html += '            <span class="card-title">Vixi! Dessa vez precisei de um guincho</span>';
                }

                if (data['_items'][item]['service'] == "gasolina") {
                    html += '            <img src="http://g1.globo.com/Noticias/Carros/foto/0,,14911702-EX,00.jpg">';
                    html += '            <span class="card-title">Acabou a gasolina :/</span>';
                }

                html += '        </div>';
                html += '        <div class="card-content">';
                html += '            <p>Endereço: ' + data['_items'][item]['address'] + ', ' + data['_items'][item]['number'] + ' - ' + data['_items'][item]['neighbohood'] + ', ' + data['_items'][item]['city'] + ' - ' + data['_items'][item]['state'] + '</p><br>';

                if (data['_items'][item]['paid']) {
                    html += '            <p><b style="font-weight: bolder;">R$</b> 45,00</p>';
                    html += '            <p><b style="font-weight: bolder;">Serviço foi feito: </b> Sim</p>';
                }
                else {
                    html += '            <p><b style="font-weight: bolder;">R$</b> ' + number_format(data['_items'][item]['value'], 2, ',', '.')+ '</p><br>';
                    html += '            <p><a href="javascript:;" id="loadModelPayment" data-service="' + data['_items'][item]['_id'] + '" class="btn blue modal-trigger">Pagar</a></p>';
                }

                html += '        </div>';
                html += '        </div>';
                html += '    </div>';
                html += '</div>';
            }
            
            $('#services').append(html);
        },
        error: function(data) {
            alert('Ocorreu um erro no nosso servidor, tente novamente mais tarde ou ligue para gente.');
        }
    });   
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

function loadModel(id) {
    console.log(id);
}

function paidService() {
    PagarMe.encryption_key = "ek_test_rHdPAKJrappXDNXMX2XhknyJRCMocC";

    var form = $("#payment_form");

    // inicializa um objeto de cartão de crédito e completa
    // com os dados do form
    var creditCard = new PagarMe.creditCard();
    creditCard.cardHolderName = 'REGINALDO';//$("#payment_form #card_holder_name").val();
    creditCard.cardExpirationMonth = 10;//$("#payment_form #card_expiration_month").val();
    creditCard.cardExpirationYear = 18;//$("#payment_form #card_expiration_year").val();
    creditCard.cardNumber = '5555444433331111';//$("#payment_form #card_number").val();
    creditCard.cardCVV = '123';//$("#payment_form #card_cvv").val();

    // pega os erros de validação nos campos do form
    var fieldErrors = creditCard.fieldErrors();

    //Verifica se há erros
    var hasErrors = false;
    for(var field in fieldErrors) { hasErrors = true; break; }

    if(hasErrors) {
        // realiza o tratamento de errors
        console.log(fieldErrors);
    } else {
        // se não há erros, gera o card_hash...
        creditCard.generateHash(function(cardHash) {
            // ...coloca-o no form...
            form.append($('<input type="hidden" name="card_hash" id="card_hash">').val(cardHash));
            // e envia o form
            submitForm();
        });
    }


    return false;
}

function submitForm() {
    data = {
        'api_key': "ak_test_hqLSMqUcpFu591rN4jwv7tP2VAif5B",
        'amount': 1499,
        'card_hash': $('#card_hash').val(),
        'payment_method': 'credit_card'
    };

    $.ajax({
        url: 'https://api.pagar.me/1/transactions',
        method: 'POST',
        data: data,
        success: function(data) {
            console.log(data);
        },
        error: function(data) {
            console.log(data);
        }
    });
}