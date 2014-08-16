$(document).ready(function(){
	
		cubetaIzquierda = $("#cubeta-izquierda");
		cubetaDerecha = $("#cubeta-derecha");
		numeroIzquierdo = -1;
		numeroDerecho = -1;
		operacion = "+";
	
	$("#numero-izquierdo").html(numeroIzquierdo);
	$("#numero-derecho").html(numeroDerecho);
	
	$(cubetaIzquierda).find(".caja-respuesta-representacion-iconica").val(numeroIzquierdo);
	$(cubetaDerecha).find(".caja-respuesta-representacion-iconica").val(numeroDerecho);	
	
	$('#caja-respuesta-nube').numeric();
	$('.caja-respuesta-representacion-iconica').numeric();
	
	$(".wrapper-cubeta-central").hide();
	$("#representacion-iconica").hide();
	$("#wrapper-simbolo-intermedio .operacion").hide();	
	
	
	
	
	$('.quinquena').live('click',function(){
		descomponerUnidades($(this),$(this).parent());
	});
	$('#vaciar').click(function(){
		$(".wrapper-cubeta-central .cubeta").trigger("start-add-elements");
		$('#vaciar img').attr("src","images/suma.png");
		$(this).bind('click',function(){return false});
		return false;
	});
	$("body").click(function(){
		var caja = $("textarea:visible").filter(function(){
			if ($(this).hasClass("deshabilitado") == false){
				if ($(this).attr("readonly") != true){
					return this;
				}
			}
		});
		$(caja).filter(":last").focus();
	});
	/*
	 * Manejador de eventos que son lanzados cuando la acci—n de disolver y
	 * aparecer en cadena es terminada.
	*/
	$(".wrapper-cubeta-central .cubeta").bind("start-add-elements",function(){
		var decenasCubetas = mergeElementos(getDecenas(cubetaIzquierda),getDecenas(cubetaDerecha));												
		var contenedorDestino = $(".wrapper-cubeta-central .cubeta");
		if (decenasCubetas.length == 0){
			$(".wrapper-cubeta-central .cubeta").trigger("add-decenas-finished");
		}
		else {
			$(decenasCubetas[0]).fadeOut(
										1000,
										disolverAparecerEnCadena(contenedorDestino,
																decenasCubetas,
																1,
																"add-decenas-finished",
																aparecerEnContenedor));	
			$(".wrapper-cubeta-central").fadeIn(2000,function(){});
		}
	});	
	$(".wrapper-cubeta-central .cubeta").bind("add-decenas-finished",function(){
		var quinquenasCubetas = mergeElementos(getQuinquenas(cubetaIzquierda),getQuinquenas(cubetaDerecha));
		var contenedorDestino = $(".wrapper-cubeta-central .cubeta");
		if (quinquenasCubetas.length == 0){
			$(".wrapper-cubeta-central .cubeta").trigger("add-quinquenas-finished");			
		}
		else {
			$(quinquenasCubetas[0]).fadeOut(
										1000,
										disolverAparecerEnCadena(contenedorDestino,
																quinquenasCubetas,
																1,
																"add-quinquenas-finished",
																aparecerEnContenedor));
		}
	});
	$(".wrapper-cubeta-central .cubeta").bind("add-quinquenas-finished",function(){
		var unidadesCubetas = mergeElementos(getUnidades(cubetaIzquierda),getUnidades(cubetaDerecha));
		var contenedorDestino = $(".wrapper-cubeta-central .cubeta");
		if (unidadesCubetas.length == 0){
			$(".wrapper-cubeta-central .cubeta").trigger("add-unidades-finished");		
		}
		else {
			$(unidadesCubetas[0]).fadeOut(
										1000,
										disolverAparecerEnCadena(contenedorDestino,
																unidadesCubetas,
																1,
																"add-unidades-finished",
																aparecerUnidadesEnContenedor));
		}
	});
	$(".wrapper-cubeta-central .cubeta").bind("add-unidades-finished",function(){
		$(".caja-respuesta-representacion-iconica").focus();
		$("#cubeta-izquierda .equivalencia").hide()
		$("#cubeta-derecha .equivalencia").hide()
		$("#cubeta-izquierda .cubeta").hide();
		$("#cubeta-derecha .cubeta").hide();
		$(".wrapper-cubeta-izquierda").addClass("centrar");
		$(".wrapper-cubeta-derecha").addClass("centrar");		
	});
	

	
	
	$("#siguiente").click(function(){
		//TODO:guardar el estado en un objeto global?	
		if ($("#caja-respuesta-nube").hasClass("deshabilitado") == true){
			//verifico si alumno responde correctamente
			var respuesta = parseInt($("#cubeta-central .caja-respuesta-representacion-iconica").val(),10);		
			if (respuesta == numeroIzquierdo + numeroDerecho){
				//reiniciar interfaz gr‡fica!
				$(".cubeta .reglon").remove();
				$(".caja-respuesta-representacion-iconica").val('');
				$("#caja-respuesta-nube").val('');
				$("#caja-respuesta-nube").removeClass("deshabilitado");
				
				$('.wrapper-cubeta-izquierda').removeClass("centrar");
				$('.wrapper-cubeta-derecha').removeClass("centrar");
				
				$('.wrapper-cubeta-izquierda .equivalencia').show();
				$('.wrapper-cubeta-izquierda .cubeta').show();
				
				$('.wrapper-cubeta-derecha .equivalencia').show();
				$('.wrapper-cubeta-derecha .cubeta').show();
				
				$('.wrapper-cubeta-central').hide();
				
				$('#vaciar img').attr("src","images/vaciador.png");
				
				
				$('body').click();
				
				
				numeroIzquierdo = Math.floor(Math.random()*55);
				numeroDerecho = Math.floor(Math.random()*55);
				$("#numero-izquierdo").html(numeroIzquierdo);
				$("#numero-derecho").html(numeroDerecho);
				
				$(".wrapper-cubeta-izquierda .caja-respuesta-representacion-iconica").val(numeroIzquierdo);
				$(".wrapper-cubeta-derecha .caja-respuesta-representacion-iconica").val(numeroDerecho);
				
				$("#representacion-iconica").hide();
				
			}
			else{
				$("#cubeta-central .caja-respuesta-representacion-iconica").effect("highlight", {'color':'red'}, 5000);
				$("#cubeta-central .caja-respuesta-representacion-iconica").focus();				
			}
		}
		else{
			var respuesta = parseInt($("#caja-respuesta-nube").val(),10);			
			if (respuesta == numeroIzquierdo + numeroDerecho){
				//pasar a siguiente ejercicio
				numeroIzquierdo = Math.floor(Math.random()*55);
				numeroDerecho = Math.floor(Math.random()*55);
				$("#numero-izquierdo").html(numeroIzquierdo);
				$("#numero-derecho").html(numeroDerecho);

				$("#caja-respuesta-nube").val('');
				$(".wrapper-cubeta-izquierda .caja-respuesta-representacion-iconica").val(numeroIzquierdo);
				$(".wrapper-cubeta-derecha .caja-respuesta-representacion-iconica").val(numeroDerecho);
				$("#caja-respuesta-nube").focus();
				
								
			}
			else{
				llenarCubetaIzquierda(numeroIzquierdo);
				llenarCubetaDerecha(numeroDerecho);
				$("#representacion-iconica").show();
				$("#caja-respuesta-nube").addClass("deshabilitado");
			}
		}
		return false;
	});
	

	/*
	$('.decena').click(function(){
		var object_decena = $(this);
		var parent_decena = $(this).parent();
		var contenedor = $(object_decena).parents(".contenedor");
		console.log(contenedor);
		$(parent_decena).fadeOut(1000,function(){
			$('.contenedor-resultado').append($(parent_decena));
			asignar_reglon_base(contenedor);			
			$(parent_decena).fadeIn(3000,function(){			
				$(object_decena).unbind('click');
			});
		});
	});
	*/
});

