'use client';
import React, { useState } from 'react';
import {
  Building2,
  Wrench,
  CreditCard,
  MapPin,
  Bed,
  Bath,
  Square,
  PhoneCall,
  ExternalLink,
  ShieldAlert,
  ChevronRight,
  Filter
} from 'lucide-react';

// Types
type County = 'All' | 'Ventura' | 'Los Angeles';
type AvailabilityStatus = 'Available Now' | 'Coming Soon' | 'Occupied';

interface PropertyUnit {
  id: string;
  title: string;
  address: string;
  city: string;
  county: 'Ventura' | 'Los Angeles';
  rent: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  status: AvailabilityStatus;
  imageUrl: string;
  amenities: string[];
}

// Sample Data (20-25 Unit Portfolio Representation)
const PROPERTIES: PropertyUnit[] = [
  {
    id: 'prop-1',
    title: 'Coastal Palms Apartment',
    address: '452 Ocean Ave, Apt 3B',
    city: 'Ventura',
    county: 'Ventura',
    rent: 2450,
    bedrooms: 2,
    bathrooms: 1.5,
    sqft: 950,
    status: 'Available Now',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800',
    amenities: ['In-unit Laundry', 'Balcony', 'Parking Spot']
  },
  {
    id: 'prop-2',
    title: 'Oxnard Heritage Quadplex',
    address: '1208 S C St, Unit A',
    city: 'Oxnard',
    county: 'Ventura',
    rent: 2100,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 720,
    status: 'Available Now',
    imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=800',
    amenities: ['Shared Courtyard', 'Pet Friendly', 'Utilities Included']
  },
  {
    id: 'prop-3',
    title: 'San Fernando Valley Townhome',
    address: '18420 Sherman Way, Unit 12',
    city: 'Reseda',
    county: 'Los Angeles',
    rent: 2850,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1250,
    status: 'Coming Soon',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
    amenities: ['Attached Garage', 'Central AC', 'Dishwasher']
  },
  {
    id: 'prop-4',
    title: 'Conejo Valley Studio',
    address: '88 N Moorpark Rd, Apt 204',
    city: 'Thousand Oaks',
    county: 'Ventura',
    rent: 1850,
    bedrooms: 0,
    bathrooms: 1,
    sqft: 500,
    status: 'Available Now',
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800',
    amenities: ['Pool Access', 'Gated Entry', 'Storage Unit']
  },
  {
    id: 'prop-5',
    title: 'Westside Modern Suite',
    address: '11640 Culver Blvd, Apt 5',
    city: 'Los Angeles',
    county: 'Los Angeles',
    rent: 3200,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1100,
    status: 'Coming Soon',
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800',
    amenities: ['EV Charging', 'Rooftop Deck', 'Hardwood Floors']
  }
];

