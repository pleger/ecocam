var LOGIN_REQUIRED = true;

var ecocam = {
	nombreAlumno : null,
	colegioAlumno : null,
	numeroCubetaIzquierda : -1,
	numeroCubetaDerecha : -1,
	ejercicios : [],
	ejercicioActual : null,
	ejerciciosPendientes : 0,
	operacion : "+",
	modoIconico : false,
	imgOperacionSuma : "lib/css/images/suma.png",
	imgOperacionResta : "lib/css/images/suma.png",
	imgOperacionVaciar : "lib/css/images/vaciar.png",		
	setNumeros : function(){
		this.ejercicioActual = this.ejercicios.shift();
		this.numeroCubetaIzquierda = this.ejercicioActual[2];
		this.numeroCubetaDerecha = this.ejercicioActual[3];
		this.ejerciciosPendientes = this.ejerciciosPendientes - 1;
	},
	getNumeroCubetaIzquierda : function(){
		return this.numeroCubetaIzquierda;
	},
	getNumeroCubetaDerecha : function(){
		return this.numeroCubetaDerecha;
	},
	setNumeroCubetas : function(izq,der){
		this.numeroCubetaIzquierda = izq;
		this.numeroCubetaDerecha = der;
	},
	addDecenaCubetaIzquierda : function(){
		this.numeroCubetaIzquierda += 10;
		this.numeroCubetaDerecha -= 10;
	},
	addDecenaCubetaDerecha : function(){
		this.numeroCubetaDerecha += 10;	
		this.numeroCubetaIzquierda -= 10;			
	},		
	addQuinquenaCubetaIzquierda : function(){
		this.numeroCubetaIzquierda += 5;
		this.numeroCubetaDerecha -= 5;
	},
	addQuinquenaCubetaDerecha : function(){
		this.numeroCubetaDerecha += 5;	
		this.numeroCubetaIzquierda -= 5;			
	},
	addUnidadCubetaIzquierda : function(){
		this.numeroCubetaIzquierda += 1;
		this.numeroCubetaDerecha -= 1;
	},
	addUnidadCubetaDerecha : function(){
		this.numeroCubetaDerecha += 1;	
		this.numeroCubetaIzquierda -= 1;			
	},		
	setOperacion : function(op){
		this.operacion = op;
	},
	setModoIconico : function(op){
		this.modoIconico = op;
	},
	setNombreAlumno : function(nombre){
		this.nombreAlumno = nombre;
	},
	setColegioAlumno : function(colegio){
		this.colegioAlumno = colegio;
	},
	getModoIconico : function(){
		return this.modoIconico;
	},
	getPathOperacion : function(op){
		switch(op){
			case 'suma': 
				return this.imgOperacionSuma;
			case 'resta':
				return this.imgOperacionResta;
			case 'vaciar':
				return this.imgOperacionVaciar;
		}
	},
	getNombreAlumno : function(){
		return this.nombreAlumno;
	},
	getColegioAlumno : function(){
		return this.colegioAlumno;
	},
	cargarEjercicios : function(){
		$.ajax({
			url:"http://www.pleiad.cl/ecocam/ejercicios/ejercicio.csv",
			cache:false,
			type:'GET',
			async:false,
			crossDomain:true,
			success:function(data_){
				var lineas = data_.split("\n");
				$.each(lineas,function(index,data){
					var ejercicio = [];			
					$.each(data.split(","),function(index,data){
						ejercicio.push(parseInt(data,10));
					});
					ecocam.ejercicios.push(ejercicio);
				});
				ecocam.ejerciciosPendientes = ecocam.ejercicios.length;
			},
			error:function(XMLHttpRequest, textStatus, errorThrown){
			}
		});
	},
	verificarEjerciciosPendientes : function(){
		return ecocam.ejerciciosPendientes <= 0 ? false : true; 
	},
	run : function(){
		this.setNumeros();
		this.setOperacion(obtenerOperacion());
		this.setNumeroCubetas(this.getNumeroCubetaIzquierda(),this.getNumeroCubetaDerecha());
	}
};


