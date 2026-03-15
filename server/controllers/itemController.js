const Item = require("../models/Item");

exports.createItem = async (req, res) => {

  try {
    const {
      title,
      description,
      category,
      type,
      locationLost,
      locationFound
    } = req.body;

    const duplicateItem = await Item.findOne({
      title,
      category,
      reportedBy: req.user.id
    });

    if (duplicateItem) {
      return res.status(400).json({ message: "You have already reported an item with this title and category" });
    }

    const images = req.files?.map(file => file.path);
    
    const item = await Item.create({
      title,
      description,
      category,
      type,
      locationLost,
      locationFound,
      images,
      reportedBy: req.user.id
    });

    res.status(201).json(item);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};

exports.getItems = async (req, res) => {
  try {
    const limit = 12;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const items = await Item.find()
      .populate("reportedBy", "fullName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRecentItems = async (req, res) => {
  try {
    const items = await Item.find()
      .populate("reportedBy", "fullName email")
      .sort({ updatedAt: -1 })
      .limit(10);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLostItems = async (req, res) => {
  try {
    const limit = 12;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const items = await Item.find({ type: "lost" })
      .populate("reportedBy", "fullName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFoundItems = async (req, res) => {
  try {
    const limit = 12;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const items = await Item.find({ type: "found" })
      .populate("reportedBy", "fullName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchItems = async (req, res) => {
  try {
    const { q, category, status, type } = req.query;
    let query = {};

    if (q) {
      query.$text = { $search: q };
    }
    if (category) query.category = category;
    if (status) query.status = status;
    if (type) query.type = type;

    const limit = 12;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const items = await Item.find(query)
      .populate("reportedBy", "fullName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate("reportedBy", "fullName");
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllItemsAdmin = async (req, res) => {
  try {
    const items = await Item.find()
      .populate("reportedBy", "fullName email")
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};