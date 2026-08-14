-- Recreate applications table with complete California Rental Application fields
DROP TABLE IF EXISTS applications;

CREATE TABLE applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Desired Property
  property_name TEXT,
  unit_number TEXT,
  desired_move_in DATE,
  
  -- Personal Details
  first_name TEXT,
  middle_name TEXT,
  last_name TEXT,
  dob DATE,
  ssn_itin TEXT,
  dl_number TEXT,
  dl_state TEXT,
  phone TEXT,
  email TEXT,
  
  -- Residence History
  current_address TEXT,
  current_city TEXT,
  current_state TEXT,
  current_zip TEXT,
  current_residence_type TEXT,
  current_dates TEXT,
  current_landlord_name TEXT,
  current_landlord_phone TEXT,
  current_reason_leaving TEXT,
  previous_address TEXT,
  previous_landlord_name TEXT,
  previous_landlord_phone TEXT,
  
  -- Employment & Financial
  employer_name TEXT,
  position TEXT,
  supervisor_name TEXT,
  supervisor_phone TEXT,
  employment_length TEXT,
  monthly_gross_income NUMERIC,
  additional_income TEXT,
  additional_income_source TEXT,
  
  -- Occupants, Pets & Vehicles
  other_occupants TEXT,
  pets TEXT,
  vehicles TEXT,
  
  -- Emergency Contact
  emergency_contact_name TEXT,
  emergency_contact_rel TEXT,
  emergency_contact_phone TEXT,
  
  -- Disclosures & Background
  evicted BOOLEAN DEFAULT false,
  bankrupt BOOLEAN DEFAULT false,
  felony BOOLEAN DEFAULT false,
  smoker BOOLEAN DEFAULT false,
  screening_notes TEXT,
  
  -- Authorization
  authorized_signature BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'Pending'
);

-- Enable public submissions
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public application submissions" 
ON applications FOR INSERT 
TO anon 
WITH CHECK (true);
