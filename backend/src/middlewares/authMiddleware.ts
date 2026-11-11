import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models";
import { Op } from 'sequelize';

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

async function touchActivity(user: any) {
  const cutoff = new Date(Date.now() - 5 * 60 * 1000);
  if (!user.last_active || new Date(user.last_active) < cutoff) {
    await User.update({ last_active: new Date() }, { where: {
      id: user.id, [Op.or]: [{ last_active: null }, { last_active: { [Op.lt]: cutoff } }],
    }, silent: true });
  }
}

export interface AuthRequest extends Request {
  user?: any;
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Lấy token từ header Authorization (cách cũ) HOẶC cookie (cách mới)
    let token = req.cookies?.accessToken;

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    if (
      (user as any).status === "BANNED" ||
      (user as any).status === "DELETED"
    ) {
      return res
        .status(403)
        .json({ error: "Forbidden: Account has been suspended or deleted" });
    }

    await touchActivity(user);
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    let token = req.cookies?.accessToken;
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (token) {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      const user = await User.findByPk(decoded.id);
      if (
        user &&
        (user as any).status !== "BANNED" &&
        (user as any).status !== "DELETED"
      ) {
        await touchActivity(user);
        req.user = user;
      }
    }
  } catch (error) {
    // Ignore invalid token for optional auth
  }
  next();
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.user.role !== "ADMIN" && req.user.role !== "CENSOR") {
    require("fs").appendFileSync(
      "auth_debug.log",
      new Date().toISOString() +
        " - Forbidden! Role is: " +
        req.user.role +
        " - ID: " +
        req.user.id +
        "\n",
    );
    return res
      .status(403)
      .json({
        error:
          "Forbidden: Requires admin privileges. Role is: " + req.user.role,
      });
  }

  next();
};
