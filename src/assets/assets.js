import fruits from "./category/fruits.png";
import bakery from "./category/bakery.png";
import beverages from "./category/beverages.png";
import beauty from "./category/beauty.png";
import baby from "./category/baby.png";

import sale1 from "./offers/offer1.jpg";
import sale2 from "./offers/offer2.jpg";
import sale3 from "./offers/offer3.jpg";
import sale4 from "./offers/offer4.jpg";
import sale5 from "./offers/offer5.jpg";

export const offers = [sale1, sale2, sale3, sale4, sale5];

export const categorycart = [
  {
    _id: "1",
    title: "Fruits & Vegetables",
    description: "A variety of fresh fruits and vegetables.",
    buttonText: "Explore Fruits and Vegetables",
    image: fruits,
  },
  {
    _id: "2",
    title: "Bakery",
    description: "Freshly baked breads, cakes, and pastries.",
    buttonText: "Explore Bakery",
    image: bakery,
  },
  {
    _id: "3",
    title: "Beverages",
    description: "Refreshing drinks and juices for every mood.",
    buttonText: "Explore Beverages",
    image: beverages,
  },
  {
    _id: "4",
    title: "Beauty & Personal Care",
    description: "Top-quality beauty and self-care products.",
    buttonText: "Explore Beauty Products",
    image: beauty,
  },
  {
    _id: "5",
    title: "Baby Care",
    description: "Essential baby products for your little ones.",
    buttonText: "Explore Baby Care",
    image: baby,
  },
];
