import React from 'react';
import Navbar from './components/Navbar';
import HeroSearch from './components/HeroSearch';
import CategoryExplorer from './components/CategoryGrid';
import RecommendedProducts from './components/RecommendedProducts';
import BrandLogoGrid from './components/BrandLogoGrid';
import Footer from './components/Footer';
import FaqSection from './components/FaqSection';
import HowToBuy from './components/HowToBuy';
import AdvancedSearchFilter from './components/AdvancedSearchFilter';
import OurServices from './components/OurServices';
import Trucks from './components/Trucks';
import ContactSection from './components/ContactSection';
import ClientReviews from './components/ClientReviews';
import NewsBlogSection from './components/NewsBlogSection';
import AutoParts from './components/AutoParts';

export default function Home() {
  return (
    <main className='bg-white font-lato text-black'>
      <Navbar />
      <HeroSearch />
      <AdvancedSearchFilter />
      <div className="container mx-auto px-4 py-8">
        {/* <CategoryExplorer /> */}
        <BrandLogoGrid />
        <div className="mt-12">
          <RecommendedProducts />
        </div>
        <div className="mt-12">
        <Trucks/>
        {/* <ClientReviews/> */}
        <NewsBlogSection/>
        </div>
        <HowToBuy />
        <OurServices/>
        <div className='py-6 w-full h-full bg-white'>
        <AutoParts/>
        </div>
      </div>
      <ContactSection/>
      {/* <FaqSection /> */}
      <Footer />
    </main>
  );
}