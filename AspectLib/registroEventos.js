

//debiera usar pointcuts de API para poder
//implementar mi crosscuting concern

var registro = {
	usuario : {
		nombre : "",
		colegio : "",
		setNombre : function(nombre){
			this.nombre = nombre;
		},
		setColegio : function(colegio){
			this.colegio = colegio;
		},
	},
	eventos : [], //una coleccion de eventos
	setEvento : function(evento){
		this.eventos.push(evento);
	},
	getEventos : function(){
		return this.eventos;
	}
};

var eventos = {
	inicio : [1, "inicio ecocam"],
	respuestaCorrecta : [2, "respuesta correcta desde nube"],	
	respuestaIncorrecta : [3, "respuesta incorrecta desde nube"],	
	habilitacionAyudaIconica : [4, "ayuda iconica habilitada"],	
	vaciadoCorrecto : [5, "vaciado correcto cubetas"],	
	vaciadoIncorrecto : [6, "vaciado incorrecto cubetas"],	
	movimientoUnidad : [7, "movimiento de unidad"],	
	movimientoQuinquena : [8, "movimiento de quinquena"],	
	descomposicionQuinquena : [9, "descomposicion de quinquena"],	
	respuestaCorrectaAyudaIconica : [10, "respuesta correcta desde IU"],
	respuestaIncorrectaAyudaIconica : [11, "respuesta incorrecta desde IU"],
	getInicio : function(){return this.inicio[0];},
	getRespuestaCorrecta : function(){return this.respuestaCorrecta[0]},	
	getRespuestaIncorrecta : function(){return this.respuestaIncorrecta[0]},	
	getHabilitacionAyudaIconica : function(){return this.habilitacionAyudaIconica[0]},	
	getVaciadoCorrecto : function(){return this.vaciadoCorrecto[0]},	
	getVaciadoIncorrecto : function(){return this.vaciadoIncorrecto[0]},	
	getMovimientoUnidad : function(){return this.movimientoUnidad[0]},	
	getMovimientoQuinquena : function(){return this.movimientoQuinquena[0]},	
	getDescomposicionQuinquena : function(){return this.descomposicionQuinquena[0]},	
	getRespuestaCorrectaAyudaIconica : function(){return this.respuestaCorrectaAyudaIconica[0]},
	getRespuestaIncorrectaAyudaIconica : function(){return this.respuestaIncorrectaAyudaIconica[0]},
	
}


var makeEvento = function(indiceEvento, info){
	var evento = [indiceEvento];
	for(var i=0;i<info.length;i++){
		evento.push(info[i]);
	}
	return evento;
};

var accionInicio = function(env){
	var evento = eventos.getInicio()
	var info = [env.ecocam.ejercicioActual[0],
				env.ecocam.ejercicioActual[1],
				env.ecocam.getNumeroCubetaIzquierda(),
				env.ecocam.getNumeroCubetaDerecha(),
				Math.round(+new Date()/1000)];
	registro.setEvento(makeEvento(evento,info));
};

var accionRespuesta = function(env){
	if (env.valorRetorno){
		registro.setEvento(makeEvento(eventos.getRespuestaCorrecta(),env.argumentos.concat(Math.round(+new Date()/1000))));	
	}
	else{
		registro.setEvento(makeEvento(eventos.getRespuestaIncorrecta(),env.argumentos));		
	}
};

var accionHabilitacionAyudaGrafica = function(env){
	registro.setEvento(makeEvento(eventos.getHabilitacionAyudaIconica(),[]));
};

var accionVaciadoCubeta = function(env){
	var evento = env.valorRetorno ?  eventos.getVaciadoCorrecto() : eventos.getVaciadoIncorrecto();
	var ecocam = env.argumentos[0];
	var info = [ecocam.getNumeroCubetaIzquierda(),
				ecocam.getNumeroCubetaDerecha()];
	registro.setEvento(makeEvento(evento,info));
};

var accionMovimientoUnidad = function(env){
	var info = [$(env.cubetaOrigen).parent().attr("id"),
				$(env.cubetaDestino).parent().attr("id")];
	registro.setEvento(makeEvento(eventos.getMovimientoUnidad(),info));
}

var accionMovimientoQuinquena = function(env){
	var info = [$(env.cubetaOrigen).parent().attr("id"),
				$(env.cubetaDestino).parent().attr("id")];
	registro.setEvento(makeEvento(eventos.getMovimientoQuinquena(),info));
}

var accionDescomposicionQuinquena = function(env){
	var info = [$(env.reglon).parent().parent().attr("id")];
	registro.setEvento(makeEvento(eventos.getDescomposicionQuinquena(),info));
}

var accionRespuestaEjercicioDesdeInterfazAyuda = function(env){
	if (env.valorRetorno){
		registro.setEvento(makeEvento(eventos.getRespuestaCorrectaAyudaIconica(),env.argumentos.concat(Math.round(+new Date()/1000))));
	}
	else{
		registro.setEvento(makeEvento(eventos.getRespuestaIncorrectaAyudaIconica(),env.argumentos));
	}
}

reactTo(inicioEcocam,accionInicio).run();
reactTo(respuestaEjercicio,accionRespuesta).run();
reactTo(habilitacionInterfazAyuda,accionHabilitacionAyudaGrafica).run();
reactTo(vaciadoCubeta,accionVaciadoCubeta).run();
reactTo(movimientoUnidad,accionMovimientoUnidad).run();
reactTo(movimientoQuinquena,accionMovimientoQuinquena).run();
reactTo(descomposicionQuinquena,accionDescomposicionQuinquena).run();
reactTo(respuestaEjercicioDesdeInterfazAyuda,accionRespuestaEjercicioDesdeInterfazAyuda).run();


/*
 * sincronizacion con servidor 
 */

var adv = function(jp, env){
	registro.usuario.setNombre(ecocam.getNombreAlumno());
	registro.usuario.setColegio(ecocam.getColegioAlumno());
	$.ajax({
		url:"http://www.pleiad.cl/ecocam/reporte/index.php",
		cache:false,
		crossDomain:true,
		type:'POST',
		data:{'eventos':JSON.stringify(eventos),'registro': JSON.stringify(registro)},
		success:function(data_){
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
		}
	});
}

var seqn = function(pc, length){
	var state = 0;
	return function(jp,env){
		if (pc(jp,env)){
			if (state == length){
				state = 0;
				return true;
			}
			state++;
		}
		return false;
	}
}

AspectScript.before(seqn(inicioEcocam, 2),adv);
 