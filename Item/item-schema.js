const itemSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    lootboxId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    rarity: {
      type: String,
      enum: ["COMMON", "UNCOMMON", "EPIC", "LEGENDARY"],
      required: true,
    },
    percentage: { type: Number, required: true },
  },
  { collection: "item" },
);

itemSchema.virtual("sellPrice").get(function () {
  const { rarity, lootbox } = this;
  const lootBoxPrice = lootbox.price;

  const sellPriceMap = {
    COMMON: 0.1,
    UNCOMMON: 0.25,
    EPIC: 0.33,
    LEGENDARY: 0.5,
  };

  const rarityPercentage = sellPriceMap[rarity.toUpperCase()] || 0;

  return lootBoxPrice * rarityPercentage;
});

itemSchema.set("toJSON", { virtuals: true });
itemSchema.set("toObject", { virtuals: true });
