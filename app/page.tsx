'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { 
  Building2, MapPin, Bed, Bath, 
  Square, Loader2, AlertCircle, Phone, Mail,
  Search, ShieldCheck, Key, FileText, UserCheck, ChevronRight
} from 'lucide-react';

const SUPABASE_URL = 'https://krxgbyjeskputjtuxivw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyeGdieWplc2twdXRqdHV4aXZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1ODQ4MDgsImV4cCI6MjEwMjE2MDgwOH0.fszuxusHVtlYJ0r4OMa65St0dPlMuOnEUUHtA96Cr-8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

type County = 'All' | 'Ventura' | 'Los Angeles';

interface PropertyUnit {
  id: string;
  unit_number: string;
  rent_amount: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number | null;
  status: string | null;
  amenities: string[] | null;
  properties: {
    name: string;
    address: string;
    city: string;
    county: 'Ventura' | 'Los Angeles';
    image_url?: string | null;
  } | null;
}

export default function PropertyHomePage() {
  const [properties, setProperties] = useState<PropertyUnit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedCounty, setSelectedCounty] = useState<County>('All');
  const [searchCity, setSearchCity] = useState<string>('');

  useEffect(() => {
    async function fetchUnits() {
      try {
        setLoading(true);
        setErrorMsg(null);

        const { data, error } = await supabase
          .from('units')
          .select(`
            id,
            unit_number,
            rent_amount,
            bedrooms,
            bathrooms,
            sqft,
            status,
            amenities,
            properties (name, address, city, county, image_url)
          `);

        if (error) {
          setErrorMsg(error.message);
        } else if (data) {
          setProperties(data as unknown as PropertyUnit[]);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setErrorMsg(err.message);
        } else {
          setErrorMsg('An unexpected error occurred.');
        }
      } font-medium {
        setLoading(false);
      }
    }

    fetchUnits();
  }, []);

  const filteredProperties = properties.filter((unit) => {
    const matchesCounty = selectedCounty === 'All' || unit.properties?.county === selectedCounty;
    const matchesCity = searchCity === '' || (unit.properties?.city || '').toLowerCase().includes(searchCity.toLowerCase());
    return matchesCounty && matchesCity;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* Top Contact & Utility Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2.5 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-6 font-medium">
            <a href="tel:8059652887" className="flex items-center gap-1.5 hover:text-white transition">
              <Phone className="w-3.5 h-3.5 text-blue-400" /> (805) 965-2887
            </a>
            <a href="mailto:info@socalpropertyhub.com" className="flex items-center gap-1.5 hover:text-white transition">
              <Mail className="w-3.5 h-3.5 text-blue-400" /> info@socalpropertyhub.com
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">35+ Years of Excellence in SoCal Property Management</span>
            <Link href="/admin" className="text-blue-400 hover:text-blue-300 font-bold transition">+ Owner/Admin Portal</Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-blue-900 text-white p-2.5 rounded-lg shadow-sm">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">SoCal Property Hub</h1>
              <p className="text-[11px] text-slate-500 font-medium tracking-wide uppercase">Cochrane Style Management</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-bold text-slate-700">
            <Link href="/" className="text-blue-700 hover:text-blue-900 transition">Home</Link>
            <a href="#listings" className="hover:text-blue-700 transition">Rental Listings</a>
            <a href="#tenants" className="hover:text-blue-700 transition">Tenants</a>
            <a href="#owners" className="hover:text-blue-700 transition">Owners</a>
            <a href="#contact" className="hover:text-blue-700 transition">Contact</a>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <a href="#tenants" className="hidden sm:inline-block border border-blue-900 text-blue-900 hover:bg-blue-50 text-xs font-bold px-4 py-2.5 rounded-lg transition">
              Tenant Log In
            </a>
            <a href="#tenants" className="bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition">
              Pay Rent Online
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section - Cochrane PM Style Banner */}
      <section className="relative bg-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-35">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=80" 
            alt="Southern California Living" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full border border-blue-400/30 mb-4 inline-block">
            Full-Service Property Management
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
            Property Management That Works
          </h2>
          <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto font-normal mb-8 leading-relaxed">
            Providing full-service property management and quality rentals across Ventura, Santa Barbara, and Los Angeles Counties.
          </p>

          {/* Search Bar Widget */}
          <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl max-w-3xl mx-auto text-slate-800 border border-white/20">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center bg-slate-100 rounded-xl px-3 py-2">
                <Search className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
                <input 
                  type="text" 
                  placeholder="Search by city (e.g. Ventura)" 
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="bg-transparent text-xs w-full focus:outline-none text-slate-800 font-medium"
                />
              </div>

              <div className="flex items-center bg-slate-100 rounded-xl px-3 py-2">
                <span className="text-xs text-slate-500 font-semibold mr-2">County:</span>
                <select 
                  value={selectedCounty}
                  onChange={(e) => setSelectedCounty(e.target.value as County)}
                  className="bg-transparent text-xs font-bold text-slate-800 w-full focus:outline-none"
                >
                  <option value="All">All Counties</option>
                  <option value="Ventura">Ventura County</option>
                  <option value="Los Angeles">Los Angeles County</option>
                </select>
              </div>

              <a 
                href="#listings" 
                className="bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow transition"
              >
                Search Listings
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Listings Section */}
      <main id="listings" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-blue-700">Available Vacancies</span>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">Featured Rental Listings</h3>
            <p className="text-sm text-slate-500 mt-1">Discover available apartment homes, townhouses, and multi-family residences.</p>
          </div>

          <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2 text-xs font-semibold">
            <span className="text-slate-500 px-2">Filter:</span>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              {(['All', 'Ventura', 'Los Angeles'] as County[]).map((county) => (
                <button
                  key={county}
                  onClick={() => setSelectedCounty(county)}
                  type="button"
                  className={`px-3.5 py-1.5 rounded-md transition text-xs font-bold ${
                    selectedCounty === county ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {county}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 mb-8 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
            <div><strong>Database Error:</strong> {errorMsg}</div>
          </div>
        )}

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-10 h-10 text-blue-900 animate-spin mb-3" />
            <p className="text-slate-500 text-xs font-medium">Fetching active rentals...</p>
          </div>
        ) : filteredProperties.length > 0 ? (
          
          /* Property Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((unit) => {
              const isComingSoon = unit.status?.toLowerCase().includes('coming');

              return (
                <div key={unit.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col group">
                  
                  {/* Image Link */}
                  <Link href={`/properties/${unit.id}`} className="relative h-52 w-full bg-slate-200 overflow-hidden block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={unit.properties?.image_url || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'} 
                      alt={unit.properties?.name || 'Property'} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md text-white shadow-sm ${
                        isComingSoon ? 'bg-amber-500' : 'bg-blue-900'
                      }`}>
                        {unit.status || 'AVAILABLE NOW'}
                      </span>
                    </div>

                    {/* Rent Tag Banner */}
                    <div className="absolute bottom-3 right-3 bg-slate-900/90 text-white px-3 py-1 rounded-lg backdrop-blur-sm font-extrabold text-sm">
                      ${unit.rent_amount} <span className="text-[10px] text-slate-300 font-normal">/ mo</span>
                    </div>
                  </Link>

                  {/* Property Details */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <Link href={`/properties/${unit.id}`} className="font-bold text-slate-900 text-lg leading-snug hover:text-blue-800 transition block mb-1">
                        {unit.properties?.name} - {unit.unit_number}
                      </Link>

                      <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-4 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        {unit.properties?.address}, {unit.properties?.city}
                      </p>

                      {/* Specs Row */}
                      <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 mb-4 text-xs text-slate-600 font-medium">
                        <div className="flex items-center gap-1.5"><Bed className="w-4 h-4 text-slate-400"/> {unit.bedrooms === 0 ? 'Studio' : `${unit.bedrooms} Bed`}</div>
                        <div className="flex items-center gap-1.5"><Bath className="w-4 h-4 text-slate-400"/> {unit.bathrooms} Bath</div>
                        <div className="flex items-center gap-1.5"><Square className="w-4 h-4 text-slate-400"/> {unit.sqft ? `${unit.sqft} sqft` : '---'}</div>
                      </div>

                      {/* Amenities Pills */}
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {(unit.amenities || []).slice(0, 3).map((item, idx) => (
                          <span key={idx} className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                      <Link href={`/properties/${unit.id}`} className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-lg text-center transition">
                        View Details
                      </Link>
                      <Link href={`/properties/${unit.id}`} className="bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold py-2.5 rounded-lg text-center transition">
                        Apply Now
                      </Link>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-500 text-sm">No properties matching your criteria.</div>
        )}
      </main>

      {/* Owners & Tenants Info Section (Cochrane PM Style) */}
      <section className="bg-white border-y border-slate-200 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Owners Card */}
          <div id="owners" className="bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="bg-blue-900 text-white w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Property Owners</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                We maximize revenue and minimize your involvement in daily operations. Dedicated full-service management powered by AppFolio integration.
              </p>
              <ul className="space-y-2 text-xs font-semibold text-slate-700 mb-8">
                <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-blue-700"/> Monthly Management: 7%–8% Competitive Rate</li>
                <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-blue-700"/> Comprehensive Tenant Credit &amp; Background Screening</li>
                <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-blue-700"/> 24/7 Emergency Maintenance Response Line</li>
                <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-blue-700"/> Direct Deposit Disbursements &amp; Financial Reporting</li>
              </ul>
            </div>
            <a href="#contact" className="bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold py-3 px-6 rounded-xl text-center transition w-fit">
              Owner Management Proposal
            </a>
          </div>

          {/* Tenants Card */}
          <div id="tenants" className="bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="bg-blue-900 text-white w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <Key className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Residents &amp; Tenants</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                Access your tenant portal anytime, anywhere. Pay rent online, request maintenance repairs, and review your lease documents.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs">
                  <FileText className="w-4 h-4 text-blue-700 mb-1" />
                  <span className="font-bold block text-slate-800">Online Payments</span>
                  <span className="text-[10px] text-slate-500">Auto-pay rent securely</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs">
                  <UserCheck className="w-4 h-4 text-blue-700 mb-1" />
                  <span className="font-bold block text-slate-800">Repair Requests</span>
                  <span className="text-[10px] text-slate-500">Direct maintenance queue</span>
                </div>
              </div>
            </div>
            <a href="#tenants" className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-3 px-6 rounded-xl text-center transition w-fit">
              Access Resident Portal
            </a>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-base mb-3">
              <Building2 className="w-5 h-5 text-blue-400" />
              SoCal Property Hub
            </div>
            <p className="text-slate-400 leading-relaxed mb-4">
              Providing premier residential property management throughout Ventura, Santa Barbara, and Los Angeles Counties.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#listings" className="hover:text-white transition">Available Rentals</a></li>
              <li><a href="#owners" className="hover:text-white transition">Property Owner Services</a></li>
              <li><a href="#tenants" className="hover:text-white transition">Resident Portal</a></li>
              <li><Link href="/admin" className="hover:text-white transition">Admin Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-3">Contact Us</h4>
            <p className="mb-1">Phone: (805) 965-2887</p>
            <p className="mb-1">Email: info@socalpropertyhub.com</p>
            <p>Hours: Mon–Fri 9:00 AM – 5:00 PM</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px]">
          <p>&copy; {new Date().getFullYear()} SoCal Property Hub Inc. Equal Housing Opportunity.</p>
          <div className="flex gap-4">
            <span className="hover:text-white">California Apartment Association Member</span>
            <span className="hover:text-white">AppFolio Property Manager</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
