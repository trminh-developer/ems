import { Router } from "express";
import {
  getMatches,
  likeUser,
  passUser,
  superlikeUser,
  unmatch,
  getWhoLikedMe,
  getWhoILiked,
} from "./MatchController";
import { requireAuth } from "../../middlewares/authMiddleware";

const router = Router();

router.get("/api/matches/who-liked-me/:userId", requireAuth, getWhoLikedMe);
router.get("/api/matches/who-i-liked/:userId", requireAuth, getWhoILiked);
router.get("/api/matches/:userId", requireAuth, getMatches);
router.post("/api/matches/like", requireAuth, likeUser);
router.post("/api/matches/pass", requireAuth, passUser);
router.post("/api/matches/superlike", requireAuth, superlikeUser);
router.delete("/api/matches/:id", requireAuth, unmatch);

export default router;