var llenarCubetaIzquierda = function(numero){
	var unidades = getNumeroUnidades(numero);
	var cubeta = $(cubetaIzquierda).find(".cubeta");
	construirDecenas(cubeta,unidades[0]);
	construirQuinquenas(cubeta,unidades[1]);
	construirUnidades(cubeta,unidades[2]);
}

var llenarCubetaDerecha = function(numero){
	var unidades = getNumeroUnidades(numero);
	var cubeta = $(cubetaDerecha).find(".cubeta");
	construirDecenas(cubeta,unidades[0]);
	construirQuinquenas(cubeta,unidades[1]);
	construirUnidades(cubeta,unidades[2]);
}

var construirDecenas = function(cubeta, decena){
	for (var i=0;i<decena;++i){
		var reglon = makeReglon();
		$(reglon).append(makeDecena());
		if ($(cubeta).find(".reglon").length == 0){
			$(cubeta).append(reglon);
		}
		else{
			$(cubeta).find(".reglon").filter(":first").before(reglon);
		}
	}
}

var construirQuinquenas = function(cubeta, quinquena){
	for (var i=0;i<quinquena;++i){
		var reglon = makeReglon();
		$(reglon).append(makeQuinquena());
		if ($(cubeta).find(".decena").length == 0){
			$(cubeta).append(reglon);
		}
		else{
			$(cubeta).find(".decena").filter(":first").parent().before(reglon);
		}
	}
}

