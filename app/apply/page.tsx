'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Home, ArrowLeft, CheckCircle2, AlertCircle, FileText, Send, Phone } from 'lucide-react';

const SUPABASE_URL = 'https://krxgbyjeskputjtuxivw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyeGdieWplc2twdXRqdHV4aXZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1ODQ4MDgsImV4cCI6MjEwMjE2MDgwOH0.fszuxusHVtlYJ0r4OMa65St0dPlMuOnEUUHtA96Cr-8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function ApplicationForm() {
  const searchParams = useSearchParams();
  const defaultProperty = searchParams.get('property') || '';
  const defaultUnit = searchParams.get('unit') || '';

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    propertyName: defaultProperty,
    unitNumber: defaultUnit,
    monthlyIncome: '',
    moveInDate: '',
    occupants: '1',
    pets: 'No',
    employmentInfo: '',
    comments: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);
    setErrorMsg(null);

    try {
      const { error } = await supabase
        .from('applications')
        .insert([{
          first_name: form.firstName,
          last_name: form.lastName,
          email: form.email,
          phone: form.phone,
          property_name: form.propertyName,
          unit_number: form.unitNumber,
          monthly_income: form.monthlyIncome ? Number(form.monthlyIncome) : null,
          move_in_date: form.moveInDate || null,
          occupants: Number(form.occupants),
          pets: form.pets,
          employment_info: form.employmentInfo,
          comments: form.comments
        }]);

      if (error) throw error;

      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Failed to submit application. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm">
      
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
        <a href="/" className="text-xs font-bold text-slate-500 hover:text-rose-800 flex items-center gap-1.5 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Rentals
        </a>
        <div className="flex items-center gap-2">
          <Home className="w-5 h-5 text-rose-800" />
          <span className="font-serif font-bold text-slate-900 text-sm">Mazza Family Rentals</span>
        </div>
      </div>

      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center bg-rose-50 text-rose-800 p-3 rounded-2xl mb-3">
          <FileText className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">Online Rental Application</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
          Please complete all required fields below to submit your rental application to Mazza Family Rentals.
        </p>
      </div>

      {success ? (
        <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h2 className="text-xl font-bold text-emerald-900">Application Submitted Successfully!</h2>
          <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto">
            Thank you for applying. Our team will review your information and reach out to you directly at <strong>{form.email}</strong> or <strong>(805) 889-3999</strong>.
          </p>
          <div className="pt-4">
            <a href="/" className="bg-rose-800 hover:bg-rose-900 text-white font-bold px-6 py-2.5 rounded-xl text-xs inline-block transition">
              Return to Website
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 text-xs sm:text-sm font-medium">
          
          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {errorMsg}
            </div>
          )}

          {/* Property Selection */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-rose-800">1. Desired Property</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 mb-1">Property Name / Address</label>
                <input 
                  required 
                  type="text" 
                  placeholder="e.g. Coastal Palms Apartment" 
                  value={form.propertyName} 
                  onChange={e => setForm({...form, propertyName: e.target.value})} 
                  className="w-full p-3 border border-slate-200 rounded-xl bg-white" 
                />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">Unit Number (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Apt 3B" 
                  value={form.unitNumber} 
                  onChange={e => setForm({...form, unitNumber: e.target.value})} 
                  className="w-full p-3 border border-slate-200 rounded-xl bg-white" 
                />
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="space-y-4 pt-2">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-rose-800">2. Applicant Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 mb-1">First Name *</label>
                <input 
                  required 
                  type="text" 
                  value={form.firstName} 
                  onChange={e => setForm({...form, firstName: e.target.value})} 
                  className="w-full p-3 border border-slate-200 rounded-xl" 
                />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">Last Name *</label>
                <input 
                  required 
                  type="text" 
                  value={form.lastName} 
                  onChange={e => setForm({...form, lastName: e.target.value})} 
                  className="w-full p-3 border border-slate-200 rounded-xl" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 mb-1">Email Address *</label>
                <input 
                  required 
                  type="email" 
                  value={form.email} 
                  onChange={e => setForm({...form, email: e.target.value})} 
                  className="w-full p-3 border border-slate-200 rounded-xl" 
                />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">Phone Number *</label>
                <input 
                  required 
                  type="tel" 
                  placeholder="(805) 889-3999"
                  value={form.phone} 
                  onChange={e => setForm({...form, phone: e.target.value})} 
                  className="w-full p-3 border border-slate-200 rounded-xl" 
                />
              </div>
            </div>
          </div>

          {/* Household & Financial Info */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-rose-800 pt-2">3. Household &amp; Employment</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-700 mb-1">Gross Monthly Income ($)</label>
                <input 
                  type="number" 
                  placeholder="5000"
                  value={form.monthlyIncome} 
                  onChange={e => setForm({...form, monthlyIncome: e.target.value})} 
                  className="w-full p-3 border border-slate-200 rounded-xl" 
                />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">Desired Move-In Date</label>
                <input 
                  type="date" 
                  value={form.moveInDate} 
                  onChange={e => setForm({...form, moveInDate: e.target.value})} 
                  className="w-full p-3 border border-slate-200 rounded-xl bg-white" 
                />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">Total Occupants</label>
                <select 
                  value={form.occupants} 
                  onChange={e => setForm({...form, occupants: e.target.value})} 
                  className="w-full p-3 border border-slate-200 rounded-xl bg-white"
                >
                  <option value="1">1 Person</option>
                  <option value="2">2 People</option>
                  <option value="3">3 People</option>
                  <option value="4">4+ People</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 mb-1">Pets Information</label>
                <input 
                  type="text" 
                  placeholder="e.g. 1 small dog (20 lbs) or None" 
                  value={form.pets} 
                  onChange={e => setForm({...form, pets: e.target.value})} 
                  className="w-full p-3 border border-slate-200 rounded-xl" 
                />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">Employer / Occupation</label>
                <input 
                  type="text" 
                  placeholder="e.g. Software Engineer at XYZ Inc" 
                  value={form.employmentInfo} 
                  onChange={e => setForm({...form, employmentInfo: e.target.value})} 
                  className="w-full p-3 border border-slate-200 rounded-xl" 
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 mb-1">Additional Notes or Questions</label>
              <textarea 
                rows={3} 
                placeholder="Any special requests or information for our review..."
                value={form.comments} 
                onChange={e => setForm({...form, comments: e.target.value})} 
                className="w-full p-3 border border-slate-200 rounded-xl" 
              />
            </div>
          </div>

          <button 
            disabled={submitting}
            type="submit" 
            className="w-full bg-rose-800 hover:bg-rose-900 text-white font-bold py-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-md disabled:opacity-50 mt-8"
          >
            <Send className="w-4 h-4" /> {submitting ? 'Submitting Application...' : 'Submit Application Now'}
          </button>

        </form>
      )}

    </div>
  );
}

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 sm:p-8">
      <Suspense fallback={<div className="text-center py-20 text-xs text-slate-500">Loading form...</div>}>
        <ApplicationForm />
      </Suspense>
    </div>
  );
}
