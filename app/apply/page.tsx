'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { 
  Home, ArrowLeft, CheckCircle2, AlertCircle, 
  FileText, Send, ShieldCheck, UserCheck, 
  Briefcase, Car, HelpCircle 
} from 'lucide-react';

const SUPABASE_URL = 'https://krxgbyjeskputjtuxivw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyeGdieWplc2twdXRqdHV4aXZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1ODQ4MDgsImV4cCI6MjEwMjE2MDgwOH0.fszuxusHVtlYJ0r4OMa65St0dPlMuOnEUUHtA96Cr-8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function ApplicationForm() {
  const searchParams = useSearchParams();
  const defaultProperty = searchParams.get('property') || '';
  const defaultUnit = searchParams.get('unit') || '';

  const [form, setForm] = useState({
    propertyName: defaultProperty,
    unitNumber: defaultUnit,
    desiredMoveIn: '',
    firstName: '',
    middleName: '',
    lastName: '',
    dob: '',
    ssnItin: '',
    dlNumber: '',
    dlState: 'CA',
    phone: '',
    email: '',
    currentAddress: '',
    currentCity: '',
    currentState: 'CA',
    currentZip: '',
    currentResidenceType: 'Rent',
    currentDates: '',
    currentLandlordName: '',
    currentLandlordPhone: '',
    currentReasonLeaving: '',
    previousAddress: '',
    previousLandlordName: '',
    previousLandlordPhone: '',
    employerName: '',
    position: '',
    supervisorName: '',
    supervisorPhone: '',
    employmentLength: '',
    monthlyGrossIncome: '',
    additionalIncome: '',
    additionalIncomeSource: '',
    otherOccupants: '',
    pets: '',
    vehicles: '',
    emergencyContactName: '',
    emergencyContactRel: '',
    emergencyContactPhone: '',
    evicted: false,
    bankrupt: false,
    felony: false,
    smoker: false,
    screeningNotes: '',
    authorizedSignature: false
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.authorizedSignature) {
      setErrorMsg('You must check the authorization box confirming truthfulness and screening approval.');
      return;
    }

    setSubmitting(true);
    setSuccess(false);
    setErrorMsg(null);

    try {
      const { error } = await supabase
        .from('applications')
        .insert([{
          property_name: form.propertyName,
          unit_number: form.unitNumber,
          desired_move_in: form.desiredMoveIn || null,
          first_name: form.firstName,
          middle_name: form.middleName,
          last_name: form.lastName,
          dob: form.dob || null,
          ssn_itin: form.ssnItin,
          dl_number: form.dlNumber,
          dl_state: form.dlState,
          phone: form.phone,
          email: form.email,
          current_address: form.currentAddress,
          current_city: form.currentCity,
          current_state: form.currentState,
          current_zip: form.currentZip,
          current_residence_type: form.currentResidenceType,
          current_dates: form.currentDates,
          current_landlord_name: form.currentLandlordName,
          current_landlord_phone: form.currentLandlordPhone,
          current_reason_leaving: form.currentReasonLeaving,
          previous_address: form.previousAddress,
          previous_landlord_name: form.previousLandlordName,
          previous_landlord_phone: form.previousLandlordPhone,
          employer_name: form.employerName,
          position: form.position,
          supervisor_name: form.supervisorName,
          supervisor_phone: form.supervisorPhone,
          employment_length: form.employmentLength,
          monthly_gross_income: form.monthlyGrossIncome ? Number(form.monthlyGrossIncome) : null,
          additional_income: form.additionalIncome,
          additional_income_source: form.additionalIncomeSource,
          other_occupants: form.otherOccupants,
          pets: form.pets,
          vehicles: form.vehicles,
          emergency_contact_name: form.emergencyContactName,
          emergency_contact_rel: form.emergencyContactRel,
          emergency_contact_phone: form.emergencyContactPhone,
          evicted: form.evicted,
          bankrupt: form.bankrupt,
          felony: form.felony,
          smoker: form.smoker,
          screening_notes: form.screeningNotes,
          authorized_signature: form.authorizedSignature
        }]);

      if (error) throw error;

      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Failed to submit application. Please check form fields.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm">
      
      {/* Header */}
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
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">California Residential Rental Application</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-lg mx-auto">
          Standard Application for Screening &amp; Rental Qualification (California Civil Code Compliant)
        </p>
      </div>

      {success ? (
        <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h2 className="text-xl font-bold text-emerald-900">Application Submitted Successfully</h2>
          <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto">
            Your application has been submitted to Mazza Family Rentals. We will review your application and contact you at <strong>{form.email}</strong> or <strong>(805) 889-3999</strong>.
          </p>
          <div className="pt-4">
            <a href="/" className="bg-rose-800 hover:bg-rose-900 text-white font-bold px-6 py-2.5 rounded-xl text-xs inline-block transition">
              Return to Website
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8 text-xs sm:text-sm font-medium">
          
          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {errorMsg}
            </div>
          )}

          {/* Section 1 */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-rose-800 flex items-center gap-2">
              <Home className="w-4 h-4" /> 1. Application Property Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-slate-700 mb-1">Property Name / Address *</label>
                <input 
                  required 
                  type="text" 
                  placeholder="e.g. Coastal Palms Apartment, Ventura CA" 
                  value={form.propertyName} 
                  onChange={e => setForm({...form, propertyName: e.target.value})} 
                  className="w-full p-3 border border-slate-200 rounded-xl bg-white" 
                />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">Unit # &amp; Move-In Date</label>
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text" 
                    placeholder="Apt 3B" 
                    value={form.unitNumber} 
                    onChange={e => setForm({...form, unitNumber: e.target.value})} 
                    className="w-full p-3 border border-slate-200 rounded-xl bg-white" 
                  />
                  <input 
                    type="date" 
                    value={form.desiredMoveIn} 
                    onChange={e => setForm({...form, desiredMoveIn: e.target.value})} 
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-xs" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-rose-800 flex items-center gap-2 border-b border-slate-100 pb-2">
              <UserCheck className="w-4 h-4" /> 2. Applicant Identification
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-700 mb-1">First Name *</label>
                <input required type="text" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">Middle Name</label>
                <input type="text" value={form.middleName} onChange={e => setForm({...form, middleName: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">Last Name *</label>
                <input required type="text" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-slate-700 mb-1">Date of Birth *</label>
                <input required type="date" value={form.dob} onChange={e => setForm({...form, dob: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">SSN or ITIN *</label>
                <input required type="text" placeholder="XXX-XX-XXXX" value={form.ssnItin} onChange={e => setForm({...form, ssnItin: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">Driver License / ID #</label>
                <input type="text" value={form.dlNumber} onChange={e => setForm({...form, dlNumber: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">DL State</label>
                <input type="text" value={form.dlState} onChange={e => setForm({...form, dlState: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 mb-1">Phone Number *</label>
                <input required type="tel" placeholder="(805) 889-3999" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">Email Address *</label>
                <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl" />
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-rose-800 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Home className="w-4 h-4" /> 3. Residence History (Current &amp; Previous)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-slate-700 mb-1">Current Address *</label>
                <input required type="text" placeholder="123 Main St" value={form.currentAddress} onChange={e => setForm({...form, currentAddress: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">City, State, Zip *</label>
                <div className="grid grid-cols-3 gap-1">
                  <input required type="text" placeholder="Ventura" value={form.currentCity} onChange={e => setForm({...form, currentCity: e.target.value})} className="p-3 border border-slate-200 rounded-xl text-xs" />
                  <input required type="text" placeholder="CA" value={form.currentState} onChange={e => setForm({...form, currentState: e.target.value})} className="p-3 border border-slate-200 rounded-xl text-xs" />
                  <input required type="text" placeholder="93001" value={form.currentZip} onChange={e => setForm({...form, currentZip: e.target.value})} className="p-3 border border-slate-200 rounded-xl text-xs" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-700 mb-1">Dates of Residence</label>
                <input type="text" placeholder="e.g. Jan 2022 - Present" value={form.currentDates} onChange={e => setForm({...form, currentDates: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">Current Landlord Name</label>
                <input type="text" value={form.currentLandlordName} onChange={e => setForm({...form, currentLandlordName: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">Landlord Phone</label>
                <input type="tel" value={form.currentLandlordPhone} onChange={e => setForm({...form, currentLandlordPhone: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 mb-1">Reason for Leaving</label>
                <input type="text" value={form.currentReasonLeaving} onChange={e => setForm({...form, currentReasonLeaving: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">Prior Address &amp; Landlord Contact</label>
                <input type="text" placeholder="Previous address &amp; landlord info" value={form.previousAddress} onChange={e => setForm({...form, previousAddress: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl" />
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-rose-800 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Briefcase className="w-4 h-4" /> 4. Employment &amp; Financial Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-700 mb-1">Current Employer *</label>
                <input required type="text" value={form.employerName} onChange={e => setForm({...form, employerName: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">Position / Title *</label>
                <input required type="text" value={form.position} onChange={e => setForm({...form, position: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">How Long Employed?</label>
                <input type="text" placeholder="e.g. 3 Years" value={form.employmentLength} onChange={e => setForm({...form, employmentLength: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-700 mb-1">Supervisor Name &amp; Phone</label>
                <input type="text" placeholder="Name / Phone" value={form.supervisorName} onChange={e => setForm({...form, supervisorName: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">Gross Monthly Income ($) *</label>
                <input required type="number" placeholder="5000" value={form.monthlyGrossIncome} onChange={e => setForm({...form, monthlyGrossIncome: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">Other Income (Amount &amp; Source)</label>
                <input type="text" placeholder="e.g. $1000/mo Freelance" value={form.additionalIncome} onChange={e => setForm({...form, additionalIncome: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl" />
              </div>
            </div>
          </div>

          {/* Section 5 */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-rose-800 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Car className="w-4 h-4" /> 5. Other Occupants, Vehicles &amp; Pets
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-700 mb-1">Other Proposed Occupants</label>
                <input type="text" placeholder="Names &amp; Relationship" value={form.otherOccupants} onChange={e => setForm({...form, otherOccupants: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">Pets (Breed, Weight, Age)</label>
                <input type="text" placeholder="e.g. None or 1 Golden Retriever 50lbs" value={form.pets} onChange={e => setForm({...form, pets: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">Vehicles (Make, Model, License Plate)</label>
                <input type="text" placeholder="e.g. 2020 Toyota Camry (7XYZ123)" value={form.vehicles} onChange={e => setForm({...form, vehicles: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl" />
              </div>
            </div>
          </div>

          {/* Section 6 */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-rose-800 flex items-center gap-2 border-b border-slate-100 pb-2">
              <HelpCircle className="w-4 h-4" /> 6. Emergency Contact
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-700 mb-1">Full Name *</label>
                <input required type="text" value={form.emergencyContactName} onChange={e => setForm({...form, emergencyContactName: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">Relationship</label>
                <input type="text" placeholder="e.g. Parent / Sibling" value={form.emergencyContactRel} onChange={e => setForm({...form, emergencyContactRel: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">Phone Number *</label>
                <input required type="tel" value={form.emergencyContactPhone} onChange={e => setForm({...form, emergencyContactPhone: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl" />
              </div>
            </div>
          </div>

          {/* Section 7 */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-rose-800 flex items-center gap-2 border-b border-slate-100 pb-2">
              <ShieldCheck className="w-4 h-4" /> 7. Questionnaire &amp; Background Disclosures
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <label className="flex items-center gap-2 text-slate-800 cursor-pointer">
                <input type="checkbox" checked={form.evicted} onChange={e => setForm({...form, evicted: e.target.checked})} className="w-4 h-4 text-rose-800 rounded" />
                Have you ever been evicted or asked to move?
              </label>

              <label className="flex items-center gap-2 text-slate-800 cursor-pointer">
                <input type="checkbox" checked={form.bankrupt} onChange={e => setForm({...form, bankrupt: e.target.checked})} className="w-4 h-4 text-rose-800 rounded" />
                Have you filed for bankruptcy in the last 7 years?
              </label>

              <label className="flex items-center gap-2 text-slate-800 cursor-pointer">
                <input type="checkbox" checked={form.felony} onChange={e => setForm({...form, felony: e.target.checked})} className="w-4 h-4 text-rose-800 rounded" />
                Have you ever been convicted of a felony?
              </label>

              <label className="flex items-center gap-2 text-slate-800 cursor-pointer">
                <input type="checkbox" checked={form.smoker} onChange={e => setForm({...form, smoker: e.target.checked})} className="w-4 h-4 text-rose-800 rounded" />
                Do you or any occupant smoke?
              </label>
            </div>
          </div>

          {/* Section 8 */}
          <div className="p-5 bg-rose-50/50 border border-rose-200 rounded-2xl space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-rose-800">
              8. California Authorization &amp; Consumer Disclosure
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
              Applicant represents that all information provided in this application is true, correct, and complete. Applicant hereby authorizes Mazza Family Rentals and its designated screening agency to verify all information, obtain consumer credit reports, verify rental history, and check employment records in accordance with California Civil Code and the Fair Credit Reporting Act (FCRA).
            </p>

            <label className="flex items-start gap-3 pt-2 text-xs font-bold text-slate-900 cursor-pointer">
              <input 
                type="checkbox" 
                required 
                checked={form.authorizedSignature} 
                onChange={e => setForm({...form, authorizedSignature: e.target.checked})} 
                className="w-4 h-4 text-rose-800 rounded mt-0.5 flex-shrink-0" 
              />
              I certify under penalty of perjury that the above information is true and accurate, and I authorize screening verification.
            </label>
          </div>

          <button 
            disabled={submitting}
            type="submit" 
            className="w-full bg-rose-800 hover:bg-rose-900 text-white font-bold py-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-md disabled:opacity-50 mt-8"
          >
            <Send className="w-4 h-4" /> {submitting ? 'Submitting Application...' : 'Submit Official California Application'}
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
