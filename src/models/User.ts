import mongoose, { Schema } from 'mongoose'
import crypto from 'crypto'

// Custom function to encrypt/hash passwords securely using Node.js built-in crypto
export function hashPassword(password: string): string {
  const salt = process.env.PASSWORD_SALT || 'troxcard-salt-981723-secure'
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
}

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  number: {
    type: String,
    required: true,
    trim: true,
  },
  companyName: {
    type: String,
    default: '',
    trim: true,
  },
  isNumberVerified: {
    type: Boolean,
    default: false,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  activeStatus: {
    type: Boolean,
    default: true,
  },
  password: {
    type: String,
    required: true,
  },
  otpCode: {
    type: String,
    default: null,
  },
  otpExpiresAt: {
    type: Date,
    default: null,
  },
  otpType: {
    type: String,
    default: null,
  },
}, {
  timestamps: true, // Auto-create createdAt and updatedAt
})

// Mongoose Pre-save middleware to automatically encrypt passwords before saving
UserSchema.pre('save', function (this: any) {
  if (this.isModified('password')) {
    this.password = hashPassword(this.password)
  }
})

if (mongoose.models.User) {
  mongoose.deleteModel('User')
}
export const User = mongoose.model('User', UserSchema)
