'use strict'


var validator = require('validator');
var fs = require('fs');
var path = require('path');


var Article = require('../models/article')


var controller = {
	datosCurso: (req, res) => {
		var hola = req.body.hola;

		return res.status(200).send({
			curso: 'Master en Frameworks JS',
			author: 'prueba'
		});
	},
	test: (req, res) => {
		return res.status(200).send({
			message: 'soy la accion test de articulos controller'
		});
	},
	save: (req, res) => {
		//recoger parametros
		var params = req.body;
		console.log(params);

		//validar datos
		/*se meten dentro de un try para que no causen excepciones*/

		try {
			var validate_title = !validator.isEmpty(params.title);
			var validate_content = !validator.isEmpty(params.content);
		} catch (err) {
			return res.status(200).send({
				status: 'error',
				message: 'Faltan datos por enviar'
			});
		}
		if (validate_title && validate_content) {
			//crear el objeto a guardar
			var article = new Article();


			//asignar valores
			article.title = params.title;
			article.content = params.content;
			article.image = null;


			//guardar el articulo

			article.save((err, articleStored) => {
				if (err || !articleStored) {
					return res.status(404).send({
						status: 'error',
						message: 'El articulo no se ha guardado!'
					});
				}

				//devolver una respuesta
				return res.status(200).send({
					status: 'success',
					article: articleStored
				});
			});

		} else {
			return res.status(200).send({
				status: 'error',
				message: 'Los datos no son validos'
			});
		}

		/*return res.status(200).send({
			message: 'soy el save'
			article: params
		});*/
	},
	getArticles: (req, res) => {

		var query = Article.find({});

		var last = req.params.last;

		if (last || last != undefined) {

			query.limit(5);
		}


		//find
		query.sort('-_id').exec((err, articles) => {
			if (err) {
				return res.status(500).send({
					status: 'error',
					message: 'Error al devolver los articulos'
				});
			}
			if (!articles) {
				return res.status(404).send({
					status: 'error',
					message: 'No hay articulos para devolver'
				});
			}
			return res.status(200).send({
				status: 'success',
				articles
			});

		});
	},
	getArticle: (req, res) => {
		//recoger el id de la url
		var articleid = req.params.id;

		//comprobar que existe
		if (!articleid || articleid == null) {
			return res.status(404).send({
				status: 'error',
				message: 'el articulo no existe'
			});
		}

		//buscar el articulo
		Article.findById(articleid, (err, article) => {

			if (err || !article) {
				return res.status(404).send({
					status: 'error',
					message: 'No existe el articulo'
				});
			}

			//devolver el json
			return res.status(200).send({
				status: 'success',
				article
			});

		});
	},
	update: (req, res) => {


		//recoger el id del articulo por url
		var articleid = req.params.id;

		//recoger los datos por put
		var params = req.body;


		//valida los datos
		try {
			var validate_title = !validator.isEmpty(params.title);
			var validate_content = !validator.isEmpty(params.content);
		} catch (err) {
			return res.status(404).send({
				status: 'error',
				message: 'faltan datos por conprobar'
			});
		}
		if (validate_title && validate_content) {
			//hacer el fimd amd update
			Article.findOneAndUpdate({ _id: articleid }, params, { new: true }, (err, articleUpdated) => {
				if (err) {
					return res.status(500).send({
						status: 'error',
						message: 'error al actializar'
					});
				}
				if (!articleUpdated) {
					return res.status(404).send({
						status: 'error',
						message: 'no existe el articulo'
					});
				}
				return res.status(200).send({
					status: 'success',
					article: articleUpdated
				});

			});

		} else {
			return res.status(200).send({
				status: 'error',
				message: 'validacion incorrecta'
			});
		}





	},
	delete: (req, res) => {

		//recibir el id
		var articleid = req.params.id;

		//find and delete
		Article.findOneAndDelete({ _id: articleid }, (err, articleRemoved) => {
			if (err) {
				return res.status(500).send({
					status: 'error',
					message: 'error al borrar'
				});
			}
			if (!articleRemoved) {
				return res.status(404).send({
					status: 'error',
					message: 'no existe el articulo'
				});
			}
			return res.status(200).send({
				status: 'success',
				article: articleRemoved
			})

		});

	},
	upload: (req, res) => {
		//conectar connect multiparter


		//recoger el fichero de la peticion
		var filename = 'imagen no subida...';
		if (!req.files) {
			if (!articleRemoved) {
				return res.status(404).send({
					status: 'error',
					message: filename
				});
			}
		}


		//conseguir el nombre y la extension del archivo
		var file_path = req.files.file0.path;
		var file_split = file_path.split('\\');

		//nombre del archivo
		var file_name = file_split[2];

		//extension del archivo

		var extension_split = file_name.split('\.');
		var file_ext = extension_split[1];

		//comprobar la extension (solo imagenes)
		if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif') {
			//borrar el archivo
			fs.unlink(file_path, (err) => {
				return res.status(200).send({
					status: 'error',
					message: 'la extension no es valida'
				});

			})
		} else {
			var articleid = req.params.id;
			//borrar el fichero
			Article.findOneAndUpdate({ _id: articleid }, { image: file_name }, { new: true }, (err, articleUpdated) => {
				if (err || !articleUpdated) {
					return res.status(500).send({
						status: 'error',
						message: 'error al guardarl aimagend el articulo',
					});
				}

				return res.status(200).send({
					status: 'success',
					article: articleUpdated
				});
			});
			//buscar el articulo y actualizarlo
			/*	return res.status(200).send({
					//fichero: req.files,
					//split: file_split,
					file_name
				})*/
		}

		//buscar el articulo, asignarle el nombre y actualizarlo



	},
	getImage: (req, res) => {


		var file = req.params.image;
		var path_file = './upload/articles/' + file;

		fs.exists(path_file, (exists) => {
			if (exists) {
				return res.sendFile(path.resolve(path_file));
			} else {
				return res.status(404).send({
					status: 'error',
					message: 'la imagen no es existe',
				});
			}
		})

	},
	search: (req, res) => {

		//sacar el string a busccar
		var searchString = req.params.search;

		//find or
		Article.find({
			"$or": [
				{ "title": { "$regex": searchString, "$options": "i" } },
				{ "content": { "$regex": searchString, "$options": "i" } }
			]
		}).sort([['date', 'descending']]).exec((err, articles) => {

			if (err) {
				return res.status(500).send({
					status: 'error',
					message: 'error en la peticion',
				});
			}
			if (!articles || articles.length <= 0) {
				return res.status(404).send({
					status: 'error',
					message: 'No hay articulos que coincidad'
				});
			}

			return res.status(200).send({
				status: 'success',
				articles
			});
		});

	}

}






module.exports = controller;