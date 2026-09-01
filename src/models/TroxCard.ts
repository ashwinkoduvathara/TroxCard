import mongoose from 'mongoose'

const TroxCardSchema = new mongoose.Schema({
  userEmail: { type: String, required: true, index: true },
  slug: { type: String, required: true, unique: true, index: true },
  
  // Step 1: Profile Details
  fullName: { type: String, default: '' },
  jobTitle: { type: String, default: 'Software Developer' },
  company: { type: String, default: 'Kodeversity' },
  bio: { type: String, default: '' },
  photoUrl: { type: String, default: '' },

  // Step 2: Contact Details & Social Links
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  website: { type: String, default: '' },
  location: { type: String, default: '' },
  showContactInfo: { type: Boolean, default: true },
  instagram: { type: String, default: '' },
  whatsapp: { type: String, default: '' },
  facebook: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  altPhone: { type: String, default: '' },
  fax: { type: String, default: '' },
  customCta: { type: String, default: '' },

  // Step 3: Content Details
  aboutBio: { type: String, default: '' },
  brochureName: { type: String, default: '' },
  brochureSize: { type: String, default: '' },
  brochureUrl: { type: String, default: '' },
  ctaText: { type: String, default: 'Book a Meeting' },
  ctaLink: { type: String, default: '' },
  ctaStyle: { type: String, default: 'primary' },
  address: { type: String, default: '' },
  country: { type: String, default: 'India' },
  state: { type: String, default: 'Kerala' },
  city: { type: String, default: 'Kochi' },
  pinCode: { type: String, default: '682018' },

  // Step 4: Theme Selection
  theme: { type: String, default: 'purple' },
  
  // Views and analytics metrics
  views: { type: Number, default: 0 },
  shares: { type: Number, default: 0 },
  scans: { type: Number, default: 0 },
  contactsSaved: { type: Number, default: 0 }
}, { 
  timestamps: true,
  collection: 'troxcard' // Explicitly set MongoDB collection name to 'troxcard'
})

export const TroxCard = mongoose.models.TroxCard || mongoose.model('TroxCard', TroxCardSchema)
