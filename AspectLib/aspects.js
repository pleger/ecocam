var Pointcuts = AspectScript.Pointcuts;

var reactTo = function(pointcut, reaction){
	var instance;
	var aspect = {
		pointcut : pointcut,
		advice : function(jp, env){
			reaction(env);
		},
		kind:AspectScript.AFTER
	};
	return {run : function(){instance = AspectScript.deploy(aspect);},
			stop : function(){AspectScript.undeploy(instance);}
			};
}

var aspectInicio = {
	pointcut : inicioEcocam,
	advice:function(jp){
		console.log(["ejercicio ha sido iniciado",
			jp.target.getNumeroCubetaIzquierda(),
			jp.target.getNumeroCubetaDerecha()]);
	},
	kind:AspectScript.AFTER
}

var aspectRespuestaEjercicio = {
	pointcut : respuestaEjercicio,
	advice : function(jp){
		var respuesta = jp.finalResult;
		var arguments = jp.args;
		if (respuesta){
			console.log(["respuesta correcta",arguments]);
		}
		else{
			console.log(["respuesta incorrecta",arguments]);		
		}
		return respuesta;
	},
	kind : AspectScript.AFTER
}

var aspectInterfazGraficaAyuda = {
	pointcut : habilitacionInterfazAyuda,
	advice : function(jp){
		if (jp.args[0]){
			console.log(["se ha habilitado la interfaz de ayuda para el usuario",
						jp.target]);
		}
	},
	kind : AspectScript.AFTER
}

var aspectVaciadoCubeta = {
	pointcut : vaciadoCubeta,
	advice : function(jp){
		var vaciable = jp.finalResult;
		if(vaciable){
			console.log(["vaciado correcto",jp.args]);
		}
		else{
			console.log(["vaciado incorrecto",jp.args]);		
		}
	},
	kind : AspectScript.AFTER
}

var aspectMovimientoUnidad =  {
	pointcut : movimientoUnidad,
	advice : function(jp){
		console.log(["movimiento unidad","desde",jp.args[2],"hasta",jp.args[1]]);
	},
	kind : AspectScript.AFTER
}

var aspectMovimientoQuinquena =  {
	pointcut : movimientoQuinquena,
	advice : function(jp){
		console.log(["movimiento quinquena","desde",jp.args[2],"hasta",jp.args[1]]);
	},
	kind : AspectScript.AFTER
}

var aspectDescomposicionQuinquena = {
	pointcut : descomposicionQuinquena,
	advice : function(jp){
		var reglon = jp.args[2];
		console.log(["descomposicion quinquena",$(reglon).parent()]);
	},
	kind : AspectScript.BEFORE
}

var aspectTriggerUnidadAdded = {
	pointcut : eventUnidadAdded,
	advice : function(jp){
		console.log(["unidadAdded",jp.args]);
	},
	kind : AspectScript.BEFORE
}

var aspectTriggerQuinquenaAdded = {
	pointcut : eventQuinquenaAdded,
	advice : function(jp){
		console.log(["quinquenaAdded",jp.args]);
	},
	kind : AspectScript.BEFORE
}

var aspectTriggerQuinquenaAccepted = {
	pointcut : eventQuinquenaComposed,
	advice : function(jp){
		console.log(["quinquenaComposed",jp.args]);
	},
	kind : AspectScript.BEFORE
}

var aspectRespuestaEjercicioInterfazGrafica = {
	pointcut : respuestaEjercicioDesdeInterfazAyuda,
	advice : function(jp){
		var respuesta = jp.finalResult;
		var arguments = jp.args;
		if (respuesta){
			console.log(["respuesta correcta desde IU",arguments]);
		}
		else{
			console.log(["respuesta incorrecta desde IU",arguments]);		
		}
		return respuesta;
	},
	kind : AspectScript.AFTER
}


/*
 * aspect's deployment
 */
 /*
AspectScript.deploy(aspectInicio);
AspectScript.deploy(aspectRespuestaEjercicio);
AspectScript.deploy(aspectInterfazGraficaAyuda);
AspectScript.deploy(aspectVaciadoCubeta);
AspectScript.deploy(aspectMovimientoUnidad);
AspectScript.deploy(aspectMovimientoQuinquena);
AspectScript.deploy(aspectDescomposicionQuinquena);
AspectScript.deploy(aspectTriggerUnidadAdded);
AspectScript.deploy(aspectTriggerQuinquenaAdded);
AspectScript.deploy(aspectTriggerQuinquenaAccepted);
AspectScript.deploy(aspectRespuestaEjercicioInterfazGrafica);
*/



