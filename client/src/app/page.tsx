"use client";
import HeroPage from "./components/HeroPage";
import Brands from "./components/Brands";
import Productspreiview from "./components/ProductsPreiview";
import Banner from "./components/ui/Banner";
import ExploreProducts from "./components/ExploreProducts";
import Footer from "./components/Footer";
import VideoSection from "./components/VideoSection";
import { useCart } from "./contexts/CartContext";

export default function Home() {

  const {toggleCart, state} = useCart();
  return (
    <>
    <button onClick={toggleCart}><span>{state.items.length}</span>
  </button>
      
      <HeroPage/>
      <Banner/>
      <Productspreiview/> 
      <Brands/>
      <VideoSection/>
    </>
  );
}
