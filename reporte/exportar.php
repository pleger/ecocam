<html>
  <head>
    <script src="../lib/jquery/jquery-1.6.2.min.js"></script>
    <script>
      $(document).ready(function(){
        $.ajax({
          url:"http://www.pleiad.cl/ecocam/reporte/servicios.php",
            cache:false,
            type:'GET',
            dataType : 'json',
            data:{'servicio':1},
            success:function(data_){
              $.each(data_,function(index, data){
                $("#colegios").append('<option value='+data+'>'+data+'</option>');
              });
            },
              error:function(XMLHttpRequest, textStatus, errorThrown){
              }
        });

        $('#colegios').change(function(event){
          if($(this).val() != ""){
            $.ajax({
              url:"http://www.pleiad.cl/ecocam/reporte/servicios.php",
                cache:false,
                type:'GET',
                dataType : 'json',
                data:{'servicio':2,'colegio':$(this).val()},
                success:function(data_){
                  $("#eventos-colegio table tbody tr").remove();
                  $.each(data_,function(index, data){
                    var tupla = $('<tr>');
                    $(tupla).append($('<td>').append(index+1));
                    $(tupla).append($('<td>').append(data[0]));
                    var link = $('<a>');
                    $(link).attr("href",data[1]+"/"+data[0]);
                    $(link).html(data[0]);
                    $(tupla).append($('<td>').append(link));
                    $("#eventos-colegio table tbody").append(tupla);

                  });
                },
                  error:function(XMLHttpRequest, textStatus, errorThrown){
                  }
            });
          }
        });

        $("#exportar").click(function(){
          $.ajax({
            url:"http://www.pleiad.cl/ecocam/reporte/servicios.php",
              cache:false,
              type:'GET',
              dataType : 'json',
              data:{'servicio':3,'colegio':$("#colegios").val()},
              success:function(data_){
                var link = $('<a>');
                $(link).attr("href",data_);
                $(link).html("resultado");
                $("#resultado-exportacion").append($(link));
              },
                error:function(XMLHttpRequest, textStatus, errorThrown){
                }
          });
        });
      });
    </script>
  </head>
  <body>
    <div>
      Seleccione colegio : <select id="colegios"><option value="">---</option></select>
    </div>
    <div id="eventos-colegio">
      <table>
        <thead>
          <tr>
            <th>N&uacute;mero</th>
            <th>Alumno</th>
            <th>Eventos</th>
          </tr>
        </thead>
        <tbody>

        </tbody>
      </table>
      <input type="button" id="exportar" value="exportar" />
    </div>
    <div id="resultado-exportacion">
    </div>
  </body>
</html>
