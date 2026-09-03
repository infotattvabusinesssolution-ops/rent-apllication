import React, { useState } from 'react';
import { 
  RotateCcw, 
  Search, 
  Printer, 
  Share2, 
  ArrowUp, 
  Mail, 
  Globe, 
  UserCheck, 
  Smartphone, 
  Lock, 
  FileText, 
  CreditCard, 
  CheckCircle2, 
  XCircle,
  AlertTriangle, 
  Package, 
  Truck,
  DollarSign,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';

export const RefundPolicy = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Refund & Cancellation policy link copied to clipboard!');
  };

  const handlePrint = () => {
    window.print();
  };

  const scrollToTop = () => {
    const container = document.getElementById('refund-policy-scroll-container');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div id="refund-policy-scroll-container" className="h-screen w-full overflow-y-auto bg-slate-50 text-slate-800 font-sans pb-12">
      {/* Top Header Bar */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs z-30 print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
            <RotateCcw className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-lg sm:text-xl leading-tight">
              Home & Scooter
            </h1>
            <p className="text-xs text-slate-500 font-medium">Refund & Cancellation Policy</p>
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
              className="w-full pl-9 pr-3 py-1.5 bg-slate-100 text-slate-800 placeholder-slate-400 rounded-lg text-sm border border-transparent focus:border-teal-500 focus:bg-white focus:outline-none transition-all"
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
            <Share2 className="w-4 h-4 text-teal-600" />
            <span className="hidden sm:inline">Copy Link</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium transition-colors shadow-sm shadow-teal-500/20"
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
            placeholder="Search keywords in refund policy..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white text-slate-800 placeholder-slate-400 rounded-xl text-sm border border-slate-200 shadow-2xs focus:border-teal-500 focus:outline-none"
          />
        </div>

        {/* Hero Banner Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-600 via-emerald-500 to-blue-600" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold mb-3">
                <RotateCcw className="w-3.5 h-3.5" />
                Official Refund & Cancellation Terms
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                REFUND & CANCELLATION POLICY
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

          <div className="bg-gradient-to-r from-slate-50 to-teal-50/40 rounded-xl p-4 sm:p-5 border border-slate-200/80 text-sm text-slate-700 leading-relaxed">
            This Refund & Cancellation Policy explains the rules applicable to cancellations, refunds, failed payments, and marketplace transactions made through <strong>Home & Scooter</strong>. Home & Scooter is an online buying and selling marketplace connecting buyers and sellers. Refund eligibility may depend on the nature of the transaction, seller terms, product condition, payment method, delivery status, and applicable law.
          </div>

          {/* Highlights Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
              <XCircle className="w-5 h-5 text-amber-600 mx-auto mb-1" />
              <div className="text-xs font-semibold text-slate-800">Pre-Dispatch Cancel</div>
              <div className="text-[11px] text-slate-500">Before Dispatch Request</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
              <DollarSign className="w-5 h-5 text-teal-600 mx-auto mb-1" />
              <div className="text-xs font-semibold text-slate-800">Original Payment</div>
              <div className="text-[11px] text-slate-500">Auto Reversals</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
              <CreditCard className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <div className="text-xs font-semibold text-slate-800">Duplicate Charge</div>
              <div className="text-[11px] text-slate-500">Verified Full Refund</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
              <Mail className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
              <div className="text-xs font-semibold text-slate-800">Support Assistance</div>
              <div className="text-[11px] text-slate-500">Dispute Review</div>
            </div>
          </div>
        </div>

        {/* All Policy Sections Stacked in Single Page Column */}
        <div className="space-y-6">

          {/* Section 1 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <XCircle className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">1. Order Cancellation</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              A buyer may request cancellation of an order before the product has been dispatched or otherwise committed for delivery, where cancellation functionality is available.
            </p>
            <div className="p-3 bg-amber-50/70 border border-amber-200 text-xs text-amber-900 rounded-xl mb-4 font-medium">
              Once an item has been dispatched, collected, delivered, or the transaction has otherwise been completed, cancellation may not be available.
            </div>
            <p className="text-xs text-slate-600">
              Where applicable, users can request cancellation through the order section of the Home & Scooter App or by contacting the relevant seller or Home & Scooter support.
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">2. Seller Cancellation</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              A seller may cancel a transaction where reasonably necessary because of:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700 mb-4">
              {[
                'Product unavailability',
                'Incorrect listing information',
                'Pricing errors',
                'Product damage before dispatch',
                'Inability to fulfil the order',
                'Suspected fraudulent activity',
                'Other legitimate fulfilment issues'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="p-3 bg-teal-50 text-teal-900 text-xs rounded-lg border border-teal-200 font-medium">
              If an eligible prepaid transaction is cancelled by the seller, the applicable refund will be initiated according to the original payment method or another permitted method.
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">3. Cancellation by Home & Scooter</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              Home & Scooter may cancel or restrict a transaction where reasonably necessary because of:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-700 mb-4">
              {[
                'Suspected fraud', 'Payment failure', 'Platform abuse', 
                'Prohibited product listings', 'Incorrect pricing', 'Technical errors', 
                'Security concerns', 'Violation of Platform policies', 'Legal or regulatory requirements'
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center font-medium">
                  {item}
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-600">
              Where an eligible prepaid transaction is cancelled, an applicable refund will be processed.
            </p>
          </section>

          {/* Section 4 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">4. Refund Eligibility</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              A refund may be considered where applicable if:
            </p>
            <div className="space-y-2 text-sm text-slate-700 mb-4">
              {[
                'A prepaid order is cancelled before fulfilment.',
                'A seller cancels a prepaid order.',
                'Payment was successfully collected but the transaction could not be completed.',
                'A duplicate payment was charged.',
                'The wrong product was delivered.',
                'The product materially differs from its listing.',
                'A product was materially damaged before or during delivery, where applicable.',
                'A refund is otherwise required under applicable law.'
              ].map((i, idx) => (
                <div key={idx} className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>{i}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 italic">
              Refund eligibility may require verification of the circumstances.
            </p>
          </section>

          {/* Section 5 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <XCircle className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">5. Non-Refundable Situations</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              Subject to applicable consumer rights, a refund may be declined where:
            </p>
            <div className="space-y-2 text-sm text-slate-700 mb-4">
              {[
                'The buyer simply changes their mind after completing an eligible non-returnable transaction.',
                'The buyer provided incorrect information that caused the transaction issue.',
                'The product has been materially altered, damaged, misused, or tampered with after receipt.',
                'The buyer fails to provide reasonable evidence for a claimed issue.',
                'The complaint is made outside an applicable return/refund period.',
                'The transaction occurred outside Home & Scooter and cannot reasonably be verified.',
                'The buyer and seller independently agreed to terms outside the Platform.',
                'The request involves fraudulent or abusive activity.'
              ].map((i, idx) => (
                <div key={idx} className="flex items-start gap-2.5 bg-rose-50/40 p-2.5 rounded-lg border border-rose-100 text-xs text-slate-700">
                  <XCircle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                  <span>{i}</span>
                </div>
              ))}
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 font-medium">
              Nothing in this section removes rights that a consumer is entitled to under applicable law.
            </div>
          </section>

          {/* Section 6 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Package className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">6. Used and Pre-Owned Products</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              Home & Scooter may allow users to sell pre-owned or used products. Normal signs of prior use that were reasonably disclosed in the listing do not automatically make a product eligible for refund.
            </p>
            <p className="text-xs text-slate-600 mb-3 font-semibold">Buyers are encouraged to carefully review:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-700 mb-4">
              {[
                'Product photographs', 'Product descriptions', 'Product condition', 
                'Known defects', 'Seller information', 'Price before transaction'
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center font-medium">
                  {item}
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-600">
              If a seller materially misrepresents a product, the buyer may raise a dispute for review.
            </p>
          </section>

          {/* Section 7 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">7. Incorrect or Damaged Products</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              If a product arrives materially damaged or materially different from the listing, the buyer should contact the seller and/or Home & Scooter as soon as reasonably possible.
            </p>
            <p className="text-xs text-slate-600 mb-3 font-semibold">The buyer may be requested to provide:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-700 mb-4">
              {[
                'Order number', 'Product photographs', 'Photographs of damage', 
                'Packaging photographs', 'Description of the issue', 'Other reasonable evidence'
              ].map((item, idx) => (
                <div key={idx} className="bg-amber-50/50 p-2.5 rounded-lg border border-amber-100 text-center font-medium text-amber-900">
                  {item}
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-600">
              Refund, replacement, return, or another resolution may be offered depending on the circumstances and applicable law.
            </p>
          </section>

          {/* Section 8 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">8. Failed Transactions</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              If payment is deducted but an order is not successfully created or confirmed, users should first check their transaction status. Depending on the payment provider, failed transaction amounts may be automatically reversed.
            </p>
            <p className="text-xs text-slate-500 mb-2">The time required for reversal depends on:</p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs text-slate-700 mb-4">
              {['Payment gateway', 'Bank', 'Card issuer', 'UPI provider', 'Payment method'].map((item, idx) => (
                <div key={idx} className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-center font-medium">
                  {item}
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 italic">
              Home & Scooter cannot control banking or payment-provider processing timelines.
            </p>
          </section>

          {/* Section 9 - DUPLICATE PAYMENTS HIGHLIGHT */}
          <section className="bg-white rounded-2xl border-2 border-blue-200 p-6 sm:p-8 shadow-md relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">9. Duplicate Payments</h2>
                <p className="text-xs text-slate-500">Refund Claims for Multiple Charges</p>
              </div>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              If a user is charged more than once for the same transaction, please contact our refund team at:
            </p>

            <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200 mb-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-bold text-blue-900">
                <Mail className="w-4 h-4 text-blue-600" />
                kvmurali62@gmail.com
              </div>
              <a
                href="mailto:kvmurali62@gmail.com?subject=Duplicate%20Payment%20Refund%20Claim"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shrink-0"
              >
                Submit Duplicate Claim
              </a>
            </div>

            <p className="text-xs text-slate-600 mb-2 font-semibold">Please provide the following details when submitting your request:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-700">
              {[
                'Registered name', 'Registered email / mobile', 
                'Order ID', 'Transaction ID', 
                'Payment amount', 'Date of transaction'
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-2 rounded border border-blue-100 font-mono text-slate-800">
                  • {item}
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-4">
              After verification, an eligible duplicate payment will be submitted for refund.
            </p>
          </section>

          {/* Section 10 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">10. Refund Processing</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              Approved refunds will generally be initiated through the original payment method where technically and legally possible. Depending on the payment provider and bank, the amount may take additional business days to appear in the user's account after the refund has been initiated.
            </p>
            <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
              Home & Scooter is not responsible for delays caused solely by banks, card networks, UPI providers, or other payment processors.
            </p>
          </section>

          {/* Section 11 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                <DollarSign className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">11. Cash or Direct Transactions</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              Where buyers and sellers complete transactions directly, including cash payments or payments made outside Home & Scooter, Home & Scooter may have limited ability to verify, reverse, or refund such payments.
            </p>
            <div className="p-3 bg-blue-50 text-blue-900 text-xs rounded-lg border border-blue-200 font-medium">
              Users are encouraged to use supported Platform transaction methods wherever available.
            </div>
          </section>

          {/* Section 12 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">12. Return Shipping</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              Where a return is approved, responsibility for return shipping may depend on the reason for the return.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700 mb-4">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">Seller Responsibility:</span>
                Where a seller sent a materially incorrect or misrepresented product, the seller may be responsible for applicable return arrangements.
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">Buyer Responsibility:</span>
                Where the return is requested for another reason, applicable shipping charges may be borne by the buyer where permitted.
              </div>
            </div>
            <p className="text-xs text-slate-500 italic">
              Specific instructions should be followed before returning a product.
            </p>
          </section>

          {/* Section 13 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">13. Refund Abuse</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              Home & Scooter may reject or investigate refund requests associated with suspected:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-700 mb-4">
              {[
                'Fraud', 'False claims', 'Repeated abusive refund activity', 
                'Manipulated evidence', 'Payment abuse', 'Account misuse'
              ].map((item, idx) => (
                <div key={idx} className="bg-rose-50/60 p-2.5 rounded-lg border border-rose-100 text-center font-medium text-rose-900">
                  {item}
                </div>
              ))}
            </div>
            <p className="text-xs text-rose-800 font-semibold bg-rose-50 p-3 rounded-lg border border-rose-200">
              Accounts involved in fraudulent activity may be restricted or suspended.
            </p>
          </section>

          {/* Section 14 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">14. Seller and Buyer Disputes</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              Where a buyer and seller cannot resolve a transaction-related issue, either party may contact Home & Scooter. We may review available:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-700 mb-4">
              {[
                'Listing information', 'Transaction records', 'Payment information', 
                'Communication records', 'Photographs', 'Supporting evidence'
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center font-medium">
                  {item}
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-600">
              Home & Scooter may assist with resolution where possible. Home & Scooter's involvement does not remove any legal rights or remedies available to buyers or sellers under applicable law.
            </p>
          </section>

          {/* Section 15 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">15. Cancellation and Refund Requests</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              Users may submit requests through available Home & Scooter order/support functionality or by contacting:
            </p>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-700">
                <span className="font-semibold text-slate-900 block">Email Support:</span>
                <a href="mailto:kvmurali62@gmail.com" className="text-teal-600 font-bold hover:underline">
                  kvmurali62@gmail.com
                </a>
              </div>
              <span className="text-xs text-slate-500 italic">Please provide sufficient transaction info & Order ID</span>
            </div>
          </section>

          {/* Section 16 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">16. Changes to This Policy</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              Home & Scooter may update this Refund & Cancellation Policy to reflect changes in:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-700 mb-4">
              {[
                'Marketplace functionality', 'Payment processes', 'Seller operations', 
                'Delivery arrangements', 'Business practices', 'Applicable laws'
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-center font-medium">
                  {item}
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500">
              The latest version will display the updated revision date.
            </p>
          </section>

          {/* Section 17 - CONTACT US */}
          <section className="bg-gradient-to-br from-teal-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold">17. Contact Us</h2>
            </div>
            <p className="text-xs text-slate-300 mb-6 leading-relaxed">
              For questions concerning cancellations, refunds, payments, or transaction disputes, contact:
            </p>
            
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2 text-slate-200">
                <span className="font-semibold text-teal-300 w-24">App Name:</span>
                <span>Home & Scooter</span>
              </div>
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
                <span className="font-semibold text-teal-300 w-24">Website:</span>
                <a href="https://homeandscooterapp.online" target="_blank" rel="noreferrer" className="text-teal-300 hover:underline">
                  homeandscooterapp.online
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <span className="font-semibold text-teal-300 w-24">Address:</span>
                <span>Bangalore, Karnataka, India</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <span className="font-semibold text-teal-300 w-24">Country:</span>
                <span>India</span>
              </div>
            </div>
          </section>

        </div>

        {/* Legal Document Footer */}
        <footer className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-xs text-slate-500 space-y-2 print:border-none">
          <div className="font-bold text-slate-800 text-sm">Home & Scooter</div>
          <div>Bangalore, Karnataka, India</div>
          <div className="flex justify-center gap-4 text-teal-600">
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
