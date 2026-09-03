import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Printer, 
  Share2, 
  ArrowUp, 
  Mail, 
  Globe, 
  MapPin, 
  UserCheck, 
  Smartphone, 
  Lock, 
  Trash2, 
  FileText, 
  Bell, 
  Database, 
  AlertTriangle, 
  Eye, 
  Camera, 
  CreditCard, 
  HelpCircle, 
  CheckCircle2, 
  Info
} from 'lucide-react';
import { toast } from 'sonner';

export const PrivacyPolicy = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Privacy policy link copied to clipboard!');
  };

  const handlePrint = () => {
    window.print();
  };

  const scrollToTop = () => {
    const container = document.getElementById('privacy-policy-scroll-container');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Helper to highlight search matches or check visibility
  const matchesSearch = (text) => {
    if (!searchQuery.trim()) return true;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  return (
    <div id="privacy-policy-scroll-container" className="h-screen w-full overflow-y-auto bg-slate-50 text-slate-800 font-sans pb-12">
      {/* Top Header Bar */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs z-30 print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-lg sm:text-xl leading-tight">
              Home & Scooter
            </h1>
            <p className="text-xs text-slate-500 font-medium">Privacy Policy</p>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative hidden sm:block w-48 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search in policy..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-100 text-slate-800 placeholder-slate-400 rounded-lg text-sm border border-transparent focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 rounded-full w-4 h-4 flex items-center justify-center"
              >
                ×
              </button>
            )}
          </div>

          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-sm font-medium transition-colors shadow-2xs"
            title="Copy Page Link"
          >
            <Share2 className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline">Copy Link</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors shadow-sm shadow-blue-500/20"
            title="Print Policy"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print / Save PDF</span>
          </button>
        </div>
      </header>

      {/* Main Single Page Document Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 space-y-8">
        
        {/* Mobile Search Input */}
        <div className="sm:hidden relative w-full print:hidden">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search keywords in privacy policy..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white text-slate-800 placeholder-slate-400 rounded-xl text-sm border border-slate-200 shadow-2xs focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Hero Banner Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-teal-500 to-indigo-600" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                Official Privacy Document
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                PRIVACY POLICY
              </h1>
              <p className="text-base font-semibold text-slate-600 mt-1">
                Home & Scooter Marketplace Platform
              </p>
            </div>

            <div className="flex flex-col sm:items-end gap-2 text-xs text-slate-500 bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-0 border-slate-200 shrink-0">
              <div className="flex items-center justify-between sm:justify-end gap-2.5 w-full sm:w-auto">
                <span className="font-medium text-slate-600 whitespace-nowrap">Effective Date:</span>
                <span className="px-2.5 py-1 bg-slate-100 sm:bg-slate-200/80 text-slate-800 rounded-md font-mono text-xs whitespace-nowrap border border-slate-200/60 shadow-2xs font-semibold">
                  3 September 2026
                </span>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-2.5 w-full sm:w-auto">
                <span className="font-medium text-slate-600 whitespace-nowrap">Last Updated:</span>
                <span className="px-2.5 py-1 bg-slate-100 sm:bg-slate-200/80 text-slate-800 rounded-md font-mono text-xs whitespace-nowrap border border-slate-200/60 shadow-2xs font-semibold">
                  3 September 2026
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-slate-50 to-blue-50/40 rounded-xl p-4 sm:p-5 border border-slate-200/80 text-sm text-slate-700 leading-relaxed">
            This Privacy Policy explains how <strong>Home & Scooter</strong> (“App”, “Platform”, “we”, “us”, or “our”), operated by Home & Scooter, collects, uses, stores, shares, and protects information when users access or use our buying and selling marketplace. By downloading, registering for, accessing, or using Home & Scooter, you acknowledge the practices described in this Privacy Policy.
          </div>

          {/* Key Feature Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
              <UserCheck className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <div className="text-xs font-semibold text-slate-800">Account Safety</div>
              <div className="text-[11px] text-slate-500">Secure Profile & Data</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
              <Lock className="w-5 h-5 text-teal-600 mx-auto mb-1" />
              <div className="text-xs font-semibold text-slate-800">Data Security</div>
              <div className="text-[11px] text-slate-500">Safeguards & Encryption</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
              <Trash2 className="w-5 h-5 text-red-500 mx-auto mb-1" />
              <div className="text-xs font-semibold text-slate-800">Easy Deletion</div>
              <div className="text-[11px] text-slate-500">In-App or Email Request</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
              <Mail className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
              <div className="text-xs font-semibold text-slate-800">Support Contact</div>
              <div className="text-[11px] text-slate-500">Grievance Assistance</div>
            </div>
          </div>
        </div>

        {/* All Policy Sections Stacked in Single Page Column */}
        <div className="space-y-6">

          {/* Section 1 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Info className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">1. About Home & Scooter</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              Home & Scooter is an online buying and selling marketplace designed to connect buyers and sellers through a convenient digital platform. Users may be able to:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-700">
              {[
                'Create and manage an account',
                'Create a user profile',
                'Browse products and listings',
                'Search and filter listings',
                'Post products or items for sale',
                'Upload product images and descriptions',
                'Contact buyers or sellers',
                'Save or shortlist listings',
                'Manage buying and selling activities',
                'Receive notifications and marketplace updates'
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-4 italic">
              The availability of individual features may vary depending on the version of the App.
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">2. Information We Collect</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-6">
              When you use Home & Scooter, we may collect information that you voluntarily provide, including:
            </p>

            <div className="space-y-6">
              {/* Subsection A */}
              <div className="bg-slate-50/70 p-4 sm:p-5 rounded-xl border border-slate-200">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  Personal and Account Information
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700">
                  {['Full name', 'Email address', 'Mobile number', 'Username', 'Profile photograph', 'Password or authentication information'].map((i, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Subsection B */}
              <div className="bg-slate-50/70 p-4 sm:p-5 rounded-xl border border-slate-200">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-600" />
                  Seller and Listing Information
                </h3>
                <p className="text-xs text-slate-500 mb-3">When you create a listing, we may collect:</p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700">
                  {[
                    'Product or item name', 'Product description', 'Product photographs or videos', 
                    'Selling price', 'Product category', 'Product condition', 
                    'Quantity or availability', 'Seller-provided location', 'Other information submitted with the listing'
                  ].map((i, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Subsection C */}
              <div className="bg-slate-50/70 p-4 sm:p-5 rounded-xl border border-slate-200">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-600" />
                  Transaction Information
                </h3>
                <p className="text-xs text-slate-500 mb-3">Where transactions are supported through Home & Scooter, we may process information relating to:</p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700">
                  {[
                    'Products purchased or sold', 'Order details', 'Transaction amounts', 
                    'Payment status', 'Cancellation information', 'Refund information, where applicable', 'Transaction history'
                  ].map((i, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Subsection D */}
              <div className="bg-slate-50/70 p-4 sm:p-5 rounded-xl border border-slate-200">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-600" />
                  Address Information
                </h3>
                <p className="text-xs text-slate-500 mb-3">Where necessary for transactions, delivery, or marketplace functionality, we may collect:</p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700">
                  {[
                    'Delivery address', 'Billing address', 'City', 
                    'State', 'Postal/PIN code', 'Country', 'Delivery instructions'
                  ].map((i, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">3. Information Collected Automatically</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              When you use Home & Scooter, certain technical information may be collected automatically, including:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm text-slate-700 mb-4">
              {[
                'IP address', 'Device type', 'Operating system', 
                'App version', 'Device identifiers', 'Browser information', 
                'Login timestamps', 'Screens or features accessed', 'Search and browsing activity', 
                'App interaction information', 'Crash reports', 'Diagnostic and performance information'
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs font-medium text-slate-700 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="p-3 bg-blue-50/60 rounded-lg text-xs text-blue-800 border border-blue-100">
              This information may be used to operate, secure, troubleshoot, analyze, and improve Home & Scooter.
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">4. Location Information</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              Home & Scooter may request permission to access location information when required for marketplace functionality. Location information may be used to:
            </p>
            <ul className="space-y-2 text-sm text-slate-700 mb-4">
              {[
                'Display listings available near you',
                'Show relevant nearby products',
                'Provide location-based search results',
                'Determine service or delivery availability',
                'Improve marketplace functionality',
                'Help detect suspicious or fraudulent activity'
              ].map((i, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{i}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
              Users can manage location permissions through their device settings. Some location-dependent features may not function correctly when location permission is disabled.
            </p>
          </section>

          {/* Section 5 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Camera className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">5. Camera, Photos and Media</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              Home & Scooter may request access to your device's camera, photographs, videos, or media where necessary to:
            </p>
            <ul className="space-y-2 text-sm text-slate-700 mb-4">
              {[
                'Take photographs of products',
                'Upload product photographs',
                'Upload product videos',
                'Add or change a profile photograph',
                'Upload verification or supporting documents, where applicable'
              ].map((i, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                  <span>{i}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-purple-900 bg-purple-50/60 p-3 rounded-lg border border-purple-100 font-medium">
              Such permissions are requested only when necessary for relevant App functionality.
            </p>
          </section>

          {/* Section 6 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">6. How We Use Your Information</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              We may use information collected through Home & Scooter to:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700">
              {[
                'Create and maintain user accounts',
                'Authenticate users',
                'Facilitate buying and selling',
                'Create and display marketplace listings',
                'Enable buyer and seller interactions',
                'Process and manage transactions',
                'Provide customer support',
                'Send account and service notifications',
                'Personalize marketplace experiences',
                'Improve search results',
                'Detect fraudulent or suspicious activities',
                'Prevent spam, abuse, and unauthorized access',
                'Resolve complaints and disputes',
                'Improve App functionality and performance',
                'Perform analytics',
                'Maintain Platform security',
                'Comply with applicable legal requirements',
                'Enforce our Terms & Conditions and other Platform policies'
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Section 7 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">7. Buyer and Seller Communication</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              Home & Scooter may provide functionality allowing buyers and sellers to communicate. Where communication occurs through the Platform, relevant information may be processed to:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700 mb-5">
              {[
                'Provide communication functionality',
                'Prevent spam and abuse',
                'Investigate complaints',
                'Prevent fraudulent activity',
                'Resolve transaction disputes',
                'Maintain marketplace safety'
              ].map((i, idx) => (
                <li key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                  <span>{i}</span>
                </li>
              ))}
            </ul>
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 leading-relaxed font-medium">
                Users should avoid sharing passwords, OTPs, complete banking credentials, or other unnecessary sensitive information with other users.
              </div>
            </div>
          </section>

          {/* Section 8 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">8. Payments</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              If Home & Scooter provides online payment functionality, payments may be processed through authorized third-party payment service providers.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-700 uppercase mb-2">Payment providers may process:</h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {['Debit or credit card information', 'Bank account information', 'UPI/payment identifiers', 'Billing information', 'Transaction information'].map((i, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-cyan-500 rounded-full shrink-0" />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-700 uppercase mb-2">Home & Scooter may receive limited data:</h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {['Transaction ID', 'Transaction amount', 'Payment method', 'Payment status'].map((i, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-teal-500 rounded-full shrink-0" />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="text-xs text-slate-600 bg-slate-100 p-3 rounded-lg border border-slate-200 font-medium">
              Unless specifically stated otherwise, Home & Scooter does not directly store complete debit or credit card details.
            </p>
          </section>

          {/* Section 9 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Share2 className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">9. Sharing of Information</h2>
            </div>
            <div className="p-3 bg-blue-50 text-blue-900 text-xs font-bold rounded-lg mb-4">
              Home & Scooter does not sell users' personal information as a business practice. Information may be shared where reasonably necessary with:
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="text-sm font-semibold text-slate-800 mb-1">Buyers and Sellers</h4>
                <p className="text-xs text-slate-600">
                  Information required to facilitate marketplace interactions or transactions may be shared between relevant buyers and sellers.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="text-sm font-semibold text-slate-800 mb-2">Service Providers</h4>
                <p className="text-xs text-slate-500 mb-3">We may use third-party providers for services including:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-700">
                  {[
                    'Cloud hosting', 'Payment processing', 'SMS & email communication', 
                    'Push notifications', 'Analytics', 'Mapping/location services', 
                    'Customer support', 'Delivery/logistics', 'Fraud prevention', 'Technical infrastructure'
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white p-2 rounded border border-slate-200">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="text-sm font-semibold text-slate-800 mb-2">Legal and Government Authorities</h4>
                <p className="text-xs text-slate-500 mb-2">Information may be disclosed where reasonably necessary to:</p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-600">
                  {[
                    'Comply with applicable laws', 'Respond to lawful government requests', 
                    'Comply with court orders', 'Investigate suspected fraud', 
                    'Protect Home & Scooter and its users', 'Protect legal rights or safety', 
                    'Enforce our policies and agreements'
                  ].map((i, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Section 10 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                <Eye className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">10. Public Marketplace Information</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              Information intentionally published by users in marketplace listings may be visible to other users. Public information may include:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-700 mb-4">
              {[
                'Seller display name', 'Profile photograph', 'Product photographs', 
                'Product description', 'Product price', 'Product condition', 
                'General location', 'Ratings and reviews'
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center font-medium">
                  {item}
                </div>
              ))}
            </div>
            <div className="p-3 bg-amber-50 text-amber-900 text-xs rounded-lg border border-amber-200">
              Users should avoid publishing sensitive personal information in publicly accessible profiles, photographs, descriptions, listings, or reviews.
            </div>
          </section>

          {/* Section 11 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">11. Data Security</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              Home & Scooter implements reasonable administrative, organizational, and technical safeguards designed to protect personal information against:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-semibold text-slate-700 mb-4">
              {['Unauthorized access', 'Unauthorized disclosure', 'Modification', 'Misuse', 'Loss', 'Destruction'].map((item, idx) => (
                <div key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
              However, no internet transmission, mobile application, database, or electronic storage system can guarantee absolute security. Users are responsible for maintaining the confidentiality of their passwords and account credentials.
            </p>
          </section>

          {/* Section 12 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">12. Data Retention</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              We may retain personal information for as long as reasonably necessary to:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700 mb-4">
              {[
                'Maintain user accounts',
                'Provide marketplace functionality',
                'Maintain transaction records',
                'Resolve disputes',
                'Prevent fraud',
                'Meet accounting or regulatory requirements',
                'Comply with applicable laws'
              ].map((i, idx) => (
                <li key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
                  <span>{i}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-slate-500">
              When personal information is no longer reasonably required, it may be deleted or anonymized in accordance with applicable requirements.
            </p>
          </section>

          {/* Section 13 - HIGHLIGHTED DELETION SECTION */}
          <section className="bg-white rounded-2xl border-2 border-red-200 p-6 sm:p-8 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 px-4 py-1 bg-red-500 text-white text-[10px] uppercase tracking-widest font-extrabold rounded-bl-xl">
              Important Action
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">13. Account and Data Deletion</h2>
                <p className="text-xs text-slate-500">User Rights for Deletion & Anonymization</p>
              </div>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              Users may request deletion of their Home & Scooter account and associated eligible personal information.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Option 1: In App */}
              <div className="bg-gradient-to-br from-slate-50 to-red-50/30 p-4 sm:p-5 rounded-xl border border-red-100">
                <h4 className="text-xs font-bold text-red-700 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-red-600" />
                  In-App Deletion Method
                </h4>
                <p className="text-xs text-slate-600 mb-3">Where this functionality is available in the App, users may navigate to:</p>
                <div className="p-3 bg-white border border-red-200 rounded-lg font-mono text-xs font-bold text-slate-800 text-center shadow-2xs">
                  Home & Scooter → Profile → Settings → Delete Account
                </div>
              </div>

              {/* Option 2: Email */}
              <div className="bg-gradient-to-br from-slate-50 to-red-50/30 p-4 sm:p-5 rounded-xl border border-red-100">
                <h4 className="text-xs font-bold text-red-700 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-red-600" />
                  Email Deletion Request
                </h4>
                <p className="text-xs text-slate-600 mb-3">Users may also submit an account or data deletion request by email:</p>
                <a
                  href="mailto:kvmurali62@gmail.com?subject=Account%20and%20Data%20Deletion%20Request%20-%20Home%20%26%20Scooter"
                  className="inline-flex items-center justify-center gap-2 w-full p-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                >
                  <Mail className="w-4 h-4" />
                  kvmurali62@gmail.com
                </a>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <p>
                When submitting a deletion request by email, users should send the request from their registered email address where possible so that account ownership can be verified.
              </p>
              <p>
                Following verification and processing of a valid deletion request, eligible personal information associated with the account will be deleted or anonymized. Certain information may be retained where reasonably necessary for:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 font-medium text-slate-700 pt-1">
                {[
                  'Legal compliance', 'Financial/accounting', 'Transaction records', 
                  'Fraud prevention', 'Security', 'Dispute resolution', 'Enforcement of legal rights'
                ].map((i, idx) => (
                  <span key={idx} className="bg-white px-2 py-1 rounded border border-slate-200 text-center">
                    {i}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Section 14 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">14. User Privacy Rights</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              Subject to applicable Indian laws and other applicable requirements, users may have rights concerning their personal information, including the ability to:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700 mb-6">
              {[
                'Request access to eligible personal information',
                'Request correction of inaccurate information',
                'Request deletion of eligible information',
                'Withdraw certain permissions or consent',
                'Request information regarding data processing',
                'Submit privacy-related complaints or grievances'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-600 font-medium">Submit privacy requests directly to our privacy team:</span>
              <a
                href="mailto:kvmurali62@gmail.com?subject=Privacy%20Rights%20Request"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shrink-0"
              >
                <Mail className="w-3.5 h-3.5" />
                kvmurali62@gmail.com
              </a>
            </div>
          </section>

          {/* Section 15 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">15. Notifications and Communications</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              Home & Scooter may send notifications concerning:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-700 mb-4">
              {[
                'Account activity', 'Buyer/seller interactions', 'Listing activity', 
                'Transactions', 'Payments', 'Security alerts', 
                'Service announcements', 'Important Platform updates'
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center font-medium">
                  {item}
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500">
              Where permitted and applicable, promotional communications may also be provided. Users may manage eligible notification permissions through their device or App settings.
            </p>
          </section>

          {/* Section 16 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">16. Cookies and Similar Technologies</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              The Home & Scooter website and web-based services may use cookies or similar technologies to:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-700 mb-4">
              {[
                'Maintain user sessions', 'Remember user preferences', 'Analyze Platform usage', 
                'Improve performance', 'Detect fraudulent activity', 'Maintain security'
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-medium">
                  • {item}
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500">
              Users may manage cookies through their browser settings.
            </p>
          </section>

          {/* Section 17 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">17. Third-Party Services</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              Home & Scooter may integrate with third-party services, including:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-700 mb-4">
              {[
                'Payment gateways', 'Cloud hosting providers', 'Authentication services', 
                'Analytics providers', 'Mapping & location services', 'Delivery / logistics', 'SMS & email providers'
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-center font-medium">
                  {item}
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500">
              Third-party providers operate according to their respective privacy policies and terms. Users are encouraged to review the privacy policies of relevant third-party services.
            </p>
          </section>

          {/* Section 18 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">18. Fraud Prevention and Marketplace Safety</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              Home & Scooter may process relevant account, device, listing, communication, and transaction information to identify and prevent:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-700 mb-4">
              {[
                'Fraudulent listings', 'Fake accounts', 'Spam', 
                'Payment abuse', 'Unauthorized account access', 'Suspicious transactions', 
                'Marketplace scams', 'Violations of Platform policies'
              ].map((item, idx) => (
                <div key={idx} className="bg-rose-50/50 p-2.5 rounded-lg border border-rose-100 text-center font-medium text-rose-900">
                  {item}
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500">
              Where reasonably necessary, Home & Scooter may restrict, suspend, or terminate accounts or marketplace activities in accordance with applicable policies.
            </p>
          </section>

          {/* Section 19 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">19. Children's Privacy</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              Home & Scooter is not intended for children who are not legally permitted to independently use buying and selling marketplace services. We do not knowingly collect children's personal information contrary to applicable legal requirements. If we become aware that such information has been collected contrary to applicable requirements, appropriate steps will be taken to delete or otherwise address the information.
            </p>
          </section>

          {/* Section 20 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">20. International Data Processing</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              Some third-party technology or infrastructure providers used by Home & Scooter may process or store information outside India. Where required, appropriate safeguards will be used in accordance with applicable legal requirements concerning the transfer and processing of personal information.
            </p>
          </section>

          {/* Section 21 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">21. Changes to This Privacy Policy</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              Home & Scooter may update this Privacy Policy periodically to reflect changes in:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-700 mb-4">
              {[
                'App functionality', 'Marketplace services', 'Technology', 
                'Business practices', 'Third-party integrations', 'Security practices', 'Applicable laws and regulations'
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-center font-medium">
                  {item}
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500">
              The latest version will display its updated revision date. Where appropriate, users may be notified of material changes through the App, website, email, or another reasonable communication method.
            </p>
          </section>

          {/* Section 22 & 23 - CONTACT & GRIEVANCE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Section 22 */}
            <section className="bg-gradient-to-br from-blue-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold">22. Contact Us</h2>
              </div>
              <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                For privacy questions, complaints, account deletion requests, or concerns regarding your personal information, contact:
              </p>
              
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-2 text-slate-200">
                  <span className="font-semibold text-blue-300 w-24">App Name:</span>
                  <span>Home & Scooter</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <span className="font-semibold text-blue-300 w-24">Company:</span>
                  <span>Home & Scooter</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <span className="font-semibold text-blue-300 w-24">Email:</span>
                  <a href="mailto:kvmurali62@gmail.com" className="text-blue-400 hover:underline">
                    kvmurali62@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <span className="font-semibold text-blue-300 w-24">Website:</span>
                  <a href="https://homeandscooterapp.online" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
                    homeandscooterapp.online
                  </a>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <span className="font-semibold text-blue-300 w-24">Address:</span>
                  <span>Bangalore, Karnataka</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <span className="font-semibold text-blue-300 w-24">Country:</span>
                  <span>India</span>
                </div>
              </div>
            </section>

            {/* Section 23 */}
            <section className="bg-gradient-to-br from-teal-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold">23. Grievance Contact</h2>
              </div>
              <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                Users may submit privacy-related complaints, grievances, correction requests, or deletion requests using the following contact details:
              </p>
              
              <div className="space-y-3 text-xs mb-6">
                <div className="flex items-center gap-2 text-slate-200">
                  <span className="font-semibold text-teal-300 w-24">Company:</span>
                  <span>Home & Scooter</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <span className="font-semibold text-teal-300 w-24">Email:</span>
                  <a href="mailto:kvmurali62@gmail.com" className="text-teal-300 hover:underline">
                    kvmurali62@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <span className="font-semibold text-teal-300 w-24">Location:</span>
                  <span>Bangalore, Karnataka, India</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 bg-white/5 p-3 rounded-lg border border-white/10 italic">
                We will review legitimate privacy requests and grievances in accordance with applicable legal requirements.
              </p>
            </section>

          </div>

        </div>

        {/* Legal Document Footer */}
        <footer className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-xs text-slate-500 space-y-2 print:border-none">
          <div className="font-bold text-slate-800 text-sm">Home & Scooter</div>
          <div>Bangalore, Karnataka, India</div>
          <div className="flex justify-center gap-4 text-blue-600">
            <a href="mailto:kvmurali62@gmail.com" className="hover:underline">kvmurali62@gmail.com</a>
            <span>•</span>
            <a href="https://homeandscooterapp.online" target="_blank" rel="noreferrer" className="hover:underline">homeandscooterapp.online</a>
          </div>
          <div className="text-slate-400 pt-2 border-t border-slate-100">
            © 2026 Home & Scooter. All Rights Reserved.
          </div>
        </footer>

      </main>

      {/* Floating Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 p-3 bg-slate-900 text-white rounded-full shadow-lg hover:bg-slate-800 transition-all z-30 print:hidden"
        title="Scroll to Top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </div>
  );
};
