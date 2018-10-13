
/**
 * Module dependencies.
 */

var express = require('express');
var mysql = require('mysql');
var routes = require('routes');
// var user = require('routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//Conexión a Mongoose.
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/primer_base', function(error){
	//mongoose.connect('mongodb://USER:C1QLNPdT@104.154.20.64/base1', function(error){
	
   if(error){
      throw error; 
   }else{
      console.log('Conectado a MongoDB');
   }
});

//Documentos
var ClienteSchema = mongoose.Schema({
	nombre: String,
    apellido: String,
    domicilio: String,
    telefono: String,
    email: String
});
var Cliente = mongoose.model('Cliente', ClienteSchema);

app.get('/', function(req, res){
	res.sendfile('./public/index.html');
});

app.get('/data',function(req,res){
var mysql = require('mysql');
var connection = mysql.createConnection({
   host: '104.197.218.120',
   user: 'root',
   password: 'MUW51KLs',
   database: 'test',
   port: 3306
});
connection.connect(function(error){
   if(error){
      throw error;
   }else{
      console.log('Conexion correcta.');
   }
});
connection.end();
});

app.get('/consultas', function(req,res){
var mysql = require('mysql');
var connection = mysql.createConnection({host: '104.197.218.120',user: 'root',password: 'MUW51KLs',database: 'test',port: 3306});
//var connection = 'bQB5AHMAcQBsAC4AYwByAGUAYQB0AGUAQwBvAG4AbgBlAGMAdABpAG8AbgAoAHsAaABvAHMAdAA6ACAAJwAxADAANAAuADEAOQA3AC4AMgAxADgALgAxADIAMAAnACwAdQBzAGUAcgA6ACAAJwByAG8AbwB0ACcALABwAGEAcwBzAHcAbwByAGQAOgAgACcATQBVAFcANQAxAEsATABzACcALABkAGEAdABhAGIAYQBzAGUAOgAgACcAdABlAHMAdAAnACwAcABvAHIAdAA6ACAAMwAzADAANgB9ACkAOwA='
//des(connection);
connection.connect(function(error){
   if(error){
      throw error;
   }else{
      console.log('Conexion correcta.');
   }
});
// var query = connection.query('Select * from prueba', function(error, result){
//    if(error){
//       throw error;
//    }else{
//       console.log(result);
//    }
//  }
// );
// connection.end();
connection.query('SELECT * FROM usuarios' ,function (error, results, fields) {
  if (error) 
    throw error;
  console.log('Total de resultados' + results.length);
  console.log('Total de campos devueltos' + fields.length);
  for (var i = 0; i < results.length; i++) {
    console.log('ID: ', results[i].usuarioscol);
  }
});
connection.end();

});


app.get('/bc'),function(req,res){

console.log(req);

}


app.get('/listar', function(req, res){
	Cliente.find({}, function(error, clientes){
      	if(error){
      		res.send('Error.');
      	}else{
        	res.send(clientes);        	
      	}
   })
});

app.get('/recuperar', function(req, res){
	Cliente.findById(req.query._id, function(error, documento){
      	if(error){
         	res.send('Error.');
      	}else{
         	res.send(documento);
      	}
   });
});

app.post('/guardar', function(req, res){
	if(req.query._id == null){
		//Inserta
		var cliente = new Cliente({
		   nombre: req.query.nombre,
		   apellido: req.query.apellido,
		   domicilio: req.query.domicilio,
		   telefono: req.query.telefono,
		   email: req.query.email
		});
		cliente.save(function(error, documento){
			if(error){
			 	res.send('Error.');
			}else{
			 	res.send(documento);
			}
	   	});
	}else{
		//Modifica
		Cliente.findById(req.query._id, function(error, documento){
		  	if(error){
				res.send('Error.');
		  	}else{
				var cliente = documento;
				cliente.nombre = req.query.nombre,
			   	cliente.apellido = req.query.apellido,
			   	cliente.domicilio = req.query.domicilio,
			   	cliente.telefono = req.query.telefono,
			   	cliente.email = req.query.email
				cliente.save(function(error, documento){
			    	if(error){
			       		res.send('Error.');
			    	}else{ 
			       		res.send(documento);
			    	}
			 	});
			}
		});
	}
});

app.post('/eliminar', function(req, res){
	Cliente.remove({_id: req.query._id}, function(error){
		if(error){
			res.send('Error.');
		}else{
			res.send('Ok');
		}
   });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
