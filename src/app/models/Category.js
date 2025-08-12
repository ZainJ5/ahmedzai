import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a category name'],
    trim: true,
    maxlength: [50, 'Category name cannot be more than 50 characters']
  },
  type: {
    type: String,
    enum: ['product', 'truck'],
    default: 'product',
    required: [true, 'Please specify the category type']
  },
  thumbnail: {
    type: String,
    required: true
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

CategorySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);