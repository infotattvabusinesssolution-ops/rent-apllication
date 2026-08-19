import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { adsApi } from '../api/adsApi';
import { CATEGORIES, CATEGORY_LIST, PROPERTY_SUBCATEGORY_LIST, LOCATIONS } from '../constants/categories';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { toast } from 'sonner';
import { Check, Upload, Image as ImageIcon, X, ArrowRight, ArrowLeft, ShieldAlert } from 'lucide-react';

export const PostAd = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Category, 2: Details, 3: Photos & Review

  // Form State
  const [category, setCategory] = useState(CATEGORIES.LAYOUT_SITES);
  const [propertySubType, setPropertySubType] = useState(PROPERTY_SUBCATEGORY_LIST[0]);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [priceUnit, setPriceUnit] = useState('₹');
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [description, setDescription] = useState('');

  // Category Specifics
  const [dimensions, setDimensions] = useState('');
  const [facing, setFacing] = useState('East Facing');
  const [bhk, setBhk] = useState('2 BHK');
  const [batteryRangeKm, setBatteryRangeKm] = useState('');
  const [brandModel, setBrandModel] = useState('');

  // Images
  const [images, setImages] = useState([
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800',
  ]);

  const postMutation = useMutation({
    mutationFn: adsApi.postAd,
    onSuccess: (res) => {
      toast.success(res.message || 'Advertisement submitted for review!');
      navigate('/my-ads');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !price || !description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const payload = {
      category,
      propertySubType: category === CATEGORIES.PROPERTIES ? propertySubType : null,
      title,
      price: Number(price),
      priceUnit,
      location,
      description,
      dimensions,
      facing,
      bhk,
      batteryRangeKm,
      brandModel,
      imageUrls: images,
    };

    postMutation.mutate(payload);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      {/* Wizard Header Progress Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Post New Advertisement</h1>
          <p className="text-xs text-slate-500 mt-0.5">Reach thousands of active buyers and renters across Bangalore</p>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className={`p-2.5 rounded-xl border text-center transition-all ${step >= 1 ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-bold' : 'border-slate-200 text-slate-400'}`}>
            <span className="text-[10px] uppercase block tracking-wider">Step 1</span>
            <span className="text-xs">Category</span>
          </div>
          <div className={`p-2.5 rounded-xl border text-center transition-all ${step >= 2 ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-bold' : 'border-slate-200 text-slate-400'}`}>
            <span className="text-[10px] uppercase block tracking-wider">Step 2</span>
            <span className="text-xs">Listing Details</span>
          </div>
          <div className={`p-2.5 rounded-xl border text-center transition-all ${step >= 3 ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-bold' : 'border-slate-200 text-slate-400'}`}>
            <span className="text-[10px] uppercase block tracking-wider">Step 3</span>
            <span className="text-xs">Photos & Publish</span>
          </div>
        </div>
      </div>

      {/* STEP 1: CATEGORY SELECTION */}
      {step === 1 && (
        <Card className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-black text-slate-900">What category do you want to post in?</h3>
            <p className="text-xs text-slate-500 mt-1">Select the primary category for your listing</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CATEGORY_LIST.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`p-4 rounded-xl border text-left font-bold text-sm transition-all cursor-pointer flex items-center justify-between ${
                  category === cat
                    ? 'border-blue-600 bg-blue-50/60 text-blue-900 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-800'
                }`}
              >
                <span>{cat}</span>
                {category === cat && <Check className="w-5 h-5 text-blue-600" />}
              </button>
            ))}
          </div>

          {category === CATEGORIES.PROPERTIES && (
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Property Subcategory
              </label>
              <div className="space-y-2">
                {PROPERTY_SUBCATEGORY_LIST.map((sub) => (
                  <label
                    key={sub}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
                      propertySubType === sub
                        ? 'border-blue-600 bg-blue-50/60 text-blue-900'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="propertySubType"
                      checked={propertySubType === sub}
                      onChange={() => setPropertySubType(sub)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span>{sub}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button onClick={() => setStep(2)}>
              Next Step: Details <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 2: DETAILS FORM */}
      {step === 2 && (
        <Card className="p-6 space-y-5">
          <div>
            <h3 className="text-lg font-black text-slate-900">Enter Listing Details</h3>
            <p className="text-xs text-slate-500 mt-0.5">Provide clear information to attract verified leads</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Ad Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 30x40 Hoskote Corner Plot or Ather 450X EV"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Asking Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 1000000"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Location <span className="text-red-500">*</span>
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-all cursor-pointer"
                >
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category Specific Form Fields */}
            {category === CATEGORIES.LAYOUT_SITES && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Plot Dimensions
                  </label>
                  <input
                    type="text"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    placeholder="e.g. 30x40 (1200 Sq.Ft)"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Facing Direction
                  </label>
                  <select
                    value={facing}
                    onChange={(e) => setFacing(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 outline-none"
                  >
                    <option value="East Facing">East Facing</option>
                    <option value="West Facing">West Facing</option>
                    <option value="North Facing">North Facing</option>
                    <option value="South Facing">South Facing</option>
                  </select>
                </div>
              </div>
            )}

            {category === CATEGORIES.ELECTRIC_SCOOTERS && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Brand & Model
                  </label>
                  <input
                    type="text"
                    value={brandModel}
                    onChange={(e) => setBrandModel(e.target.value)}
                    placeholder="e.g. Ather 450X Gen 3"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Battery Range (km/charge)
                  </label>
                  <input
                    type="text"
                    value={batteryRangeKm}
                    onChange={(e) => setBatteryRangeKm(e.target.value)}
                    placeholder="e.g. 105 km/charge"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide details about specs, condition, approvals, nearby landmarks..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-all"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={() => setStep(1)} icon={ArrowLeft}>
              Back
            </Button>
            <Button onClick={() => setStep(3)}>
              Next Step: Photos <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 3: PHOTOS & SUBMIT */}
      {step === 3 && (
        <Card className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-black text-slate-900">Upload Listing Photos</h3>
            <p className="text-xs text-slate-500 mt-0.5">High quality images generate up to 5x more lead inquiries</p>
          </div>

          {/* Photo Uploader Dropzone */}
          <div className="p-8 border-2 border-dashed border-blue-200 rounded-2xl bg-blue-50/30 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Drag & Drop images or browse files</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Supports PNG, JPG, WEBP up to 10MB</p>
            </div>
          </div>

          {/* Image Previews */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {images.map((img, idx) => (
              <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 group">
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImages(images.filter((_, i) => i !== idx))}
                  className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-80 hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Moderation Workflow Status Alert */}
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-bold text-amber-900">Marketplace Moderation Workflow</p>
              <p className="text-amber-800 leading-relaxed">
                Upon submitting, your advertisement status will be set to <strong className="font-black text-amber-900">PENDING_APPROVAL</strong>. Our admin team will review and approve your listing shortly before it goes live to buyers.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={() => setStep(2)} icon={ArrowLeft}>
              Back
            </Button>
            <Button
              variant="success"
              size="lg"
              onClick={handleSubmit}
              isLoading={postMutation.isPending}
              className="font-black"
            >
              Post Advertisement Now
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
