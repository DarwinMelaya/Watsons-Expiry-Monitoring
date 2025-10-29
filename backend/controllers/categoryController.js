import Category from "../models/categoryModel.js";

// @desc    Create new category
// @route   POST /api/categories
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.userId;

    // Check if category with same name already exists for this user
    const existingCategory = await Category.findOne({ name, user: userId });
    if (existingCategory) {
      return res
        .status(400)
        .json({ message: "Category with this name already exists" });
    }

    // Create category
    const category = await Category.create({
      name,
      description,
      user: userId,
    });

    res.status(201).json({
      _id: category._id,
      name: category.name,
      description: category.description,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all categories for a user
// @route   GET /api/categories
export const getCategories = async (req, res) => {
  try {
    const userId = req.user.userId;
    const categories = await Category.find({ user: userId }).sort({ name: 1 });

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single category
// @route   GET /api/categories/:id
export const getCategory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const category = await Category.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
export const updateCategory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, description } = req.body;

    // Check if category exists and belongs to user
    const category = await Category.findOne({
      _id: req.params.id,
      user: userId,
    });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Check if name is being changed and if new name already exists
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({
        name,
        user: userId,
        _id: { $ne: req.params.id },
      });
      if (existingCategory) {
        return res
          .status(400)
          .json({ message: "Category with this name already exists" });
      }
    }

    // Update category
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        ...(name && { name }),
        ...(description !== undefined && { description }),
      },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
export const deleteCategory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const category = await Category.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
