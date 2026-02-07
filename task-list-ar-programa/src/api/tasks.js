// api/tasks.js
const https = require("https");
const url = require("url");

// LEER ESTO DE LAS VARIABLES DE ENTORNO DE VERCEL
// EJEMPLO DE URL: https://tu-proyecto.firebaseio.com/tasks
const FIREBASE_URL = process.env.FIREBASE_URL;

export default async function handler(req, res) {
  // Configurar CORS para permitir peticiones desde tu propio frontend
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Detectar ID en la URL (ej: /api/tasks/123)
  const pathParts = req.url.split("/");
  const id =
    pathParts.length > 1 && pathParts[pathParts.length - 1] !== "tasks"
      ? pathParts[pathParts.length - 1]
      : null;

  try {
    if (req.method === "GET") {
      // GET: Traer todo y convertir de Objeto Firebase a Array para Angular
      const data = await firebaseRequest(FIREBASE_URL + ".json", "GET");
      if (!data) return res.status(200).json([]);

      // Transformación clave: { "id1": {text: "A"}, "id2": {text: "B"} } -> [ {id: "id1", text: "A"}, {id: "id2", text: "B"} ]
      const tasksArray = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      return res.status(200).json(tasksArray);
    } else if (req.method === "POST") {
      // POST: Crear tarea
      const newTask = JSON.parse(req.body);
      // Eliminamos ID si viene, Firebase crea el suyo
      delete newTask.id;
      const result = await firebaseRequest(
        FIREBASE_URL + ".json",
        "POST",
        newTask,
      );
      // Devolvemos la tarea con el ID generado por Firebase
      return res.status(201).json({ id: result.name, ...newTask });
    } else if (req.method === "DELETE" && id) {
      // DELETE: Borrar tarea específica
      await firebaseRequest(`${FIREBASE_URL}/${id}.json`, "DELETE");
      return res.status(200).json({ success: true });
    } else if (req.method === "PUT" && id) {
      // PUT: Actualizar tarea (Toggle reminder, etc)
      const updatedTask = JSON.parse(req.body);
      await firebaseRequest(`${FIREBASE_URL}/${id}.json`, "PUT", updatedTask);
      return res.status(200).json(updatedTask);
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

// Función auxiliar para hacer peticiones https nativas (sin dependencias)
function firebaseRequest(urlStr, method, body = null) {
  return new Promise((resolve, reject) => {
    const parsedUrl = url.parse(urlStr);
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.path,
      method: method,
      headers: { "Content-Type": "application/json" },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(data ? JSON.parse(data) : null);
        } catch (e) {
          resolve(null); // Si no hay JSON (ej: DELETE)
        }
      });
    });

    req.on("error", (e) => reject(e));
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}
