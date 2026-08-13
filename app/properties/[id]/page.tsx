'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { 
  Building2, MapPin, Bed, Bath, 
  Square, ArrowLeft, CheckCircle2, Loader2, Calendar
} from 'lucide-react';

const SUPABASE_URL = 'https://krxgbyjeskputjtuxivw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyeGdieWplc2twdXRqdHV4aXZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1ODQ4MDgsImV4cCI6MjEwMjE2MDgwOH0.fszuxusHVtlYJ0r4OMa65St0dPlMuOnEUUHtA96Cr-8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface UnitDetail {
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
    county: string;
    zip_code: string;
    image_url?: string | null;
    gallery_images?: string[] | null;
  } | null;
}

export default function PropertyDetailPage() {
  const routeParams = useParams();
  const id = Array.isArray(routeParams?.id) ? routeParams.id[0] : routeParams?.id;

  const [unit, setUnit] = useState<UnitDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');

  useEffect(() => {
    async function fetchDetail() {
      if (!id) return;
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('units')
          .select(`
            id, unit_number, rent_amount, bedrooms, bathrooms, sqft, status, amenities,
            properties (name, address, city, county, zip_code, image_url, gallery_images)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        if (data) {
          const detail = data as unknown as UnitDetail;
          setUnit(detail);
          const initialImg = detail.properties?.gallery_images?.[0] || detail.properties?.image_url || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80';
          setSelectedImage(initialImg);
        }
      } catch (err) {
        console.error('Error fetching unit detail:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!unit) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 text-center">
        <p className="text-slate-600">Property listing not found.</p>
        <a href="/" className="text-blue-600 font-semibold underline mt-4 inline-block">Return Home</a>
      </div>
    );
  }

  const gallery = unit.properties?.gallery_images?.length 
    ? unit.properties.gallery_images 
    : [unit.properties?.image_url || selectedImage];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600">
            <ArrowLeft className="w-4 h-4" /> Back to Listings
          </a>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-slate-900">SoCal Property Hub</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Title Row */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">{unit.properties?.name} - {unit.unit_number}</h1>
            <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4 text-slate-400" />
              {unit.properties?.address}, {unit.properties?.city}, CA {unit.properties?.zip_code}
            </p>
          </div>
          <div className="text-left md:text-right">
            <span className="text-3xl font-black text-blue-600">${unit.rent_amount}</span>
            <span className="text-xs text-slate-400 block font-normal">/ month</span>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
          <div className="lg:col-span-3 h-96 lg:h-[480px] bg-slate-200 rounded-2xl overflow-hidden shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selectedImage} alt="Main view" className="w-full h-full object-cover transition-all duration-300" />
          </div>

          <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto max-h-[480px]">
            {gallery.map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(imgUrl)}
                type="button"
                className={`relative h-24 lg:h-28 w-32 lg:w-full rounded-xl overflow-hidden flex-shrink-0 border-2 transition ${
                  selectedImage === imgUrl ? 'border-blue-600 ring-2 ring-blue-600/20' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imgUrl} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Specs & Application Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            
            {/* Specs Bar */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-3 gap-4 text-center">
              <div>
                <Bed className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                <span className="text-xs text-slate-400 block">Bedrooms</span>
                <span className="font-bold text-slate-800">{unit.bedrooms === 0 ? 'Studio' : unit.bedrooms}</span>
              </div>
              <div>
                <Bath className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                <span className="text-xs text-slate-400 block">Bathrooms</span>
                <span className="font-bold text-slate-800">{unit.bathrooms}</span>
              </div>
              <div>
                <Square className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                <span className="text-xs text-slate-400 block">Square Feet</span>
                <span className="font-bold text-slate-800">{unit.sqft || '---'} sqft</span>
              </div>
            </div>

            {/* Amenities List */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4 text-base">Included Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {(unit.amenities || []).map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    {amenity}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar Box */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit space-y-4">
            <h3 className="font-bold text-slate-900 text-lg">Interested in this unit?</h3>
            <p className="text-xs text-slate-500">Schedule an in-person tour or submit a rental application directly online.</p>
            
            <button 
              type="button"
              onClick={() => alert('Tour scheduled!')}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition"
            >
              <Calendar className="w-4 h-4" /> Schedule Tour
            </button>

            <button 
              type="button"
              onClick={() => alert('Application form opened!')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs transition"
            >
              Apply Online Now
            </button>
          </div>

        </div>

      </main>
    </div>
  );
}
