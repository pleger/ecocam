
var setNumeroNube = function(widget, numero){
	$(widget).html(numero);
};

var setNumeroCubeta = function(widget, numero){
	$(widget).find(".caja-respuesta-representacion-iconica").val(numero);
}

var descomponerQuinquena = function(ecocam, widget, reglon){
	var unidades = new Array();
	unidades[0] = makeUnidad(ecocam,false,true);
	for(var i=1;i<5;++i){
		unidades[i] = makeUnidad(ecocam);
	}
	hijos = $(reglon).children();
	cantidadHijos = $(hijos).length - 1;
	$(widget).remove();	
	$(hijos).remove();
	$(reglon).empty();
	for(var i=0;i<5;++i){
		$(reglon).append(unidades[i]);
	}
	for(var i=0;i<cantidadHijos;++i){
		$(reglon).append(makeUnidad(ecocam));
	}	
};

var setFocus = function(widget){
	var textarea = $("textarea:visible").filter(function(){
		if ($(this).hasClass("deshabilitado") == false){
			if ($(this).attr("readonly") != true){
				return this;
			}
		}
	});
	$(textarea).filter(":last").focus();
}

var ejecutarDisolverAparecer = function(elementos, widgetDestino, evento, hook, indice){
	$(elementos[indice]).addClass("dashed-line");
	setTimeout(function(){$(elementos[indice]).fadeOut(
								1000,
								disolverAparecerEnCadena(widgetDestino,
														elementos,
														++indice,
														evento,
														hook))},1000);
		
}

/**
* cubetas
*/
var llenarCubeta = function(ecocam, widget, numero){
	var unidades = getNumeroUnidades(numero);
	var cubeta = $(widget).find(".cubeta");
	construirDecenas(ecocam,cubeta,unidades[0]);
	construirQuinquenas(ecocam,cubeta,unidades[1]);
	construirUnidades(ecocam,cubeta,unidades[2]);
}

/**
* cubeta resultado central
*/

var construirDecenas = function(ecocam, cubeta, decena){
	for (var i=0;i<decena;++i){
		var reglon = makeReglon();
		$(reglon).append(makeDecena(ecocam));
		if ($(cubeta).find(".reglon").length == 0){
			$(cubeta).append(reglon);
		}
		else{
			$(cubeta).find(".reglon").filter(":first").before(reglon);
		}
	}
}

var construirQuinquenas = function(ecocam, cubeta, quinquena){
	for (var i=0;i<quinquena;++i){
		var reglon = makeReglon();
		$(reglon).append(makeQuinquena(ecocam));
		if ($(cubeta).find(".decena").length == 0){
			$(cubeta).append(reglon);
		}
		else{
			$(cubeta).find(".decena").filter(":first").parent().before(reglon);
		}
	}
}

