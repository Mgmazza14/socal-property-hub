'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { 
  Home, ArrowLeft, CheckCircle2, AlertCircle, 
  FileText, Send, ShieldCheck, UserCheck, 
  Briefcase, Car, HelpCircle, Plus, Trash2 
} from 'lucide-react';

const SUPABASE_URL = 'https://krxgbyjeskputjtuxivw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyeGdieWplc2twdXRqdHV4aXZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1ODQ4MDgsImV4cCI6MjEwMjE2MDgwOH0.fszuxusHVtlYJ0r4OMa65St0dPlMuOnEUUHtA96Cr-8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface PropertyPref {
  propertyName: string;
  unitNumber: string;
  desiredMoveIn: string;
}

interface ResidenceHistory {
  address: string;
  city: string;
  state: string;
  zip: string;
  dates: string;
  landlordName: string;
  landlordPhone: string;
  reasonLeaving: string;
}

interface EmploymentHistory {
  employerName: string;
  position: string;
  employmentLength: string;
  supervisorInfo: string;
  monthlyGrossIncome: string;
  additionalIncome: string;
}

interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

function ApplicationForm() {
  const searchParams = useSearchParams();
  const defaultProperty = searchParams.get('property') || '';
  const defaultUnit = searchParams.get('unit') || '';

  // Section 1: Desired Properties
  const [properties, setProperties] = useState<PropertyPref[]>([
    { propertyName: defaultProperty, unitNumber: defaultUnit, desiredMoveIn: '' }
  ]);

  // Section 2: Primary Applicant & Co-Applicants
  const [primaryApplicant, setPrimaryApplicant] = useState({
    firstName: '', middleName: '', lastName: '', dob: '', ssnItin: '', dlNumber: '', dlState: 'CA', phone: '', email: ''
  });
  const [coApplicants, setCoApplicants] = useState<Array<{
    firstName: string; lastName: string; phone: string; email: string; relationship: string;
  }>>([]);

  // Section 3: Residence History
  const [residences, setResidences] = useState<ResidenceHistory[]>([
    { address: '', city: '', state: 'CA', zip: '', dates: '', landlordName: '', landlordPhone: '', reasonLeaving: '' }
  ]);

  // Section 4: Employment & Income
  const [employers, setEmployers] = useState<EmploymentHistory[]>([
    { employerName: '', position: '', employmentLength: '', supervisorInfo: '', monthlyGrossIncome: '', additionalIncome: '' }
  ]);

  // Section 5: Household Occupants, Vehicles & Pets (Initialized with 1 default line each)
  const [otherOccupants, setOtherOccupants] = useState<Array<{ name: string; age: string; relationship: string }>>([
    { name: '', age: '', relationship: '' }
  ]);
  const [vehicles, setVehicles] = useState<Array<{ makeModel: string; year: string; licensePlate: string }>>([
    { makeModel: '', year: '', licensePlate: '' }
  ]);
  const [pets, setPets] = useState<Array<{ breedType: string; weight: string; age: string }>>([
    { breedType: '', weight: '', age: '' }
  ]);

  // Section 6: Emergency Contacts
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    { name: '', relationship: '', phone: '' }
  ]);

  // Section 7 & 8: Background & Disclosure
  const [disclosures, setDisclosures] = useState({
    evicted: false, bankrupt: false, felony: false, smoker: false, authorizedSignature: false
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Helper Handlers
  const addProperty = () => setProperties([...properties, { propertyName: '', unitNumber: '', desiredMoveIn: '' }]);
  const removeProperty = (idx: number) => setProperties(properties.filter((_, i) => i !== idx));

  const addCoApplicant = () => setCoApplicants([...coApplicants, { firstName: '', lastName: '', phone: '', email: '', relationship: '' }]);
  const removeCoApplicant = (idx: number) => setCoApplicants(coApplicants.filter((_, i) => i !== idx));

  const addResidence = () => setResidences([...residences, { address: '', city: '', state: 'CA', zip: '', dates: '', landlordName: '', landlordPhone: '', reasonLeaving: '' }]);
  const removeResidence = (idx: number) => setResidences(residences.filter((_, i) => i !== idx));

  const addEmployer = () => setEmployers([...employers, { employerName: '', position: '', employmentLength: '', supervisorInfo: '', monthlyGrossIncome: '', additionalIncome: '' }]);
  const removeEmployer = (idx: number) => setEmployers(employers.filter((_, i) => i !== idx));

  const addOccupant = () => setOtherOccupants([...otherOccupants, { name: '', age: '', relationship: '' }]);
  const removeOccupant = (idx: number) => setOtherOccupants(otherOccupants.filter((_, i) => i !== idx));

  const addVehicle = () => setVehicles([...vehicles, { makeModel: '', year: '', licensePlate: '' }]);
  const removeVehicle = (idx: number) => setVehicles(vehicles.filter((_, i) => i !== idx));

  const addPet = () => setPets([...pets, { breedType: '', weight: '', age: '' }]);
  const removePet = (idx: number) => setPets(pets.filter((_, i) => i !== idx));

  const addEmergencyContact = () => setEmergencyContacts([...emergencyContacts, { name: '', relationship: '', phone: '' }]);
  const removeEmergencyContact = (idx: number) => setEmergencyContacts(emergencyContacts.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disclosures.authorizedSignature) {
      setErrorMsg('You must check the authorization box confirming truthfulness and screening approval.');
      return;
    }

    setSubmitting(true);
    setSuccess(false);
    setErrorMsg(null);

    try {
      const primaryProp = properties[0];
      const primaryRes = residences[0];
      const primaryEmp = employers[0];
      const primaryEmerg = emergencyContacts[0];

      const formattedProperties = properties
        .filter(p => p.propertyName.trim() !== '')
        .map((p, i) => `#${i + 1}: ${p.propertyName} (Unit ${p.unitNumber || 'N/A'}, Move-in: ${p.desiredMoveIn || 'N/A'})`).join(' | ');

      const formattedCoApplicants = coApplicants
        .filter(c => c.firstName.trim() !== '' || c.lastName.trim() !== '')
        .map(c => `${c.firstName} ${c.lastName} (${c.relationship}, Phone: ${c.phone}, Email: ${c.email})`).join(' | ');

      const formattedResidences = residences
        .filter(r => r.address.trim() !== '')
        .map((r, i) => `#${i + 1}: ${r.address}, ${r.city}, ${r.state} ${r.zip} (${r.dates}, Landlord: ${r.landlordName} - ${r.landlordPhone}, Reason: ${r.reasonLeaving})`).join('\n');

      const formattedEmployers = employers
        .filter(emp => emp.employerName.trim() !== '')
        .map((emp, i) => `#${i + 1}: ${emp.employerName} - ${emp.position} (${emp.employmentLength}, Gross: $${emp.monthlyGrossIncome}/mo, Sup: ${emp.supervisorInfo})`).join('\n');

      const formattedOccupants = otherOccupants
        .filter(o => o.name.trim() !== '')
        .map(o => `${o.name} (Age: ${o.age}, Rel: ${o.relationship})`).join(', ');

      const formattedVehicles = vehicles
        .filter(v => v.makeModel.trim() !== '' || v.licensePlate.trim() !== '')
        .map(v => `${v.year} ${v.makeModel} [Plate: ${v.licensePlate}]`).join(', ');

      const formattedPets = pets
        .filter(p => p.breedType.trim() !== '')
        .map(p => `${p.breedType} (${p.weight} lbs, Age: ${p.age})`).join(', ');

      const formattedEmergency = emergencyContacts
        .filter(ec => ec.name.trim() !== '')
        .map(ec => `${ec.name} (${ec.relationship}): ${ec.phone}`).join(' | ');

      const { error } = await supabase
        .from('applications')
        .insert([{
          property_name: formattedProperties || primaryProp?.propertyName || '',
          unit_number: primaryProp?.unitNumber || '',
          desired_move_in: primaryProp?.desiredMoveIn || null,
          first_name: primaryApplicant.firstName,
          middle_name: primaryApplicant.middleName,
          last_name: primaryApplicant.lastName,
          dob: primaryApplicant.dob || null,
          ssn_itin: primaryApplicant.ssnItin,
          dl_number: primaryApplicant.dlNumber,
          dl_state: primaryApplicant.dlState,
          phone: primaryApplicant.phone,
          email: primaryApplicant.email,
          current_address: primaryRes?.address || '',
          current_city: primaryRes?.city || '',
          current_state: primaryRes?.state || '',
          current_zip: primaryRes?.zip || '',
          current_dates: primaryRes?.dates || '',
          current_landlord_name: primaryRes?.landlordName || '',
          current_landlord_phone: primaryRes?.landlordPhone || '',
          current_reason_leaving: primaryRes?.reasonLeaving || '',
          previous_address: formattedResidences,
          employer_name: primaryEmp?.employerName || '',
          position: primaryEmp?.position || '',
          employment_length: primaryEmp?.employmentLength || '',
          supervisor_name: primaryEmp?.supervisorInfo || '',
          monthly_gross_income: primaryEmp?.monthlyGrossIncome ? Number(primaryEmp.monthlyGrossIncome) : null,
          additional_income: formattedEmployers,
          other_occupants: formattedCoApplicants ? `Co-Applicants: ${formattedCoApplicants} | Occupants: ${formattedOccupants}` : formattedOccupants,
          pets: formattedPets,
          vehicles: formattedVehicles,
          emergency_contact_name: primaryEmerg?.name || '',
          emergency_contact_rel: primaryEmerg?.relationship || '',
          emergency_contact_phone: formattedEmergency,
          evicted: disclosures.evicted,
          bankrupt: disclosures.bankrupt,
          felony: disclosures.felony,
          smoker: disclosures.smoker,
          authorized_signature: disclosures.authorizedSignature
        }]);

      if (error) throw error;

      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Failed to submit application. Please check required fields.');
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
            Your application has been submitted to Mazza Family Rentals. We will review your application and contact you at <strong>{primaryApplicant.email}</strong> or <strong>(805) 889-3999</strong>.
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

          {/* Section 1: Desired Properties */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-rose-800 flex items-center gap-2">
                <Home className="w-4 h-4" /> 1. Application Property Preference(s)
              </h3>
              <button type="button" onClick={addProperty} className="text-xs text-rose-800 hover:text-rose-900 font-bold flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm transition">
                <Plus className="w-3.5 h-3.5" /> Add Property
              </button>
            </div>

            {properties.map((prop, idx) => (
              <div key={idx} className="p-4 bg-white rounded-xl border border-slate-200 relative space-y-3">
                {properties.length > 1 && (
                  <button type="button" onClick={() => removeProperty(idx)} className="absolute top-3 right-3 text-slate-400 hover:text-red-600 transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Property Preference #{idx + 1}</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 mb-1">Property Name / Address *</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="e.g. Coastal Palms Apartment, Ventura CA" 
                      value={prop.propertyName} 
                      onChange={e => {
                        const updated = [...properties];
                        updated[idx].propertyName = e.target.value;
                        setProperties(updated);
                      }} 
                      className="w-full p-2.5 border border-slate-200 rounded-lg text-xs" 
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">Unit # &amp; Move-In Date</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="text" 
                        placeholder="Apt 3B" 
                        value={prop.unitNumber} 
                        onChange={e => {
                          const updated = [...properties];
                          updated[idx].unitNumber = e.target.value;
                          setProperties(updated);
                        }} 
                        className="w-full p-2.5 border border-slate-200 rounded-lg text-xs" 
                      />
                      <input 
                        type="date" 
                        value={prop.desiredMoveIn} 
                        onChange={e => {
                          const updated = [...properties];
                          updated[idx].desiredMoveIn = e.target.value;
                          setProperties(updated);
                        }} 
                        className="w-full p-2 border border-slate-200 rounded-lg text-xs" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Section 2: Applicants & Co-Applicants */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-rose-800 flex items-center gap-2">
                <UserCheck className="w-4 h-4" /> 2. Applicant &amp; Co-Applicant Identification
              </h3>
              <button type="button" onClick={addCoApplicant} className="text-xs text-rose-800 hover:text-rose-900 font-bold flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition">
                <Plus className="w-3.5 h-3.5" /> Add Co-Applicant
              </button>
            </div>

            <div className="space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 bg-rose-50 px-2.5 py-1 rounded-md inline-block">Primary Applicant</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 mb-1">First Name *</label>
                  <input required type="text" value={primaryApplicant.firstName} onChange={e => setPrimaryApplicant({...primaryApplicant, firstName: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl" />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">Middle Name</label>
                  <input type="text" value={primaryApplicant.middleName} onChange={e => setPrimaryApplicant({...primaryApplicant, middleName: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl" />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">Last Name *</label>
                  <input required type="text" value={primaryApplicant.lastName} onChange={e => setPrimaryApplicant({...primaryApplicant, lastName: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-slate-700 mb-1">Date of Birth *</label>
                  <input required type="date" value={primaryApplicant.dob} onChange={e => setPrimaryApplicant({...primaryApplicant, dob: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl" />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">SSN or ITIN *</label>
                  <input required type="text" placeholder="XXX-XX-XXXX" value={primaryApplicant.ssnItin} onChange={e => setPrimaryApplicant({...primaryApplicant, ssnItin: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl" />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">Driver License / ID #</label>
                  <input type="text" value={primaryApplicant.dlNumber} onChange={e => setPrimaryApplicant({...primaryApplicant, dlNumber: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl" />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">DL State</label>
                  <input type="text" value={primaryApplicant.dlState} onChange={e => setPrimaryApplicant({...primaryApplicant, dlState: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 mb-1">Phone Number *</label>
                  <input required type="tel" placeholder="(805) 889-3999" value={primaryApplicant.phone} onChange={e => setPrimaryApplicant({...primaryApplicant, phone: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl" />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">Email Address *</label>
                  <input required type="email" value={primaryApplicant.email} onChange={e => setPrimaryApplicant({...primaryApplicant, email: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl" />
                </div>
              </div>
            </div>

            {coApplicants.map((coApp, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 relative space-y-3 mt-4">
                <button type="button" onClick={() => removeCoApplicant(idx)} className="absolute top-3 right-3 text-slate-400 hover:text-red-600 transition">
                  <Trash2 className="w-4 h-4" />
                </button>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800">Co-Applicant #{idx + 1}</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 mb-1">First Name</label>
                    <input type="text" value={coApp.firstName} onChange={e => {
                      const updated = [...coApplicants];
                      updated[idx].firstName = e.target.value;
                      setCoApplicants(updated);
                    }} className="w-full p-2.5 border border-slate-200 rounded-lg text-xs" />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">Last Name</label>
                    <input type="text" value={coApp.lastName} onChange={e => {
                      const updated = [...coApplicants];
                      updated[idx].lastName = e.target.value;
                      setCoApplicants(updated);
                    }} className="w-full p-2.5 border border-slate-200 rounded-lg text-xs" />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">Relationship / Phone</label>
                    <input type="text" placeholder="Spouse / (805) 555-0100" value={coApp.relationship} onChange={e => {
                      const updated = [...coApplicants];
                      updated[idx].relationship = e.target.value;
                      setCoApplicants(updated);
                    }} className="w-full p-2.5 border border-slate-200 rounded-lg text-xs" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Section 3: Residence History */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-rose-800 flex items-center gap-2">
                <Home className="w-4 h-4" /> 3. Residence History
              </h3>
              <button type="button" onClick={addResidence} className="text-xs text-rose-800 hover:text-rose-900 font-bold flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition">
                <Plus className="w-3.5 h-3.5" /> Add Previous Residence
              </button>
            </div>

            {residences.map((res, idx) => (
              <div key={idx} className="p-4 bg-slate-50/50 rounded-xl border border-slate-200 relative space-y-3">
                {residences.length > 1 && (
                  <button type="button" onClick={() => removeResidence(idx)} className="absolute top-3 right-3 text-slate-400 hover:text-red-600 transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {idx === 0 ? 'Current Residence *' : `Previous Residence #${idx}`}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 mb-1">Address *</label>
                    <input required type="text" placeholder="123 Main St" value={res.address} onChange={e => {
                      const updated = [...residences];
                      updated[idx].address = e.target.value;
                      setResidences(updated);
                    }} className="w-full p-2.5 border border-slate-200 rounded-lg text-xs" />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">City, State, Zip *</label>
                    <div className="grid grid-cols-3 gap-1">
                      <input required type="text" placeholder="Ventura" value={res.city} onChange={e => {
                        const updated = [...residences];
                        updated[idx].city = e.target.value;
                        setResidences(updated);
                      }} className="p-2 border border-slate-200 rounded-lg text-xs" />
                      <input required type="text" placeholder="CA" value={res.state} onChange={e => {
                        const updated = [...residences];
                        updated[idx].state = e.target.value;
                        setResidences(updated);
                      }} className="p-2 border border-slate-200 rounded-lg text-xs" />
                      <input required type="text" placeholder="93001" value={res.zip} onChange={e => {
                        const updated = [...residences];
                        updated[idx].zip = e.target.value;
                        setResidences(updated);
                      }} className="p-2 border border-slate-200 rounded-lg text-xs" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 mb-1">Dates of Residence</label>
                    <input type="text" placeholder="Jan 2022 - Present" value={res.dates} onChange={e => {
                      const updated = [...residences];
                      updated[idx].dates = e.target.value;
                      setResidences(updated);
                    }} className="w-full p-2.5 border border-slate-200 rounded-lg text-xs" />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">Landlord Name &amp; Phone</label>
                    <input type="text" placeholder="John Doe / (805) 555-0199" value={res.landlordName} onChange={e => {
                      const updated = [...residences];
                      updated[idx].landlordName = e.target.value;
                      setResidences(updated);
                    }} className="w-full p-2.5 border border-slate-200 rounded-lg text-xs" />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">Reason for Leaving</label>
                    <input type="text" placeholder="e.g. Relocating for work" value={res.reasonLeaving} onChange={e => {
                      const updated = [...residences];
                      updated[idx].reasonLeaving = e.target.value;
                      setResidences(updated);
                    }} className="w-full p-2.5 border border-slate-200 rounded-lg text-xs" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Section 4: Employment & Financial */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-rose-800 flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> 4. Employment &amp; Income Information
              </h3>
              <button type="button" onClick={addEmployer} className="text-xs text-rose-800 hover:text-rose-900 font-bold flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition">
                <Plus className="w-3.5 h-3.5" /> Add Secondary / Past Job
              </button>
            </div>

            {employers.map((emp, idx) => (
              <div key={idx} className="p-4 bg-slate-50/50 rounded-xl border border-slate-200 relative space-y-3">
                {employers.length > 1 && (
                  <button type="button" onClick={() => removeEmployer(idx)} className="absolute top-3 right-3 text-slate-400 hover:text-red-600 transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {idx === 0 ? 'Primary Employment *' : `Secondary / Additional Income #${idx}`}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 mb-1">Employer / Source *</label>
                    <input required type="text" value={emp.employerName} onChange={e => {
                      const updated = [...employers];
                      updated[idx].employerName = e.target.value;
                      setEmployers(updated);
                    }} className="w-full p-2.5 border border-slate-200 rounded-lg text-xs" />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">Position / Title *</label>
                    <input required type="text" value={emp.position} onChange={e => {
                      const updated = [...employers];
                      updated[idx].position = e.target.value;
                      setEmployers(updated);
                    }} className="w-full p-2.5 border border-slate-200 rounded-lg text-xs" />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">Gross Monthly Income ($) *</label>
                    <input required type="number" placeholder="5000" value={emp.monthlyGrossIncome} onChange={e => {
                      const updated = [...employers];
                      updated[idx].monthlyGrossIncome = e.target.value;
                      setEmployers(updated);
                    }} className="w-full p-2.5 border border-slate-200 rounded-lg text-xs" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 mb-1">Duration of Employment</label>
                    <input type="text" placeholder="e.g. 3 Years" value={emp.employmentLength} onChange={e => {
                      const updated = [...employers];
                      updated[idx].employmentLength = e.target.value;
                      setEmployers(updated);
                    }} className="w-full p-2.5 border border-slate-200 rounded-lg text-xs" />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">Supervisor Name &amp; Contact</label>
                    <input type="text" placeholder="Supervisor Name / Phone" value={emp.supervisorInfo} onChange={e => {
                      const updated = [...employers];
                      updated[idx].supervisorInfo = e.target.value;
                      setEmployers(updated);
                    }} className="w-full p-2.5 border border-slate-200 rounded-lg text-xs" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Section 5: Occupants, Vehicles & Pets (Automatic line default + Add/Delete) */}
          <div className="space-y-6 pt-4 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-rose-800 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Car className="w-4 h-4" /> 5. Household Occupants, Vehicles &amp; Pets
            </h3>

            {/* Additional Non-Applying Occupants */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Additional Non-Applying Occupants</span>
                <button type="button" onClick={addOccupant} className="text-[11px] text-rose-800 hover:text-rose-900 font-bold flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md transition">
                  <Plus className="w-3 h-3" /> Add Occupant
                </button>
              </div>
              {otherOccupants.map((occ, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input type="text" placeholder="Full Name" value={occ.name} onChange={e => {
                    const updated = [...otherOccupants];
                    updated[idx].name = e.target.value;
                    setOtherOccupants(updated);
                  }} className="flex-1 p-2 border border-slate-200 rounded-lg text-xs" />
                  <input type="text" placeholder="Age" value={occ.age} onChange={e => {
                    const updated = [...otherOccupants];
                    updated[idx].age = e.target.value;
                    setOtherOccupants(updated);
                  }} className="w-20 p-2 border border-slate-200 rounded-lg text-xs" />
                  <input type="text" placeholder="Relationship" value={occ.relationship} onChange={e => {
                    const updated = [...otherOccupants];
                    updated[idx].relationship = e.target.value;
                    setOtherOccupants(updated);
                  }} className="w-32 p-2 border border-slate-200 rounded-lg text-xs" />
                  {otherOccupants.length > 1 && (
                    <button type="button" onClick={() => removeOccupant(idx)} className="text-slate-400 hover:text-red-600 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Vehicles */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Vehicles</span>
                <button type="button" onClick={addVehicle} className="text-[11px] text-rose-800 hover:text-rose-900 font-bold flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md transition">
                  <Plus className="w-3 h-3" /> Add Vehicle
                </button>
              </div>
              {vehicles.map((v, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input type="text" placeholder="Year / Make / Model" value={v.makeModel} onChange={e => {
                    const updated = [...vehicles];
                    updated[idx].makeModel = e.target.value;
                    setVehicles(updated);
                  }} className="flex-1 p-2 border border-slate-200 rounded-lg text-xs" />
                  <input type="text" placeholder="License Plate #" value={v.licensePlate} onChange={e => {
                    const updated = [...vehicles];
                    updated[idx].licensePlate = e.target.value;
                    setVehicles(updated);
                  }} className="w-40 p-2 border border-slate-200 rounded-lg text-xs" />
                  {vehicles.length > 1 && (
                    <button type="button" onClick={() => removeVehicle(idx)} className="text-slate-400 hover:text-red-600 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Pets */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Pets</span>
                <button type="button" onClick={addPet} className="text-[11px] text-rose-800 hover:text-rose-900 font-bold flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md transition">
                  <Plus className="w-3 h-3" /> Add Pet
                </button>
              </div>
              {pets.map((p, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input type="text" placeholder="Type &amp; Breed (e.g. Golden Retriever)" value={p.breedType} onChange={e => {
                    const updated = [...pets];
                    updated[idx].breedType = e.target.value;
                    setPets(updated);
                  }} className="flex-1 p-2 border border-slate-200 rounded-lg text-xs" />
                  <input type="text" placeholder="Weight (lbs)" value={p.weight} onChange={e => {
                    const updated = [...pets];
                    updated[idx].weight = e.target.value;
                    setPets(updated);
                  }} className="w-28 p-2 border border-slate-200 rounded-lg text-xs" />
                  {pets.length > 1 && (
                    <button type="button" onClick={() => removePet(idx)} className="text-slate-400 hover:text-red-600 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 6: Emergency Contacts */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-rose-800 flex items-center gap-2">
                <HelpCircle className="w-4 h-4" /> 6. Emergency Contacts
              </h3>
              <button type="button" onClick={addEmergencyContact} className="text-xs text-rose-800 hover:text-rose-900 font-bold flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition">
                <Plus className="w-3.5 h-3.5" /> Add Emergency Contact
              </button>
            </div>

            {emergencyContacts.map((ec, idx) => (
              <div key={idx} className="p-3 bg-slate-50/50 rounded-xl border border-slate-200 relative grid grid-cols-1 sm:grid-cols-3 gap-3">
                {emergencyContacts.length > 1 && (
                  <button type="button" onClick={() => removeEmergencyContact(idx)} className="absolute top-2.5 right-2.5 text-slate-400 hover:text-red-600 transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <div>
                  <label className="block text-slate-700 mb-1">Contact Name *</label>
                  <input required type="text" value={ec.name} onChange={e => {
                    const updated = [...emergencyContacts];
                    updated[idx].name = e.target.value;
                    setEmergencyContacts(updated);
                  }} className="w-full p-2.5 border border-slate-200 rounded-lg text-xs" />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">Relationship</label>
                  <input type="text" placeholder="e.g. Parent / Sibling" value={ec.relationship} onChange={e => {
                    const updated = [...emergencyContacts];
                    updated[idx].relationship = e.target.value;
                    setEmergencyContacts(updated);
                  }} className="w-full p-2.5 border border-slate-200 rounded-lg text-xs" />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">Phone Number *</label>
                  <input required type="tel" value={ec.phone} onChange={e => {
                    const updated = [...emergencyContacts];
                    updated[idx].phone = e.target.value;
                    setEmergencyContacts(updated);
                  }} className="w-full p-2.5 border border-slate-200 rounded-lg text-xs" />
                </div>
              </div>
            ))}
          </div>

          {/* Section 7: Disclosures */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-rose-800 flex items-center gap-2 border-b border-slate-100 pb-2">
              <ShieldCheck className="w-4 h-4" /> 7. Questionnaire &amp; Background Disclosures
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <label className="flex items-center gap-2 text-slate-800 cursor-pointer">
                <input type="checkbox" checked={disclosures.evicted} onChange={e => setDisclosures({...disclosures, evicted: e.target.checked})} className="w-4 h-4 text-rose-800 rounded" />
                Have you ever been evicted or asked to move?
              </label>

              <label className="flex items-center gap-2 text-slate-800 cursor-pointer">
                <input type="checkbox" checked={disclosures.bankrupt} onChange={e => setDisclosures({...disclosures, bankrupt: e.target.checked})} className="w-4 h-4 text-rose-800 rounded" />
                Have you filed for bankruptcy in the last 7 years?
              </label>

              <label className="flex items-center gap-2 text-slate-800 cursor-pointer">
                <input type="checkbox" checked={disclosures.felony} onChange={e => setDisclosures({...disclosures, felony: e.target.checked})} className="w-4 h-4 text-rose-800 rounded" />
                Have you ever been convicted of a felony?
              </label>

              <label className="flex items-center gap-2 text-slate-800 cursor-pointer">
                <input type="checkbox" checked={disclosures.smoker} onChange={e => setDisclosures({...disclosures, smoker: e.target.checked})} className="w-4 h-4 text-rose-800 rounded" />
                Do you or any occupant smoke?
              </label>
            </div>
          </div>

          {/* Section 8: Authorization */}
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
                checked={disclosures.authorizedSignature} 
                onChange={e => setDisclosures({...disclosures, authorizedSignature: e.target.checked})} 
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
