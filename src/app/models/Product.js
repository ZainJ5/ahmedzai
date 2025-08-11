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
    required: [true, 'Please provide product weight'],
    min: [0, 'Weight cannot be negative']
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  fuelType: {
    type: String,
    required: [true, 'Please specify the fuel type'],
    enum: ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'CNG', 'LPG', 'Other'],
    trim: true
  },
  mileage: {
    type: Number,
    required: [true, 'Please provide mileage'],
    min: [0, 'Mileage cannot be negative'],
    default: 0
  },
  mileageUnit: {
    type: String,
    required: [true, 'Please specify mileage unit'],
    enum: ['km/l', 'mpg', 'l/100km'],
    default: 'km/l'
  },
  chassis: {
    type: String,
    required: [true, 'Please provide chassis'],
    trim: true
  },
  color: {
    type: String,
    required: [true, 'Please provide color'],
    trim: true
  },
  axleConfiguration: {
    type: String,
    required: [true, 'Please provide axle configuration'],
    trim: true
  },
  vehicleGrade: {
    type: String,
    required: [true, 'Please provide vehicle grade'],
    trim: true
  },
  features: {
    camera360: {
      type: Boolean,
      default: false
    },
    airBags: {
      type: Boolean,
      default: false
    },
    airCondition: {
      type: Boolean,
      default: false
    },
    alloyWheels: {
      type: Boolean,
      default: false
    },
    abs: {
      type: Boolean,
      default: false
    },
    sunRoof: {
      type: Boolean,
      default: false
    },
    autoAC: {
      type: Boolean,
      default: false
    },
    backCamera: {
      type: Boolean,
      default: false
    },
    backSpoiler: {
      type: Boolean,
      default: false
    },
    doubleMuffler: {
      type: Boolean,
      default: false
    },
    fogLights: {
      type: Boolean,
      default: false
    },
    tv: {
      type: Boolean,
      default: false
    },
    hidLights: {
      type: Boolean,
      default: false
    },
    keylessEntry: {
      type: Boolean,
      default: false
    },
    leatherSeats: {
      type: Boolean,
      default: false
    },
    navigation: {
      type: Boolean,
      default: false
    },
    parkingSensors: {
      type: Boolean,
      default: false
    },
    doubleAC: {
      type: Boolean,
      default: false
    },
    powerSteering: {
      type: Boolean,
      default: false
    },
    powerWindows: {
      type: Boolean,
      default: false
    },
    pushStart: {
      type: Boolean,
      default: false
    },
    radio: {
      type: Boolean,
      default: false
    },
    retractableMirrors: {
      type: Boolean,
      default: false
    },
    roofRail: {
      type: Boolean,
      default: false
    }
  },
  thumbnail: {
    type: String,
    required: [true, 'Thumbnail image is required']
  },
  images: [{
    type: String
  }],
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