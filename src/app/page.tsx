"use client";

import ImageSlider from "@/components/ImageSlider";
import BookCard from "@/components/BookCard";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <ImageSlider />
      <BookCard />
      <CartDrawer />
      <Footer />
    </>
  );
}
