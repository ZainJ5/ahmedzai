import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a product title'],
    trim: true,
    maxlength: [200, 'Product title cannot be more than 200 characters']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please select a category']
  },
  make: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: [true, 'Please select a brand']
  },
  unitPrice: {
    type: Number,
    required: [true, 'Please provide a unit price'],
    min: [0, 'Price cannot be negative']
  },
  discountPercentage: {
    type: Number,
    min: [0, 'Discount percentage cannot be negative'],
    max: [100, 'Discount percentage cannot exceed 100'],
    default: 0
  },
  year: {
    type: Number,
    required: [true, 'Please provide a manufacturing year']
  },
  model: {
    type: String,
    required: [true, 'Please provide a model'],
    trim: true
  },
  quantity: {
    type: Number,
    required: [true, 'Please provide product quantity'],
    min: [0, 'Quantity cannot be negative'],
    default: 0
  },
  weight: {
    type: Number,
    required: [true, 'Please provide product weight']
  },
  features: {
    type: String,
    required: [true, 'Please provide product features']
  },
  images: [{
    type: String,
    required: [true, 'Product images are required']
  }],
  thumbnail: {
    type: String,
    required: [true, 'Thumbnail image is required']
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

ProductSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

ProductSchema.virtual('discountedPrice').get(function() {
  if (!this.discountPercentage || this.discountPercentage === 0) {
    return this.unitPrice;
  }
  return this.unitPrice * (1 - (this.discountPercentage / 100));
});

ProductSchema.set('toJSON', { virtuals: true });
ProductSchema.set('toObject', { virtuals: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);