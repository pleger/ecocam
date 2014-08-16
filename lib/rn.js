
var obtenerNumero = function(){
	return Math.floor(Math.random()*55);
}

var obtenerOperacion = function(){
	return '+';
}

var operacionCorrecta = function(op){
	switch(op){
		case '+':
			return function(resultado, izquierdo, derecho){
				return resultado == izquierdo+derecho?true:false;
			}
		case '-':
			return function(resultado, izquierdo, derecho){
				return resultado == izquierdo-derecho?true:false;
			}
	}		
}

var sumaCorrecta = operacionCorrecta('+');
var sumaCorrectaInterfazGrafica = operacionCorrecta('+');
var restaCorrecta = operacionCorrecta('-');

var getNumeroUnidades = function(numero){
	decena = 0;
	quinquena = 0;
	unidad = 0;
	decena = Math.floor(numero/10);
	numero -= decena*10;
	quinquena = Math.floor(numero/5);
	numero -= quinquena*5;
	unidad = numero
	numero -= numero;
	return [decena,quinquena,unidad];	
}

var getClaseElemento = function(widget){
	var clases = $(widget).attr('class');
	return clases.split(' ')[0];
}

var esVaciable = function(objeto){
	return objeto.getNumeroCubetaIzquierda()%10 == 0 ? true:(objeto.getNumeroCubetaDerecha()%10 == 0 ? true: false);
}

var movimientoValidoQuinquena = function(ecocam){
	return function(droppable){
		if (droppable == false){
			return true;
		}
		var cantidadActual = $(droppable).hasClass('wrapper-cubeta-derecha') ? ecocam.getNumeroCubetaDerecha():ecocam.getNumeroCubetaIzquierda();
		var addQuinquenaCubeta = $(droppable).hasClass('wrapper-cubeta-derecha') ? addQuinquenaCubetaDerecha:addQuinquenaCubetaIzquierda;
		if (cantidadActual < 10){
			if (cantidadActual+5 > 10){
				return true;
			}
		}
		else{
			if ((Math.floor((cantidadActual+5)/10) > Math.floor(cantidadActual/10)) && (cantidadActual+5)%10 != 0){
				return true;
			}				
		}
		$("#wrapper-cubetas").trigger("quinquenaAccepted",
									[ecocam,
									$(droppable).find(".cubeta"),
									addQuinquenaCubeta,
									this]);			
	};
}

var movimientoValidoDecena = function(ecocam){
	return function(droppable){	
		return true;
	};
}