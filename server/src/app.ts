import "dotenv/config";
import express from "express";
import cors from "cors";
import profileRoutes from "./routes/profileRoutes";
import spaceRoutes from "./routes/spaceRoutes";
import userRoutes from "./routes/userRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import ratingRoutes from "./routes/ratingRoutes";
import tagRoutes from "./routes/tagRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import locationRoutes from "./routes/locationRoutes";
import mediaRoutes from "./routes/mediaRoutes";
import reportRoutes from "./routes/reportRoutes";
import favoriteRoutes from "./routes/favoriteRoutes";
import accessibilityInfoRoutes from "./routes/accessibilityInfoRoutes";
import requireAuth from "./middleware/authMiddleware";
import errorMiddleware from "./middleware/errorMiddleware";

const app = express();
const clientOrigin = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";

app.disable("x-powered-by");

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

app.use("/profile", profileRoutes);
app.use(
  "/spaces",
  (req, res, next) => {
    if (req.method === "POST") return requireAuth(req, res, next);
    next();
  },
  spaceRoutes,
);

app.use("/users", userRoutes);
app.use("/reviews", reviewRoutes);
app.use("/ratings", ratingRoutes);
app.use("/tags", tagRoutes);
app.use("/categories", categoryRoutes);
app.use("/locations", locationRoutes);
app.use("/media", mediaRoutes);
app.use("/reports", reportRoutes);
app.use("/favorites", favoriteRoutes);
app.use("/accessibility-infos", accessibilityInfoRoutes);

app.use(errorMiddleware);

export default app;
