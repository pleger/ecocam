var Pointcuts = AspectScript.Pointcuts;

/*
 * pc : inicioEcocam
 * Introduce el objeto ecocam al ambiente para que
 * la funcion del usuario pueda utilizarlo.
 */
var inicioEcocam = function(jp, env){
	return (jp.isExec() && jp.fun == ecocam.run) ? env.bind("ecocam",jp.target) : false;
};

var respuestaEjercicio = function(){
	var myCFlow = Pointcuts.cflow(Pointcuts.exec(clickBotonSiguiente));
	return function(jp, env){
		if(jp.isCall() && jp.fun == sumaCorrecta && myCFlow(jp)){
			env = env.bind("argumentos",jp.args);			
			return env.bind("valorRetorno",jp.finalResult);
		}
		return false;
	}
}();

var habilitacionInterfazAyuda = function(){
	var myCFlow = Pointcuts.cflow(Pointcuts.exec(clickBotonSiguiente));
	return function(jp, env){
		if(jp.isCall() && jp.fun == ecocam.setModoIconico && jp.args[0] == true && myCFlow(jp)){
			return env.bind("ecocam",jp.target);			
		}
		return false;
	}
}();

var vaciadoCubeta = function(jp, env){
	if(jp.isCall() && jp.fun == esVaciable){
		return env.bind("ecocam",jp.target)
			.bind("argumentos",jp.args)
			.bind("valorRetorno",jp.finalResult);		
	}
	return false;
};

var movimientoUnidad = function(jp, env){
	if (jp.isCall() && (jp.fun == addUnidadCubetaDerecha || jp.fun == addUnidadCubetaIzquierda)){
		return env.bind("ecocam",jp.target)
			   .bind("cubetaOrigen",jp.args[2])
			   .bind("cubetaDestino",jp.args[1]);				
	}
	return false;
};

var movimientoQuinquena = function(jp, env){
	if (jp.isCall() && (jp.fun == addQuinquenaCubetaDerecha || jp.fun == addQuinquenaCubetaIzquierda)){
		return env.bind("ecocam",jp.target)
			.bind("cubetaOrigen",jp.args[2])		
			.bind("cubetaDestino",jp.args[1]);				
	}
	return false;
};

var descomposicionQuinquena = function(jp, env){
	if (jp.isCall() && jp.fun == descomponerQuinquena){
		return env.bind("ecocam",jp.args[0])
			   .bind("reglon",jp.args[2]);		
	}
	return false;
};

var makePointcutTrigger = function(kind){
	return function(jp, env){
		return jp.isExec() 
		&& jp.fun == trigger
		&& jp.args[0] == kind;		
	}
};

var eventUnidadAdded = makePointcutTrigger("unidadAdded");
var eventQuinquenaAdded = makePointcutTrigger("quinquenaAdded");
var eventQuinquenaComposed = makePointcutTrigger("quinquenaComposed");

var respuestaEjercicioDesdeInterfazAyuda = function(){
	var myCFlow = Pointcuts.cflow(Pointcuts.exec(clickBotonSiguiente));
	return function(jp, env){
		if(jp.isCall() && jp.fun == sumaCorrectaInterfazGrafica && myCFlow(jp)){
			return env.bind("ecocam",jp.target)
				.bind("argumentos",jp.args)
				.bind("valorRetorno",jp.finalResult);					
		}
		return false;
	}
}();

//dirty hack to capture trigger method execution.
//var JQTrigger = jQuery.event.trigger 
//var trigger = function (event, data, elem) {
//	JQTrigger.call(jQuery.event,event,data,elem);
//};
   
//$(document).ready(function(){
//	jQuery.event.trigger = trigger;
//})