var construirUnidades = function(cubeta, unidad){
	for (var i=0;i<unidad;++i){
		if ($(cubeta).find(".unidad").length > 0 || $(cubeta).find(".quinquena").length > 0){
			$(cubeta).find(".reglon").filter(":first").append(makeUnidad());
		}
		else{
			if ($(cubeta).find(".decena").length > 0){
				var reglon = makeReglon();
				$(reglon).append(makeUnidad());
				$(cubeta).find(".reglon").filter(":first").before(reglon);							
			}
			else{
				var reglon = makeReglon();
				$(reglon).append(makeUnidad());
				$(cubeta).append(reglon);			
			}
		}
	}
}
	
	
	
/*	
		if ($(cubeta).find(".decena").length == 0){
			var reglon = makeReglon();
			$(reglon).append(makeUnidad());
			$(cubeta).append(reglon);
		}
		else{
			if ($(cubeta).find(".quinquena").length > 0){
								
			}
				var reglon = makeReglon();
				$(reglon).append(makeUnidad());
				$(cubeta).find(".reglon").filter(":first").before(reglon);			
			}
			else{
			}
		}
	}
}
*/

var getNumeroUnidades = function(numero){
	var decena = 0;
	var quinquena = 0;
	var unidad = 0;
	decena = parseInt(numero/10,10);
	numero -= decena*10;
	quinquena = parseInt(numero/5,10);
	numero -= quinquena*5;
	unidad = numero
	numero -= numero;
	unidades = new Array();
	return [decena,quinquena,unidad];	
}

var mergeElementos = function(elementosIzquierda, elementosDerecha){
	var tamanioElementosIzquierda = elementosIzquierda.length - 1;
	var tamanioElementosDerecha = elementosDerecha.length - 1;
	var elementos = Array();
	var indice = 0
	for(var i=tamanioElementosIzquierda;i>=0;--i){
		elementos[indice++] = elementosIzquierda[i];		
	}
	for(var i=tamanioElementosDerecha;i>=0;--i){
		elementos[indice++] = elementosDerecha[i];		
	}	
	return elementos;
}

var getDecenas = function(contenedor){
	return $(contenedor).find(".cubeta").find(".decena");
}

var getQuinquenas = function(contenedor){
	return $(contenedor).find(".cubeta").find(".quinquena");
}

var getUnidades = function(contenedor){
	return $(contenedor).find(".cubeta").find(".unidad");
}


var disolverAparecerEnCadena = function(contenedor,
										elementos,
										indice,
										evento,
										hookAparecer){
	return function(){
		hookAparecer(contenedor,elementos[indice-1]);
		if (indice <= elementos.length - 1){
			$(elementos[indice]).fadeOut(1000,
										disolverAparecerEnCadena(contenedor,
																elementos,
																++indice,
																evento,
																hookAparecer));
		}
		else{
			$(".wrapper-cubeta-central .cubeta").trigger(evento);
		}
		
	}
}

var aparecerEnContenedor = function(contenedor, elemento){
	$(elemento).unbind();
	var reglon = makeReglon();
	$(reglon).append(elemento);	
	if ($(contenedor).find(".reglon").length == 0){
		$(contenedor).append(reglon);	
	}
	else {
		$(contenedor).find(".reglon").filter(":first").before(reglon);
	}
	$(elemento).fadeIn(1000,function(){})
}

var aparecerUnidadesEnContenedor = function(contenedor, elemento){
	/*
	 * 1) existen quinquena
	 * 2) no existe quinquena
	*/
	$(elemento).unbind();	
	var quinquenas = $(contenedor).find(".quinquena");
	if (quinquenas.length == 0){
		var unidades = $(contenedor).find(".unidad");
		if (unidades.length == 0){
			var reglon = makeReglon();
			$(reglon).append(elemento);
			$(contenedor).find(".reglon").filter(":first").before(reglon);
		}
		else{
			var reglon = $(unidades).filter(":first").parent();
			$(reglon).append(elemento);
		}
	}
	else{
		var reglon = $(quinquenas).filter(":first").parent();
		$(reglon).append(elemento);
	}
	$(elemento).fadeIn(1000,function(){})
}

var makeReglon = function(){
	return $('<div class="reglon">');
}

var makeDecena = function(base){
	if (base==true){
		return $('<div class="decena base">');		
	}
	return $('<div class="decena">');
}

var makeQuinquena = function(base){
	if (base==true){
		return $('<div class="quinquena base">');		
	}
	return $('<div class="quinquena">');
}

var makeUnidad = function(base,izquierda){
	if (izquierda==true){
		if (base==true){
			return $('<div class="unidad base izquierda">');
		}
		else{
			return $('<div class="unidad izquierda">');		
		}
	}
	else{
		if (base==true){
			return $('<div class="unidad base">');	
		}
		else{
			return $('<div class="unidad">');			
		}	
	}
}


var asignar_reglon_base = function(contenedor){
	console.log(contenedor);
	var ultimo_reglon = $(contenedor).children().filter(":last");
	console.log($(ultimo_reglon).children());
	$(ultimo_reglon).children().addClass("inferior");
}