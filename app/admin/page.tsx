'use client';

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft, PlusCircle, CheckCircle2 } from 'lucide-react';

const SUPABASE_URL = 'https://krxgbyjeskputjtuxivw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyeGdieWplc2twdXRqdHV4aXZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1ODQ4MDgsImV4cCI6MjEwMjE2MDgwOH0.fszuxusHVtlYJ0r4OMa65St0dPlMuOnEUUHtA96Cr-8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function AdminAddPropertyPage() {
  const [form, setForm] = useState({
    propertyName: '',
    address: '',
    city: '',
    county: 'Ventura',
    zipCode: '',
    unitNumber: 'Apt 101',
    rentAmount: '2500',
    bedrooms: '2',
    bathrooms: '1.5',
    sqft: '900',
    imageUrl: '',
    amenities: 'Parking, In-Unit Laundry, Balcony'
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      const { data: propData, error: propErr } = await supabase
        .from('properties')
        .insert([{
          name: form.propertyName,
          address: form.address,
          city: form.city,
          county: form.county,
          zip_code: form.zipCode,
          image_url: form.imageUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
          gallery_images: form.imageUrl ? [form.imageUrl] : []
        }])
        .select()
        .single();

      if (propErr) throw propErr;

      const { error: unitErr } = await supabase
        .from('units')
        .insert([{
          property_id: propData.id,
          unit_number: form.unitNumber,
          rent_amount: Number(form.rentAmount),
          bedrooms: Number(form.bedrooms),
          bathrooms: Number(form.bathrooms),
          sqft: Number(form.sqft),
          status: 'Available Now',
          amenities: form.amenities.split(',').map(s => s.trim())
        }]);

      if (unitErr) throw unitErr;

      setSuccess(true);
      setForm({
        propertyName: '', address: '', city: '', county: 'Ventura', zipCode: '',
        unitNumber: 'Apt 101', rentAmount: '2500', bedrooms: '2', bathrooms: '1.5',
        sqft: '900', imageUrl: '', amenities: 'Parking, In-Unit Laundry'
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert('Error adding property: ' + err.message);
      } else {
        alert('An unexpected error occurred.');
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        
        <div className="flex items-center justify-between mb-6">
          <a href="/" className="text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to Website
          </a>
          <span className="text-xs font-black uppercase tracking-wider bg-blue-50 text-blue-600 px-3 py-1 rounded-md">
            Admin Portal
          </span>
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Add New Property Listing</h1>
        <p className="text-xs text-slate-500 mb-8">Fill out the form below to immediately publish a new rental onto your live website.</p>

        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            Property successfully published to Supabase!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 mb-1">Property Name</label>
              <input required type="text" placeholder="e.g. Pacific Breezes" value={form.propertyName} onChange={e => setForm({...form, propertyName: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl" />
            </div>
            <div>
              <label className="block text-slate-700 mb-1">Unit Number</label>
              <input required type="text" placeholder="e.g. Unit 4B" value={form.unitNumber} onChange={e => setForm({...form, unitNumber: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-slate-700 mb-1">Street Address</label>
              <input required type="text" placeholder="e.g. 100 Main St" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl" />
            </div>
            <div>
              <label className="block text-slate-700 mb-1">City</label>
              <input required type="text" placeholder="e.g. Ventura" value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 mb-1">County</label>
              <select value={form.county} onChange={e => setForm({...form, county: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl bg-white">
                <option value="Ventura">Ventura</option>
                <option value="Los Angeles">Los Angeles</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 mb-1">Zip Code</label>
              <input required type="text" placeholder="93001" value={form.zipCode} onChange={e => setForm({...form, zipCode: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl" />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-slate-700 mb-1">Rent ($)</label>
              <input required type="number" value={form.rentAmount} onChange={e => setForm({...form, rentAmount: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl" />
            </div>
            <div>
              <label className="block text-slate-700 mb-1">Beds</label>
              <input required type="number" value={form.bedrooms} onChange={e => setForm({...form, bedrooms: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl" />
            </div>
            <div>
              <label className="block text-slate-700 mb-1">Baths</label>
              <input required type="number" step="0.5" value={form.bathrooms} onChange={e => setForm({...form, bathrooms: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl" />
            </div>
            <div>
              <label className="block text-slate-700 mb-1">Sq Ft</label>
              <input required type="number" value={form.sqft} onChange={e => setForm({...form, sqft: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl" />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 mb-1">Image URL</label>
            <input type="text" placeholder="https://images.unsplash.com/photo-..." value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl" />
          </div>

          <div>
            <label className="block text-slate-700 mb-1">Amenities (Comma separated)</label>
            <input type="text" placeholder="Pool, Garage, Balcony" value={form.amenities} onChange={e => setForm({...form, amenities: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl" />
          </div>

          <button 
            disabled={saving} 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-3.5 rounded-xl text-xs flex items-center justify-center gap-2 transition mt-6"
          >
            <PlusCircle className="w-4 h-4" /> {saving ? 'Publishing...' : 'Publish Listing'}
          </button>

        </form>
      </div>
    </div>
  );
}
