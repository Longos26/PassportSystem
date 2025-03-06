const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    passportNumber: {
        type: String,
        unique: true,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    nationality: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    placeOfBirth: {
        type: String,
        required: true
    },
    dateOfIssue: {
        type: Date,
        required: true
    },
    dateOfExpiry: {
        type: Date,
        required: true
    },
    issuingCountry: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    address: {
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        zipCode: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        }
    },
    contact: {
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        }
    },
    emergencyContact: {
        name: {
            type: String,
            required: true
        },
        relationship: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        }
    }
}, { timestamps: true });

// Generate tracking number before saving
ApplicationSchema.pre('save', async function(next) {
  if (!this.trackingNumber) {
    // Create a unique tracking number with format PSP-YYYY-XXXXXXX
    const year = new Date().getFullYear();
    const randomStr = Math.floor(1000000 + Math.random() * 9000000).toString();
    this.trackingNumber = `PSP-${year}-${randomStr}`;
  }
  
  // Set estimated completion date based on application type and processing
  if (this.status === 'payment_completed' && !this.estimatedCompletionDate) {
    let daysToAdd = 0;
    
    if (this.isEmergency) {
      daysToAdd = 2;
    } else if (this.isExpedited) {
      daysToAdd = 10;
    } else {
      // Normal processing
      switch(this.applicationType) {
        case 'new':
          daysToAdd = 42; // 6 weeks
          break;
        case 'renewal':
          daysToAdd = 35; // 5 weeks
          break;
        case 'name_change':
        case 'address_update':
          daysToAdd = 28; // 4 weeks
          break;
        default:
          daysToAdd = 42;
      }
    }
    
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + daysToAdd);
    this.estimatedCompletionDate = estimatedDate;
  }
  
  next();
});

module.exports = mongoose.models.Application || mongoose.model('Application', ApplicationSchema);