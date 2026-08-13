'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Building2, Wrench, CreditCard, MapPin, Bed, Bath, 
  Square, PhoneCall, ShieldAlert, Loader2
} from 'lucide-react';

// Use fallback placeholder URLs to pass Next.js build-time static checks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type County = 'All' | 'Ventura' | 'Los Angeles';

interface PropertyUnit {
  id: string;
  unit_number: string;
  rent_amount: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  status: 'Available Now' | 'Coming Soon' | 'Occupied';
  amenities: string[];
  properties: {
    name: string;
    address: string;
    city: string;
    county: 'Ventura' | 'Los Angeles';
  };
}

export default function PropertyHomePage() {
  const [properties, setProperties] = useState<PropertyUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCounty, setSelectedCounty] = useState<County>('All');

  useEffect(() => {
    async function fetchUnits() {
      try {
        setLoading(true);

        // Don't execute database query if environment keys aren't configured
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
          console.warn('Supabase URL variable missing in Vercel environment.');
          setLoading(false);
          return;
        }

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
            properties (name, address, city, county)
          `);

        if (error) throw error;
        if (data) setProperties(data as unknown as PropertyUnit[]);
      } catch (err) {
        console.error('Error fetching properties from Supabase:', err);
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

      {/* Header */}
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
          <a href="#tenant-portal" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm transition">
            Pay Rent Online
          </a>
        </div>
      </header>

      {/* Available Rentals Section */}
      <section id="listings" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Available & Upcoming Vacancies</h3>
            <p className="text-sm text-slate-500">Live database connection established</p>
          </div>

          <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2 text-xs font-medium">
            <span className="text-slate-500 px-2">Filter by County:</span>
            <div className="flex bg-slate-100 p-1 rounded-md">
              {(['All', 'Ventura', 'Los Angeles'] as County[]).map((county) => (
                <button
                  key={county}
                  onClick={() => setSelectedCounty(county)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                    selectedCounty === county ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {county}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
            <p className="text-slate-500 text-xs">Fetching live listings from Supabase...</p>
          </div>
        ) : filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((unit) => (
              <div key={unit.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-slate-900 text-base">{unit.properties?.name} - {unit.unit_number}</h4>
                      <div className="text-right">
                        <span className="text-lg font-extrabold text-blue-600">${unit.rent_amount}</span>
                        <span className="text-[10px] text-slate-400 block">/month</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 flex items-center gap-1 mb-4">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {unit.properties?.address}, {unit.properties?.city}
                    </p>

                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 mb-4 text-xs text-slate-600">
                      <div className="flex items-center gap-1"><Bed className="w-4 h-4 text-slate-400"/> {unit.bedrooms === 0 ? 'Studio' : `${unit.bedrooms} Bed`}</div>
                      <div className="flex items-center gap-1"><Bath className="w-4 h-4 text-slate-400"/> {unit.bathrooms} Bath</div>
                      <div className="flex items-center gap-1"><Square className="w-4 h-4 text-slate-400"/> {unit.sqft || '---'} sqft</div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {unit.amenities?.map((item, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded">{item}</span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button onClick={() => alert('Tour requested')} className="flex-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2.5 rounded-lg text-center">Schedule Tour</button>
                    <button onClick={() => alert('Application requested')} className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold py-2.5 rounded-lg text-center">Apply Online</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500 text-sm">No properties found.</div>
        )}
      </section>

    </div>
  );
}
