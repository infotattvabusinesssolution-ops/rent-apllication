import React, { useState, useMemo } from 'react';
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
  Sparkles,
  RotateCcw,
} from 'lucide-react';

export const PostAd = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const initialCategory = searchParams.get('category') || CATEGORIES.LAYOUT_SITES;

  const [step, setStep] = useState(searchParams.get('category') ? 2 : 1); // 1: Select Category, 2: Ad Details & Photos
  
  // Dynamic Modal State for Subcategories (Matching Image 1)
  const [activeParentCategory, setActiveParentCategory] = useState(null);
  const [isPositionTypeModalOpen, setIsPositionTypeModalOpen] = useState(false);
  const [isServiceTypeModalOpen, setIsServiceTypeModalOpen] = useState(false);

  // Form Base State
  const [category, setCategory] = useState(initialCategory);
  const [subCategory, setSubCategory] = useState('');
  const [isSubSelected, setIsSubSelected] = useState(false);
  const [activeSchemaType, setActiveSchemaType] = useState('DEFAULT');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [description, setDescription] = useState('');

  // Property Specific Form Fields (Images 1, 2, 3)
  const [propertyType, setPropertyType] = useState('Houses & Apartments');
  const [rentOrSale, setRentOrSale] = useState('For Sale');
  const [bhk, setBhk] = useState('2 BHK');
  const [bathrooms, setBathrooms] = useState('2');
  const [washrooms, setWashrooms] = useState('1');
  const [furnishing, setFurnishing] = useState('Semi-Furnished');
  const [projectStatus, setProjectStatus] = useState('Ready to Move');
  const [listedBy, setListedBy] = useState('Owner');
  const [superBuiltupArea, setSuperBuiltupArea] = useState('');
  const [carpetArea, setCarpetArea] = useState('');
  const [maintenanceMonthly, setMaintenanceMonthly] = useState('');
  const [totalFloors, setTotalFloors] = useState('');
  const [carParking, setCarParking] = useState('1');
  const [floorNo, setFloorNo] = useState('');
  const [facing, setFacing] = useState('East');
  const [projectName, setProjectName] = useState('');
  const [plotArea, setPlotArea] = useState('');
  const [plotLength, setPlotLength] = useState('');
  const [plotBreadth, setPlotBreadth] = useState('');

  // Bike Specific Form Fields (Images 4, 5)
  const [brand, setBrand] = useState('');
  const [year, setYear] = useState('2022');
  const [fuel, setFuel] = useState('Petrol');
  const [kmDriven, setKmDriven] = useState('');

  // Job Specific Form Fields
  const [positionType, setPositionType] = useState('Full-time');
  const [salaryFrom, setSalaryFrom] = useState('');
  const [salaryTo, setSalaryTo] = useState('');
  const [salaryPeriod, setSalaryPeriod] = useState('Monthly');

  // Service Specific Form Fields (Images 1 & 2 in latest request)
  const [serviceType, setServiceType] = useState('AC');

  // Photos State (Multiple Photo Selection Gallery)
  const [images, setImages] = useState([]);

  // Fetch Categories dynamically from Database API
  const { data: categoriesFromApi } = useQuery({
    queryKey: ['userCategories'],
    queryFn: () => categoryApi.getCategories(),
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const allCategories = useMemo(() => {
    return Array.isArray(categoriesFromApi) ? categoriesFromApi : [];
  }, [categoriesFromApi]);

  // Main Categories (parent === 'None (Main Category)' or !parent or top-level)
  const mainCategories = useMemo(() => {
    if (allCategories.length > 0) {
      const mainsFromDb = allCategories.filter((c) => {
        if (c.isActive === false) return false;
        if (!c.parent || c.parent === 'None (Main Category)' || c.parent === 'None' || c.parent.trim() === '') return true;
        if (Array.isArray(c.subCategories) && c.subCategories.length > 0) return true;
        const standardMains = ['properties', 'bikes', 'jobs', 'services', 'layout sites', 'electric scooters', 'others'];
        if (standardMains.includes(c.name.trim().toLowerCase())) return true;
        const isChildOfExisting = allCategories.some(
          (other) => other.name.trim().toLowerCase() === c.parent.trim().toLowerCase() && other.name.trim().toLowerCase() !== c.name.trim().toLowerCase()
        );
        return !isChildOfExisting;
      });
      if (mainsFromDb.length > 0) {
        return mainsFromDb.map((c) => ({
          name: c.name,
          title: c.name,
          desc: c.description || `Post listings and offers under ${c.name}`,
          icon: c.icon || '📦',
          schemaType: c.schemaType || 'DEFAULT',
          bg: c.name.includes('Layout')
            ? 'bg-[#fffbeb]'
            : c.name.includes('Scooter') || c.name.includes('Bike')
            ? 'bg-[#fefce8]'
            : c.name.includes('Jobs') || c.name.includes('Services')
            ? 'bg-[#faf5ff]'
            : c.name.includes('Properties')
            ? 'bg-[#f0f6ff]'
            : 'bg-[#f0fdf4]',
          arrowColor: c.name.includes('Layout')
            ? 'text-amber-700'
            : c.name.includes('Jobs') || c.name.includes('Services')
            ? 'text-purple-600'
            : 'text-blue-600',
        }));
      }
    }
    return [];
  }, [allCategories]);

  // Subcategories mapping by Parent Category Name (100% Real Data from Admin & MongoDB)
  const getSubcategoriesForParent = (parentName) => {
    if (!parentName) return [];
    
    const targetParent = parentName.trim().toLowerCase();
    const parentObj = allCategories.find((c) => c.name.trim().toLowerCase() === targetParent);

    // RULE 1: If Admin saved a category with subCategories array in Admin Dashboard:
    // Return EXACTLY what Admin selected (or [] if 0 selected / None)
    if (parentObj && Array.isArray(parentObj.subCategories)) {
      if (parentObj.subCategories.length === 0) {
        return [];
      }
      return parentObj.subCategories.map((subName) => {
        const matched = allCategories.find((c) => c.name.trim().toLowerCase() === subName.trim().toLowerCase());
        return {
          name: subName,
          title: subName,
          desc: matched?.description || `Listings under ${subName}`,
          icon: matched?.icon || '📌',
          schemaType: matched?.schemaType || parentObj.schemaType || 'DEFAULT',
        };
      });
    }

    // RULE 2: Fallback for child categories in MongoDB where c.parent matches targetParent
    const subMap = new Map();
    allCategories.forEach((c) => {
      if (c.isActive !== false && c.parent && c.parent.trim().toLowerCase() === targetParent && c.name.trim().toLowerCase() !== targetParent) {
        subMap.set(c.name.toLowerCase(), {
          name: c.name,
          title: c.name,
          desc: c.description || `Listings under ${c.name}`,
          icon: c.icon || '📌',
          schemaType: c.schemaType || parentObj?.schemaType || 'DEFAULT',
        });
      }
    });

    return Array.from(subMap.values());
  };

  // Dynamic Service Type options matching Images 1, 2, 3 based on subCategory
  const serviceTypeOptions = useMemo(() => {
    if (subCategory.includes('Electronics') || subCategory.includes('Repair')) {
      return ['AC', 'Home Appliances', 'TV, Video/Audio', 'Computer & Laptops', 'RO / Water Purifier', 'Others'];
    }
    if (subCategory.includes('Renovation') || subCategory.includes('Home')) {
      return ['Electrician', 'Plumber', 'Painter', 'Carpenter', 'Others'];
    }
    if (subCategory.includes('Cleaning') || subCategory.includes('Pest')) {
      return ['House Deep Cleaning', 'Pest Control', 'Sofa/Carpet Cleaning', 'Water Tank Cleaning', 'Others'];
    }
    if (subCategory.includes('Packers') || subCategory.includes('Movers')) {
      return ['Household Shifting', 'Vehicle Transportation', 'Office Relocation', 'Others'];
    }
    if (subCategory.includes('Auto') || subCategory.includes('Transport') || subCategory.includes('Vehicle')) {
      return ['Auto Rickshaw Pickup', 'Taxi & Cab Service', 'Vehicle Transportation', 'Others'];
    }
    if (subCategory.includes('Festival') || subCategory.includes('Social') || subCategory.includes('Event')) {
      return ['Festival Wishes & Banners', 'Social Work Banners', 'Event Promotion', 'Others'];
    }
    return ['AC', 'Home Appliances', 'TV, Video/Audio', 'Computer & Laptops', 'RO / Water Purifier', 'Auto Rickshaw Pickup', 'Festival Banners', 'Others'];
  }, [subCategory]);

  // Auto-trigger subcategory modal or direct form open based on subcategories availability
  React.useEffect(() => {
    const urlCat = searchParams.get('category');
    const urlSub = searchParams.get('subCategory');
    if (urlCat && !urlSub && !isSubSelected && !subCategory) {
      const subs = getSubcategoriesForParent(urlCat);
      if (subs.length > 0) {
        setActiveParentCategory({ name: urlCat, title: urlCat });
        setStep(1);
      } else {
        // Direct Form Open if Sub Category is None
        setCategory(urlCat);
        setSubCategory('');
        const matchingCat = allCategories.find((c) => c.name.toLowerCase() === urlCat.toLowerCase());
        if (matchingCat?.schemaType) {
          setActiveSchemaType(matchingCat.schemaType);
        }
        setStep(2);
      }
    }
  }, [searchParams, categoriesFromApi, isSubSelected, subCategory]);

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

  // Quick AI Assistant Title Generator ("Write for me")
  const handleWriteForMe = () => {
    if (category === 'Services' || subCategory.includes('Repair') || activeSchemaType === 'SERVICES') {
      setTitle(`${serviceType} Service & Repair - Fast & Professional`);
      setDescription(`Professional ${serviceType} repair and maintenance services in ${location || 'Bangalore'}. Doorstep service by verified experts, genuine parts used, affordable charges.`);
      toast.success('Generated service title & description!');
    } else if (category === 'Jobs' || subCategory.includes('Telecaller') || activeSchemaType === 'JOBS') {
      setTitle(`Hiring ${subCategory || 'Staff'} - ${positionType}`);
      setDescription(`Looking for motivated candidates for ${subCategory || 'Job'}. Position type: ${positionType}. Salary offered: ₹${salaryFrom || '15000'} - ₹${salaryTo || '30000'} (${salaryPeriod}). Apply now!`);
      toast.success('Generated job title & description!');
    } else if (category.includes('Bike') || activeSchemaType.includes('BIKE')) {
      if (brand) {
        setTitle(`${year} ${brand} - Excellent Condition, Low KM Driven`);
        setDescription(`Selling my well-maintained ${brand} (${year} model). Driven only ${kmDriven || '12000'} km. Single owner, regular servicing done.`);
      } else {
        setTitle(`${year} Model Vehicle - Well Maintained for Quick Sale`);
      }
      toast.success('Generated title & description!');
    } else if (category.includes('Property') || activeSchemaType.includes('PROP')) {
      if (projectName || location) {
        setTitle(`${bhk} Property at ${projectName || location || 'Prime Location'}`);
        setDescription(`Spacious ${bhk} property in ${projectName || location || 'prime locality'}. Super builtup area: ${superBuiltupArea || '1200'} sq.ft. Ready to move with clear titles.`);
      } else {
        setTitle(`${bhk} House for ${rentOrSale} in Bangalore`);
      }
      toast.success('Generated title & description!');
    } else {
      setTitle(`${category} - Best Offer`);
      toast.success('Generated title suggestion!');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description || !phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    const formattedPhone = phone.startsWith('+') ? phone : `+91 ${phone.trim()}`;
    const calculatedPrice = price ? Number(price) : salaryFrom ? Number(salaryFrom) : 0;

    const payload = {
      category,
      propertySubType: subCategory || category,
      title,
      price: calculatedPrice,
      priceUnit: '₹',
      location: location || 'Bangalore, Karnataka',
      description,
      posterName: user?.name || 'Seller',
      posterPhone: formattedPhone,
      posterId: user?.id || user?.userId || 'USR-8821',
      imageUrls: images,

      // Category specific fields
      type: serviceType || propertyType || rentOrSale,
      serviceType: serviceType || propertyType,
      bhk,
      bathrooms,
      washrooms,
      furnishing,
      projectStatus,
      listedBy,
      superBuiltupArea,
      carpetArea,
      maintenanceMonthly,
      totalFloors,
      carParking,
      floorNo,
      facing,
      projectName,
      plotArea,
      length: plotLength,
      breadth: plotBreadth,
      brand,
      year,
      fuel,
      kmDriven,
      positionType,
      salaryFrom,
      salaryTo,
      salaryPeriod,
      dimensions: superBuiltupArea ? `${superBuiltupArea} sq.ft` : plotArea ? `${plotArea} sq.ft` : undefined,
    };

    postMutation.mutate(payload);
  };

  const handleMainCategoryClick = (mainCat) => {
    setIsSubSelected(false);
    const subs = getSubcategoriesForParent(mainCat.name);
    if (subs.length > 0) {
      setActiveParentCategory(mainCat);
    } else {
      setCategory(mainCat.name);
      setSubCategory('');
      setActiveSchemaType(mainCat.schemaType || 'DEFAULT');
      setStep(2);
    }
  };

  const handleSubCategorySelect = (subItem) => {
    const parentName = activeParentCategory?.name || category || 'Properties';
    setCategory(parentName);
    setSubCategory(subItem.name);
    setIsSubSelected(true);
    setActiveSchemaType(subItem.schemaType || activeParentCategory?.schemaType || 'DEFAULT');
    setActiveParentCategory(null);
    setStep(2);
  };

  // Determine Form Type based on schemaType or names
  const isHousesForm =
    activeSchemaType === 'PROPERTIES_HOUSES' ||
    subCategory.includes('House') ||
    subCategory.includes('Apartment') ||
    subCategory.includes('Flats') ||
    subCategory.includes('PG') ||
    (category === 'Properties' && !subCategory);

  const isShopsForm =
    activeSchemaType === 'PROPERTIES_SHOPS' ||
    subCategory.includes('Shop') ||
    subCategory.includes('Office') ||
    subCategory.includes('Commercial');

  const isLandsForm =
    activeSchemaType === 'PROPERTIES_LANDS' ||
    subCategory.includes('Lands') ||
    subCategory.includes('Plots') ||
    category === 'Layout Sites';

  const isBikesForm =
    activeSchemaType === 'BIKES_VEHICLE' ||
    category === 'Bikes' ||
    category === 'Electric Scooters' ||
    subCategory === 'Motorcycles' ||
    subCategory === 'Scooters';

  const isBikePartsForm =
    activeSchemaType === 'BIKES_PARTS' ||
    subCategory === 'Spare Parts' ||
    subCategory === 'Bicycles';

  const isJobsForm =
    activeSchemaType === 'JOBS' ||
    category === 'Jobs' ||
    subCategory.includes('Telecaller') ||
    subCategory.includes('Data Entry') ||
    subCategory.includes('Sales') ||
    subCategory.includes('Driver') ||
    subCategory.includes('Delivery') ||
    subCategory.includes('IT');

  const isServicesForm =
    activeSchemaType === 'SERVICES' ||
    category === 'Services' ||
    category.toLowerCase().includes('service') ||
    subCategory.toLowerCase().includes('service') ||
    subCategory.includes('Repair') ||
    subCategory.includes('Cleaning') ||
    subCategory.includes('Packers') ||
    subCategory.includes('Renovation') ||
    subCategory.includes('Legal') ||
    subCategory.includes('Auto') ||
    subCategory.includes('Transport') ||
    subCategory.includes('Festival') ||
    subCategory.includes('Social');

  return (
    <div className="space-y-6 pb-24 max-w-lg mx-auto px-1 sm:px-0 font-sans">
      {/* STEP 1: SELECT MAIN CATEGORY */}
      {step === 1 && (
        <div className="space-y-6">
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

          <div className="space-y-3.5">
            {mainCategories.map((cat) => (
              <div
                key={cat.name}
                onClick={() => handleMainCategoryClick(cat)}
                className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-xs flex items-center justify-between gap-4 cursor-pointer hover:shadow-md transition-all group"
              >
                <div className={`w-14 h-14 rounded-2xl ${cat.bg} flex items-center justify-center text-2xl shrink-0 border border-slate-100/50`}>
                  <span className="select-none">{cat.icon}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-serif font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-slate-400 text-xs font-light mt-0.5 leading-normal">
                    {cat.desc}
                  </p>
                </div>

                <ChevronRight className={`w-5 h-5 ${cat.arrowColor} shrink-0`} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DYNAMIC SUBCATEGORY SELECTION MODAL (MATCHING IMAGE 1) */}
      {activeParentCategory && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-xs animate-in fade-in-50 duration-200">
          <div className="fixed inset-0" onClick={() => setActiveParentCategory(null)} />
          <div className="relative w-full max-w-lg bg-white rounded-t-3xl shadow-2xl p-5 border-t border-slate-100 max-h-[85vh] overflow-y-auto z-10 space-y-4 animate-in slide-in-from-bottom duration-300">
            <div>
              <h2 className="font-serif text-2xl font-bold text-slate-900 tracking-tight">
                {activeParentCategory.name}
              </h2>
              <p className="text-slate-500 text-xs font-light mt-1">
                Select specific category for your {activeParentCategory.name.toLowerCase()}:
              </p>
            </div>

            <div className="space-y-3 pt-1">
              {getSubcategoriesForParent(activeParentCategory.name).map((sub) => (
                <div
                  key={sub.name}
                  onClick={() => handleSubCategorySelect(sub)}
                  className="bg-[#f8fafc] rounded-2xl p-4 border border-slate-100/90 shadow-xs flex items-center justify-between gap-4 cursor-pointer hover:bg-blue-50/50 hover:border-blue-200 transition-all group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-2xl shrink-0 border border-slate-100 shadow-2xs">
                    <span className="select-none">{sub.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                      {sub.title}
                    </h3>
                    <p className="text-slate-400 text-xs font-light mt-0.5">
                      {sub.desc}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-blue-600 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* POSITION TYPE SELECTOR DIALOG MODAL */}
      {isPositionTypeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs animate-in fade-in-50 duration-200 p-4">
          <div className="fixed inset-0" onClick={() => setIsPositionTypeModalOpen(false)} />
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 border border-slate-100 z-10 space-y-4 animate-in zoom-in-95 duration-200">
            <h3 className="font-serif text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              {subCategory || 'BPO & Telecaller'} &gt; Position type
            </h3>

            <div className="space-y-3 pt-1">
              {['Contract', 'Full-time', 'Part-time', 'Temporary'].map((pt) => (
                <div
                  key={pt}
                  onClick={() => {
                    setPositionType(pt);
                    setIsPositionTypeModalOpen(false);
                  }}
                  className={`p-3.5 rounded-xl font-serif text-sm cursor-pointer transition-all ${
                    positionType === pt
                      ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                      : 'text-slate-800 hover:bg-slate-50 font-normal'
                  }`}
                >
                  {pt}
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsPositionTypeModalOpen(false)}
                className="text-xs font-bold text-blue-700 hover:text-blue-900 tracking-wider uppercase cursor-pointer"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SERVICE TYPE SELECTOR DIALOG MODAL (MATCHING IMAGE 2) */}
      {isServiceTypeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs animate-in fade-in-50 duration-200 p-4">
          <div className="fixed inset-0" onClick={() => setIsServiceTypeModalOpen(false)} />
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 border border-slate-100 z-10 space-y-4 animate-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto">
            <h3 className="font-serif text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              {subCategory || 'Electronics Repair & Services'} &gt; Type
            </h3>

            <div className="space-y-3 pt-1">
              {/* Popular Section */}
              <div>
                <span className="font-serif font-bold text-slate-900 text-sm block mb-2">Popular</span>
                <div className="space-y-1">
                  {serviceTypeOptions.map((st) => (
                    <div
                      key={`pop-${st}`}
                      onClick={() => {
                        setServiceType(st);
                        setIsServiceTypeModalOpen(false);
                      }}
                      className={`p-3 rounded-xl font-serif text-sm cursor-pointer transition-all ${
                        serviceType === st
                          ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                          : 'text-slate-800 hover:bg-slate-50 font-normal'
                      }`}
                    >
                      {st}
                    </div>
                  ))}
                </div>
              </div>

              {/* All Section */}
              <div className="pt-2 border-t border-slate-100">
                <span className="font-serif font-bold text-slate-900 text-sm block mb-2">All</span>
                <div className="space-y-1">
                  {serviceTypeOptions.map((st) => (
                    <div
                      key={`all-${st}`}
                      onClick={() => {
                        setServiceType(st);
                        setIsServiceTypeModalOpen(false);
                      }}
                      className={`p-3 rounded-xl font-serif text-sm cursor-pointer transition-all ${
                        serviceType === st
                          ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                          : 'text-slate-800 hover:bg-slate-50 font-normal'
                      }`}
                    >
                      {st}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsServiceTypeModalOpen(false)}
                className="text-xs font-bold text-blue-700 hover:text-blue-900 tracking-wider uppercase cursor-pointer"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: AD DETAILS FORM */}
      {step === 2 && (
        <div className="space-y-5">
          {/* Top Bar Header */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setStep(1)}
                className="p-2 -ml-2 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
                aria-label="Go back"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Include some details
              </h1>
            </div>
          </div>

          {/* Category Header Subtitle (Matching Image 1) */}
          <div className="border-b border-slate-200 pb-3">
            <h2 className="font-bold text-slate-900 text-xl sm:text-2xl tracking-tight">
              {isServicesForm ? 'Services' : subCategory || category}
            </h2>
            <p className="text-slate-500 text-xs font-normal mt-0.5">
              {isServicesForm ? subCategory || 'Electronics Repair & Services' : `Sub Category: ${category}`}
            </p>
          </div>

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ------------------------------------------------------------- */}
            {/* FORM 1: PROPERTIES -> HOUSES & APARTMENTS */}
            {/* ------------------------------------------------------------- */}
            {isHousesForm && (
              <>
                <div>
                  <label className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5 block">
                    Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full bg-white border-b-2 border-slate-300 py-3 text-slate-900 text-sm font-medium outline-none focus:border-blue-600 transition-all cursor-pointer"
                  >
                    <option value="Houses & Apartments">Houses & Apartments</option>
                    <option value="Apartments / Flats">Apartments / Flats</option>
                    <option value="Independent House / Villa">Independent House / Villa</option>
                    <option value="Builder Floors">Builder Floors</option>
                    <option value="Farm Houses">Farm Houses</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5 block">BHK</label>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {['1 BHK', '2 BHK', '3 BHK', '4 BHK', '4+ BHK'].map((b) => (
                      <button
                        type="button"
                        key={b}
                        onClick={() => setBhk(b)}
                        className={`px-4 py-2 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                          bhk === b ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5 block">Bathrooms</label>
                  <div className="flex gap-2">
                    {['1', '2', '3', '4', '4+'].map((b) => (
                      <button
                        type="button"
                        key={b}
                        onClick={() => setBathrooms(b)}
                        className={`px-4 py-2 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                          bathrooms === b ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5 block">Furnishing</label>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {['Unfurnished', 'Semi-Furnished', 'Fully Furnished'].map((f) => (
                      <button
                        type="button"
                        key={f}
                        onClick={() => setFurnishing(f)}
                        className={`px-4 py-2 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                          furnishing === f ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5 block">Project Status</label>
                  <div className="flex gap-3">
                    {['Ready to Move', 'Under Construction'].map((st) => (
                      <button
                        type="button"
                        key={st}
                        onClick={() => setProjectStatus(st)}
                        className={`flex-1 py-3 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                          projectStatus === st ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5 block">Listed by</label>
                  <div className="flex gap-2">
                    {['Builder', 'Dealer', 'Owner'].map((l) => (
                      <button
                        type="button"
                        key={l}
                        onClick={() => setListedBy(l)}
                        className={`px-4 py-2 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                          listedBy === l ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5 block">
                    Super Builtup area sqft <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={superBuiltupArea}
                    onChange={(e) => setSuperBuiltupArea(e.target.value)}
                    placeholder="e.g. 1200"
                    className="w-full bg-white border-b-2 border-slate-300 py-3 text-slate-900 text-sm font-medium outline-none focus:border-blue-600 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5 block">
                    Carpet Area sqft <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={carpetArea}
                    onChange={(e) => setCarpetArea(e.target.value)}
                    placeholder="e.g. 950"
                    className="w-full bg-white border-b-2 border-slate-300 py-3 text-slate-900 text-sm font-medium outline-none focus:border-blue-600 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5 block">Maintenance (Monthly)</label>
                  <input
                    type="number"
                    value={maintenanceMonthly}
                    onChange={(e) => setMaintenanceMonthly(e.target.value)}
                    placeholder="e.g. 2500"
                    className="w-full bg-white border-b-2 border-slate-300 py-3 text-slate-900 text-sm font-medium outline-none focus:border-blue-600 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5 block">Total Floors</label>
                    <input
                      type="number"
                      value={totalFloors}
                      onChange={(e) => setTotalFloors(e.target.value)}
                      placeholder="e.g. 5"
                      className="w-full bg-white border-b-2 border-slate-300 py-3 text-slate-900 text-sm font-medium outline-none focus:border-blue-600 transition-all"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5 block">Floor No</label>
                    <input
                      type="number"
                      value={floorNo}
                      onChange={(e) => setFloorNo(e.target.value)}
                      placeholder="e.g. 2"
                      className="w-full bg-white border-b-2 border-slate-300 py-3 text-slate-900 text-sm font-medium outline-none focus:border-blue-600 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5 block">Car Parking</label>
                  <div className="flex gap-2">
                    {['0', '1', '2', '3', '3+'].map((p) => (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setCarParking(p)}
                        className={`px-4 py-2 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                          carParking === p ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5 block">Facing</label>
                  <select
                    value={facing}
                    onChange={(e) => setFacing(e.target.value)}
                    className="w-full bg-white border-b-2 border-slate-300 py-3 text-slate-900 text-sm font-medium outline-none focus:border-blue-600 transition-all cursor-pointer"
                  >
                    <option value="East">East</option>
                    <option value="North">North</option>
                    <option value="North-East">North-East</option>
                    <option value="West">West</option>
                    <option value="South">South</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5 block">Project Name</label>
                  <input
                    type="text"
                    maxLength={70}
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g. Prestige Heights / Brigade Enclave"
                    className="w-full bg-white border-b-2 border-slate-300 py-3 text-slate-900 text-sm font-medium outline-none focus:border-blue-600 transition-all"
                  />
                  <span className="text-[10px] text-slate-400 block text-right mt-1">{projectName.length}/70</span>
                </div>
              </>
            )}

            {/* ------------------------------------------------------------- */}
            {/* FORM 2: PROPERTIES -> SHOPS & OFFICES */}
            {/* ------------------------------------------------------------- */}
            {isShopsForm && (
              <>
                <div>
                  <label className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5 block">Furnishing</label>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {['Unfurnished', 'Semi-Furnished', 'Fully Furnished'].map((f) => (
                      <button
                        type="button"
                        key={f}
                        onClick={() => setFurnishing(f)}
                        className={`px-4 py-2 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                          furnishing === f ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5 block">Project Status</label>
                  <div className="flex gap-3">
                    {['Ready to Move', 'Under Construction'].map((st) => (
                      <button
                        type="button"
                        key={st}
                        onClick={() => setProjectStatus(st)}
                        className={`flex-1 py-3 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                          projectStatus === st ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5 block">Listed by</label>
                  <div className="flex gap-2">
                    {['Builder', 'Dealer', 'Owner'].map((l) => (
                      <button
                        type="button"
                        key={l}
                        onClick={() => setListedBy(l)}
                        className={`px-4 py-2 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                          listedBy === l ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5 block">
                    Super Builtup area sqft <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={superBuiltupArea}
                    onChange={(e) => setSuperBuiltupArea(e.target.value)}
                    placeholder="e.g. 1500"
                    className="w-full bg-white border-b-2 border-slate-300 py-3 text-slate-900 text-sm font-medium outline-none focus:border-blue-600 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5 block">
                    Carpet Area sqft <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={carpetArea}
                    onChange={(e) => setCarpetArea(e.target.value)}
                    placeholder="e.g. 1200"
                    className="w-full bg-white border-b-2 border-slate-300 py-3 text-slate-900 text-sm font-medium outline-none focus:border-blue-600 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5 block">Maintenance (Monthly)</label>
                  <input
                    type="number"
                    value={maintenanceMonthly}
                    onChange={(e) => setMaintenanceMonthly(e.target.value)}
                    placeholder="e.g. 3500"
                    className="w-full bg-white border-b-2 border-slate-300 py-3 text-slate-900 text-sm font-medium outline-none focus:border-blue-600 transition-all"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5 block">Car Parking</label>
                  <div className="flex gap-2">
                    {['0', '1', '2', '3+'].map((p) => (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setCarParking(p)}
                        className={`px-4 py-2 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                          carParking === p ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5 block">Washrooms</label>
                  <div className="flex gap-2">
                    {['1', '2', '3', '3+'].map((w) => (
                      <button
                        type="button"
                        key={w}
                        onClick={() => setWashrooms(w)}
                        className={`px-4 py-2 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                          washrooms === w ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5 block">Project Name</label>
                  <input
                    type="text"
                    maxLength={70}
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g. MG Road Commercial Complex"
                    className="w-full bg-white border-b-2 border-slate-300 py-3 text-slate-900 text-sm font-medium outline-none focus:border-blue-600 transition-all"
                  />
                  <span className="text-[10px] text-slate-400 block text-right mt-1">{projectName.length}/70</span>
                </div>
              </>
            )}

            {/* ------------------------------------------------------------- */}
            {/* FORM 3: PROPERTIES -> LANDS & PLOTS */}
            {/* ------------------------------------------------------------- */}
            {isLandsForm && (
              <>
                <div>
                  <label className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5 block">
                    Type <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-3">
                    {['For Rent', 'For Sale'].map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setRentOrSale(t)}
                        className={`flex-1 py-3.5 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                          rentOrSale === t ? 'bg-slate-900 text-white border-slate-900 shadow-xs' : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5 block">Listed by</label>
                  <div className="flex gap-2">
                    {['Builder', 'Dealer', 'Owner'].map((l) => (
                      <button
                        type="button"
                        key={l}
                        onClick={() => setListedBy(l)}
                        className={`px-4 py-2 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                          listedBy === l ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5 block">
                    Plot Area <span className="text-red-500">*</span> (sq.ft)
                  </label>
                  <input
                    type="number"
                    value={plotArea}
                    onChange={(e) => setPlotArea(e.target.value)}
                    placeholder="e.g. 1200"
                    className="w-full bg-white border-b-2 border-slate-300 py-3 text-slate-900 text-sm font-medium outline-none focus:border-blue-600 transition-all"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5 block">Length (ft)</label>
                    <input
                      type="number"
                      value={plotLength}
                      onChange={(e) => setPlotLength(e.target.value)}
                      placeholder="e.g. 40"
                      className="w-full bg-white border-b-2 border-slate-300 py-3 text-slate-900 text-sm font-medium outline-none focus:border-blue-600 transition-all"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5 block">Breadth (ft)</label>
                    <input
                      type="number"
                      value={plotBreadth}
                      onChange={(e) => setPlotBreadth(e.target.value)}
                      placeholder="e.g. 30"
                      className="w-full bg-white border-b-2 border-slate-300 py-3 text-slate-900 text-sm font-medium outline-none focus:border-blue-600 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5 block">Facing</label>
                  <select
                    value={facing}
                    onChange={(e) => setFacing(e.target.value)}
                    className="w-full bg-white border-b-2 border-slate-300 py-3 text-slate-900 text-sm font-medium outline-none focus:border-blue-600 transition-all cursor-pointer"
                  >
                    <option value="East">East</option>
                    <option value="North">North</option>
                    <option value="North-East">North-East</option>
                    <option value="West">West</option>
                    <option value="South">South</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5 block">Project Name</label>
                  <input
                    type="text"
                    maxLength={70}
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g. MUDA Approved Green Enclave"
                    className="w-full bg-white border-b-2 border-slate-300 py-3 text-slate-900 text-sm font-medium outline-none focus:border-blue-600 transition-all"
                  />
                  <span className="text-[10px] text-slate-400 block text-right mt-1">{projectName.length}/70</span>
                </div>
              </>
            )}

            {/* ------------------------------------------------------------- */}
            {/* FORM 4: BIKES -> MOTORCYCLES & SCOOTERS */}
            {/* ------------------------------------------------------------- */}
            {isBikesForm && (
              <>
                <div>
                  <label className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5 block">
                    Brand <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. Royal Enfield, Honda, Yamaha, TVS, Hero, Ola, Ather..."
                    className="w-full bg-white border-b-2 border-slate-300 py-3 text-slate-900 text-sm font-medium outline-none focus:border-emerald-600 transition-all"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5 block">
                      Year <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full bg-white border-b-2 border-slate-300 py-3 text-slate-900 text-sm font-medium outline-none focus:border-emerald-600 transition-all cursor-pointer"
                      required
                    >
                      {['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015'].map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5 block">
                      Fuel <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={fuel}
                      onChange={(e) => setFuel(e.target.value)}
                      className="w-full bg-white border-b-2 border-slate-300 py-3 text-slate-900 text-sm font-medium outline-none focus:border-emerald-600 transition-all cursor-pointer"
                      required
                    >
                      <option value="Petrol">Petrol</option>
                      <option value="Electric">Electric</option>
                      <option value="CNG">CNG</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                      KM driven <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">{kmDriven.length}/6</span>
                  </div>
                  <input
                    type="number"
                    maxLength={6}
                    value={kmDriven}
                    onChange={(e) => {
                      if (e.target.value.length <= 6) setKmDriven(e.target.value);
                    }}
                    placeholder="e.g. 15000"
                    className="w-full bg-white border-b-2 border-slate-300 py-3 text-slate-900 text-sm font-medium outline-none focus:border-emerald-600 transition-all"
                    required
                  />
                </div>
              </>
            )}

            {/* Bike Parts / Bicycles optional Brand */}
            {isBikePartsForm && (
              <div>
                <label className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5 block">
                  Brand / Manufacturer
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Trek, Giant, Studds, Shimano..."
                  className="w-full bg-white border-b-2 border-slate-300 py-3 text-slate-900 text-sm font-medium outline-none focus:border-emerald-600 transition-all"
                />
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* FORM 5: JOBS FORM */}
            {/* ------------------------------------------------------------- */}
            {isJobsForm && (
              <>
                {/* Position Type Selector Trigger */}
                <div>
                  <label className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5 block">
                    Position type <span className="text-red-500">*</span>
                  </label>
                  <div
                    onClick={() => setIsPositionTypeModalOpen(true)}
                    className="w-full bg-white border-b-2 border-slate-300 py-3 text-slate-900 text-sm font-medium outline-none cursor-pointer flex justify-between items-center group hover:border-purple-600 transition-all"
                  >
                    <span>{positionType}</span>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-purple-600" />
                  </div>
                </div>

                {/* Salary From Input (0/7 max) */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-slate-800 text-xs uppercase tracking-wider block">
                      Salary from
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">{salaryFrom.length}/7</span>
                  </div>
                  <input
                    type="number"
                    maxLength={7}
                    value={salaryFrom}
                    onChange={(e) => {
                      if (e.target.value.length <= 7) setSalaryFrom(e.target.value);
                    }}
                    placeholder="e.g. 15000"
                    className="w-full bg-white border-b-2 border-slate-300 py-3 text-slate-900 text-sm font-medium outline-none focus:border-purple-600 transition-all"
                  />
                </div>

                {/* Salary Period Select */}
                <div>
                  <label className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5 block">
                    Salary period <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={salaryPeriod}
                    onChange={(e) => setSalaryPeriod(e.target.value)}
                    className="w-full bg-white border-b-2 border-slate-300 py-3 text-slate-900 text-sm font-medium outline-none focus:border-purple-600 transition-all cursor-pointer"
                    required
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Hourly">Hourly</option>
                  </select>
                </div>

                {/* Salary To Input (0/7 max) */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-slate-800 text-xs uppercase tracking-wider block">
                      Salary to
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">{salaryTo.length}/7</span>
                  </div>
                  <input
                    type="number"
                    maxLength={7}
                    value={salaryTo}
                    onChange={(e) => {
                      if (e.target.value.length <= 7) setSalaryTo(e.target.value);
                    }}
                    placeholder="e.g. 35000"
                    className="w-full bg-white border-b-2 border-slate-300 py-3 text-slate-900 text-sm font-medium outline-none focus:border-purple-600 transition-all"
                  />
                </div>
              </>
            )}

            {/* ------------------------------------------------------------- */}
            {/* FORM 6: SERVICES FORM (IMAGES 1 & 2 IN LATEST REQUEST) */}
            {/* ------------------------------------------------------------- */}
            {isServicesForm && (
              <>
                {/* Service Type Selector Trigger (Opening Image 2 Dialog Modal) */}
                <div>
                  <label className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5 block">
                    Type <span className="text-red-500">*</span>
                  </label>
                  <div
                    onClick={() => setIsServiceTypeModalOpen(true)}
                    className="w-full bg-white border-b-2 border-slate-300 py-3 text-slate-900 text-sm font-medium outline-none cursor-pointer flex justify-between items-center group hover:border-blue-600 transition-all"
                  >
                    <span>{serviceType}</span>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                  </div>
                </div>
              </>
            )}

            {/* ------------------------------------------------------------- */}
            {/* COMMON FIELDS: PRICE (NON-JOBS), LOCATION, PHONE, TITLE, DESCRIPTION, MULTIPLE PHOTOS */}
            {/* ------------------------------------------------------------- */}

            {!isJobsForm && !isServicesForm && (
              <div>
                <label className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5 block">
                  Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 85000"
                  className="w-full bg-white border-b-2 border-slate-300 py-3 text-slate-900 text-sm font-medium outline-none focus:border-blue-600 transition-all"
                  required
                />
              </div>
            )}

            <div>
              <label className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5 block">
                Location / Area Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Indiranagar, Bangalore"
                className="w-full bg-white border-b-2 border-slate-300 py-3 text-slate-900 text-sm font-medium outline-none focus:border-blue-600 transition-all"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5 block">
                Contact Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 6370362109 or +91 6370362109"
                className="w-full bg-white border-b-2 border-slate-300 py-3 text-slate-900 text-sm font-medium outline-none focus:border-blue-600 transition-all"
                required
              />
            </div>

            {/* AI Assistant Quick Write Box for Title & Description */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-2xl border border-purple-100/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-600 fill-purple-200" /> Write for me (AI Assistant)
                </span>
                <button
                  type="button"
                  onClick={handleWriteForMe}
                  className="bg-white hover:bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1.5 rounded-full border border-purple-200 shadow-2xs flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                >
                  <RotateCcw className="w-3 h-3 text-purple-600" />
                  <span>Write for me</span>
                </button>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                    Ad title <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">{title.length}/70</span>
                </div>
                <p className="text-[11px] text-slate-500 font-light mb-1.5">
                  Mention the key features of your item (e.g. brand, model, age, type)
                </p>
                <input
                  type="text"
                  maxLength={70}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={
                    isServicesForm
                      ? 'e.g. AC Repair & Servicing at Doorstep'
                      : isJobsForm
                      ? 'e.g. Urgent Hiring: Telecaller Executive'
                      : 'e.g. Royal Enfield Classic 350'
                  }
                  className="w-full bg-white border-b-2 border-slate-300 py-3 text-slate-900 text-sm font-medium outline-none focus:border-blue-600 transition-all"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                    Describe what you are selling <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">{description.length}/4096</span>
                </div>
                <p className="text-[11px] text-slate-500 font-light mb-1.5">
                  Include condition, features and reason for selling
                </p>
                <textarea
                  rows={4}
                  maxLength={4096}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your offer or item in detail..."
                  className="w-full bg-white border-b-2 border-slate-300 py-3 text-slate-900 text-sm font-light outline-none focus:border-blue-600 transition-all"
                  required
                />
              </div>
            </div>

            {/* Photo Upload Gallery Box */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-bold text-slate-800 text-xs uppercase tracking-wider block">
                  Upload Photos ({images.length} added)
                </label>
                <span className="text-[10px] text-blue-600 font-bold">Select multiple from gallery</span>
              </div>

              <div className="flex gap-3 overflow-x-auto scrollbar-none py-1">
                {/* Add Photo Button */}
                <label className="w-28 h-28 rounded-2xl border-2 border-dashed border-blue-600 bg-[#f0f6ff] flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:bg-blue-100/50 transition-all shrink-0">
                  <ImageIcon className="w-6 h-6 text-blue-600" />
                  <span className="font-bold text-blue-600 text-xs text-center">
                    + Add Photos
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                </label>

                {/* Multiple Photo Thumbnails */}
                {images.map((img, idx) => (
                  <div key={idx} className="w-28 h-28 rounded-2xl overflow-hidden border border-slate-200/80 relative shrink-0 group">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, i) => i !== idx))}
                      className="absolute top-1.5 right-1.5 p-1 bg-red-600 text-white rounded-full opacity-90 hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                      title="Remove photo"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 bg-slate-900/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full backdrop-blur-xs">
                        Cover
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-slate-400 font-light pt-1">* Required Fields</p>

            {/* Bottom Submit Button */}
            <button
              type="submit"
              disabled={postMutation.isPending}
              className="w-full bg-[#0047a5] hover:bg-[#003882] active:scale-[0.99] text-white font-bold text-base py-4 px-6 rounded-2xl shadow-lg shadow-blue-900/10 flex items-center justify-center cursor-pointer transition-all mt-6 disabled:opacity-50"
            >
              {postMutation.isPending ? 'Publishing...' : 'Next'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
