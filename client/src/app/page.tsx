"use client";
import HeroPage from "./components/HeroPage";
import Productspreiview from "./components/ProductsPreiview";
import ExploreProducts from "./components/ExploreProducts";
import Footer from "./components/Footer";
import VideoSection from "./components/VideoSection";
import { useCart } from "./contexts/CartContext";
import CategoryBanner from "./components/CategoryBanner";

export default function Home() {

  const {toggleCart, state} = useCart();
  return (
    <>
      <HeroPage/>
      <CategoryBanner/>
      <Productspreiview/> 
      <VideoSection/>
    </>
  );
}
