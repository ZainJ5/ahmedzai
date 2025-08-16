import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MessageSquare, Phone } from 'lucide-react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function AutoPartsPage() {
  // const primaryColor = "#162135";
  const primaryColor = "#a52500";
  
  const componentParts = [
    {
      icon: '/engine.webp',
      title: "Engine and Gear x 1",
      subtitle: "(without catalytic converter)"
    },
    {
      icon: '/suspension.webp',
      title: "Front and Rear Suspension",
      subtitle: "x 1"
    },
    {
      icon: '/nose.webp',
      title: "Front Nose Cut x 1",
      subtitle: ""
    },
    {
      icon: '/fenders.webp',
      title: "Front Fenders x 2",
      subtitle: ""
    },
    {
      icon: '/bonnet.webp',
      title: "Bonnet x 1",
      subtitle: ""
    },
    {
      icon: '/sidedoor.webp',
      title: "Side Doors x 4",
      subtitle: ""
    },
    {
      icon: '/sidemirror.webp',
      title: "Side Mirrors x 2",
      subtitle: ""
    },
    {
      icon: '/trunck.webp',
      title: "Back Door or Trunk Lid x 1",
      subtitle: ""
    },
    {
      icon: '/bumper.webp',
      title: "Rear Bumper x 1",
      subtitle: ""
    },
    {
      icon: '/taillights.webp',
      title: "Tail Lights x 2",
      subtitle: ""
    }
  ];

  return (
    <div className="bg-white font-sans text-gray-800">
      <Navbar/>
      <section className="bg-gray-100 border-b border-gray-200">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-2 leading-tight"
            style={{ color: primaryColor }}
          >
            Premium Auto Parts & Expert Dismantling Services
          </h1>
          <div className="w-24 h-1 mx-auto mb-6" style={{ backgroundColor: primaryColor }}></div>
          <p className="text-center text-gray-600 max-w-3xl mx-auto text-base md:text-lg">
            Professional automotive dismantling with high-quality Japanese parts shipped worldwide
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between items-start">
            <div className="w-full lg:w-2/3 pr-0 lg:pr-12 mb-8 lg:mb-0">
              <h2 className="text-lg md:text-xl font-medium mb-3 text-gray-700">
                Looking for quality parts for your automotive needs?
              </h2>
              <h2 className="text-2xl md:text-3xl font-bold mb-5" style={{ color: primaryColor }}>
                Ahmadzai Trading Japan Is Your One Stop for Quality Scrap Cars and Parts
              </h2>
              <div className="space-y-4 text-gray-700 text-base">
                <p>
                  At Ahmadzai Trading Japan, we offer an extensive range of scrap cars from
                  which you can purchase spare parts or complete engine sets.
                </p>
                <p>
                  We use modern, specially fitted equipment, which allows us to reduce the
                  time and increase the quality and density of loading, reducing your risks
                  for damage of parts.
                </p>
                <p>
                  Along with dismantling, we can also load the used parts into containers and
                  arrange the shipment so you don't have to worry about making any of the
                  arrangements. Numbers of the cars that we can load into the container will
                  vary depending on the way you want to dismantle the car.
                </p>
                <p>
                  Dismantling, packaging parts and loading them into containers is conducted
                  in Toyama dismantling yard of Ahmadzai Trading.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 mt-6">
                <a
                  href="https://wa.me/+818046646786"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-6 rounded-md flex items-center cursor-pointer font-semibold transition-all hover:shadow-lg"
                  style={{ backgroundColor: primaryColor, color: '#fff' }}
                >
                  <MessageSquare className="mr-2" size={20} />
                  WhatsApp Now
                </a>
                <Link
                  href="/contact"
                  className="py-3 px-6 rounded-md flex items-center font-semibold transition-all hover:shadow-lg border-2"
                  style={{ borderColor: primaryColor, color: primaryColor }}
                >
                  <Phone className="mr-2" size={20} />
                  Contact Us
                </Link>
              </div>
            </div>

            <div className="w-full lg:w-1/3 flex justify-center">
              <div className="relative overflow-hidden w-full max-w-md h-[300px] md:h-[350px] lg:h-[380px] rounded-lg shadow-md">
                <Image 
                  src="/autopart-1.webp" 
                  alt="Engine parts" 
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-2"
            style={{ color: primaryColor }}
          >
            COMPONENTS FOR DISMANTLING
          </h2>
          <div className="w-24 h-1 mx-auto mb-6" style={{ backgroundColor: primaryColor }}></div>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-10 text-base md:text-lg">
            High-quality automotive components from premium Japanese vehicles
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
            {componentParts.map((part, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl border border-gray-100 group"
              >
                <div className="p-4 md:p-6 flex flex-col items-center">
                  <div 
                    className="rounded-full p-3 md:p-4 mb-4 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden relative group-hover:shadow-inner transition-all"
                    style={{ width: '80px', height: '80px', minWidth: '80px', minHeight: '80px' }}
                  >
                    <div className="w-full h-full relative">
                      <Image 
                        src={part.icon} 
                        alt={part.title}
                        fill
                        sizes="80px"
                        className="object-contain p-1 transition-all duration-300 group-hover:brightness-[90%]"
                      />
                    </div>
                  </div>
                  <h3 
                    className="font-bold text-center text-base md:text-lg mb-1 group-hover:text-[#162135] transition-colors" 
                    style={{ color: primaryColor }}
                  >
                    {part.title}
                  </h3>
                  {part.subtitle && (
                    <p className="text-sm text-gray-600 text-center mt-1">{part.subtitle}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-12 md:mb-16">
            <h2 
              className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4"
              style={{ color: primaryColor }}
            >
              EXCLUSIONS
            </h2>
            <div className="w-16 h-1 mb-4 md:mb-6" style={{ backgroundColor: primaryColor }}></div>
            <p className="text-gray-700 max-w-4xl text-base md:text-lg">
              Please note that the parts set does not include 
              <span className="font-bold"> car interior parts, catalytic converters, tires, or other miscellaneous parts</span>.
            </p>
          </div>

          <div className="mb-12 md:mb-16">
            <h2 
              className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4"
              style={{ color: primaryColor }}
            >
              CALCULATION
            </h2>
            <div className="w-16 h-1 mb-4 md:mb-6" style={{ backgroundColor: primaryColor }}></div>
            <p className="mb-6 md:mb-8 text-gray-700 text-base md:text-lg">C&F to your Destination Country includes:</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100">
                <div className="p-4 text-center text-white font-bold" style={{ backgroundColor: primaryColor }}>
                  EXPENSES FOR CAR INCLUDES
                </div>
                <div className="p-5">
                  <ul className="list-disc pl-5 space-y-3 text-gray-700 text-sm md:text-base">
                    <li><span className="font-bold">AUCTION CAR PRICE</span> is the price by which a car was purchased from auction.</li>
                    <li><span className="font-bold">AUCTION FEE</span> is the fee paid by our company to auction for each purchased unit.</li>
                    <li><span className="font-bold">TRANSPORTATION TO OUR YARD FEE</span> is the transportation fee to our yard. We recommend purchasing cars from auctions close to our Toyama dismantling yard.</li>
                    <li><span className="font-bold">RECYCLE FEE</span></li>
                    <li><span className="font-bold">OUR AGENT FEE</span></li>
                    <li><span className="font-bold">DISMANTLE COST</span></li>
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100">
                <div className="p-4 text-center text-white font-bold" style={{ backgroundColor: primaryColor }}>
                  EXPENSES FOR CONTAINER
                </div>
                <div className="p-5">
                  <ul className="list-disc pl-5 space-y-3 text-gray-700 text-sm md:text-base">
                    <li>Drayage (container transportation from shipping company to yard and back to shipping company)</li>
                    <li>Customer broker's fee</li>
                    <li>Export tax</li>
                    <li>Container scale</li>
                    <li>Container seal</li>
                    <li>Origin THC (Terminal Handling Charges)</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100">
                <div className="p-4 text-center text-white font-bold" style={{ backgroundColor: primaryColor }}>
                  FREIGHT
                </div>
                <div className="p-5">
                  <ul className="list-disc pl-5 space-y-3 text-gray-700 text-sm md:text-base">
                    <li>Amount to be paid to Shipping Company</li>
                    <li>Freight charges vary based on the destination country and port.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-12 md:mb-16">
            <h2 
              className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4"
              style={{ color: primaryColor }}
            >
              PARTS PACKAGING FEE
            </h2>
            <div className="w-16 h-1 mb-4 md:mb-6" style={{ backgroundColor: primaryColor }}></div>
            <p className="text-gray-700 max-w-4xl text-base md:text-lg">
              While we do not charge for the labor involved in packaging, there is a materials fee. 
              The customer can choose the packaging material, which affects the price. On average, 
              <span className="font-bold"> the packaging fee is 50,000 JPY per container</span>.
            </p>
          </div>

          <div>
            <h2 
              className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4"
              style={{ color: primaryColor }}
            >
              NUMBER OF CARS IN CONTAINER
            </h2>
            <div className="w-16 h-1 mb-4 md:mb-6" style={{ backgroundColor: primaryColor }}></div>
            <p className="mb-6 md:mb-8 text-gray-700 max-w-4xl text-base md:text-lg">
              <span className="font-bold">Dismantled cars could be shipped by 20F or 40F containers.</span> 
              Numbers of the cars that we can load into the container will vary depending on the way you dismantle the car.
            </p>

            <div className="overflow-hidden rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
              <table className="w-full border-collapse bg-white text-sm md:text-base">
                <thead>
                  <tr>
                    <th className="border p-3 md:p-4 bg-gray-50 text-gray-700"></th>
                    <th className="border p-3 md:p-4 text-white font-bold" style={{ backgroundColor: primaryColor }}>
                      40F CONTAINER
                    </th>
                    <th className="border p-3 md:p-4 text-white font-bold" style={{ backgroundColor: primaryColor }}>
                      20F CONTAINER
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="border p-3 md:p-4 font-bold text-center bg-gray-50">FULL CAR DISMANTLE</td>
                    <td className="border p-3 md:p-4 text-center">25-33 Cars</td>
                    <td className="border p-3 md:p-4 text-center">18 Cars</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="border p-3 md:p-4 font-bold text-center bg-gray-50">HALF CUT</td>
                    <td className="border p-3 md:p-4 text-center">12-15 Cars</td>
                    <td className="border p-3 md:p-4 text-center">9 Cars</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 
              className="text-2xl md:text-3xl lg:text-4xl font-bold mb-5 md:mb-6"
              style={{ color: primaryColor }}
            >
              Ready to Get Started?
            </h2>
            <p className="text-gray-700 mb-6 md:mb-8 text-base md:text-lg">
              Contact us today for a customized quote for your auto parts needs. We provide fast, reliable service with worldwide shipping.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://wa.me/+818046646786"
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-6 md:px-8 rounded-md flex items-center font-semibold transition-all hover:shadow-lg"
                style={{ backgroundColor: primaryColor, color: '#fff' }}
              >
                <MessageSquare className="mr-2" size={20} />
                Contact Us Now
              </a>
              <Link
                href="/contact"
                className="py-3 px-6 md:px-8 rounded-md flex items-center font-semibold transition-all hover:shadow-lg border-2"
                style={{ borderColor: primaryColor, color: primaryColor }}
              >
                Request Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  );
}