import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";

const app: Express = express();

// app.use(cors({
// origin: '*', // your frontend origin
// methods: ['GET','POST','PUT','DELETE'],
// credentials: true
// }));

// app.use(
//   cors({
//     origin: true, // or your frontend IP/domain
//     credentials: true,
//   })
// );

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

// Routes
import projectRoutes from "./Project/project.route";
import companyRoutes from "./Company/company.route";
import serviceRoutes from "./Service/service.route";

app.use("/api/projects", projectRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/services", serviceRoutes);

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/health", (req: Request, res: Response) => {
  res.send("Hello World!");
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    path: req.originalUrl,
    method: req.method,
  });
});

export default app;
