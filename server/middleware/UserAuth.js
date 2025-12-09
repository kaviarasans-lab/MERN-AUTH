import jwt from "jsonwebtoken";

const userAuth = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.json({ success: false, message: "Not Authorized Login Again" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: decoded.id };  // <-- final correct place to store userId

    next();

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export default userAuth;