export default function PropertyHomePage() {
  const [selectedCounty, setSelectedCounty] = useState<County>('All');
  const [maxRent, setMaxRent] = useState<number>(3500);

  const filteredProperties = PROPERTIES.filter(property => {
    const matchesCounty = selectedCounty === 'All' || property.county === selectedCounty;
    const matchesRent = property.rent <= maxRent;
    return matchesCounty && matchesRent;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">

      {/* Top Utility Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>Managing Quality Residential Units in Ventura & Los Angeles Counties</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-amber-400 font-medium">
              <ShieldAlert className="w-3.5 h-3.5" /> Maintenance Emergency: (805) 555-0199
            </span>
          </div>
        </div>
      </div>

      {/* Main Header / Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2.5 rounded-lg">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">SoCal Property Hub</h1>
              <p className="text-xs text-slate-500">Ventura & LA County Rentals</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#listings" className="text-slate-600 hover:text-blue-600 transition">Available Rentals</a>
            <a href="#tenant-portal" className="text-slate-600 hover:text-blue-600 transition">Tenant Portal</a>
            <a href="#maintenance" className="text-slate-600 hover:text-blue-600 transition">Maintenance</a>
            <a href="#contact" className="text-slate-600 hover:text-blue-600 transition">Contact Us</a>
          </nav>
          <a
            href="#tenant-portal"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm transition"
          >
            Pay Rent Online
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <img
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1600"
            alt="Southern California Neighborhood"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <span className="inline-block bg-blue-500/20 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full border border-blue-400/30 mb-4">
              Local Family Managed Portfolio
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
              Quality Homes Across Ventura & Los Angeles
            </h2>
            <p className="text-slate-300 text-base sm:text-lg mb-8 leading-relaxed">
              Transparent management, prompt maintenance, and comfortable living spaces in Southern California's best communities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#listings"
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3.5 rounded-lg text-center transition shadow-lg shadow-blue-600/30"
              >
                Browse Vacancies
              </a>
              <a
                href="#tenant-portal"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold px-6 py-3.5 rounded-lg text-center backdrop-blur-sm transition"
              >
                Tenant Quick Actions
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Tenant Quick Action Hub */}
      <section id="tenant-portal" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-xl shadow-xl border border-slate-200/80 p-6 md:p-8">
          <div className="border-b border-slate-100 pb-4 mb-6">
            <h3 className="text-lg font-bold text-slate-900">Current Resident Portal</h3>
            <p className="text-xs text-slate-500">Quick access to payment options and maintenance dispatch.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pay Rent */}
            <div className="p-5 rounded-lg border border-slate-100 bg-slate-50 hover:border-blue-200 hover:bg-blue-50/50 transition group">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <CreditCard className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-1">Pay Rent Online</h4>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Fast and secure ACH or credit card payments via our online payment gateway.
              </p>
              <a
                href="https://www.zillow.com/rental-manager/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 group-hover:text-blue-700"
              >
                Launch Payment Portal <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Maintenance Request */}
            <div id="maintenance" className="p-5 rounded-lg border border-slate-100 bg-slate-50 hover:border-amber-200 hover:bg-amber-50/50 transition group">
              <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Wrench className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-1">Maintenance Request</h4>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Submit non-emergency repair tickets with photos directly to our dispatch team.
              </p>
              <button
                onClick={() => alert('Maintenance Modal / Form will open here.')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 group-hover:text-amber-700"
              >
                Submit Ticket <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Emergency Info */}
            <div className="p-5 rounded-lg border border-slate-100 bg-slate-50 hover:border-rose-200 hover:bg-rose-50/50 transition group">
              <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <PhoneCall className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-1">24/7 Emergency Line</h4>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Active pipe bursts, severe water leaks, or heating failures requiring immediate dispatch.
              </p>
              <a
                href="tel:8055550199"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 group-hover:text-rose-700"
              >
                Call On-Call Hotline <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Available Rentals Section */}
      <section id="listings" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Available & Upcoming Vacancies</h3>
            <p className="text-sm text-slate-500">Explore residential units across Ventura and Los Angeles Counties</p>
          </div>

          {/* Filters */}
          <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm flex flex-wrap items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-2 px-2 text-slate-500">
              <Filter className="w-3.5 h-3.5" /> Filter by:
            </div>

            {/* County Selector */}
            <div className="flex bg-slate-100 p-1 rounded-md">
              {(['All', 'Ventura', 'Los Angeles'] as County[]).map((county) => (
                <button
                  key={county}
                  onClick={() => setSelectedCounty(county)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                    selectedCounty === county
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {county}
                </button>
              ))}
            </div>

            {/* Rent Range Filter */}
            <div className="flex items-center gap-2 px-2 border-l border-slate-200">
              <span className="text-slate-500">Max Rent:</span>
              <span className="font-bold text-slate-900">${maxRent}</span>
              <input
                type="range"
                min="1500"
                max="3500"
                step="100"
                value={maxRent}
                onChange={(e) => setMaxRent(Number(e.target.value))}
                className="w-24 accent-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Property Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((unit) => (
              <div
                key={unit.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
              >
                {/* Image & Status Tag */}
                <div className="relative h-48 w-full bg-slate-100">
                  <img
                    src={unit.imageUrl}
                    alt={unit.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm ${
                      unit.status === 'Available Now'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-amber-500 text-white'
                    }`}>
                      {unit.status}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="bg-slate-900/80 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      {unit.county} Co.
                    </span>
                  </div>
                </div>

                {/* Property Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-slate-900 text-base">{unit.title}</h4>
                      <div className="text-right">
                        <span className="text-lg font-extrabold text-blue-600">${unit.rent}</span>
                        <span className="text-[10px] text-slate-400 block">/month</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mb-4">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {unit.address}, {unit.city}
                    </p>

                    {/* Specs */}
                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 mb-4 text-xs text-slate-600">
                      <div className="flex items-center gap-1">
                        <Bed className="w-4 h-4 text-slate-400" />
                        <span>{unit.bedrooms === 0 ? 'Studio' : `${unit.bedrooms} Bed`}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="w-4 h-4 text-slate-400" />
                        <span>{unit.bathrooms} Bath</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Square className="w-4 h-4 text-slate-400" />
                        <span>{unit.sqft} sqft</span>
                      </div>
                    </div>

                    {/* Amenities tags */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {unit.amenities.map((item, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => alert(`Inquiry initiated for ${unit.title}`)}
                      className="flex-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2.5 rounded-lg transition text-center"
                    >
                      Schedule Tour
                    </button>
                    <button
                      onClick={() => alert(`Application form opened for ${unit.title}`)}
                      className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold py-2.5 rounded-lg transition text-center"
                    >
                      Apply Online
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <p className="text-slate-500 text-sm">No rental units found matching your current filter criteria.</p>
            <button
              onClick={() => { setSelectedCounty('All'); setMaxRent(3500); }}
              className="mt-3 text-xs font-bold text-blue-600 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Local Policy Disclosures Footer Section */}
      <footer id="contact" className="bg-slate-900 text-slate-400 text-xs py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 text-white font-bold text-sm mb-3">
                <Building2 className="w-4 h-4 text-blue-400" /> SoCal Property Management
              </div>
              <p className="leading-relaxed text-slate-400">
                Direct family management for 20+ residential units across Oxnard, Ventura, Thousand Oaks, and the San Fernando Valley.
              </p>
            </div>
            <div>
              <h5 className="text-white font-bold mb-3">Regional Compliance</h5>
              <p className="leading-relaxed text-slate-400">
                All Los Angeles County and Ventura County properties comply with California AB 1482 Tenant Protection Act, fair housing statutes, and local municipal health codes.
              </p>
            </div>
            <div>
              <h5 className="text-white font-bold mb-3">Management Contact</h5>
              <p className="mb-1">Email: management@socalpropertyhub.com</p>
              <p className="mb-1">Phone: (805) 555-0100</p>
              <p>Office: Ventura County, CA</p>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-center text-slate-500">
            <p>© {new Date().getFullYear()} SoCal Property Hub. Equal Housing Opportunity.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
