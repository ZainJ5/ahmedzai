import mongoose from 'mongoose';

const heroSlideSchema = new mongoose.Schema({
  mediaUrl: {
    type: String,
    required: true,
    trim: true
  },
  mediaType: {
    type: String,
    enum: ['image'],
    required: true,
    default: 'image'
  },
  position: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

heroSlideSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const HeroSlide = mongoose.models.HeroSlide || mongoose.model('HeroSlide', heroSlideSchema);

export default HeroSlide;