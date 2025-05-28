const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    fullName: { type: String },            
    avatar: { type: String },
    isVerified: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["freelancer", "client", "organizer"] },
    bio: { type: String },
    location:{ type: String },
    skills: [String],
    socialLinks: [String],  
    portfolioUrl: { type: String },       // added
    githubUrl: { type: String },          // added
    linkedinUrl: { type: String },        // added
    websiteUrl: { type: String },         // added
    hourlyRate: { type: Number },         // added
    companyName: { type: String },        // only for clients
    clientSince: { type: Date },

    // for web3
    walletAddress: {type: String}
  },
  { timestamps: true }
);

// Virtuals for is_client and is_freelancer flags

userSchema.virtual("is_client").get(function () {
  return this.role === "client";
});

userSchema.virtual("is_freelancer").get(function () {
  return this.role === "freelancer";
});

module.exports = mongoose.model("User", userSchema);
