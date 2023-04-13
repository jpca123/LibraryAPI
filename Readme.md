# Library App

Este es un proyecto desarrollado por [Juan Pablo Castillo](https://jpca123.github.io/portafolio) estudiante de desarrollo web, el cual es una `API REST` desarrollada en ***NodeJS*** con **Typescript** usando el framework ***ExpressJs*** y una base de datos no relacional ***MongoDB***, ademas usando el paquete _Mongoose_ para conectarla. Este proyecto que implementa el patron de diseño ***MVC*** _(model view controller)_ para administrar una biblioteca que registra y maneja libros, autores, categorias y usuarios.

## Authentificacion
Los usuarios pueden crear una cuenta para añadir libros y a su vez agregar libros a sus cuenta, el registro se hace a travez de un nombre de usuario _userName_ unico, un email y un genero, ademas de algunos campos opcionales. Se le permite una sesion simultanea y se usa el modulo ***JWT*** _(jsonwebtoken)_ para controlar su acceso a la aplicación.

## Operaciones CRUD
En este proyecto se implementan las operacions crud a las entidades del sistema como lo son los usuarios, libos autores y categorias. Esto permite un control total, ademas de que solo usuarios con cuentas pueden editar información, los demas solamente pueden consumirla.

## Manejo de Archivos
La principal pieza de este proyecto son los libros ya que estos son el eje sobre el que gira el proyecto, si embargo estos pueden ser solamente información o tener su propio documento (solamente formato pdf por seguridad), ademas de un poster o portada en algunos casos. Los archivos se suben y almacenan en el servidor usando el paquete llamado ***multer*** para controlar su carga al servidor.

## Envio de Emails
En el funcionamiento de la aplicación el usuario debe proporcionar un email que sera usado paraa recuperar su contraseña en caso de olvido, este correo ademas se usara para notificar de la creación de la cuenta. La funcionalidad de envio de emails se realizo con el paquete de nodejs ***nodemailer*** usando un servidor smtp.

# Informacion adicional
En el proyecto adjunto el modelo entidad relación de la base de datos en el estandar **UML**.

version de node: 16.13.0

version de npm: 9.4.1