var construirUnidades = function(ecocam, cubeta, unidad){
	for (var i=0;i<unidad;++i){
		if ($(cubeta).find(".unidad").length > 0 || $(cubeta).find(".quinquena").length > 0){
			$(cubeta).find(".reglon").filter(":first").append(makeUnidad(ecocam));
		}
		else{
			if ($(cubeta).find(".decena").length > 0){
				var reglon = makeReglon();
				$(reglon).append(makeUnidad(ecocam));
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

/**
* constructores
*/

var makeReglon = function(){
	return $('<div class="reglon">');
}

var makeDecena = function(objeto, base){
	return base ? $('<div class="decena base">').draggable({revert:movimientoValidoDecena(objeto)}):$('<div class="decena">').draggable({revert:movimientoValidoDecena(objeto)});
}

var makeQuinquena = function(objeto, base){
	return base ? $('<div class="quinquena base">').draggable({revert:movimientoValidoQuinquena(objeto)}):$('<div class="quinquena">').draggable({revert:movimientoValidoQuinquena(objeto)});
}

var makeUnidad = function(base, izquierda){
	if (izquierda==true){
		return base ? $('<div class="unidad base izquierda">').draggable({revert:true}):$('<div class="unidad izquierda">').draggable({revert:true});
	}
	else{
		return base ? $('<div class="unidad base">').draggable({revert:true}):$('<div class="unidad">').draggable({revert:true});	
	}
}


/**
* transiciones hacia cubeta central de resultado
*/

var disolverAparecerEnCadena = function(contenedor,
										elementos,
										indice,
										evento,
										hookAparecer){
	return function(){
		hookAparecer(contenedor,elementos[indice-1]);
		if (indice <= elementos.length - 1){
			$(elementos[indice]).addClass("dashed-line");
			setTimeout(function(){},350);		
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
	$(elemento).removeClass("dashed-line");
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
	$(elemento).removeClass("dashed-line");	
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


/**
* accesores de elementos
*/

var getDecenas = function(contenedor){
	return $(contenedor).find(".cubeta").find(".decena");
}

var getQuinquenas = function(contenedor){
	return $(contenedor).find(".cubeta").find(".quinquena");
}

var getUnidades = function(contenedor){
	return $(contenedor).find(".cubeta").find(".unidad");
}

/**
* utils
**/

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

/**
* actualizar numeros de cubetas izquierda y derecha
*/

var setNumeroCubetas = function(izquierdo, derecho){
	setNumeroCubeta($("#cubeta-izquierda"),izquierdo);	
	setNumeroCubeta($("#cubeta-derecha"),derecho);	
}

var addDecenaCubetaDerecha = function(objeto,cubeta,cubetaElementoVisitante){
	if ($(cubeta).get(0) == $(cubetaElementoVisitante).get(0)){
		return;
	}
	objeto.addDecenaCubetaDerecha();
	setNumeroCubetas(objeto.getNumeroCubetaIzquierda(),objeto.getNumeroCubetaDerecha());
}

var addDecenaCubetaIzquierda = function(objeto,cubeta,cubetaElementoVisitante){
	console.log("pase")
	if ($(cubeta).get(0) == $(cubetaElementoVisitante).get(0)){
		return;
	}
	console.log("pase")	
	objeto.addDecenaCubetaIzquierda();
	setNumeroCubetas(objeto.getNumeroCubetaIzquierda(),objeto.getNumeroCubetaDerecha());
}

var addQuinquenaCubetaDerecha = function(objeto,cubeta,cubetaElementoVisitante){
	if ($(cubeta).get(0) == $(cubetaElementoVisitante).get(0)){
		return;
	}
	objeto.addQuinquenaCubetaDerecha();
	setNumeroCubetas(objeto.getNumeroCubetaIzquierda(),objeto.getNumeroCubetaDerecha());
}

var addQuinquenaCubetaIzquierda = function(objeto,cubeta,cubetaElementoVisitante){
	if ($(cubeta).get(0) == $(cubetaElementoVisitante).get(0)){
		return;
	}
	objeto.addQuinquenaCubetaIzquierda();
	setNumeroCubetas(objeto.getNumeroCubetaIzquierda(),objeto.getNumeroCubetaDerecha());
}

var addUnidadCubetaDerecha = function(objeto,cubeta,cubetaElementoVisitante){
	if ($(cubeta).get(0) == $(cubetaElementoVisitante).get(0)){
		return;
	}
	objeto.addUnidadCubetaDerecha();
	setNumeroCubetas(objeto.getNumeroCubetaIzquierda(),objeto.getNumeroCubetaDerecha());
}

var addUnidadCubetaIzquierda = function(objeto,cubeta,cubetaElementoVisitante){
	if ($(cubeta).get(0) == $(cubetaElementoVisitante).get(0)){
		return;
	}
	objeto.addUnidadCubetaIzquierda();
	setNumeroCubetas(objeto.getNumeroCubetaIzquierda(),objeto.getNumeroCubetaDerecha());
}