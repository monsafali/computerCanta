import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    Sr_No: {
      type: String,
      required: true,
      unique: true,
    },

    vehicle: String,

    Party: {
      type: String,
      required: true,
    },

    Product: {
      type: String,
      required: true,
    },

    ProductId: String,

    Gross: {
      type: Number,
      required: true,
    },

    Tare: {
      type: Number,
      required: true,
    },

    Net: Number,

    Cash: {
      type: Number,
      required: true,
    },

    Date: String,


    GrossDate: String,

    TareDate: String,
    formDate: String,

    GrossTime: String,

    TareTime: String,

    remarks: String,

    calc40: {
      mnds: Number,
      kg: Number,
    },

    calc37: {
      mnds: Number,
      kg: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", ProductSchema);

export default Product;
