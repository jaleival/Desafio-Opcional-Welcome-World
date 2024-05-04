const express = require("express");
const app = express();
const fs = require("fs");
const moment = require("moment");

app.listen(8080, () =>
  console.log("Servidor habilitado http://localhost:8080")
);

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.get("/crear", (req, res) => {
  const { archivo, contenido } = req.query;
  let ruta = `${__dirname}/archivos/${archivo}`;

  fs.writeFile(
    ruta,
    `${moment().format("DD/MM/YYYY")}\n${contenido}`,
    "utf8",
    (error) => {
      error
        ? res.send("No se ha podido crear el archivo")
        : res.send("El archivo fue creado con éxito");
    }
  );
});

app.get("/leer", (req, res) => {
  const archivo = req.query.archivo;
  let ruta = `${__dirname}/archivos/${archivo}`;

  fs.readFile(ruta, "utf8", (error, data) => {
    error ? res.send("No se ha podido leer el archivo") : res.send(data);
  });
});

app.get("/renombrar", (req, res) => {
  const { nombre, nuevoNombre } = req.query;
  let rutaOld = `${__dirname}/archivos/${nombre}`;
  let rutaNew = `${__dirname}/archivos/${nuevoNombre}`;

  fs.rename(rutaOld, rutaNew, (error) => {
    error
      ? res.send("No se ha podido renombrar el archivo")
      : res.send(`El archivo ${nombre} ahora se llama ${nuevoNombre}`);
  });
});

app.get("/eliminar", (req, res) => {
  const archivo = req.query.archivo;
  let ruta = `${__dirname}/archivos/${archivo}`;

  res.write(
    `<p>Tu solicitud para eliminar el archivo ${archivo} se está procesando</p>`,
    "utf8",
    () => {
      setTimeout(() => {
        fs.unlink(ruta, (error) => {
          error
            ? res.end("No se ha podido eliminar el archivo", "utf8")
            : res.end("El archivo fue eliminado con éxito", "utf8");
        });
      }, 3000);
    }
  );
});