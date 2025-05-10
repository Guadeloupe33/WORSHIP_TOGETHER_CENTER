const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  accountType: {
    type: String,
    enum: ['personal', 'organization'],
    default: 'personal'
  },
  religion: {
    type: String,
    enum: [
      'Christianity', 'Islam', 'Hinduism', 'Buddhism', 'Judaism',
      'Sikhism', 'Baháʼí', 'Jainism', 'Shinto', 'Taoism'
    ]
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Custom'],
    default: 'Custom'
  },
  
  denomination: {
    type: String,
    trim: true
  },
  organizationName: {
    type: String,
    trim: true
  },
  mission: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  photo: {
    type: String,
    default: ''
  },
  taxId: { type: String },         // ✅ Correct format
  is501c3: { type: Boolean }, 
  
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Password match method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
