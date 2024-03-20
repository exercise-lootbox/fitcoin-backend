import admin from 'firebase-admin'

// This middleware uses Firebase Authentication to verify the user's token.
export async function authMiddleware(req, res, next) {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const idToken = authorization.split("Bearer ")[1];

    const decodedToken = await admin().verifyIdToken(idToken);
    req.user = decodedToken;
    return await next(req, res);
  } catch (error) {
    return res.status(403).json({ error: "Unauthorized: " + String(error) });
  }
}
