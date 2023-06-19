
# Ejercicio de postulación: Simulación check-in Aerolínea

Una aerolínea, está evaluando comenzar sus operaciones en países de latinoamérica. Para esto, necesita
saber si es posible realizar un check-in automático de sus pasajeros. La aerolínea cuenta con 2 aviones, de distinta capacidad y distribución de asientos de acuerdo a un modelo dado. 


# Tareas a realizar

Crear un programa que realice una simulación de check-in. Para ello se contara con una base de datos (solo lectura) que contiene todos los datos necesarios para la simulación.

Crear una API REST, con un solo endpoint que permita
consultar por el ID del vuelo y retornar la simulación. Una compra puede tener muchas tarjetas
de embarque asociadas, pero estas tarjetas pueden no tener un asiento asociado, siempre tendrá un tipo de asiento, por lo tanto, al retornar la simulación del check-in se debe asignar el asiento a cada tarjeta de embarque.

Los puntos a tomar en cuenta son:
● Todo pasajero menor de edad debe quedar al lado de al menos uno de sus acompañantes mayores de edad (se
puede agrupar por el id de la compra).
● Si una compra tiene, por ejemplo, 4 tarjetas de embarque, tratar en lo posible que los asientos que se asignen estén juntos, o queden muy cercanos (ya sea en la fila o en la columna).
● Si una tarjeta de embarque pertenece a la clase “económica”, no se puede asignar un asiento de otra clase.


# Documentación del Servicio.

Estructura:
Método: GET
Ruta: /flights/:id/passengers
Respuesta exitosa:

{
"code": 200,
"data": {
"flightId": 1,
"takeoffDateTime": 1688207580,
"takeoffAirport": "Aeropuerto Internacional Arturo Merino Benitez, Chile",
"landingDateTime": 1688221980,
"landingAirport": "Aeropuerto Internacional Jorge Cháve, Perú",
"airplaneId": 1,
"passengers": [
{
"passengerId": 90,
"dni": 983834822,
"name": "Marisol",
"age": 44,
"country": "México",
"boardingPassId": 24,
"purchaseId": 47,
"seatTypeId": 1,
"seatId": 1
},
}


# Instaclación Local

A brief description of what this project does and who it's for


## Acknowledgements

 - [Awesome Readme Templates](https://awesomeopensource.com/project/elangosundar/awesome-README-templates)
 - [Awesome README](https://github.com/matiassingers/awesome-readme)
 - [How to write a Good readme](https://bulldogjob.com/news/449-how-to-write-a-good-readme-for-your-github-project)


## Appendix

Any additional information goes here


## 🔗 Links
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://katherineoelsner.com/)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/)
[![twitter](https://img.shields.io/badge/twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/)


## Lessons Learned

What did you learn while building this project? What challenges did you face and how did you overcome them?


## 🛠 Skills
Javascript, HTML, CSS...


## Other Common Github Profile Sections
👩‍💻 I'm currently working on...

🧠 I'm currently learning...

👯‍♀️ I'm looking to collaborate on...

🤔 I'm looking for help with...

💬 Ask me about...

📫 How to reach me...

😄 Pronouns...

⚡️ Fun fact...


# Hi, I'm Katherine! 👋


## 🚀 About Me
I'm a full stack developer...


## Feedback

If you have any feedback, please reach out to us at fake@fake.com


## Features

- Light/dark mode toggle
- Live previews
- Fullscreen mode
- Cross platform


## FAQ

#### Question 1

Answer 1

#### Question 2

Answer 2


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`API_KEY`

`ANOTHER_API_KEY`


## Installation Local

Clonar proyecto

https://github.com/nicomugas/SimulacionCheckInAerolnea.git

Ir la directorio del proyecto
```
$ cd check-in
```
Instalar dependencias

```
  $ npm install 
  
```
Ejecutar

```
  $ npm run dev
  
```
Navegación Local
https://localhost:PORT/flights/:id/passengers

Ej: https://localhost:3000/flights/2/passengers

## Deploy

Deploy en Render.com

https://simulacioncheckinaerolinea.onrender.com/flights/:id/passengers

Ejemplo:
https://simulacioncheckinaerolinea.onrender.com/flights/2/passengers


# Tecnologías 

JavaScript
Node
Express
MySql


# Resumen de la Resolución 

A partir de un vuelo recibido como parametro, se obtienen los BoardingPass correspondientes. 

Así como también, se obtienen todos los asientos disponibles para el vuelo y avión requeridos. Esto se realiza agrupandolos por clase. 

Luego se filtran los BoardingPass, obteniedno asi tres grupos diferentes a procesar. 

1. BoardingPass con menores de edad.
2. BoardingPass de mas de un pasajero para una misma compra.
3. BoardingPass de pasajeros individuales. 

Se procesan cada una de esta listas, asignandoles un seat a cada pasajero en el vuelo, cumpliendo las reglas solicitadas, a saber:

- Los menores esten al lado de mayor. 
- En caso de varios pasajeros para una misma compra, tratar de ubicarlos lo mas cercano posible. 

Finalmente se devuelve el listado con la simulación de ubicaciones. 

