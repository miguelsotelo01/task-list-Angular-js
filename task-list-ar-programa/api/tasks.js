const https = require("https");
const url = require("url");

const FIREBASE_URL = process.env.FIREBASE_URL;

export default async function handler(req, res) {
  // CORS Headers
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

  const pathParts = req.url.split("/");
  const id =
    pathParts.length > 1 && pathParts[pathParts.length - 1] !== "tasks"
      ? pathParts[pathParts.length - 1]
      : null;

  try {
    if (req.method === "GET") {
      const data = await firebaseRequest(FIREBASE_URL + ".json", "GET");
      if (!data) return res.status(200).json([]);

      const tasksArray = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      return res.status(200).json(tasksArray);
    } else if (req.method === "POST") {
      // CORRECCIÓN AQUÍ:
      // Vercel ya parsea el body si es application/json.
      // Solo usamos JSON.parse si llega como texto.
      const newTask =
        typeof req.body === "string" ? JSON.parse(req.body) : req.body;

      delete newTask.id;
      const result = await firebaseRequest(
        FIREBASE_URL + ".json",
        "POST",
        newTask,
      );
      return res.status(201).json({ id: result.name, ...newTask });
    } else if (req.method === "DELETE" && id) {
      await firebaseRequest(`${FIREBASE_URL}/${id}.json`, "DELETE");
      return res.status(200).json({ success: true });
    } else if (req.method === "PUT" && id) {
      // MISMA CORRECCIÓN AQUÍ
      const updatedTask =
        typeof req.body === "string" ? JSON.parse(req.body) : req.body;

      await firebaseRequest(`${FIREBASE_URL}/${id}.json`, "PUT", updatedTask);
      return res.status(200).json(updatedTask);
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Error en API:", error); // Esto te ayudará a ver el error en los logs de Vercel
    res.status(500).json({ error: error.message });
  }
}

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
          resolve(null);
        }
      });
    });

    req.on("error", (e) => reject(e));
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}
