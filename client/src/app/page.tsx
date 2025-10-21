"use client";
import HeroPage from "./components/HeroPage";
import Brands from "./components/Brands";
import Productspreiview from "./components/ProductsPreiview";
import Banner from "./components/ui/Banner";
import DirectPages from "./components/DirectPage";
import ExploreProducts from "./components/ExploreProducts";
import Banner2 from "./components/ui/Banner2";

export default function Home() {
  return (
    <>
      <HeroPage/>
      <Banner/>
      <Productspreiview/>
      <DirectPages/>
      <Banner2/>
      <ExploreProducts/>
      <Brands/>
    </>
  );
}
