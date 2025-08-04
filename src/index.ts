import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import { Deal } from './db_models';
import { DealType, NewDealType } from './types/dealType';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

(async () =>
    await mongoose
    .connect("mongodb://localhost:27017/local")
    .catch((err) => console.error("mongodb error:", err)))();

app.get("/api/deals", async (req, res) => {
    const name = req.query.name as string;
    let query = {};
    if (name) {
        query = { name: { $regex: name, $options: "i" } };
    }
    try {
        const deals = await Deal.find(query);
        res.json(deals);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "internal server error" });
    }
});

app.delete("/api/deals/:id", async (req, res) => {
    const id = req.params.id;
    try {
        await Deal.deleteOne({ _id: id });
        res.status(204).end();
    } catch (error) {}
});

app.put("/api/deals", async (req, res) => {
    const dealObj = req.body;
    if (!dealObj || !dealObj._id) {
        return res.status(400).json({ error: "missing required fields" });
    }
    try {
        const deal = await Deal.findByIdAndUpdate(dealObj._id, dealObj);
        res.status(200).json(deal);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "internal server error" });
    }
})

app.post("/api/deals", async (req, res) => {
    const dealObj = req.body;
    if (
        !dealObj
        || !dealObj.client
        || !dealObj.name
        || !dealObj.status
        || !dealObj.start_date
        || !dealObj.end_date
    ) {
        return res.status(400).json({ error: "missing required fields" });
    }
    try {
        const deal = new Deal(dealObj as NewDealType);
        await deal.save();
        res.status(201).json(deal);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "internal server error" });
    }
})

app.get("/", async (_req, res) => {
    let all = await Deal.find({});
    res.json(all);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});