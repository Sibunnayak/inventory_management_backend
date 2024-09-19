const Item = require("../models/Item");
const QRCode = require("qrcode");
const { v4: uuidv4 } = require("uuid");

// Create a new inventory item and generate a QR code
exports.createItem = async (req, res) => {
  const { Name, partNumber, dateReceived, quantityReceived } = req.body;

  try {
    const qrCodeData = uuidv4(); // Generate unique data for QR code

    // Generate QR code as a base64 string
    const qrCodeUrl = await QRCode.toDataURL(qrCodeData);

    // Create a new item with the generated QR code data
    const item = new Item({
      name: Name,
      partNumber,
      dateReceived,
      numberReceived: quantityReceived,
      balance: quantityReceived,
      dispatches: [],
      qrCode: qrCodeUrl, // Save the base64 QR code directly
    });

    await item.save();

    res.status(201).json({ item, message: "Item created successfully" });
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({ error: "Error creating item" });
  }
};

// Get all inventory items with QR code image download
exports.getItems = async (req, res) => {
  try {
    const items = await Item.find();
    const itemsWithQrCodeUrls = items.map((item) => ({
      ...item.toObject(),
      qrCodeUrl: item.qrCode,
    }));

    res.json(itemsWithQrCodeUrls);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ error: "Error fetching items" });
  }
};

// Update an inventory item
exports.updateItem = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    if (updateData.numberReceived) {
      item.numberReceived = updateData.numberReceived;
    }

    const totalDispatched = item.dispatches.reduce(
      (acc, dispatch) => acc + dispatch.number,
      0
    );

    item.balance = item.numberReceived - totalDispatched;

    for (let key in updateData) {
      if (key !== "numberReceived") {
        item[key] = updateData[key];
      }
    }

    const updatedItem = await item.save();

    res.json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating item" });
  }
};

// Delete an inventory item
exports.deleteItem = async (req, res) => {
  const { id } = req.params;

  try {
    await Item.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error deleting item" });
  }
};

// Handle QR code scanning and update dispatch information
exports.scanQRCode = async (req, res) => {
  const { qrCode, dispatchDate, dispatchNumber } = req.body;
//   console.log(qrCode, dispatchDate, dispatchNumber);
  try {
    const item = await Item.findOne({ qrCode });
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    // Check if dispatch number exceeds balance
    if (dispatchNumber > item.balance) {
      return res
        .status(400)
        .json({ error: "Dispatch number exceeds available balance" });
    }

    // Update dispatch records and balance
    item.dispatches.push({ date: dispatchDate, number: dispatchNumber });
    item.balance -= dispatchNumber;

    await item.save();
    res.status(204).send(item);
  } catch (error) {
    res.status(500).json({ error: "Error scanning QR code" });
  }
};
