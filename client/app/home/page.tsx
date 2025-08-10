'use client';
import { Button } from "@/components/ui/button";
import { gridItems } from "@/constant/client/constant";
import { useSettingStore } from "@/store/useSetting.store";
import React, { useEffect, useState } from "react";

const HomePage = () => {

  const { banners, products, fetchFeaturedBanners, fetchFeaturedProducts } = useSettingStore();

  const [currentSlide, setCurrentSlide] = useState(0);

  // fetch when page reloads:
  useEffect(() => {
    fetchFeaturedBanners();
    fetchFeaturedProducts();
  }, [fetchFeaturedBanners, fetchFeaturedProducts]);

  useEffect(() => {
    const bannerTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 3000);

    return () => clearInterval(bannerTimer);
  }, [banners.length])


  return (
    <div className="min-h-screen bg-white">

      {/* Featured banner section: */}
      {
        banners.length > 0 &&
        <section className="relative h-[600px] overflow-hidden">
          {
            banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${currentSlide === index ? "opacity-100" : "opacity-0"}`}
              >
                <div className="absolute inset-0">
                  <img
                    src={banner.imageUrl}
                    alt={`bannerimgurl-${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                </div>

                <div className="relative h-full container mx-auto px-4 flex items-center">
                  <div className="text-white space-y-6">
                    <span className="text-sm uppercase tracking-wider">I am JHON</span>
                    <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                      BEST Selling
                      <br />
                      Ecommerce Website
                    </h1>
                    <p className="text-lg">
                      A Creative, Flexible, Clean, Easy to use and
                      <br />
                      High Performance E-Commerce theme
                    </p>
                    <Button
                      className="bg-white text-black hover:bg-gray-500 px-8 py-6 text-lg cursor-pointer"
                    >
                      Shop Now
                    </Button>
                  </div>

                </div>

              </div>
            ))
          }

          {/* buttons: dots  */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {
              banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-3 w-3 rounded-full transition-all ${currentSlide === index ? 'bg-white w-6' : "bg-white/50 hover:bg-white/75"}`}
                >

                </button>
              ))
            }

          </div>

        </section>
      }

      {/* Grid section: */}
      <section className="py-16">
        <div className="container mx-auto p-4">
          <h2 className="text-center text-2xl font-semibold mb-2 font-sans">
            The Winter Edits
          </h2>
          <p className="text-center text-gray-400 mb-8">
            Designed to keep your satisfaction
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {gridItems.map((gridItem, index) => (
              <div key={index} className="relative group overflow-hidden">
                <div className="aspect-[3/4]">
                  <img
                    src={gridItem.image}
                    alt={gridItem.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-center text-white p-4">
                    <h3 className="text-xl font-semibold mb-2">
                      {gridItem.title}
                    </h3>
                    <p className="text-sm">{gridItem.subtitle}</p>
                    <Button className="mt-4 bg-white text-black hover:bg-gray-100">
                      SHOP NOW
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products section: */}
      <section className="py-16">
        <div className="container mx-auto p-4">
          <h2 className="text-center text-2xl font-semibold mb-2 font-sans">
            The Featured Products
          </h2>
          <p className="text-center text-gray-400 mb-8">
            View form list of your featured Products
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {products.map((item, index) => (
              <div key={index} className="relative group overflow-hidden">
                <div className="aspect-[3/4]">
                  <img
                    src={item?.images[0]}
                    alt={item?.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-center text-white p-4">
                    <h3 className="text-xl font-semibold mb-2">
                      {item?.name}
                    </h3>
                    <p className="text-sm">Rs. {item?.price}</p>
                    <Button className="mt-4 bg-white text-black hover:bg-gray-100">
                      Quick View
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


    </div>
  );
};

export default HomePage;
