'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Home, ArrowLeft, CheckCircle2, AlertCircle, DollarSign, Send, CreditCard, ShieldCheck } from 'lucide-react';

const SUPABASE_URL = 'https://krxgbyjeskputjtuxivw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyeGdieWplc2twdXRqdHV4aXZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1ODQ4MDgsImV4cCI6MjEwMjE2MDgwOH0.fszuxusHVtlYJ0r4OMa65St0dPlMuOnEUUHtA96Cr-8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function PayRentForm() {
  const searchParams = useSearchParams();
  const defaultProperty = searchParams.get('property') || '';
  const defaultUnit = searchParams.get('unit') || '';

  const [form, setForm] = useState({
    residentName: '',
    email: '',
    phone: '',
    propertyName: defaultProperty,
    unitNumber: defaultUnit,
    paymentAmount: '',
    paymentMethod: 'eCheck / ACH Bank Transfer',
    paymentDate: new Date().toISOString().split('T')[0],
    billingZip: '',
    notes: '',
    authorized: false
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.authorized) {
      setErrorMsg('Please check the authorization box to proceed with the payment.');
      return;
    }

    setSubmitting(true);
    setSuccess(false);
    setErrorMsg(null);

    try {
      const { error } = await supabase
        .from('rent_payments')
        .insert([{
          resident_name: form.residentName,
          email: form.email,
          phone: form.phone,
          property_name: form.propertyName,
          unit_number: form.unitNumber,
          payment_amount: form.paymentAmount ? Number(form.paymentAmount) : null,
          payment_method: form.paymentMethod,
          payment_date: form.paymentDate || null,
          billing_zip: form.billingZip,
          notes: form.notes
        }]);

      if (error) throw error;

      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Failed to process payment request. Please check required fields.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
        <a href="/" className="text-xs font-bold text-slate-500 hover:text-cyan-900 flex items-center gap-1.5 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </a>
        <div className="flex items-center gap-2">
          <Home className="w-5 h-5 text-cyan-900" />
          <span className="font-serif font-bold text-slate-900 text-sm">Mazza Family Rentals</span>
        </div>
      </div>

      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center bg-sky-50 text-cyan-900 p-3 rounded-2xl mb-3">
          <DollarSign className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">Resident Rent Payment Portal</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-lg mx-auto">
          Submit online rent payments securely for your Mazza Family Rentals property.
        </p>
      </div>

      {success ? (
        <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h2 className="text-xl font-bold text-emerald-900">Payment Submitted Successfully!</h2>
          <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto">
            Your payment receipt has been submitted for <strong>{form.propertyName} (Unit {form.unitNumber})</strong>. A confirmation copy will be sent to <strong>{form.email}</strong>.
          </p>
          <div className="pt-4">
            <a href="/" className="bg-cyan-900 hover:bg-cyan-950 text-white font-bold px-6 py-2.5 rounded-xl text-xs inline-block transition">
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

          {/* Section 1: Property & Resident Info */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-cyan-900 flex items-center gap-2">
              <Home className="w-4 h-4" /> 1. Resident &amp; Unit Information
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 mb-1">Resident Full Name *</label>
                <input 
                  required 
                  type="text" 
                  placeholder="e.g. John Doe" 
                  value={form.residentName} 
                  onChange={e => setForm({...form, residentName: e.target.value})} 
                  className="w-full p-3 border border-slate-200 rounded-xl bg-white" 
                />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">Email Address *</label>
                <input 
                  required 
                  type="email" 
                  placeholder="john@example.com" 
                  value={form.email} 
                  onChange={e => setForm({...form, email: e.target.value})} 
                  className="w-full p-3 border border-slate-200 rounded-xl bg-white" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-700 mb-1">Phone Number *</label>
                <input 
                  required 
                  type="tel" 
                  placeholder="(805) 889-3999" 
                  value={form.phone} 
                  onChange={e => setForm({...form, phone: e.target.value})} 
                  className="w-full p-3 border border-slate-200 rounded-xl bg-white" 
                />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">Property Name / Address *</label>
                <input 
                  required 
                  type="text" 
                  placeholder="e.g. Coastal Palms" 
                  value={form.propertyName} 
                  onChange={e => setForm({...form, propertyName: e.target.value})} 
                  className="w-full p-3 border border-slate-200 rounded-xl bg-white" 
                />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">Unit Number *</label>
                <input 
                  required 
                  type="text" 
                  placeholder="Apt 3B" 
                  value={form.unitNumber} 
                  onChange={e => setForm({...form, unitNumber: e.target.value})} 
                  className="w-full p-3 border border-slate-200 rounded-xl bg-white" 
                />
              </div>
            </div>
          </div>

          {/* Section 2: Payment Details */}
          <div className="space-y-4 pt-2">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-cyan-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <CreditCard className="w-4 h-4" /> 2. Payment Amount &amp; Method
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-700 mb-1">Payment Amount ($) *</label>
                <input 
                  required 
                  type="number" 
                  placeholder="2450" 
                  value={form.paymentAmount} 
                  onChange={e => setForm({...form, paymentAmount: e.target.value})} 
                  className="w-full p-3 border border-slate-200 rounded-xl" 
                />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">Payment Method</label>
                <select 
                  value={form.paymentMethod} 
                  onChange={e => setForm({...form, paymentMethod: e.target.value})} 
                  className="w-full p-3 border border-slate-200 rounded-xl bg-white"
                >
                  <option value="eCheck / ACH Bank Transfer">eCheck / ACH Bank Transfer (Free)</option>
                  <option value="Debit / Credit Card">Debit / Credit Card</option>
                  <option value="Auto-Pay Enrollment">Set Up Monthly Auto-Pay</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 mb-1">Payment Date</label>
                <input 
                  type="date" 
                  value={form.paymentDate} 
                  onChange={e => setForm({...form, paymentDate: e.target.value})} 
                  className="w-full p-3 border border-slate-200 rounded-xl bg-white" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 mb-1">Billing Zip Code *</label>
                <input 
                  required 
                  type="text" 
                  placeholder="93001" 
                  value={form.billingZip} 
                  onChange={e => setForm({...form, billingZip: e.target.value})} 
                  className="w-full p-3 border border-slate-200 rounded-xl" 
                />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">Notes / Payment Memo (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. August Rent + Garage Fee" 
                  value={form.notes} 
                  onChange={e => setForm({...form, notes: e.target.value})} 
                  className="w-full p-3 border border-slate-200 rounded-xl" 
                />
              </div>
            </div>
          </div>

          {/* Section 3: Authorization */}
          <div className="p-5 bg-sky-50/60 border border-sky-200 rounded-2xl space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-cyan-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Payment Authorization
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
              By checking the box below, you authorize Mazza Family Rentals to process the stated rent payment for your specified unit.
            </p>

            <label className="flex items-start gap-3 pt-2 text-xs font-bold text-slate-900 cursor-pointer">
              <input 
                type="checkbox" 
                required 
                checked={form.authorized} 
                onChange={e => setForm({...form, authorized: e.target.checked})} 
                className="w-4 h-4 text-cyan-900 rounded mt-0.5 flex-shrink-0" 
              />
              I authorize the rent payment charge for the amount listed above.
            </label>
          </div>

          <button 
            disabled={submitting}
            type="submit" 
            className="w-full bg-cyan-900 hover:bg-cyan-950 text-white font-bold py-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-md disabled:opacity-50 mt-8"
          >
            <Send className="w-4 h-4" /> {submitting ? 'Processing Payment...' : 'Submit Rent Payment'}
          </button>

        </form>
      )}

    </div>
  );
}

export default function PayRentPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 sm:p-8">
      <Suspense fallback={<div className="text-center py-20 text-xs text-slate-500">Loading payment portal...</div>}>
        <PayRentForm />
      </Suspense>
    </div>
  );
}
