const checkAdmin = (req, res, next) => {
  if (req.role === "admin") {
    return next();
  }
  return res.status(403).json({ success: false, message: "Access denied" });
};

export default checkAdmin;
