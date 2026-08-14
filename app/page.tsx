'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Home, MapPin, Bed, Bath, 
  Square, Loader2, AlertCircle, ShieldAlert,
  Search, CheckCircle2, Phone, CreditCard, Wrench
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
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    subject: '',
    propertyDescription: '',
    message: ''
  });
  const [submittingContact, setSubmittingContact] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);

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
      } finally {
        setLoading(false);
      }
    }

    fetchUnits();
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingContact(true);
    setContactSuccess(false);
    setContactError(null);

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([{
          first_name: contactForm.firstName,
          last_name: contactForm.lastName,
          phone: contactForm.phone,
          email: contactForm.email,
          subject: contactForm.subject,
          property_description: contactForm.propertyDescription,
          message: contactForm.message
        }]);

      if (error) throw error;

      setContactSuccess(true);
      setContactForm({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        subject: '',
        propertyDescription: '',
        message: ''
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setContactError(err.message);
      } else {
        setContactError('Failed to send message. Please try again.');
      }
    } finally {
      setSubmittingContact(false);
    }
  };

  const filteredProperties = properties.filter((unit) => {
    const matchesCounty = selectedCounty === 'All' || unit.properties?.county === selectedCounty;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
      unit.properties?.name?.toLowerCase().includes(searchLower) ||
      unit.properties?.city?.toLowerCase().includes(searchLower) ||
      unit.properties?.address?.toLowerCase().includes(searchLower);

    return matchesCounty && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between">
      <div>
        
        {/* Top Utility Bar */}
        <div className="bg-slate-900 text-slate-300 text-xs py-2.5 px-4 sm:px-8 border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
            <span className="font-medium text-slate-300">40+ Years of Excellence in SoCal Residential Rentals</span>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                <Phone className="w-3.5 h-3.5 text-blue-400" /> Office: (805) 555-0100
              </span>
              <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <ShieldAlert className="w-3.5 h-3.5" /> Maintenance Hotline: (805) 555-0199
              </span>
            </div>
          </div>
        </div>

        {/* Header Navigation */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            
            {/* Logo */}
            <a href="/" className="flex items-center gap-3">
              <div className="bg-rose-800 text-white p-2.5 rounded-xl shadow-sm">
                <Home className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">Mazza Family Rentals</h1>
                <p className="text-xs text-slate-500 font-medium">Ventura &amp; LA County Residential Rentals</p>
              </div>
            </a>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
              <a href="#listings" className="text-slate-900 hover:text-rose-800 transition">Available Rentals</a>
              <a href="#tenant-portal" className="hover:text-rose-800 transition">Tenant Portal</a>
              <a href="#maintenance" className="hover:text-rose-800 transition">Maintenance</a>
              <a href="#contact" className="hover:text-rose-800 transition">Contact Us</a>
            </nav>

            {/* Action Button */}
            <a href="#pay-rent" className="bg-rose-800 hover:bg-rose-900 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow transition">
              Pay Rent Online
            </a>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative bg-slate-900 text-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=80" 
              alt="Ventura County Coast" 
              className="w-full h-full object-cover opacity-35 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-900/40" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
            <span className="inline-block bg-white/10 text-rose-200 border border-white/20 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-md">
              Ventura &amp; Los Angeles Counties
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              Find Your Quality Residential Rental
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-normal">
              Discover well-maintained apartments, townhomes, and single-family residences across Southern California with seamless online portal management.
            </p>

            {/* Integrated Search & Filter Box */}
            <div className="bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl shadow-2xl text-slate-800 text-left max-w-3xl mx-auto mt-8 border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                
                <div className="md:col-span-6 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input 
                    type="text" 
                    placeholder="Search by city or neighborhood..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-800/30"
                  />
                </div>

                <div className="md:col-span-4">
                  <div className="flex bg-slate-100 p-1 rounded-xl">
                    {(['All', 'Ventura', 'Los Angeles'] as County[]).map((county) => (
                      <button
                        key={county}
                        onClick={() => setSelectedCounty(county)}
                        type="button"
                        className={`flex-1 py-2 text-[11px] font-bold rounded-lg transition ${
                          selectedCounty === county 
                            ? 'bg-white text-rose-800 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {county === 'Los Angeles' ? 'LA' : county}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <a 
                    href="#listings" 
                    className="w-full bg-rose-800 hover:bg-rose-900 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center transition shadow-md"
                  >
                    View ({filteredProperties.length})
                  </a>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Value Badges Section */}
        <section className="bg-white border-b border-slate-200 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center gap-3 text-slate-700">
              <CreditCard className="w-5 h-5 text-rose-800 flex-shrink-0" />
              <span className="text-xs font-semibold">Easy Online Rent Payments &amp; Auto-Pay</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-slate-700">
              <Wrench className="w-5 h-5 text-rose-800 flex-shrink-0" />
              <span className="text-xs font-semibold">24/7 Dedicated Maintenance Response</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-slate-700">
              <CheckCircle2 className="w-5 h-5 text-rose-800 flex-shrink-0" />
              <span className="text-xs font-semibold">40+ Years of SoCal Residential Experience</span>
            </div>
          </div>
        </section>

        {/* Main Listings Grid */}
        <main id="listings" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-slate-200 pb-5">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Available &amp; Upcoming Vacancies</h2>
              <p className="text-xs text-slate-500 mt-1">Showing active rental openings across Ventura &amp; Los Angeles Counties</p>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 self-start md:self-auto">
              {filteredProperties.length} Properties Available
            </span>
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
              <Loader2 className="w-10 h-10 text-rose-800 animate-spin mb-3" />
              <p className="text-slate-500 text-xs font-medium">Loading rental inventory...</p>
            </div>
          ) : filteredProperties.length > 0 ? (
            
            /* Property Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((unit) => {
                const isComingSoon = unit.status?.toLowerCase().includes('coming');
                const isVentura = unit.properties?.county === 'Ventura';

                return (
                  <div key={unit.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
                    
                    <a href={`/properties/${unit.id}`} className="relative h-52 w-full bg-slate-200 overflow-hidden block group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={unit.properties?.image_url || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'} 
                        alt={unit.properties?.name || 'Property'} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md text-white shadow-sm ${
                          isComingSoon ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}>
                          {unit.status || 'AVAILABLE NOW'}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-900/80 text-white backdrop-blur-sm">
                          {isVentura ? 'Ventura Co.' : 'Los Angeles Co.'}
                        </span>
                      </div>
                    </a>

                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-1 gap-2">
                          <a href={`/properties/${unit.id}`} className="font-bold text-slate-900 text-lg leading-snug hover:text-rose-800 transition">
                            {unit.properties?.name}
                          </a>
                          <div className="text-right flex-shrink-0">
                            <span className="text-xl font-black text-rose-800">${unit.rent_amount}</span>
                            <span className="text-[11px] text-slate-400 block font-normal">/month</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-5 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          {unit.properties?.address}, {unit.properties?.city}
                        </p>

                        <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 mb-5 text-xs text-slate-600 font-medium">
                          <div className="flex items-center gap-1.5"><Bed className="w-4 h-4 text-slate-400"/> {unit.bedrooms === 0 ? 'Studio' : `${unit.bedrooms} Bed`}</div>
                          <div className="flex items-center gap-1.5"><Bath className="w-4 h-4 text-slate-400"/> {unit.bathrooms} Bath</div>
                          <div className="flex items-center gap-1.5"><Square className="w-4 h-4 text-slate-400"/> {unit.sqft ? `${unit.sqft} sqft` : '---'}</div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {(unit.amenities || []).map((item, idx) => (
                            <span key={idx} className="bg-slate-100 text-slate-600 text-[11px] font-medium px-2.5 py-1 rounded-md">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <a href={`/properties/${unit.id}`} className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-3 rounded-xl text-center transition">
                          View Details
                        </a>
                        <a href={`/properties/${unit.id}`} className="bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold py-3 rounded-xl text-center transition">
                          Apply Online
                        </a>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-500 text-sm bg-white rounded-2xl border border-slate-200">
              No properties found matching your search criteria. Try clearing filters.
            </div>
          )}
        </main>

        {/* Contact Us Today Section */}
        <section id="contact" className="bg-white border-t border-slate-200 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            
            <h2 className="text-3xl sm:text-4xl font-serif text-slate-900 tracking-tight">Contact Us Today</h2>
            <div className="w-12 h-0.5 bg-rose-800 mx-auto my-4" />
            <p className="text-slate-600 text-sm sm:text-base font-light mb-10">
              Let us know how we can be of assistance. We look forward to hearing from you!
            </p>

            {contactSuccess && (
              <div className="p-4 mb-8 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl font-medium flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Thank you! Your message has been received. We will get back to you shortly.
              </div>
            )}

            {contactError && (
              <div className="p-4 mb-8 bg-red-50 border border-red-200 text-red-800 text-sm rounded-xl font-medium flex items-center justify-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                {contactError}
              </div>
            )}

            <form onSubmit={handleContactSubmit} className="space-y-6 text-left">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-slate-700 text-sm font-normal mb-2">Full name</label>
                  <input 
                    required
                    type="text" 
                    value={contactForm.firstName}
                    onChange={(e) => setContactForm({ ...contactForm, firstName: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-rose-800/60 rounded-none focus:outline-none focus:border-rose-800 focus:ring-1 focus:ring-rose-800 text-sm text-slate-800 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 text-sm font-normal mb-2">Last Name</label>
                  <input 
                    required
                    type="text" 
                    value={contactForm.lastName}
                    onChange={(e) => setContactForm({ ...contactForm, lastName: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-rose-800/60 rounded-none focus:outline-none focus:border-rose-800 focus:ring-1 focus:ring-rose-800 text-sm text-slate-800 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-slate-700 text-sm font-normal mb-2">Phone</label>
                  <input 
                    type="tel" 
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-rose-800/60 rounded-none focus:outline-none focus:border-rose-800 focus:ring-1 focus:ring-rose-800 text-sm text-slate-800 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 text-sm font-normal mb-2">Email</label>
                  <input 
                    required
                    type="email" 
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-rose-800/60 rounded-none focus:outline-none focus:border-rose-800 focus:ring-1 focus:ring-rose-800 text-sm text-slate-800 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-slate-700 text-sm font-normal mb-2">Subject / Inquiry Type</label>
                  <input 
                    type="text" 
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-rose-800/60 rounded-none focus:outline-none focus:border-rose-800 focus:ring-1 focus:ring-rose-800 text-sm text-slate-800 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 text-sm font-normal mb-2">Description of Property(s)</label>
                  <input 
                    type="text" 
                    value={contactForm.propertyDescription}
                    onChange={(e) => setContactForm({ ...contactForm, propertyDescription: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-rose-800/60 rounded-none focus:outline-none focus:border-rose-800 focus:ring-1 focus:ring-rose-800 text-sm text-slate-800 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 text-sm font-normal mb-2">Message Or Questions</label>
                <textarea 
                  required
                  rows={5}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-rose-800/60 rounded-none focus:outline-none focus:border-rose-800 focus:ring-1 focus:ring-rose-800 text-sm text-slate-800 bg-white"
                />
              </div>

              <div className="text-center pt-4">
                <button 
                  type="submit" 
                  disabled={submittingContact}
                  className="bg-rose-800 hover:bg-rose-900 text-white font-normal px-12 py-3.5 text-base tracking-wide transition shadow-sm disabled:opacity-50"
                >
                  {submittingContact ? 'Sending...' : 'Submit'}
                </button>
              </div>

            </form>

          </div>
        </section>

      </div>

      {/* Custom Burgundy Footer Section */}
      <footer className="bg-rose-900 text-white py-14 px-4 sm:px-6 lg:px-8 border-t border-rose-950">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* Brand & Address Column */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="bg-white text-rose-900 p-2 rounded-xl shadow-sm">
                <Home className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold tracking-tight">Mazza Family Rentals</h3>
              </div>
            </div>
            
            <div className="text-sm text-rose-100 font-light space-y-1 pt-2">
              <p>(805) 555-0100</p>
              <p className="pt-1">Ventura &amp; Los Angeles Counties, CA</p>
            </div>
          </div>

          {/* Links Column */}
          <div className="space-y-3">
            <h4 className="text-lg font-serif font-bold tracking-wide text-white">Links</h4>
            <ul className="space-y-2 text-sm text-rose-100 font-light">
              <li><a href="/" className="hover:text-white transition">Home</a></li>
              <li><a href="#listings" className="hover:text-white transition">Rental Listings</a></li>
              <li><a href="#tenant-portal" className="hover:text-white transition">Tenants</a></li>
              <li><a href="#contact" className="hover:text-white transition">Contact</a></li>
            </ul>
          </div>

          {/* Sign In Column */}
          <div className="space-y-3">
            <h4 className="text-lg font-serif font-bold tracking-wide text-white">Sign in</h4>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-rose-200">Tenants</p>
              <a href="#pay-rent" className="inline-block text-sm text-rose-100 hover:text-white underline transition">
                Log In
              </a>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-rose-800/60 text-center text-xs text-rose-200 font-light">
          © {new Date().getFullYear()} Mazza Family Rentals. All rights reserved.
        </div>
      </footer>

    </div>
  );
}
