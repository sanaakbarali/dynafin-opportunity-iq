'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWorkspace } from '@/lib/context/WorkspaceContext';
import { formatINR } from '@/lib/formatting/currency';
import {
  ShieldAlert,
  ArrowUpRight,
  TrendingUp,
  FileText,
  Sliders,
  DollarSign,
  Compass,
  CheckCircle2,
  Scale,
  Bot,
  FolderOpen,
  Bell,
  X,
  ChevronDown,
  Building2,
  Layers,
  Activity,
  Menu,
  User,
  LogOut,
} from 'lucide-react';

export function TopNav() {
  const pathname = usePathname();
  const {
    business,
    activeDemoId,
    switchDemoBusiness,
    activeOpportunity,
    notifications,
    dismissNotification,
    user,
    isAuthenticated,
    isDemoMode,
    userProfile,
    signOut,
  } = useWorkspace();

  const [showNotifs, setShowNotifs] = useState(false);
  const [showBizSwitcher, setShowBizSwitcher] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navLinks = [
    { name: 'Workspace', href: '/workspace', icon: Layers },
    { name: 'Opportunity Studio', href: '/opportunities', icon: ArrowUpRight, badge: 'Core' },
    { name: 'Cash Flow IQ', href: '/cash-flow', icon: Activity },
    { name: 'Buyer Intel', href: '/buyers', icon: TrendingUp },
    { name: 'Risk Assessment', href: '/risk', icon: ShieldAlert },
    { name: 'Scenario Lab', href: '/scenarios', icon: Sliders },
    { name: 'Funding Navigator', href: '/funding', icon: Compass },
    { name: 'Loan Readiness', href: '/loan-readiness', icon: CheckCircle2 },
    { name: 'Loan Comparison', href: '/loan-comparison', icon: Scale },
    { name: 'AI Assistant', href: '/assistant', icon: Bot },
    { name: 'Report Centre', href: '/reports', icon: FileText },
    { name: 'Document Room', href: '/documents', icon: FolderOpen },
  ];

  const unreadNotifs = notifications.filter((n) => !n.isRead);

  return (
    <header className="sticky top-0 z-50 bg-charcoal text-ivory border-b border-charcoal-300">
      {/* Editorial Top Utility Bar & Financial Ticker */}
      <div className="border-b border-charcoal-400/60 px-4 sm:px-6 py-1.5 flex flex-wrap items-center justify-between text-xs font-mono text-sage-light tracking-wide">
        <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
          <span className="inline-flex items-center gap-1.5 bg-rust/30 text-rust-light px-2 py-0.5 text-[11px] font-semibold tracking-wider uppercase border border-rust/40">
            <span className="w-1.5 h-1.5 rounded-full bg-rust-light animate-pulse" />
            Decision Intel
          </span>
          <span className="text-ivory-300 hidden md:inline">
            MSME PRE-ORDER RISK EVALUATION ENGINE
          </span>
          <span className="text-charcoal-300 hidden md:inline">|</span>
          {activeOpportunity && (
            <span className="text-amber-light truncate max-w-xs md:max-w-md">
              Evaluating: <span className="text-ivory font-semibold">{activeOpportunity.title}</span> ({formatINR(activeOpportunity.purchaseOrder.totalOrderValue)})
            </span>
          )}
        </div>

        {/* Demo Switcher & Alert Drawer Trigger */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Active Demo Profile Selector */}
          <div className="relative">
            <button
              onClick={() => setShowBizSwitcher(!showBizSwitcher)}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-charcoal-400 hover:bg-charcoal-300 text-ivory text-xs border border-charcoal-300 transition-colors"
            >
              <Building2 className="w-3.5 h-3.5 text-sage" />
              <span className="font-semibold">{business.businessName}</span>
              <span className="text-sage-light font-normal">({business.locationCity})</span>
              <ChevronDown className="w-3 h-3 text-sage ml-0.5" />
            </button>

            {showBizSwitcher && (
              <div className="absolute right-0 mt-1 w-72 bg-charcoal-500 border border-charcoal-300 shadow-2xl p-2 z-50 font-sans">
                <div className="text-[10px] font-mono uppercase tracking-widest text-sage px-2 py-1 mb-1 border-b border-charcoal-400">
                  Switch Illustrative MSME Profile
                </div>
                <button
                  onClick={() => {
                    switchDemoBusiness('sri-textiles');
                    setShowBizSwitcher(false);
                  }}
                  className={`w-full text-left p-2.5 text-xs transition-colors flex flex-col gap-0.5 ${
                    activeDemoId === 'sri-textiles' || activeDemoId === 'sana-textiles'
                      ? 'bg-charcoal-300 text-ivory border-l-2 border-amber'
                      : 'hover:bg-charcoal-400 text-ivory-200'
                  }`}
                >
                  <span className="font-semibold text-ivory">Sri Textiles (Madurai, TN)</span>
                  <span className="text-[11px] text-sage-light">Textiles • 12 Staff • ₹15L PO Evaluation</span>
                </button>
                <button
                  onClick={() => {
                    switchDemoBusiness('kovai-precision');
                    setShowBizSwitcher(false);
                  }}
                  className={`w-full text-left p-2.5 text-xs transition-colors flex flex-col gap-0.5 mt-1 ${
                    activeDemoId === 'kovai-precision'
                      ? 'bg-charcoal-300 text-ivory border-l-2 border-amber'
                      : 'hover:bg-charcoal-400 text-ivory-200'
                  }`}
                >
                  <span className="font-semibold text-ivory">Kovai Precision Engineering (Coimbatore)</span>
                  <span className="text-[11px] text-sage-light">Light Engg • 18 Staff • ₹28.5L Tier-1 PO</span>
                </button>
                <button
                  onClick={() => {
                    switchDemoBusiness('trichy-foods');
                    setShowBizSwitcher(false);
                  }}
                  className={`w-full text-left p-2.5 text-xs transition-colors flex flex-col gap-0.5 mt-1 ${
                    activeDemoId === 'trichy-foods'
                      ? 'bg-charcoal-300 text-ivory border-l-2 border-amber'
                      : 'hover:bg-charcoal-400 text-ivory-200'
                  }`}
                >
                  <span className="font-semibold text-ivory">Trichy Natural Food Processing (Trichy)</span>
                  <span className="text-[11px] text-sage-light">Agro Oils • 9 Staff • ₹8.4L Retail PO</span>
                </button>
              </div>
            )}
          </div>

          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="relative p-1.5 text-ivory-300 hover:text-ivory hover:bg-charcoal-400 border border-charcoal-300 transition-colors"
              title="Financial Decision Alerts"
            >
              <Bell className="w-3.5 h-3.5 text-amber-light" />
              {unreadNotifs.length > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rust text-[9px] font-bold text-white flex items-center justify-center rounded-full">
                  {unreadNotifs.length}
                </span>
              )}
            </button>

            {showNotifs && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-charcoal-500 border border-charcoal-300 shadow-2xl p-4 z-50 font-sans">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-charcoal-400">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rust" />
                    <span className="text-xs font-mono uppercase tracking-wider text-ivory font-semibold">
                      Financial Alerts ({notifications.length})
                    </span>
                  </div>
                  <button
                    onClick={() => setShowNotifs(false)}
                    className="text-ivory-400 hover:text-ivory"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2.5 max-h-80 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-2.5 border text-xs relative ${
                        notif.severity === 'critical'
                          ? 'bg-rust/10 border-rust/40 text-ivory'
                          : notif.severity === 'warning'
                          ? 'bg-amber/10 border-amber/40 text-ivory'
                          : 'bg-charcoal-400 border-charcoal-300 text-ivory-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-ivory flex items-center gap-1.5">
                          {notif.severity === 'critical' && (
                            <span className="w-2 h-2 rounded-full bg-rust" />
                          )}
                          {notif.severity === 'warning' && (
                            <span className="w-2 h-2 rounded-full bg-amber" />
                          )}
                          {notif.title}
                        </span>
                        <button
                          onClick={() => dismissNotification(notif.id)}
                          className="text-ivory-400 hover:text-ivory text-[10px]"
                        >
                          ✕
                        </button>
                      </div>
                      <p className="mt-1 text-[11px] leading-relaxed text-ivory-300">
                        {notif.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Authentication & User Session Controls */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2 border-l border-charcoal-400 pl-3">
              <Link
                href="/settings"
                className="flex items-center gap-1.5 text-[11px] text-ivory hover:text-amber transition-colors font-mono"
                title="Business & Profile Settings"
              >
                <User className="w-3.5 h-3.5 text-sage" />
                <span className="truncate max-w-[120px] font-semibold">{userProfile?.fullName || user.email?.split('@')[0]}</span>
              </Link>
              <button
                onClick={() => signOut()}
                className="p-1 text-ivory-400 hover:text-rust hover:bg-charcoal-400 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 border-l border-charcoal-400 pl-3 text-[11px] font-mono">
              <Link
                href="/login"
                className="text-ivory-300 hover:text-ivory transition-colors"
              >
                Sign In
              </Link>
              <span className="text-charcoal-300">/</span>
              <Link
                href="/register"
                className="text-amber hover:underline font-semibold"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Main Editorial Brand & Primary Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-baseline gap-2 group">
            <span className="font-serif text-2xl sm:text-3xl tracking-tight text-ivory font-normal group-hover:text-amber-light transition-colors">
              DYNAFIN
            </span>
            <span className="font-mono text-[10px] tracking-widest uppercase text-sage px-1.5 py-0.5 border border-sage/40">
              OPPORTUNITY IQ
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 font-mono text-xs overflow-x-auto py-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 flex items-center gap-1.5 transition-all relative ${
                  isActive
                    ? 'text-ivory bg-charcoal-400 border border-sage/60 font-medium'
                    : 'text-ivory-300 hover:text-ivory hover:bg-charcoal-400/50'
                }`}
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span className="text-[9px] uppercase px-1 py-0.2 bg-amber text-charcoal font-bold">
                    {link.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Hamburger Menu Button */}
        <div className="lg:hidden">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 border border-charcoal-300 hover:bg-charcoal-400 text-ivory"
          >
            {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Menu */}
      {showMobileMenu && (
        <div className="lg:hidden bg-charcoal-500 border-t border-charcoal-400 px-4 py-4 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setShowMobileMenu(false)}
                className={`flex items-center justify-between p-2.5 text-xs font-mono border ${
                  isActive
                    ? 'bg-charcoal-300 text-ivory border-amber'
                    : 'text-ivory-300 border-transparent hover:bg-charcoal-400'
                }`}
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span className="text-[9px] uppercase px-1 bg-amber text-charcoal font-bold">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
