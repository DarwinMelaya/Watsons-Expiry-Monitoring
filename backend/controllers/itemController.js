import Item from "../models/itemModel.js";

// @desc    Create new product
// @route   POST /api/products
export const createProduct = async (req, res) => {
  try {
    const { sku, description, expiry, quantity, category } = req.body;
    const userId = req.user.userId;

    // Note: Frontend will check for duplicates by SKU and month before calling this
    // Create product
    const item = await Item.create({
      sku,
      description,
      expiry: new Date(expiry),
      quantity,
      user: userId,
      ...(category && { category }),
    });

    const populatedItem = await Item.findById(item._id).populate(
      "category",
      "name description"
    );

    res.status(201).json({
      _id: populatedItem._id,
      sku: populatedItem.sku,
      description: populatedItem.description,
      expiry: populatedItem.expiry,
      quantity: populatedItem.quantity,
      category: populatedItem.category,
      createdAt: populatedItem.createdAt,
      updatedAt: populatedItem.updatedAt,
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
    const products = await Item.find({ user: userId })
      .populate("category", "name description")
      .sort({ expiry: 1 });

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
    const product = await Item.findOne({
      _id: req.params.id,
      user: userId,
    }).populate("category", "name description");

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
    const { sku, description, expiry, quantity, category } = req.body;

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
        ...(category !== undefined && { category: category || null }),
      },
      { new: true, runValidators: true }
    ).populate("category", "name description");

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

    const now = new Date();
    const expiringProducts = await Item.find({
      user: userId,
      expiry: {
        $gte: now,
        $lte: futureDate,
      },
    })
      .populate("category", "name description")
      .sort({ expiry: 1 });

    res.status(200).json(expiringProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check if product with same SKU and month exists
// @route   GET /api/products/check?sku=...&expiry=...
export const checkDuplicateProduct = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { sku, expiry } = req.query;

    const expiryDate = new Date(expiry);
    const year = expiryDate.getFullYear();
    const month = expiryDate.getMonth();

    // Find products with same SKU and same year/month
    const existingItems = await Item.find({
      user: userId,
      sku: sku,
    });

    const matchingItem = existingItems.find((item) => {
      const itemDate = new Date(item.expiry);
      return itemDate.getFullYear() === year && itemDate.getMonth() === month;
    });

    if (matchingItem) {
      const populatedItem = await Item.findById(matchingItem._id).populate(
        "category",
        "name description"
      );
      return res.status(200).json({
        exists: true,
        item: {
          _id: populatedItem._id,
          sku: populatedItem.sku,
          description: populatedItem.description,
          expiry: populatedItem.expiry,
          quantity: populatedItem.quantity,
          category: populatedItem.category,
        },
      });
    }

    res.status(200).json({ exists: false });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Append quantity to existing product
// @route   PUT /api/products/:id/append
export const appendProductQuantity = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { quantity } = req.body;

    const product = await Item.findOne({ _id: req.params.id, user: userId });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updatedProduct = await Item.findByIdAndUpdate(
      req.params.id,
      { quantity: product.quantity + parseInt(quantity) },
      { new: true, runValidators: true }
    ).populate("category", "name description");

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
