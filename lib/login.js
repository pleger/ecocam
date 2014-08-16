var loginDialog;
$(document).ready(function(){
	loginDialog = $('#login').dialog({
		modal:true,
		resizable:false,
		autoOpen:false,
		width:400,
		title:"Registro usuario",
		draggable:false,
		closeText:'hide',
		close:function(){
			$("#gui").show();
			ecocam.cargarEjercicios();
			if(ecocam.verificarEjerciciosPendientes){
				ecocam.run();
				inicializarIU(ecocam);					
			}
			else{
				finSesionIU(ecocam);
			}
		},
		open:function(event,ui){
			$('#user-text').val('');
			$('#user-text').focus();
		}
	});
	
	$('#user-text').keypress(function(e){
		if(e.keyCode == 13){
			if(validarLogin($(this).val())==false){
				return false;
			}
			$('#registrar-login').click();
		}
	});
	
	$('#registrar-login').click(function(){
		if(validarLogin($("#user-text").val())==false){
			return false;
		}
		ecocam.setNombreAlumno($("#user-text").val());	
		ecocam.setColegioAlumno($("#colegio-login").val());
		if(loginDialog.dialog('isOpen')){
			loginDialog.dialog('close');
		}
	});
	$.ajax({
		url:"http://www.pleiad.cl/ecocam/reporte/servicios.php",
		cache:false,
		type:'GET',
		dataType : 'json',
		data:{'servicio':1},
		success:function(data_){
			$.each(data_,function(index, data){
				$("#colegio-login").append('<option value='+data+'>'+data+'</option>');
			});
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
		}
	});
});

var validarLogin = function(user){
	if (user == ''){
		return false;
	}
	return true;
}