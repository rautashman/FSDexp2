require("dotenv/config");

const express = require("express");
const path = require("path");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const databaseName = process.env.MONGODB_DB || "contact_manager";

let contactsCollection;

app.use(express.json());
app.use(express.static(__dirname));

function formatContact(contact) {
  return {
    id: contact._id.toString(),
    name: contact.name,
    email: contact.email,
    phone: contact.phone
  };
}

function validateContactPayload(payload) {
  const errors = [];

  if (!payload.name || !payload.name.trim()) {
    errors.push("Name is required.");
  }

  if (!payload.email || !payload.email.trim()) {
    errors.push("Email is required.");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email.trim())) {
    errors.push("Email must be valid.");
  }

  if (!payload.phone || !payload.phone.trim()) {
    errors.push("Phone number is required.");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

app.get("/api/contacts", async (req, res) => {
  try {
    const contacts = await contactsCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    res.json(contacts.map(formatContact));
  } catch (error) {
    res.status(500).json({ message: "Failed to load contacts." });
  }
});

app.post("/api/contacts", async (req, res) => {
  const { isValid, errors } = validateContactPayload(req.body);

  if (!isValid) {
    return res.status(400).json({ message: errors[0], errors });
  }

  try {
    const newContact = {
      name: req.body.name.trim(),
      email: req.body.email.trim(),
      phone: req.body.phone.trim(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await contactsCollection.insertOne(newContact);

    res.status(201).json(formatContact({ ...newContact, _id: result.insertedId }));
  } catch (error) {
    res.status(500).json({ message: "Failed to create contact." });
  }
});

app.put("/api/contacts/:id", async (req, res) => {
  const { isValid, errors } = validateContactPayload(req.body);

  if (!isValid) {
    return res.status(400).json({ message: errors[0], errors });
  }

  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid contact id." });
  }

  try {
    const updatedContact = {
      name: req.body.name.trim(),
      email: req.body.email.trim(),
      phone: req.body.phone.trim(),
      updatedAt: new Date()
    };

    const result = await contactsCollection.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: updatedContact },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return res.status(404).json({ message: "Contact not found." });
    }

    res.json(formatContact(result.value));
  } catch (error) {
    res.status(500).json({ message: "Failed to update contact." });
  }
});

app.delete("/api/contacts/:id", async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid contact id." });
  }

  try {
    const result = await contactsCollection.deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Contact not found." });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Failed to delete contact." });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

async function startServer() {
  const client = new MongoClient(mongoUri);

  await client.connect();
  const database = client.db(databaseName);
  contactsCollection = database.collection("contacts");

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
