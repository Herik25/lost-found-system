const { check, validationResult } = require("express-validator");

exports.validateItemReport = [
  check("title", "Title is required").notEmpty(),
  check("description", "Description is required").notEmpty(),
  check("category", "Category is required").notEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
