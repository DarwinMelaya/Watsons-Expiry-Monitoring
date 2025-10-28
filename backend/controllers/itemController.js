import Item from "../models/itemModel.js";

// @desc    Create new product
// @route   POST /api/products
export const createProduct = async (req, res) => {
  try {
    const { sku, description, expiry, quantity } = req.body;
    const userId = req.user.userId;

    // Check if product with same SKU already exists
    const existingItem = await Item.findOne({ sku });
    if (existingItem) {
      return res
        .status(400)
        .json({ message: "Product with this SKU already exists" });
    }

    // Create product
    const item = await Item.create({
      sku,
      description,
      expiry: new Date(expiry),
      quantity,
      user: userId,
    });

    res.status(201).json({
      _id: item._id,
      sku: item.sku,
      description: item.description,
      expiry: item.expiry,
      quantity: item.quantity,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all products for a user
// @route   GET /api/products
export const getProducts = async (req, res) => {
  try {
    const userId = req.user.userId;
    const products = await Item.find({ user: userId }).sort({ expiry: 1 });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
export const getProduct = async (req, res) => {
  try {
    const userId = req.user.userId;
    const product = await Item.findOne({ _id: req.params.id, user: userId });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
export const updateProduct = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { sku, description, expiry, quantity } = req.body;

    // Check if product exists and belongs to user
    const product = await Item.findOne({ _id: req.params.id, user: userId });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if SKU is being changed and if new SKU already exists
    if (sku && sku !== product.sku) {
      const existingProduct = await Item.findOne({
        sku,
        _id: { $ne: req.params.id },
      });
      if (existingProduct) {
        return res
          .status(400)
          .json({ message: "Product with this SKU already exists" });
      }
    }

    // Update product
    const updatedProduct = await Item.findByIdAndUpdate(
      req.params.id,
      {
        ...(sku && { sku }),
        ...(description && { description }),
        ...(expiry && { expiry: new Date(expiry) }),
        ...(quantity !== undefined && { quantity }),
      },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const userId = req.user.userId;
    const product = await Item.findOne({ _id: req.params.id, user: userId });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Item.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get products expiring soon
// @route   GET /api/products/expiring/:days
export const getExpiringProducts = async (req, res) => {
  try {
    const userId = req.user.userId;
    const days = parseInt(req.params.days) || 30;

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    const expiringProducts = await Item.find({
      user: userId,
      expiry: { $lte: futureDate },
      expiry: { $gte: new Date() }, // Not expired yet
    }).sort({ expiry: 1 });

    res.status(200).json(expiringProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