$(document).ready(function(){
	//dynamic title
	var date = new Date();
	document.title = ".:: Ecocam "+date.getFullYear()+ " ::.";
	$(".wrapper-cubeta-central").hide();
	$("#representacion-iconica").hide();
	$("#wrapper-simbolo-intermedio .operacion").hide();
	
	/**
	* Formato
	*/
	$('#caja-respuesta-nube').numeric();
	$('.caja-respuesta-representacion-iconica').numeric();
	$('#caja-respuesta-nube').keypress(function(event){
		if (event.which == 13){
			var respuesta = clickBotonSiguiente(ecocam);
			if (respuesta != true){
				$(this).attr("disabled","disabled");		
			}
			return false;
		}
	})
	$('.caja-respuesta-representacion-iconica').keypress(function(event){
		if (event.which == 13){
			clickBotonSiguiente(ecocam);
			return false;
		}
	});
	/**
	* Bind de widgets con eventos
	*/
	$('#vaciar').bind('click',vaciarFunction);
	$(".wrapper-cubeta-central .cubeta").bind("start-add-elements",function(){
		var decenas = mergeElementos(getDecenas($("#cubeta-izquierda")),getDecenas($("#cubeta-derecha")));												
		var widgetDestino = $(".wrapper-cubeta-central .cubeta");
		if (decenas.length == 0){
			$(".wrapper-cubeta-central .cubeta").trigger("add-decenas-finished");
		}
		else {
			ejecutarDisolverAparecer(decenas,
									widgetDestino,
									"add-decenas-finished",
									aparecerEnContenedor,
									0);
			$(".wrapper-cubeta-central").fadeIn(2000,function(){});
		}
	});	
	$(".wrapper-cubeta-central .cubeta").bind("add-decenas-finished",function(){
		var quinquenas = mergeElementos(getQuinquenas($("#cubeta-izquierda")),getQuinquenas($("#cubeta-derecha")));
		var widgetDestino = $(".wrapper-cubeta-central .cubeta");
		if (quinquenas.length == 0){
			$(".wrapper-cubeta-central .cubeta").trigger("add-quinquenas-finished");			
		}
		else {
			ejecutarDisolverAparecer(quinquenas,
									widgetDestino,
									"add-quinquenas-finished",
									aparecerEnContenedor,
									0);		
		}
	});
	$(".wrapper-cubeta-central .cubeta").bind("add-quinquenas-finished",function(){
		var unidades = mergeElementos(getUnidades($("#cubeta-izquierda")),getUnidades($("#cubeta-derecha")));
		var widgetDestino = $(".wrapper-cubeta-central .cubeta");
		if (unidades.length == 0){
			$(".wrapper-cubeta-central .cubeta").trigger("add-unidades-finished");		
		}
		else {
			ejecutarDisolverAparecer(unidades,
									widgetDestino,
									"add-unidades-finished",
									aparecerUnidadesEnContenedor,
									0);		
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
	setFocus($("textarea:visible"));
	/**
	* drag and drop
	*/
	$("#wrapper-cubetas").bind("quinquenaAdded",function(event, cubeta, reglon){
		var quinquenas = $(reglon).find(".quinquena"); 
		if ($(quinquenas).length == 2){
			var reglonNuevo = makeReglon();
			$(reglonNuevo).append(makeDecena(ecocam));
			$(reglon).before(reglonNuevo);
			$(reglon).remove();
		}
	});
	$("#wrapper-cubetas").bind("quinquenaComposed",function(event, cubeta, reglon){
		$("#vaciar").unbind();
		$("#vaciar").bind('click',function(){return false;});
		setTimeout(function(){
			var quinquenas = $(reglon).find(".quinquena"); 
			if ($(quinquenas).length == 2){
				var reglonNuevo = makeReglon();
				$(reglonNuevo).append(makeDecena(ecocam));
				$(reglon).before(reglonNuevo);
				$(reglon).remove();
			}
			$("#vaciar").unbind();
			$("#vaciar").bind('click',vaciarFunction);
		},1000);
	});
	$("#wrapper-cubetas").bind("unidadAdded",function(event, cubeta, reglon){
		var unidades = $(reglon).find(".unidad"); 
		if ($(unidades).length == 10){
			$(reglon).find(".unidad").remove();
			$(reglon).append(makeQuinquena(ecocam));
			$("#wrapper-cubetas").trigger("quinquenaComposed",[cubeta,reglon]);		
			$(reglon).append(makeQuinquena(ecocam));
			$("#wrapper-cubetas").trigger("quinquenaComposed",[cubeta,reglon]);					
		}		
		else {
			if ($(unidades).length >= 5){
				if ($(reglon).find(".quinquena").length > 0){
					$(reglon).find(".unidad").remove();
					$(reglon).append(makeQuinquena(ecocam));
					$("#wrapper-cubetas").trigger("quinquenaComposed",[cubeta,reglon]);				
				}
				else{
					$(reglon).find(".unidad").remove();
					$(reglon).append(makeQuinquena(ecocam));
					for (var i=5;i<$(unidades).length;++i){
						$(reglon).append(makeUnidad());
					}
					$("#wrapper-cubetas").trigger("quinquenaComposed",[cubeta,reglon]);
				}
			}
		}
	});
	$("#wrapper-cubetas").bind("quinquenaAccepted",function(event, ecocam, cubeta, addQuinquenaCubeta, elementoVisitante){
		var cubetaElementoVisitante = $(elementoVisitante).parents(".cubeta");	
		addQuinquenaCubeta(ecocam,cubeta,cubetaElementoVisitante);		
		var reglonDefinitivo;
		var reglonTop = $(cubeta).find(".reglon").filter(":first");
		var numeroUnidades = $(reglonTop).find(".unidad").length;
		if (numeroUnidades > 0){
			var reglon = makeReglon();
			$(reglon).append(makeQuinquena(ecocam));
			for(var i=0;i<numeroUnidades;++i){
				$(reglon).append(makeUnidad());
			}
			$(reglonTop).before(reglon);
			$(reglonTop).remove();
			reglonDefinitivo = reglon;
		}
		else{
			if ($(reglonTop).find(".quinquena").length > 0){
				$(reglonTop).append(makeQuinquena(ecocam));
				reglonDefinitivo = reglonTop;
			}
			else{
				var reglon = makeReglon();
				$(reglon).append(makeQuinquena(ecocam));
				$(reglonTop).before(reglon);
				reglonDefinitivo = reglonTop;
			}
		}
		$(elementoVisitante).remove();
		$("#wrapper-cubetas").trigger("quinquenaAdded",[cubeta,reglonDefinitivo]);	
	});
	$(".wrapper-cubeta-derecha").droppable({
		drop: dropFunction(ecocam,
						addDecenaCubetaDerecha,
						addQuinquenaCubetaDerecha,
						addUnidadCubetaDerecha)
	});
	$(".wrapper-cubeta-izquierda").droppable({
		drop: dropFunction(ecocam,
						addDecenaCubetaIzquierda,
						addQuinquenaCubetaIzquierda,
						addUnidadCubetaIzquierda)
	});
	if (LOGIN_REQUIRED==true){
		$('#gui').hide();
		loginDialog.dialog('open');		
	}
	else{
		ecocam.cargarEjercicios();
		if (ecocam.verificarEjerciciosPendientes()){
			ecocam.run();
			inicializarIU(ecocam);				
		}
		else{
			finSesionIU(ecocam);
		}
	}
	$.blockUI.defaults.applyPlatformOpacityRules = false;
});

var inicializarIU = function(ecocam){
	setNumeroNube($("#numero-izquierdo"),ecocam.getNumeroCubetaIzquierda());
	setNumeroNube($("#numero-derecho"),ecocam.getNumeroCubetaDerecha());	
	setNumeroCubeta($("#cubeta-izquierda"),ecocam.getNumeroCubetaIzquierda());
	setNumeroCubeta($("#cubeta-derecha"),ecocam.getNumeroCubetaDerecha());
	$('.quinquena').live('click',function(){
		var quinquena = $(this);
		descomponerQuinquena(ecocam,quinquena,$(quinquena).parent());
	});	
	$("#caja-respuesta-nube").removeClass("deshabilitado");	
	$("#caja-respuesta-nube").removeAttr("disabled");	
	$("#caja-respuesta-nube").val("");
	$("#caja-respuesta-nube").focus();
}

var reiniciarIU = function(ecocam){
	$("#representacion-iconica").hide();
	$(".cubeta .reglon").remove();
	$(".caja-respuesta-representacion-iconica").val('');
	$("#caja-respuesta-nube").removeClass("deshabilitado");	
	
	$('.wrapper-cubeta-izquierda .equivalencia').show();
	$('.wrapper-cubeta-izquierda .cubeta').show();
	$('.wrapper-cubeta-izquierda').removeClass("centrar");
	
	$('.wrapper-cubeta-derecha').removeClass("centrar");	
	$('.wrapper-cubeta-derecha .equivalencia').show();
	$('.wrapper-cubeta-derecha .cubeta').show();
	
	$('.wrapper-cubeta-central').hide();
	$('#vaciar img').attr("src",ecocam.getPathOperacion("vaciar"));
	$("#vaciar").bind('click',vaciarFunction);
}

var finSesionIU = function(ecocam){
	$.blockUI({
		message: "<h1><strong>Fin de ejercicios</strong></h1>",
		css: {
			border: 'none',
			padding: '15px', 	        
			backgroundColor: '#000',
			'-webkit-border-radius': '10px', 	        
			'-moz-border-radius': '10px', 	        
			opacity: .5, 	        
			color: '#fff',	    
		},	   
		overlayCSS: {
			backgroundColor: '#00BB00', 	        
			opacity: .5 	    
		},				
	}); 
	$("#gui").hide();
}

var vaciarFunction = function(){
	if (esVaciable(ecocam)){
		$(".wrapper-cubeta-central .cubeta").trigger("start-add-elements");
		$('#vaciar img').attr("src",ecocam.getPathOperacion('suma'));
		$("#vaciar").unbind();
		$("#vaciar").bind("click",function(){return false;});
		$('.quinquena').die();
	}
	else{
		$(".caja-respuesta-representacion-iconica").effect("highlight", {'color':'red'}, 3000);
	}
	return false;
}

//Esta funcion debiera ser refactorizada para que funcione con el evento
//unidadAccepted.
var dropFunction = function(ecocam,addDecenaCubeta,addQuinquenaCubeta,addUnidadCubeta){
	return function(event, ui) {
			var elementoVisitante = ui.draggable;
			var cubetaElementoVisitante = $(elementoVisitante).parents(".cubeta");
			var claseElemento = getClaseElemento($(elementoVisitante));
			var cubeta = $(this).find(".cubeta");
			var reglonTop = $(cubeta).find(".reglon").filter(":first");
			switch(claseElemento){
				case 'unidad':
					addUnidadCubeta(ecocam,cubeta,cubetaElementoVisitante);
					if ($(reglonTop).find(".decena").length > 0){
						var reglon = makeReglon();
						$(reglon).append(makeUnidad());
						$(reglonTop).before(reglon);
					}
					else{
						if($(reglonTop).find(".unidad").length > 0){
							$(reglonTop).append(makeUnidad());
						}
						else{
							//supongo que solo hay una quinquena
							$(reglonTop).append(makeUnidad());									
						}
					}
					$(elementoVisitante).remove();
					$("#wrapper-cubetas").trigger("unidadAdded",[cubeta,reglonTop]);
					break;
				case 'decena':
					/*
					addDecenaCubeta(ecocam,cubeta,cubetaElementoVisitante);
					$(reglonTop).before($(makeReglon()).append(makeDecena()));
					$(elementoVisitante).remove();					
					*/
					break;
				}
			}
}

var clickBotonSiguiente = function(ecocam){
	if (ecocam.getModoIconico() == false){
		//caso en que solo esta la nube
		var respuesta = parseInt($("#caja-respuesta-nube").val(),10);			
		if (sumaCorrecta(respuesta,ecocam.getNumeroCubetaIzquierda(),ecocam.getNumeroCubetaDerecha())){
			//pasar a siguiente ejercicio
			if (ecocam.verificarEjerciciosPendientes()){
				ecocam.run();
				inicializarIU(ecocam);
				return true;			
			}
			else{
				finSesionIU(ecocam);			
			}
		}
		else{
			//se muestra ayuda iconica
			$("#caja-respuesta-nube").val('');
			ecocam.setModoIconico(true);
			llenarCubeta(ecocam,$("#cubeta-izquierda"),ecocam.getNumeroCubetaIzquierda());
			llenarCubeta(ecocam,$("#cubeta-derecha"),ecocam.getNumeroCubetaDerecha());
			$("#representacion-iconica").show();
			$("#caja-respuesta-nube").addClass("deshabilitado");				
		}
	}
	else{
		//usuario responde desde seccion iconica
		var respuesta = parseInt($("#cubeta-central .caja-respuesta-representacion-iconica").val(),10);		
		if (sumaCorrectaInterfazGrafica(respuesta,ecocam.getNumeroCubetaIzquierda(),ecocam.getNumeroCubetaDerecha())){
			//reiniciar interfaz grafica!
			$("#caja-respuesta-nube").val(respuesta);
			$("#caja-respuesta-nube").removeClass("deshabilitado");
			$('#caja-respuesta-nube').removeAttr("disabled");			
			$("#caja-respuesta-nube").effect("highlight",1000,function(){
				reiniciarIU(ecocam);			
				if (ecocam.verificarEjerciciosPendientes()){
					ecocam.run();
					inicializarIU(ecocam);				
					ecocam.setModoIconico(false);						
				}
				else{
					finSesionIU(ecocam);
				}					
			});				
			$("#representacion-iconica").fadeOut(1000,function(){
			});
			return true;			
		}
		else{
			$("#cubeta-central .caja-respuesta-representacion-iconica").effect("highlight", {'color':'red'}, 5000);
			$("#cubeta-central .caja-respuesta-representacion-iconica").focus();				
		}
	}

}
