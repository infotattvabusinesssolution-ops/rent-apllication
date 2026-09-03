import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Printer, 
  Share2, 
  ArrowUp, 
  Mail, 
  Globe, 
  UserCheck, 
  Smartphone, 
  Lock, 
  Trash2, 
  ShieldCheck, 
  AlertTriangle, 
  Eye, 
  CreditCard, 
  CheckCircle2, 
  Info,
  Scale,
  Package,
  Truck,
  Ban,
  DollarSign,
  HelpCircle,
  Building
} from 'lucide-react';
import { toast } from 'sonner';

export const TermsConditions = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Terms & Conditions link copied to clipboard!');
  };

  const handlePrint = () => {
    window.print();
  };

  const scrollToTop = () => {
    const container = document.getElementById('terms-conditions-scroll-container');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div id="terms-conditions-scroll-container" className="h-screen w-full overflow-y-auto bg-slate-50 text-slate-800 font-sans pb-12">
      {/* Top Header Bar */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs z-30 print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-lg sm:text-xl leading-tight">
              Home & Scooter
            </h1>
            <p className="text-xs text-slate-500 font-medium">Terms & Conditions Documentation</p>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative hidden sm:block w-48 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search terms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-100 text-slate-800 placeholder-slate-400 rounded-lg text-sm border border-transparent focus:border-indigo-500 focus:bg-white focus:outline-none transition-all"
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
            <Share2 className="w-4 h-4 text-indigo-600" />
            <span className="hidden sm:inline">Copy Link</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors shadow-sm shadow-indigo-500/20"
            title="Print Terms"
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
            placeholder="Search in terms & conditions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white text-slate-800 placeholder-slate-400 rounded-xl text-sm border border-slate-200 shadow-2xs focus:border-indigo-500 focus:outline-none"
          />
        </div>

        {/* Hero Banner Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-600 via-blue-600 to-teal-500" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-3">
                <Scale className="w-3.5 h-3.5" />
                Legal Platform Agreement
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                TERMS & CONDITIONS
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

          <div className="bg-gradient-to-r from-slate-50 to-indigo-50/40 rounded-xl p-4 sm:p-5 border border-slate-200/80 text-sm text-slate-700 leading-relaxed">
            Welcome to <strong>Home & Scooter</strong>. These Terms & Conditions (“Terms”) govern your access to and use of the Home & Scooter mobile application, website, marketplace, and related services (“Platform”). The Platform is operated by <strong>Home & Scooter, Bangalore, Karnataka, India</strong>. By registering for, accessing, browsing, or using Home & Scooter, you agree to these Terms. If you do not agree with these Terms, you should not use the Platform.
          </div>

          {/* Highlights Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
              <Building className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
              <div className="text-xs font-semibold text-slate-800">Marketplace Role</div>
              <div className="text-[11px] text-slate-500">Connecting Buyers & Sellers</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
              <UserCheck className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <div className="text-xs font-semibold text-slate-800">Eligibility</div>
              <div className="text-[11px] text-slate-500">Legal Agreement Standards</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
              <Ban className="w-5 h-5 text-rose-500 mx-auto mb-1" />
              <div className="text-xs font-semibold text-slate-800">Prohibited Items</div>
              <div className="text-[11px] text-slate-500">Strict Safety Compliance</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
              <Scale className="w-5 h-5 text-teal-600 mx-auto mb-1" />
              <div className="text-xs font-semibold text-slate-800">Governing Law</div>
              <div className="text-[11px] text-slate-500">Bangalore, Karnataka, India</div>
            </div>
          </div>
        </div>

        {/* All Policy Sections Stacked in Single Page Column */}
        <div className="space-y-6">

          {/* Section 1 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Info className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">1. About Home & Scooter</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              Home & Scooter is an online marketplace that enables users to list, discover, buy, and sell eligible products and items. The Platform may provide functionality including:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-700">
              {[
                'Buyer and seller registration',
                'User profiles',
                'Product listings',
                'Product photographs and descriptions',
                'Search and filtering',
                'Buyer-seller communication',
                'Order and transaction management',
                'Online payments, where available',
                'Location-based marketplace functionality',
                'Notifications',
                'Ratings and reviews, where available'
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-4 italic">
              Features may be added, modified, restricted, or discontinued as the Platform develops.
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Building className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">2. Marketplace Role</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              Home & Scooter primarily provides technology that enables buyers and sellers to connect and conduct marketplace activities.
            </p>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
              <p>
                Unless expressly stated otherwise for a particular transaction, products listed by independent sellers are offered by those sellers and not directly by Home & Scooter.
              </p>
              <p className="font-semibold text-slate-900">
                Sellers are responsible for the accuracy, legality, condition, ownership, availability, description, and pricing of their listings. Buyers are responsible for reviewing available listing information before making a purchase or entering into a transaction.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">3. User Eligibility</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              You must be legally capable of entering into a binding agreement under applicable law to independently use the Platform. By creating an account, you represent that:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700 mb-4">
              {[
                'Information provided by you is accurate and current.',
                'You are legally permitted to use the Platform.',
                'You will comply with these Terms and applicable laws.',
                'You will not use Home & Scooter for unlawful or fraudulent purposes.'
              ].map((i, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                  <span>{i}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500">
              Where a user is not legally capable of independently entering into an agreement, use of the Platform must comply with applicable legal requirements.
            </p>
          </section>

          {/* Section 4 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">4. Account Registration</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              Certain Home & Scooter functionality may require registration. Users may be required to provide information including:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-700 mb-4">
              {[
                'Name', 'Mobile number', 'Email address', 'Address', 
                'Profile information', 'Seller information', 'Verification information'
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center font-medium">
                  {item}
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Users are responsible for keeping their account information accurate and up to date.
            </p>
          </section>

          {/* Section 5 - ACCOUNT SECURITY */}
          <section className="bg-white rounded-2xl border-2 border-indigo-200 p-6 sm:p-8 shadow-md relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">5. Account Security</h2>
                <p className="text-xs text-slate-500">Confidentiality & Access Credentials</p>
              </div>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              Users are responsible for maintaining the confidentiality of their credentials:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold text-slate-800 mb-4">
              {['Password', 'OTP', 'Login credentials', 'Account access'].map((item, idx) => (
                <div key={idx} className="bg-indigo-50 p-2.5 rounded-lg border border-indigo-100 text-center text-indigo-900">
                  {item}
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
              <p>
                You must not knowingly allow unauthorized persons to use your account. If you suspect unauthorized access, immediately secure your account and contact:
              </p>
              <div className="flex items-center gap-2 pt-1 font-bold text-indigo-600">
                <Mail className="w-4 h-4" />
                <a href="mailto:kvmurali62@gmail.com" className="hover:underline">
                  kvmurali62@gmail.com
                </a>
              </div>
            </div>

            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 font-semibold">
              Home & Scooter will never require you to publicly disclose your password or OTP to another marketplace user.
            </div>
          </section>

          {/* Section 6 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <Package className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">6. Seller Responsibilities</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              Sellers using Home & Scooter agree to:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700 mb-4">
              {[
                'Provide accurate product information.',
                'Upload photographs that reasonably represent the actual item.',
                'Clearly disclose known material defects or damage.',
                'Provide accurate pricing.',
                'Maintain accurate product availability.',
                'Have the legal right to sell listed products.',
                'Comply with applicable laws and regulations.',
                'Fulfil accepted transactions in accordance with agreed terms.',
                'Avoid misleading, deceptive, or fraudulent listings.'
              ].map((i, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs">
                  <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-1.5 shrink-0" />
                  <span>{i}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-600 font-medium">
              Sellers remain responsible for their listings and products.
            </p>
          </section>

          {/* Section 7 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Eye className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">7. Product Listings</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              Home & Scooter may establish listing rules regarding titles, descriptions, photographs, categories, prices, and prohibited content. We reserve the right to remove or restrict listings that:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-700 mb-4">
              {[
                'Violate these Terms', 'Violate applicable laws', 'Contain misleading info', 
                'Appear fraudulent', 'Infringe 3rd party rights', 'Inappropriate content', 
                'Security or safety concerns', 'Prohibited items'
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center font-medium">
                  {item}
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 italic">
              Removal of a listing does not necessarily mean Home & Scooter has determined that the seller violated a law.
            </p>
          </section>

          {/* Section 8 - PROHIBITED ITEMS */}
          <section className="bg-white rounded-2xl border-2 border-rose-200 p-6 sm:p-8 shadow-md relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <Ban className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">8. Prohibited and Restricted Items</h2>
                <p className="text-xs text-slate-500">Strict Marketplace Safety Rules</p>
              </div>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              Users must not use Home & Scooter to list, advertise, purchase, or sell products prohibited by applicable law or Platform policy. Prohibited items include:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-700 mb-4">
              {[
                'Illegal goods', 'Stolen property', 'Counterfeit products', 
                'Unauthorized copyrighted goods', 'Dangerous substances', 'Illegal drugs or narcotics', 
                'Weapons or explosives', 'Fraudulent documents', 'Unauthorized IP infringement', 
                'Products prohibited under Indian Law'
              ].map((item, idx) => (
                <div key={idx} className="bg-rose-50/50 p-2.5 rounded-lg border border-rose-100 text-rose-900 font-medium flex items-center gap-2">
                  <Ban className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-rose-800 bg-rose-50 p-3 rounded-lg border border-rose-200 font-medium">
              Home & Scooter may remove prohibited listings and restrict or suspend associated accounts immediately.
            </p>
          </section>

          {/* Section 9 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">9. Buyer Responsibilities</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              Buyers should carefully review product description, photographs, price, condition, seller info, delivery arrangements, and cancellation terms before confirming a transaction.
            </p>
            <p className="text-xs text-slate-600 font-bold mb-2">Buyers must NOT:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-700">
              {[
                'Make fraudulent orders', 'Misuse payment systems', 'Provide false information', 
                'Abuse sellers or users', 'Manipulate reviews/ratings', 'Unlawful platform usage'
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center font-medium">
                  {item}
                </div>
              ))}
            </div>
          </section>

          {/* Section 10 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
                <DollarSign className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">10. Pricing</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              Sellers are generally responsible for determining the prices of their listings unless otherwise specified by Home & Scooter. Prices displayed on the Platform may be subject to applicable taxes, delivery charges, Platform charges, or other fees where disclosed.
            </p>
            <p className="text-xs text-slate-500 font-medium">
              Users should review the total amount presented before confirming a paid transaction.
            </p>
          </section>

          {/* Section 11 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">11. Payments</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              Where online payments are available, payments may be processed through third-party payment service providers. Users may be required to comply with the payment provider's terms and policies.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 mb-4">
              Home & Scooter may receive transaction-related info: <strong>Transaction ID, Amount, Payment method, Payment status</strong>.
            </div>
            <p className="text-xs text-slate-500 italic">
              Home & Scooter does not ordinarily store complete debit or credit card information where payment details are processed directly by an authorized payment provider.
            </p>
          </section>

          {/* Section 12 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">12. Failed Payments</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              A transaction may fail due to banking issues, gateway errors, insufficient funds, network problems, incorrect info, technical issues, or security restrictions.
            </p>
            <p className="text-xs text-slate-500">
              Where money is debited but the transaction is unsuccessful, reversal timelines depend on the relevant bank, payment provider, or payment gateway.
            </p>
          </section>

          {/* Section 13 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Package className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">13. Orders and Transactions</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              Submitting an order or purchase request does not necessarily guarantee successful completion. Transactions may be cancelled or rejected due to unavailability, pricing errors, payment failure, suspected fraud, seller cancellation, or technical/policy issues.
            </p>
            <div className="p-3 bg-indigo-50 text-indigo-900 text-xs rounded-lg border border-indigo-200 font-medium">
              Applicable refund and cancellation rules are described separately in the Home & Scooter Refund & Cancellation Policy.
            </div>
          </section>

          {/* Section 14 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">14. Delivery and Collection</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              Depending on the transaction, products may be delivered by a seller, delivered using a 3rd-party logistics provider, collected directly by the buyer, or delivered through another supported arrangement.
            </p>
            <p className="text-xs text-slate-500 italic">
              Estimated delivery times are estimates unless expressly guaranteed. Home & Scooter is not responsible for delays caused by circumstances reasonably outside its control.
            </p>
          </section>

          {/* Section 15 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <Package className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">15. Product Condition</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              Home & Scooter may support listings for new and/or pre-owned products. For pre-owned products, reasonable signs of prior use may exist. Sellers must accurately disclose condition, and buyers should review descriptions before purchasing.
            </p>
          </section>

          {/* Section 16 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">16. Buyer and Seller Communication</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              Users may communicate through Home & Scooter. Communication functionality must NOT be used for harassment, threats, spam, fraud, phishing, malware, or soliciting sensitive banking credentials.
            </p>
            <div className="p-3 bg-amber-50 text-amber-900 text-xs rounded-lg border border-amber-200 font-semibold">
              Users should never share passwords, OTPs, PINs, or complete banking credentials with other marketplace users.
            </div>
          </section>

          {/* Section 17 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Eye className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">17. Reviews and Ratings</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              Where ratings and reviews are available, users must submit genuine feedback based on actual experience. Users must not submit fake reviews, manipulate ratings, pay for fraudulent reviews, or post defamatory content.
            </p>
          </section>

          {/* Section 18 & 19 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
              <h2 className="text-lg font-bold text-slate-900 mb-3">18. Intellectual Property</h2>
              <p className="text-xs text-slate-700 leading-relaxed">
                The Home & Scooter name, Platform design, software, graphics, logos, and proprietary materials are protected by intellectual property laws. Users may not copy, modify, distribute, or commercially exploit materials without authorization.
              </p>
            </section>

            <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
              <h2 className="text-lg font-bold text-slate-900 mb-3">19. User-Generated Content</h2>
              <p className="text-xs text-slate-700 leading-relaxed">
                Users retain rights in uploaded content (photos, descriptions, reviews) but grant Home & Scooter permission to host, display, and reproduce content to operate and promote the Platform.
              </p>
            </section>
          </div>

          {/* Section 20 & 21 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">20 & 21. Fraud, Misuse & Account Suspension</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              Home & Scooter investigates suspected fraud, fake listings, payment abuse, spam, manipulation, or policy violations. We reserve the right to restrict, suspend, or terminate accounts where reasonably necessary.
            </p>
          </section>

          {/* Section 22 - ACCOUNT DELETION */}
          <section className="bg-white rounded-2xl border-2 border-red-200 p-6 sm:p-8 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">22. Account Deletion</h2>
                <p className="text-xs text-slate-500">User Data Deletion Policy</p>
              </div>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              Users may request deletion of their Home & Scooter account through available account settings or by contacting:
            </p>
            <a
              href="mailto:kvmurali62@gmail.com?subject=Account%20Deletion%20Request%20-%20Terms%20Agreement"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors"
            >
              <Mail className="w-4 h-4" />
              kvmurali62@gmail.com
            </a>
          </section>

          {/* Section 23, 24, 25 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-700">
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-2">23. Privacy</h3>
              <p>Subject to the Home & Scooter Privacy Policy which details collection, processing, and data sharing.</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-2">24. Third-Party Services</h3>
              <p>Integrates with payment, mapping, auth, logistics, and cloud providers operating under their own policies.</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-2">25. Platform Availability</h3>
              <p>Operation is provided as reliable as possible; maintenance or outages may occasionally occur.</p>
            </div>
          </div>

          {/* Section 26, 27, 28 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <h2 className="text-xl font-bold text-slate-900 mb-4">26, 27 & 28. Disclaimer, Liability & Indemnification</h2>
            <div className="space-y-3 text-xs text-slate-700">
              <p>
                <strong>Disclaimer:</strong> Home & Scooter is provided on an “as available” basis. For independent seller transactions, Home & Scooter does not independently guarantee seller representations unless explicitly stated.
              </p>
              <p>
                <strong>Limitation of Liability:</strong> To the extent permitted by law, Home & Scooter will not be liable for indirect, incidental, or consequential losses.
              </p>
              <p>
                <strong>Indemnification:</strong> Users agree to be responsible for claims or liabilities arising from unlawful platform use or breach of Terms.
              </p>
            </div>
          </section>

          {/* Section 29 - GOVERNING LAW */}
          <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0">
                <Scale className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold">29. Governing Law & Jurisdiction</h2>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              These Terms are governed by the laws of India. Subject to applicable law, disputes relating to Home & Scooter will be subject to the jurisdiction of competent courts in <strong>Bangalore, Karnataka, India</strong>.
            </p>
            <p className="text-[11px] text-slate-400 italic">
              Nothing in this provision prevents a consumer from exercising any mandatory rights or remedies available under applicable law.
            </p>
          </section>

          {/* Section 30 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <h2 className="text-xl font-bold text-slate-900 mb-3">30. Changes to These Terms</h2>
            <p className="text-xs text-slate-700 leading-relaxed">
              Home & Scooter may update these Terms periodically. Continued use following an update constitutes acceptance to the extent permitted by applicable law.
            </p>
          </section>

          {/* Section 31 - CONTACT US */}
          <section className="bg-gradient-to-br from-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold">31. Contact Us</h2>
            </div>
            <p className="text-xs text-slate-300 mb-6 leading-relaxed">
              For questions, complaints, or support regarding these Terms, contact:
            </p>
            
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2 text-slate-200">
                <span className="font-semibold text-indigo-300 w-24">App Name:</span>
                <span>Home & Scooter</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <span className="font-semibold text-indigo-300 w-24">Company:</span>
                <span>Home & Scooter</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <span className="font-semibold text-indigo-300 w-24">Email:</span>
                <a href="mailto:kvmurali62@gmail.com" className="text-indigo-300 hover:underline">
                  kvmurali62@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <span className="font-semibold text-indigo-300 w-24">Website:</span>
                <a href="https://homeandscooterapp.online" target="_blank" rel="noreferrer" className="text-indigo-300 hover:underline">
                  homeandscooterapp.online
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <span className="font-semibold text-indigo-300 w-24">Address:</span>
                <span>Bangalore, Karnataka, India</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <span className="font-semibold text-indigo-300 w-24">Country:</span>
                <span>India</span>
              </div>
            </div>
          </section>

        </div>

        {/* Legal Document Footer */}
        <footer className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-xs text-slate-500 space-y-2 print:border-none">
          <div className="font-bold text-slate-800 text-sm">Home & Scooter</div>
          <div>Bangalore, Karnataka, India</div>
          <div className="flex justify-center gap-4 text-indigo-600">
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
