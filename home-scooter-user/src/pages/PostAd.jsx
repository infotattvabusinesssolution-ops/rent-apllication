import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { adsApi } from '../api/adsApi';
import { categoryApi } from '../api/categoryApi';
import { CATEGORIES } from '../constants/categories';

import { toast } from 'sonner';
import {
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  X,
} from 'lucide-react';

export const PostAd = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const initialCategory = searchParams.get('category') || CATEGORIES.LAYOUT_SITES;

  const [step, setStep] = useState(searchParams.get('category') ? 2 : 1); // 1: Select Category, 2: Ad Details & Photos
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);

  // Form State
  const [category, setCategory] = useState(initialCategory);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [dimensions, setDimensions] = useState('');
  const [description, setDescription] = useState('');

  // Photos State
  const [images, setImages] = useState([]);

  const postMutation = useMutation({
    mutationFn: adsApi.postAd,
    onSuccess: (res) => {
      toast.success(res?.message || 'Advertisement submitted for review!');
      navigate('/my-ads');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to post advertisement. Please try again.');
    },
  });

  const handleImageFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const readPromises = files.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(file);
          })
      );

      Promise.all(readPromises).then((base64Images) => {
        setImages((prev) => [...prev, ...base64Images]);
        toast.success(`${files.length} photo(s) added`);
      });
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !price || !description || !phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    const formattedPhone = phone.startsWith('+') ? phone : `+91 ${phone.trim()}`;

    const payload = {
      category,
      title,
      price: Number(price),
      priceUnit: '₹',
      location: location || 'Bangalore, Karnataka',
      description,
      dimensions,
      imageUrls: images,
      posterName: user?.name || 'Seller',
      posterPhone: formattedPhone,
      posterId: user?.id || user?.userId || 'USR-8821',
    };

    postMutation.mutate(payload);
  };

  const { data: categoriesFromApi } = useQuery({
    queryKey: ['userCategories'],
    queryFn: () => categoryApi.getCategories(),
  });

  const dynamicCategories = Array.isArray(categoriesFromApi) ? categoriesFromApi : [];

  const categoriesList = dynamicCategories.length > 0
    ? dynamicCategories
        .filter((c) => c.parent === 'None (Main Category)' || !c.parent)
        .map((c) => ({
          id: c.name,
          title: c.name,
          desc: c.description || `Post listings under ${c.name}`,
          icon: c.icon || '📦',
          bg: c.name.includes('Layout')
            ? 'bg-[#fffbeb]'
            : c.name.includes('Scooter')
            ? 'bg-[#fefce8]'
            : c.name.includes('Services')
            ? 'bg-[#faf5ff]'
            : c.name.includes('Properties')
            ? 'bg-[#f0f6ff]'
            : 'bg-[#f0fdf4]',
          arrowColor: c.name.includes('Layout')
            ? 'text-amber-700'
            : c.name.includes('Services')
            ? 'text-purple-600'
            : 'text-blue-600',
        }))
    : [
        {
          id: 'Layout Sites',
          title: 'Layout Sites',
          desc: 'Plots, Land & Gated Sites',
          icon: '🗺️',
          bg: 'bg-[#fffbeb]',
          arrowColor: 'text-amber-700',
        },
        {
          id: 'Properties',
          title: 'Properties',
          desc: 'Rent / Sale Houses, Shops, Offices & PGs',
          icon: '🏢',
          bg: 'bg-[#f0f6ff]',
          arrowColor: 'text-blue-600',
        },
        {
          id: 'Electric Scooters',
          title: 'Electric Scooters',
          desc: 'Daily & Monthly EV Rentals',
          icon: '🛵',
          bg: 'bg-[#fefce8]',
          arrowColor: 'text-amber-700',
        },
        {
          id: 'Services',
          title: 'Services',
          desc: 'Interiors, Maintenance & Repairs',
          icon: '🛠️',
          bg: 'bg-[#faf5ff]',
          arrowColor: 'text-purple-600',
        },
        {
          id: 'Others',
          title: 'Others',
          desc: 'Miscellaneous & Partner Ads',
          icon: '📦',
          bg: 'bg-[#f0fdf4]',
          arrowColor: 'text-teal-600',
        },
      ];

  const fetchedPropertySubs = dynamicCategories
    .filter((c) => c.parent === 'Properties')
    .map((c) => ({
      title: c.name,
      desc: c.description || `Properties for ${c.name}`,
      icon: c.icon || '🏢',
    }));

  const propertySubcategories = fetchedPropertySubs.length > 0
    ? fetchedPropertySubs
    : [
        {
          title: 'Rent: House & Apartments',
          desc: 'Rental houses, flats & apartments',
          icon: '🏠',
        },
        {
          title: 'Rent: Shop & Offices',
          desc: 'Commercial shops, showrooms & office spaces',
          icon: '🏬',
        },
        {
          title: 'Sale: House & Apartments',
          desc: 'Houses, flats & villas for purchase',
          icon: '🏡',
        },
        {
          title: 'Sale: Shop & Offices',
          desc: 'Commercial shops & offices for sale',
          icon: '🏢',
        },
        {
          title: 'PG & Guest House',
          desc: 'Paying guest accommodations, hostels & co-living',
          icon: '🛏️',
        },
      ];


  const handleCategoryClick = (catId) => {
    if (catId === 'Properties') {
      setIsPropertyModalOpen(true);
    } else {
      setCategory(catId);
      setStep(2);
    }
  };

  const handlePropertySubClick = (subTitle) => {
    setCategory(subTitle);
    setIsPropertyModalOpen(false);
    setStep(2);
  };


  return (
    <div className="space-y-6 pb-24 max-w-lg mx-auto px-1 sm:px-0">
      {/* STEP 1: SELECT CATEGORY */}
      {step === 1 && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
              aria-label="Go back"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Select Category
            </h1>
          </div>

          {/* Category Cards List */}
          <div className="space-y-3.5">
            {categoriesList.map((cat) => (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-xs flex items-center justify-between gap-4 cursor-pointer hover:shadow-md transition-all group"
              >
                {/* Left Icon */}
                <div className={`w-14 h-14 rounded-2xl ${cat.bg} flex items-center justify-center text-2xl shrink-0 border border-slate-100/50`}>
                  <span className="select-none">{cat.icon}</span>
                </div>

                {/* Middle Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-slate-400 text-xs font-light mt-0.5 leading-normal">
                    {cat.desc}
                  </p>
                </div>

                {/* Right Arrow */}
                <ChevronRight className={`w-5 h-5 ${cat.arrowColor} shrink-0`} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SELECT PROPERTY CATEGORY MODAL */}
      {isPropertyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-xs animate-in fade-in-50 duration-200">
          <div className="fixed inset-0" onClick={() => setIsPropertyModalOpen(false)} />

          <div className="relative w-full max-w-lg bg-white rounded-t-3xl shadow-2xl p-5 border-t border-slate-100 max-h-[85vh] overflow-y-auto z-10 space-y-4 animate-in slide-in-from-bottom duration-300">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Select Property Category
              </h2>
              <p className="text-slate-400 text-xs font-serif font-light mt-1">
                Choose the specific category for your property listing:
              </p>
            </div>

            <div className="space-y-3 pt-1">
              {propertySubcategories.map((sub) => (
                <div
                  key={sub.title}
                  onClick={() => handlePropertySubClick(sub.title)}
                  className="bg-[#f8fafc] rounded-2xl p-4 border border-slate-100/90 shadow-xs flex items-center justify-between gap-4 cursor-pointer hover:bg-blue-50/50 hover:border-blue-200 transition-all group"
                >
                  {/* Left Icon Box */}
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-2xl shrink-0 border border-slate-100 shadow-2xs">
                    <span className="select-none">{sub.icon}</span>
                  </div>

                  {/* Middle Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                      {sub.title}
                    </h3>
                    <p className="text-slate-400 text-xs font-light mt-0.5">
                      {sub.desc}
                    </p>
                  </div>

                  {/* Right Chevron */}
                  <ChevronRight className="w-5 h-5 text-blue-600 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: AD DETAILS & PHOTOS */}
      {step === 2 && (
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => setStep(1)}
              className="p-2 -ml-2 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
              aria-label="Go back"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Ad Details & Photos
            </h1>
          </div>

          {/* Selected Category Pill Badge */}
          <div>
            <div className="bg-[#f0f6ff] border border-blue-200/80 text-blue-700 text-xs font-serif font-bold px-4 py-2 rounded-2xl inline-flex items-center gap-2 shadow-xs">
              <span className="text-base">
                {category.includes('Rent: House')
                  ? '🏠'
                  : category.includes('Rent: Shop')
                  ? '🏬'
                  : category.includes('Sale: House')
                  ? '🏡'
                  : category.includes('Sale: Shop') || category.includes('Shop')
                  ? '🏢'
                  : category.includes('PG')
                  ? '🛏️'
                  : category.includes('Layout')
                  ? '🗺️'
                  : category.includes('Scooter')
                  ? '🛵'
                  : category.includes('Services')
                  ? '🛠️'
                  : '📦'}

              </span>
              <span>{category}</span>
            </div>
          </div>


          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Field 1: Ad Title */}
            <div>
              <label className="font-serif font-bold text-slate-900 text-sm mb-1.5 block">
                Ad Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 2 BHK House / Shop in Indiranagar / PG ..."
                className="w-full bg-[#f8fafc] border border-slate-200/80 rounded-2xl p-4 font-serif text-slate-800 text-sm placeholder:text-slate-400 font-light outline-none focus:border-blue-600 focus:bg-white transition-all"
                required
              />
            </div>

            {/* Field 2: Price / Rent (₹) */}
            <div>
              <label className="font-serif font-bold text-slate-900 text-sm mb-1.5 block">
                Price / Rent (₹)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 4500000 or 25000"
                className="w-full bg-[#f8fafc] border border-slate-200/80 rounded-2xl p-4 font-serif text-slate-800 text-sm placeholder:text-slate-400 font-light outline-none focus:border-blue-600 focus:bg-white transition-all"
                required
              />
            </div>

            {/* Field 3: Location / Area Name */}
            <div>
              <label className="font-serif font-bold text-slate-900 text-sm mb-1.5 block">
                Location / Area Name
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Indiranagar, Electronic City"
                className="w-full bg-[#f8fafc] border border-slate-200/80 rounded-2xl p-4 font-serif text-slate-800 text-sm placeholder:text-slate-400 font-light outline-none focus:border-blue-600 focus:bg-white transition-all"
              />
            </div>

            {/* Field: Contact Phone Number */}
            <div>
              <label className="font-serif font-bold text-slate-900 text-sm mb-1.5 block">
                Contact Phone Number (For WhatsApp Leads)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 6370362109 or +91 6370362109"
                className="w-full bg-[#f8fafc] border border-slate-200/80 rounded-2xl p-4 font-serif text-slate-800 text-sm placeholder:text-slate-400 font-light outline-none focus:border-blue-600 focus:bg-white transition-all"
                required
              />
            </div>

            {/* Field 4: Category Specific Details (Only for Layout, Scooters, Properties) */}
            {category !== 'Services' && category !== 'Others' && (
              <div>
                <label className="font-serif font-bold text-slate-900 text-sm mb-1.5 block">
                  {category.includes('Layout')
                    ? 'Plot Dimensions'
                    : category.includes('Scooter')
                    ? 'Battery Range (KM)'
                    : 'Details / BHK / Amenities'}
                </label>
                <input
                  type="text"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  placeholder={
                    category.includes('Layout')
                      ? 'e.g. 30x40 sq.ft (1200 Sq.Ft)'
                      : category.includes('Scooter')
                      ? 'e.g. 140'
                      : 'e.g. 2 BHK Fully Furnished / Ground Floor Shop'
                  }
                  className="w-full bg-[#f8fafc] border border-slate-200/80 rounded-2xl p-4 font-serif text-slate-800 text-sm placeholder:text-slate-400 font-light outline-none focus:border-blue-600 focus:bg-white transition-all"
                />
              </div>
            )}




            {/* Field 5: Full Description */}
            <div>
              <label className="font-serif font-bold text-slate-900 text-sm mb-1.5 block">
                Full Description
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe key features, specs, document status..."
                className="w-full bg-[#f8fafc] border border-slate-200/80 rounded-2xl p-4 font-serif text-slate-800 text-sm placeholder:text-slate-400 font-light outline-none focus:border-blue-600 focus:bg-white transition-all"
                required
              />
            </div>

            {/* Field 6: Upload Photos */}
            <div>
              <label className="font-serif font-bold text-slate-900 text-sm mb-2.5 block">
                Upload Photos (Select Multiple from Gallery)
              </label>

              <div className="flex gap-3 overflow-x-auto scrollbar-none py-1">
                {/* Open Gallery Box Trigger */}
                <label className="w-28 h-28 rounded-2xl border-2 border-blue-600 bg-[#f0f6ff] flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:bg-blue-100/50 transition-all shrink-0">
                  <ImageIcon className="w-6 h-6 text-blue-600" />
                  <span className="font-serif font-bold text-blue-600 text-xs text-center">
                    Open Gallery
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                </label>

                {/* Photo Previews */}
                {images.map((img, idx) => (
                  <div key={idx} className="w-28 h-28 rounded-2xl overflow-hidden border border-slate-200/80 relative shrink-0 group">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={postMutation.isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-serif font-bold text-base py-4 px-6 rounded-2xl shadow-lg shadow-blue-500/20 flex items-center justify-center cursor-pointer transition-all mt-6 disabled:opacity-50"
            >
              {postMutation.isPending ? 'Publishing...' : 'Post Ad Now'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
