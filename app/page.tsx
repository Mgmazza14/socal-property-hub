'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Building2, MapPin, Bed, Bath, 
  Square, ShieldAlert, Loader2, AlertCircle
} from 'lucide-react';

const SUPABASE_URL = 'https://krxgbyjeskputjtuxivw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyeGdieWplc2twdXRqdHV4aXZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1ODQ4MDgsImV4cCI6MjEwMjE2MDgwOH0.fszuxusHVtlYJ0r4OMa65St0dPlMuOnEUUHtA96Cr-8''; // Your legacy anon key here

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

type County = 'All' | 'Ventura' | 'Los Angeles';

interface PropertyUnit {
  id: string;
  unit_number: string;
  rent_amount: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  status: string;
  amenities: string[];
  properties: {
    name: string;
    address: string;
    city: string;
    county: 'Ventura' | 'Los Angeles';
    image_url?: string;
  } | null;
}

export default function PropertyHomePage() {
  const [properties, setProperties] = useState<PropertyUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedCounty, setSelectedCounty] = useState<County>('All');

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
      } catch (err: any) {
        setErrorMsg(err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    }

    fetchUnits();
  }, []);

  const filteredProperties = properties.filter(unit => {
    return selectedCounty === 'All' || unit.properties?.county === selectedCounty;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* Header Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2.5 rounded-lg shadow-sm">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">SoCal Property Hub</h1>
              <p className="text-xs text-slate-500 font-medium">Ventura & LA County Rentals</p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#listings" className="text-slate-900 hover:text-blue-600 transition">Available Rentals</a>
            <a href="#tenant-portal" className="hover:text-blue-600 transition">Tenant Portal</a>
            <a href="#maintenance" className="hover:text-blue-600 transition">Maintenance</a>
            <a href="#contact" className="hover:text-blue-600 transition">Contact Us</a>
          </nav>

          {/* Action Button */}
          <a href="#pay-rent" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-lg shadow transition">
            Pay Rent Online
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Filter Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Available & Upcoming Vacancies</h2>
            <p className="text-sm text-slate-500 mt-1">Explore current residential openings across Ventura and Los Angeles Counties</p>
          </div>

          <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3 text-xs font-semibold">
            <span className="text-slate-500 px-2">Filter by County:</span>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              {(['All', 'Ventura', 'Los Angeles'] as County[]).map((county) => (
                <button
                  key={county}
                  onClick={() => setSelectedCounty(county)}
                  className={`px-4 py-1.5 rounded-md transition ${
                    selectedCounty === county ? 'bg-white text-blue-600 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
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
          <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
            <div><strong>Database Error:</strong> {errorMsg}</div>
          </div>
        )}

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-3" />
            <p className="text-slate-500 text-xs font-medium">Loading rental listings...</p>
          </div>
        ) : filteredProperties.length > 0 ? (
          
          /* Property Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((unit) => {
              const isComingSoon = unit.status?.toLowerCase().includes('coming');
              const isVentura = unit.properties?.county === 'Ventura';

              return (
                <div key={unit.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
                  
                  {/* Image Container with Badges */}
                  <div className="relative h-48 w-full bg-slate-200 overflow-hidden">
                    <img 
                      src={unit.properties?.image_url || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'} 
                      alt={unit.properties?.name || 'Property'} 
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md text-white shadow-sm ${
                        isComingSoon ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}>
                        {unit.status || 'AVAILABLE NOW'}
                      </span>
                    </div>

                    {/* County Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-900/80 text-white backdrop-blur-sm">
                        {isVentura ? 'Ventura Co.' : 'Los Angeles Co.'}
                      </span>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-1 gap-2">
                        <h3 className="font-bold text-slate-900 text-lg leading-snug">
                          {unit.properties?.name}
                        </h3>
                        <div className="text-right flex-shrink-0">
                          <span className="text-xl font-extrabold text-blue-600">${unit.rent_amount}</span>
                          <span className="text-[11px] text-slate-400 block font-normal">/month</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-5 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        {unit.properties?.address}, {unit.properties?.city}
                      </p>

                      {/* Specs Row */}
                      <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 mb-5 text-xs text-slate-600 font-medium">
                        <div className="flex items-center gap-1.5"><Bed className="w-4 h-4 text-slate-400"/> {unit.bedrooms === 0 ? 'Studio' : `${unit.bedrooms} Bed`}</div>
                        <div className="flex items-center gap-1.5"><Bath className="w-4 h-4 text-slate-400"/> {unit.bathrooms} Bath</div>
                        <div className="flex items-center gap-1.5"><Square className="w-4 h-4 text-slate-400"/> {unit.sqft ? `${unit.sqft} sqft` : '---'}</div>
                      </div>

                      {/* Amenities Pills */}
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {unit.amenities?.map((item, idx) => (
                          <span key={idx} className="bg-slate-100 text-slate-600 text-[11px] font-medium px-2.5 py-1 rounded-md">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button onClick={() => alert(`Scheduling tour for ${unit.properties?.name}`)} className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-3 rounded-xl text-center transition">
                        Schedule Tour
                      </button>
                      <button onClick={() => alert(`Applying online for ${unit.properties?.name}`)} className="bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold py-3 rounded-xl text-center transition">
                        Apply Online
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-500 text-sm">No properties found in this county.</div>
        )}
      </main>

    </div>
  );
}
