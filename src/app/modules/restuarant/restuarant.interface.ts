export interface IRestuarant {
    name: { type: String },
    businessName: { type: String },
    businessEmail: { type: String },
    phone: { type: String },
    gstRate: { type: String },
    cgstRate: { type: String },
    sgstRate: { type: String },
    address: { type: String },
    logo: { type: String, nullable: true },
    tagline: { type: String },
    coverPhoto: [{ type: String }],
    description: { type: String },
    referralCode: { type: String },
    isDelete?: {
        type: boolean;
    }
  }