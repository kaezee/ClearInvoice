import React, { useState, useEffect } from 'react';
import {
  X, ChevronRight, ChevronLeft, Palette, FileText, Archive,
  HelpCircle, LogOut, User, Plus, Trash2, Upload, ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { C, T, R, CURRENCIES, currSym, PAYMENT_TERMS } from '../tokens';
import { useApp } from '../store';
import { ProjectCard } from './ProjectCard';
import { Modal } from './Modal';
import { DeleteModal } from './DeleteModal';
import { NumberInput } from './ui/NumberInput';
import { LightModalBtn } from './ui/CircleIconBtn';
import {
  BrandingSettings, InvoiceDefaultsType, InvoiceStyle,
  RateCardItem, CustomField,
} from '../types';

/* ── Types & constants ────────────────────────────────────── */

type View = 'menu' | 'edit-profile' | 'branding' | 'invoice-defaults' | 'archived' | 'help';


const QUOTE_EXPIRY_OPTIONS = [7, 14, 30];
const PRESET_COLORS = ['#FF659C', '#FFE24B', '#65F7FF', '#4DFF91', '#0A0A0A', '#7C3AED'];

const ST = { duration: 0.28, ease: [0.16, 1, 0.3, 1] as any };
const ABS: React.CSSProperties = { position: 'absolute', inset: 0, overflow: 'hidden' };

/* ── Main AvatarSheet ─────────────────────────────────────── */

interface AvatarSheetProps {
  open: boolean;
  onClose: () => void;
  initialView?: View;
  /** Skip the slide-in entrance animation (used when reopening after back-nav) */
  instant?: boolean;
}

export function AvatarSheet({ open, onClose, initialView, instant }: AvatarSheetProps) {
  const { projects, branding, updateBranding } = useApp();
  const archivedCount = projects.filter(p => p.status === 'archived').length;
  const [view, setView] = useState<View>(initialView ?? 'menu');

  // On open: jump straight to the requested sub-view (e.g. 'archived').
  // On close: wait for the slide-down animation to finish before resetting to 'menu'.
  useEffect(() => {
    if (open) {
      setView(initialView ?? 'menu');
    } else {
      const t = setTimeout(() => setView('menu'), 360);
      return () => clearTimeout(t);
    }
  }, [open, initialView]);

  const freelancerName = branding.freelancerName || 'Freelancer';
  const businessName   = branding.businessName   || 'Your Studio';
  const avatarInitial  = freelancerName[0]?.toUpperCase() ?? 'K';

  const goTo  = (v: View)  => setView(v);
  const goBack = ()        => setView('menu');

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="avatar-backdrop"
            initial={{ opacity: instant ? 1 : 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200 }}
          />

          {/* Slide-in panel — skips entrance animation when reopened via back-nav */}
          <motion.div
            key="avatar-panel"
            initial={{ x: instant ? 0 : '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '100%', background: C.white, zIndex: 201, overflow: 'hidden' }}
          >
            {/*
              Inner view stack.
              - Menu slides from the LEFT (it's the "home" of this panel)
              - All sub-views slide from the RIGHT (push deeper)
              AnimatePresence runs both exit + enter simultaneously so it feels
              like a native push/pop navigation.
            */}
            <AnimatePresence initial={false}>

              {view === 'menu' && (
                <motion.div key="menu"
                  initial={{ x: '-25%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '-25%', opacity: 0 }}
                  transition={ST} style={ABS}
                >
                  <MenuContent
                    freelancerName={freelancerName} businessName={businessName}
                    avatarInitial={avatarInitial} archivedCount={archivedCount}
                    onClose={onClose}
                    onGoEditProfile={() => goTo('edit-profile')}
                    onGoBranding={() => goTo('branding')}
                    onGoInvoiceDefaults={() => goTo('invoice-defaults')}
                    onGoArchived={() => goTo('archived')}
                    onGoHelp={() => goTo('help')}
                  />
                </motion.div>
              )}

              {view === 'edit-profile' && (
                <motion.div key="edit-profile"
                  initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                  transition={ST} style={ABS}
                >
                  <EditProfileContent
                    freelancerName={freelancerName} businessName={businessName}
                    avatarInitial={avatarInitial}
                    onBack={goBack}
                    onSave={(name, company) => {
                      updateBranding({ ...branding, freelancerName: name, businessName: company });
                      goBack();
                    }}
                  />
                </motion.div>
              )}

              {view === 'branding' && (
                <motion.div key="branding"
                  initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                  transition={ST} style={ABS}
                >
                  <BrandingContent onBack={goBack} />
                </motion.div>
              )}

              {view === 'invoice-defaults' && (
                <motion.div key="invoice-defaults"
                  initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                  transition={ST} style={ABS}
                >
                  <InvoiceDefaultsContent onBack={goBack} onGoBranding={() => goTo('branding')} />
                </motion.div>
              )}

              {view === 'archived' && (
                <motion.div key="archived"
                  initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                  transition={ST} style={ABS}
                >
                  <ArchivedContent onBack={goBack} onClose={onClose} />
                </motion.div>
              )}

              {view === 'help' && (
                <motion.div key="help"
                  initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                  transition={ST} style={ABS}
                >
                  <HelpContent onBack={goBack} />
                </motion.div>
              )}

            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ── Menu content ─────────────────────────────────────────── */

function MenuContent({
  freelancerName, businessName, avatarInitial, archivedCount,
  onClose, onGoEditProfile, onGoBranding, onGoInvoiceDefaults, onGoArchived, onGoHelp,
}: {
  freelancerName: string; businessName: string; avatarInitial: string;
  archivedCount: number; onClose: () => void;
  onGoEditProfile: () => void; onGoBranding: () => void;
  onGoInvoiceDefaults: () => void; onGoArchived: () => void; onGoHelp: () => void;
}) {
  const navigate = useNavigate();
  const { setHasLaunched } = useApp();

  const handleSignOut = () => {
    setHasLaunched(false);
    onClose();
    setTimeout(() => navigate('/'), 50);
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', background: C.white }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', flexShrink: 0 }}>
        <span style={{ fontSize: T.title.fontSize, fontWeight: 700, color: C.black, letterSpacing: '-0.02em' }}>Profile</span>
        {/* × Light context close — 16px icon, 36×36 circle, 44×44 tap target */}
        <LightModalBtn onClick={onClose} ariaLabel="Close" style={{ marginRight: -6 }}>
          <X size={16} strokeWidth={2.5} />
        </LightModalBtn>
      </div>

      {/* Identity block */}
      <div style={{ padding: '24px 20px 24px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: C.quoting, flexShrink: 0, border: `1.5px solid ${C.black}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: T.avatar.fontSize, fontWeight: 700, color: C.black }}>{avatarInitial}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
          <p style={{ fontSize: T.title.fontSize, fontWeight: 700, color: C.black, margin: 0, letterSpacing: '-0.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>{freelancerName}</p>
          <p style={{ fontSize: '13px', color: C.muted, margin: '1px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>{businessName}</p>
          <InlineEditProfileBtn onClick={onGoEditProfile} />
        </div>
      </div>

      <Divider />
      <SectionLabel>Customise</SectionLabel>
      <SheetRow icon={<Palette size={22} color="rgba(10,10,10,0.6)" strokeWidth={1.75} />} label="Logo & style" onClick={onGoBranding} />
      <SheetRow icon={<FileText size={22} color="rgba(10,10,10,0.6)" strokeWidth={1.75} />} label="Invoice setup" onClick={onGoInvoiceDefaults} last />

      <Divider />
      <SectionLabel>Projects</SectionLabel>
      <SheetRow icon={<Archive size={22} color="rgba(10,10,10,0.6)" strokeWidth={1.75} />} label="Archived projects" badge={archivedCount > 0 ? String(archivedCount) : undefined} onClick={onGoArchived} last />

      <Divider />
      <SectionLabel>Account</SectionLabel>
      <SheetRow icon={<HelpCircle size={22} color="rgba(10,10,10,0.6)" strokeWidth={1.75} />} label="Help" onClick={onGoHelp} />
      <SheetRow icon={<LogOut size={22} color={C.danger} strokeWidth={1.75} />} label="Sign out" labelColor={C.danger} onClick={handleSignOut} last noChevron hoverBg={C.dangerLight} activeBg={C.dangerLight} />

      <div style={{ height: 'calc(env(safe-area-inset-bottom, 0px) + 24px)' }} />
    </div>
  );
}

/* ── Edit Profile content ─────────────────────────────────── */

function EditProfileContent({
  freelancerName, businessName, avatarInitial, onBack, onSave,
}: {
  freelancerName: string; businessName: string; avatarInitial: string;
  onBack: () => void; onSave: (name: string, company: string) => void;
}) {
  const [name, setName]       = useState(freelancerName);
  const [company, setCompany] = useState(businessName);
  const [saved, setSaved]     = useState(false);
  const initial2 = name.trim()[0]?.toUpperCase() ?? avatarInitial;

  const handleSave = () => {
    if (!name.trim()) return;
    setSaved(true);
    setTimeout(() => onSave(name.trim(), company.trim()), 600);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.white }}>
      <SubViewHeader title="Edit profile" onBack={onBack} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 16px' }}>
        {/* Avatar preview */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0 20px' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: C.quoting, border: `2px solid ${C.black}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: T.xl.fontSize, fontWeight: 700, color: C.black }}>{initial2}</span>
          </div>
          <p style={{ fontSize: '11px', color: C.muted, margin: 0 }}>Your initial is shown in the app</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={labelStyle}>Your name</label>
            <input className="ci" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Kiran Das" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Company / studio name</label>
            <input className="ci" value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g. KD Studio" style={inputStyle} />
            <p style={{ fontSize: '11px', color: C.muted, marginTop: 5 }}>Shown on all your quotes and invoices</p>
          </div>
        </div>
      </div>
      {/* Sticky save footer */}
      <div style={{ padding: '12px 16px', background: C.white, borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
        <button
          onClick={handleSave}
          disabled={!name.trim()}
          onMouseEnter={e => { if (name.trim() && !saved) e.currentTarget.style.background = '#2A2A2A'; }}
          onMouseLeave={e => { e.currentTarget.style.background = saved ? C.cleared : C.black; }}
          style={{
            width: '100%', height: 48,
            background: saved ? C.cleared : C.black,
            color: saved ? C.black : C.white,
            border: 'none', borderRadius: R.xl,
            cursor: name.trim() ? 'pointer' : 'not-allowed',
            fontSize: '15px', fontWeight: 700, letterSpacing: '-0.01em',
            opacity: name.trim() ? 1 : 0.35,
            transition: 'background 200ms, color 200ms, opacity 150ms',
          }}
        >
          {saved ? 'Saved ✓' : 'Save'}
        </button>
      </div>
    </div>
  );
}

/* ── Branding content ─────────────────────────────────────── */

function BrandingContent({ onBack }: { onBack: () => void }) {
  const { branding, updateBranding } = useApp();
  const [settings, setSettings] = useState<BrandingSettings>({ ...branding });
  const [hexInput, setHexInput] = useState(branding.brandColor);
  const [saved, setSaved]       = useState(false);

  const update = (partial: Partial<BrandingSettings>) => {
    const next = { ...settings, ...partial };
    setSettings(next);
    if (partial.brandColor) setHexInput(partial.brandColor);
  };

  const handleHexBlur = () => {
    const clean = hexInput.startsWith('#') ? hexInput : `#${hexInput}`;
    if (/^#[0-9A-Fa-f]{6}$/.test(clean)) update({ brandColor: clean });
    else setHexInput(settings.brandColor);
  };

  const handleSave = () => {
    updateBranding(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const headerBg = (style: InvoiceStyle) =>
    style === 'classic' ? C.black : style === 'branded' ? settings.brandColor : C.white;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.surface }}>
      <SubViewHeader title="Logo & style" onBack={onBack} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>

        {/* Logo */}
        <PanelCard title="Your logo">
          {settings.logoUrl ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <img src={settings.logoUrl} alt="Logo" style={{ width: 48, height: 48, borderRadius: R.md, objectFit: 'contain', background: C.surface }} />
              <div>
                <p style={{ fontSize: '13px', fontWeight: 500, color: C.black, margin: '0 0 4px' }}>Logo uploaded</p>
                <button onClick={() => update({ logoUrl: undefined })}
                  onMouseEnter={e => (e.currentTarget.style.color = C.danger)}
                  onMouseLeave={e => (e.currentTarget.style.color = C.muted)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, fontSize: '13px', fontWeight: 500, padding: 0, transition: 'color 150ms' }}>Remove</button>
              </div>
            </div>
          ) : (
            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '20px 16px', border: `1.5px dashed ${C.border}`, borderRadius: R.lg, cursor: 'pointer' }}>
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) update({ logoUrl: URL.createObjectURL(f) }); }} />
              <div style={{ width: 44, height: 44, background: C.surface, borderRadius: R.md, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Upload size={18} color={C.muted} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: C.black, display: 'block' }}>Upload logo</span>
                <span style={{ fontSize: '11px', color: C.muted }}>PNG or SVG · shown on all invoices and quotes</span>
              </div>
            </label>
          )}
        </PanelCard>

        {/* Brand colour */}
        <PanelCard title="Brand colour">
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 14 }}>
            {PRESET_COLORS.map(color => (
              <button key={color} onClick={() => update({ brandColor: color })}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.15)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                style={{ width: 28, height: 28, borderRadius: R.md, background: color, border: `1.5px solid ${C.black}`, cursor: 'pointer', flexShrink: 0, outline: settings.brandColor === color ? `2px solid ${C.black}` : 'none', outlineOffset: 2, transition: 'outline 120ms, transform 150ms' }}
              />
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 24, height: 24, borderRadius: R.sm, background: settings.brandColor, border: `1px solid ${C.border}`, flexShrink: 0 }} />
            <input className="ci" value={hexInput} onChange={e => setHexInput(e.target.value)} onBlur={handleHexBlur} maxLength={7}
              style={{ width: 90, height: 36, border: `1px solid ${C.border}`, borderRadius: R.md, padding: '0 10px', fontSize: '13px', fontFamily: 'monospace', outline: 'none', color: C.black }}
            />
            <span style={{ fontSize: '11px', color: C.muted }}>Hex value</span>
          </div>
          {/* Preview */}
          <div style={{ marginTop: 14, background: C.surface, borderRadius: R.md, padding: 12 }}>
            <p style={{ fontSize: '10px', color: C.muted, margin: '0 0 8px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Preview</p>
            <div style={{ border: `1.5px solid ${C.black}`, borderRadius: R.sm, overflow: 'hidden', maxWidth: 140 }}>
              <div style={{ height: 16, background: C.black, padding: '0 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '7px', color: C.white, fontWeight: 600 }}>Invoice</span>
                <span style={{ fontSize: '7px', color: settings.brandColor, fontFamily: 'monospace' }}>INV-001</span>
              </div>
              <div style={{ background: C.white, padding: 8 }}>
                {[80, 60, 100].map((w, i) => (
                  <div key={i} style={{ height: 3, background: i === 2 ? settings.brandColor : C.border, borderRadius: 2, width: `${w}%`, marginBottom: 4 }} />
                ))}
              </div>
            </div>
          </div>
        </PanelCard>

        {/* Invoice style */}
        <PanelCard title="Invoice style">
          <div style={{ display: 'flex', gap: 8 }}>
            {(['classic', 'branded', 'minimal'] as InvoiceStyle[]).map(style => {
              const active = settings.invoiceStyle === style;
              return (
                <button key={style} onClick={() => update({ invoiceStyle: style })}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.borderColor = C.borderStrong; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.borderColor = C.border; }}
                  style={{ flex: 1, border: `1.5px solid ${active ? C.black : C.border}`, borderRadius: R.md, overflow: 'hidden', cursor: 'pointer', background: 'transparent', padding: 0, transition: 'border-color 150ms' }}
                >
                  <div style={{ height: 52, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ height: 16, background: headerBg(style), flexShrink: 0, borderBottom: `1px solid ${C.border}` }} />
                    <div style={{ flex: 1, background: C.white, padding: '4px 6px', display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {[70, 50, 85].map((w, i) => <div key={i} style={{ height: 2, background: C.border, borderRadius: 2, width: `${w}%` }} />)}
                    </div>
                  </div>
                  <div style={{ background: C.surface, borderTop: `1px solid ${C.border}`, padding: '4px 8px', textAlign: 'center', fontSize: '10px', fontWeight: 600, color: active ? C.black : C.muted, letterSpacing: '0.04em' }}>
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </div>
                </button>
              );
            })}
          </div>
        </PanelCard>

      </div>
      {/* Sticky save footer */}
      <div style={{ padding: '12px 16px', background: C.white, borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
        <button
          onClick={handleSave}
          onMouseEnter={e => { if (!saved) e.currentTarget.style.background = '#2A2A2A'; }}
          onMouseLeave={e => { e.currentTarget.style.background = saved ? C.cleared : C.black; }}
          style={{
            width: '100%', height: 48,
            background: saved ? C.cleared : C.black,
            color: saved ? C.black : C.white,
            border: 'none', borderRadius: R.xl,
            cursor: 'pointer', fontSize: '15px', fontWeight: 700,
            letterSpacing: '-0.01em',
            transition: 'background 200ms, color 200ms',
          }}
        >
          {saved ? 'Saved ✓' : 'Save'}
        </button>
      </div>
    </div>
  );
}

/* ── Invoice Defaults content ─────────────────────────────── */

function InvoiceDefaultsContent({ onBack, onGoBranding }: { onBack: () => void; onGoBranding: () => void }) {
  const { invoiceDefaults, updateInvoiceDefaults } = useApp();
  const [defaults, setDefaults] = useState<InvoiceDefaultsType>({ ...invoiceDefaults });
  const [showAddService, setShowAddService] = useState(false);
  const [showAddField, setShowAddField]     = useState(false);
  const [shakingId, setShakingId]           = useState<string | null>(null);
  const [saved, setSaved]                   = useState(false);

  const update = (partial: Partial<InvoiceDefaultsType>) => setDefaults(prev => ({ ...prev, ...partial }));

  const removeRateItem = (id: string) => {
    if (shakingId === id) {
      update({ rateCard: defaults.rateCard.filter(r => r.id !== id) });
      setShakingId(null);
    } else {
      setShakingId(id);
      setTimeout(() => setShakingId(null), 600);
    }
  };

  const currSymbol = currSym(defaults.defaultCurrency ?? 'GBP');

  const handleSave = () => {
    updateInvoiceDefaults(defaults);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', background: C.surface }}>

      {/* Header — Branding shortcut as secondary small button */}
      <SubViewHeader
        title="Invoice setup"
        onBack={onBack}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>

        {/* ── 1. YOUR BUSINESS ─────────────────────────────── */}
        <PanelCard title="Your business">
          <p style={{ fontSize: '11px', color: C.muted, margin: '0 0 16px', lineHeight: 1.5 }}>
            This information appears on every invoice and quote you send.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Your name</label>
                <input className="ci" value={defaults.fullName || ''} onChange={e => update({ fullName: e.target.value })}
                  placeholder="e.g. Krishnachandran R." style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Business name</label>
                <input className="ci" value={defaults.businessName || ''} onChange={e => update({ businessName: e.target.value })}
                  placeholder="e.g. Kaezee Designs" style={inputStyle} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input className="ci" type="email" value={defaults.businessEmail || ''} onChange={e => update({ businessEmail: e.target.value })}
                placeholder="e.g. hello@kaezee.com" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Address line 1</label>
              <input className="ci" value={defaults.addressLine1 || ''} onChange={e => update({ addressLine1: e.target.value })}
                placeholder="e.g. 14 Clerkenwell Road" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Address line 2 <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontSize: '10px' }}>optional</span></label>
              <input className="ci" value={defaults.addressLine2 || ''} onChange={e => update({ addressLine2: e.target.value })}
                placeholder="Floor, suite, unit..." style={inputStyle} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>City</label>
                <input className="ci" value={defaults.city || ''} onChange={e => update({ city: e.target.value })}
                  placeholder="e.g. London" style={inputStyle} />
              </div>
              <div style={{ width: 108 }}>
                <label style={labelStyle}>Postcode</label>
                <input className="ci" value={defaults.postcode || ''} onChange={e => update({ postcode: e.target.value })}
                  placeholder="EC1M 5RF" style={inputStyle} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Phone <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontSize: '10px' }}>optional</span></label>
                <input className="ci" value={defaults.phone || ''} onChange={e => update({ phone: e.target.value })}
                  placeholder="+44 7700 900000" style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>VAT / Reg No <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontSize: '10px' }}>optional</span></label>
                <input className="ci" value={defaults.regNumber || ''} onChange={e => update({ regNumber: e.target.value })}
                  placeholder="GB123456789" style={inputStyle} />
              </div>
            </div>
          </div>
        </PanelCard>

        {/* ── 2. NUMBERING ─────────────────────────────────── */}
        <PanelCard title="Numbering">
          <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Invoice prefix</label>
              <div style={{ position: 'relative' }}>
                <input className="ci" value={defaults.invoicePrefix ?? 'INV'} onChange={e => update({ invoicePrefix: e.target.value.toUpperCase() })}
                  placeholder="INV" maxLength={6} style={{ ...inputStyle, paddingRight: 50 }} />
                <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: C.muted, pointerEvents: 'none' }}>-001</span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Quote prefix</label>
              <div style={{ position: 'relative' }}>
                <input className="ci" value={defaults.quotePrefix ?? 'QUO'} onChange={e => update({ quotePrefix: e.target.value.toUpperCase() })}
                  placeholder="QUO" maxLength={6} style={{ ...inputStyle, paddingRight: 50 }} />
                <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: C.muted, pointerEvents: 'none' }}>-001</span>
              </div>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Starting number</label>
            <NumberInput
              min={1}
              value={defaults.startingNumber ?? 1}
              onChange={val => update({ startingNumber: Math.max(1, Number(val)) })}
              style={{ height: 44 }}
            />
            <p style={{ fontSize: '11px', color: C.muted, marginTop: 6 }}>
              Your next invoice will be {defaults.invoicePrefix ?? 'INV'}-{String(defaults.startingNumber ?? 1).padStart(3, '0')}
            </p>
          </div>
        </PanelCard>

        {/* ── 3. SERVICES ─────────────────────────────────── */}
        <PanelCard title="Services">
          {defaults.rateCard.map((item, idx) => (
            <motion.div key={item.id}
              animate={shakingId === item.id ? { x: [0, -4, 4, -4, 4, 0] } : { x: 0 }}
              transition={{ duration: 0.4 }}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', gap: 8, borderBottom: idx < defaults.rateCard.length - 1 ? `1px solid ${C.border}` : 'none' }}
            >
              <span style={{ fontSize: '13px', fontWeight: 500, color: C.black, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: 8 }}>{item.service}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: C.black }}>{currSymbol}{item.price.toLocaleString()}</span>
                <button onClick={() => removeRateItem(item.id)}
                  onMouseEnter={e => (e.currentTarget.style.color = C.danger)}
                  onMouseLeave={e => (e.currentTarget.style.color = shakingId === item.id ? C.danger : C.borderStrong)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: shakingId === item.id ? C.danger : C.borderStrong, padding: 2, display: 'flex', alignItems: 'center', transition: 'color 150ms' }}
                ><X size={14} /></button>
              </div>
            </motion.div>
          ))}
          <AddRowButton label="Add service" onClick={() => setShowAddService(true)} />
        </PanelCard>

        {/* ── 4. CUSTOM FIELDS ─────────────────────────────── */}
        <PanelCard title="Custom fields">
          {defaults.customFields.map((field, idx) => (
            <div key={field.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', gap: 8, borderBottom: idx < defaults.customFields.length - 1 ? `1px solid ${C.border}` : 'none' }}>
              <span style={{ fontSize: '13px', color: C.muted, flexShrink: 0, maxWidth: '40%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{field.label}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <span style={{ fontSize: '13px', fontWeight: 500, color: C.black, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120 }}>{field.value}</span>
                <button onClick={() => update({ customFields: defaults.customFields.filter(f => f.id !== field.id) })}
                  onMouseEnter={e => (e.currentTarget.style.color = C.danger)}
                  onMouseLeave={e => (e.currentTarget.style.color = C.borderStrong)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.borderStrong, padding: 2, display: 'flex', alignItems: 'center', flexShrink: 0, transition: 'color 150ms' }}
                ><X size={14} /></button>
              </div>
            </div>
          ))}
          <AddRowButton label="Add custom field" onClick={() => setShowAddField(true)} />
        </PanelCard>

        {/* ── 5. PAYMENT DEFAULTS ──────────────────────────── */}
        <PanelCard title="Payment defaults">
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Payment due within</label>
            <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
              {PAYMENT_TERMS.map(t => {
                const active = defaults.defaultTerms === t.key;
                return (
                  <button key={t.key} onClick={() => update({ defaultTerms: t.key })}
                    onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = C.black; e.currentTarget.style.color = C.black; } }}
                    onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; } }}
                    style={{ flex: 1, padding: '8px 0', border: `1.5px solid ${active ? C.black : C.border}`, borderRadius: R.xl, background: active ? C.black : C.white, cursor: 'pointer', fontSize: '11px', fontWeight: 700, color: active ? C.white : C.muted, transition: 'all 120ms' }}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
            <p style={{ fontSize: '11px', color: C.muted }}>Days after invoice is sent</p>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Default currency</label>
            <div style={{ position: 'relative' }}>
              <select className="ci" value={defaults.defaultCurrency} onChange={e => update({ defaultCurrency: e.target.value })}
                style={{ ...inputStyle, paddingRight: 32, appearance: 'none', cursor: 'pointer', height: 44 }}
              >
                <option value="GBP">£  GBP — British Pound</option>
                <option value="USD">$  USD — US Dollar</option>
                <option value="EUR">€  EUR — Euro</option>
                <option value="INR">₹  INR — Indian Rupee</option>
                <option value="AUD">A$  AUD — Australian Dollar</option>
                <option value="CAD">C$  CAD — Canadian Dollar</option>
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: C.muted }} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Default payment notes</label>
            <textarea className="ci" value={defaults.paymentNotes} onChange={e => update({ paymentNotes: e.target.value })}
              rows={3} placeholder="Bank details, preferred payment method..."
              style={{ ...inputStyle, height: 'auto', padding: '10px 12px', resize: 'none', lineHeight: 1.6 } as any}
            />
          </div>
        </PanelCard>

        {/* ── 6. QUOTE DEFAULTS ────────────────────────────── */}
        <PanelCard title="Quote defaults">
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Default quote expiry</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {QUOTE_EXPIRY_OPTIONS.map(days => {
                const active = defaults.defaultQuoteExpiry === days;
                return (
                  <button key={days} onClick={() => update({ defaultQuoteExpiry: days })}
                    onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = C.black; e.currentTarget.style.color = C.black; } }}
                    onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; } }}
                    style={{ flex: 1, padding: '8px 0', border: `1.5px solid ${active ? C.black : C.border}`, borderRadius: R.xl, background: active ? C.black : C.white, cursor: 'pointer', fontSize: T.pill.fontSize, fontWeight: 700, color: active ? C.white : C.muted, transition: 'all 120ms' }}
                  >
                    {days} days
                  </button>
                );
              })}
            </div>
            <p style={{ fontSize: '11px', color: C.muted, marginTop: 6 }}>Days until quote expires</p>
          </div>
          <div>
            <label style={labelStyle}>Default quote notes</label>
            <textarea className="ci" value={defaults.defaultQuoteNotes || ''} onChange={e => update({ defaultQuoteNotes: e.target.value })}
              rows={3} placeholder="e.g. To proceed, reply to confirm and work begins immediately."
              style={{ ...inputStyle, height: 'auto', padding: '10px 12px', resize: 'none', lineHeight: 1.6 } as any}
            />
            <p style={{ fontSize: '11px', color: C.muted, marginTop: 4 }}>Shown at the bottom of every quote you send</p>
          </div>
        </PanelCard>

        {/* ── 7. TAX ───────────────────────────────────────── */}
        <PanelCard title="Tax">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: defaults.taxEnabled ? 16 : 0 }}>
            <label style={{ fontSize: '13px', fontWeight: 500, color: C.black }}>Add tax to invoices</label>
            <SheetToggle checked={!!defaults.taxEnabled} onChange={(v) => update({ taxEnabled: v })} />
          </div>
          {defaults.taxEnabled && (
            <>
              <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Tax name</label>
                  <input className="ci"
                    value={defaults.taxLabel ?? ''}
                    onChange={e => update({ taxLabel: e.target.value })}
                    placeholder="e.g. VAT, GST"
                    style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = C.black)}
                    onBlur={e  => (e.currentTarget.style.borderColor = C.border)}
                  />
                </div>
                <div style={{ width: 90 }}>
                  <label style={labelStyle}>Rate</label>
                  <div style={{ position: 'relative' }}>
                    <input className="ci"
                      type="number" min={0} max={100}
                      value={defaults.taxRate ?? 20}
                      onChange={e => update({ taxRate: Number(e.target.value) })}
                      placeholder="20"
                      style={{ ...inputStyle, paddingRight: 28 }}
                      onFocus={e => (e.currentTarget.style.borderColor = C.black)}
                      onBlur={e  => (e.currentTarget.style.borderColor = C.border)}
                    />
                    <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: '13px', color: C.muted, pointerEvents: 'none' }}>%</span>
                  </div>
                </div>
              </div>
              {defaults.taxLabel && (
                <p style={{ fontSize: '11px', color: C.muted, margin: 0, lineHeight: 1.5 }}>
                  Shown on invoice as: <strong style={{ color: C.black }}>{defaults.taxLabel} {defaults.taxRate ?? 0}%</strong>
                </p>
              )}
            </>
          )}
        </PanelCard>

      </div>

      {/* Sticky save footer */}
      <div style={{ padding: '12px 16px', background: C.white, borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
        <button
          onClick={handleSave}
          onMouseEnter={e => { if (!saved) e.currentTarget.style.background = '#2A2A2A'; }}
          onMouseLeave={e => { e.currentTarget.style.background = saved ? C.cleared : C.black; }}
          style={{
            width: '100%', height: 48,
            background: saved ? C.cleared : C.black,
            color: saved ? C.black : C.white,
            border: 'none', borderRadius: R.xl,
            cursor: 'pointer', fontSize: '15px', fontWeight: 700,
            letterSpacing: '-0.01em',
            transition: 'background 200ms, color 200ms',
          }}
        >
          {saved ? 'Saved ✓' : 'Save'}
        </button>
      </div>

      {/* Add modals */}
      <PanelAddModal
        open={showAddService} onClose={() => setShowAddService(false)}
        title="Add service"
        fields={[
          { key: 'service', label: 'Service name', placeholder: 'e.g. Illustration', type: 'text' },
          { key: 'price',   label: 'Price',         placeholder: '0',                  type: 'number' },
        ]}
        onAdd={data => {
          const item: RateCardItem = { id: Date.now().toString(), service: data.service, price: Number(data.price) };
          update({ rateCard: [...defaults.rateCard, item] });
        }}
      />
      <PanelAddModal
        open={showAddField} onClose={() => setShowAddField(false)}
        title="Add custom field"
        fields={[
          { key: 'label', label: 'Field name', placeholder: 'e.g. VAT Number', type: 'text' },
          { key: 'value', label: 'Value',       placeholder: 'e.g. GB123456789', type: 'text' },
        ]}
        onAdd={data => {
          const field: CustomField = { id: Date.now().toString(), label: data.label, value: data.value };
          update({ customFields: [...defaults.customFields, field] });
        }}
      />
    </div>
  );
}

/* ── Archived content ─────────────────────────────────────── */

function ArchivedContent({ onBack, onClose }: { onBack: () => void; onClose: () => void }) {
  const { projects, deleteProject, restoreProject } = useApp();
  const navigate = useNavigate();

  // Tapping a card from the Archived panel:
  // 1. Write the sessionStorage flag so ProjectList reopens on Archived when we return.
  // 2. Navigate only — React Router unmounts ProjectList (and therefore AvatarSheet) in the
  //    same render. We deliberately do NOT call onClose(): that would cause AnimatePresence
  //    to start the sheet's slide-out for 1-2 frames before the parent unmounts, which is
  //    the visual mis-match vs. the clean snap users see from active/cleared cards.
  const handleCardClick = (id: string) => {
    sessionStorage.setItem('clear_reopen_sheet', 'archived');
    navigate(`/projects/${id}`);
  };

  // One-tap restore: returns project to its pre-archive status, no picker needed.
  const handleRestore = (id: string) => {
    restoreProject(id);
    toast.success('Restored');
  };

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const archivedProjects = projects.filter(p => p.status === 'archived');
  const deleteTarget     = projects.find(p => p.id === deleteTargetId);

  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', background: C.surface }}>
      <SubViewHeader
        title="Archived"
        onBack={onBack}
        right={<span style={{ fontSize: '13px', color: C.muted, paddingRight: 16 }}>{archivedProjects.length} project{archivedProjects.length !== 1 ? 's' : ''}</span>}
      />
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px 40px' }}>
        {archivedProjects.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 80, gap: 8, textAlign: 'center' }}>
            <p style={{ fontSize: '15px', fontWeight: 500, color: C.muted, margin: 0 }}>No archived projects</p>
            <p style={{ fontSize: '13px', color: C.hint, margin: 0 }}>Swipe left on a project and tap Archive</p>
          </div>
        ) : (
          <div role="list" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <AnimatePresence initial={false}>
              {archivedProjects.map(p => (
                <motion.div key={p.id} layout
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 48, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ProjectCard
                    project={p} isOverdue={false}
                    onStatusTap={() => {}}
                    onAdvanceStatus={() => {}}
                    onRequestClear={() => {}}
                    onDeleteRequest={() => setDeleteTargetId(p.id)}
                    onArchive={() => {}}
                    onRestore={() => handleRestore(p.id)}
                    onCardClick={handleCardClick}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <DeleteModal
        open={!!deleteTargetId && !!deleteTarget}
        onClose={() => setDeleteTargetId(null)}
        clientName={deleteTarget?.clientName ?? ''}
        body="There's no way to get it back."
        onDelete={() => { if (deleteTargetId) { deleteProject(deleteTargetId); setDeleteTargetId(null); } }}
      />
    </div>
  );
}

/* ── Help content ─────────────────────────────────────────── */

const FAQS = [
  {
    q: 'How do I send a quote?',
    a: 'Open a project and scroll to the Quote section. Tap Generate quote, review the details, then tap Send quote to copy a shareable link.',
  },
  {
    q: 'How do I mark a project as cleared?',
    a: 'Once payment arrives, open the project and tap Mark as cleared. The project moves to your Cleared tab permanently.',
  },
  {
    q: 'How do I add my bank details to invoices?',
    a: 'Tap your avatar → Invoice defaults → Payment defaults. Add your details in Default payment notes. They appear on every invoice automatically.',
  },
];

function HelpContent({ onBack }: { onBack: () => void }) {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.surface }}>
      <SubViewHeader title="Help" onBack={onBack} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px 40px' }}>
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: '12px', overflow: 'hidden' }}>
          {FAQS.map((faq, i) => {
            const open = expanded === i;
            const isLast = i === FAQS.length - 1;
            return (
              <div key={i} style={{ borderBottom: isLast ? 'none' : `1px solid ${C.border}` }}>
                <button
                  onClick={() => setExpanded(open ? null : i)}
                  onMouseEnter={e => (e.currentTarget.style.background = C.surface)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                  style={{
                    width: '100%', minHeight: 52,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0 16px', gap: 12,
                    background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                    transition: 'background 150ms',
                  }}
                >
                  <span style={{ fontSize: '13px', fontWeight: 600, color: C.black, lineHeight: 1.5 }}>{faq.q}</span>
                  <ChevronRight
                    size={16} color={C.muted} strokeWidth={2}
                    style={{
                      flexShrink: 0,
                      transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 200ms ease-in-out',
                    } as React.CSSProperties}
                  />
                </button>
                <div style={{ maxHeight: open ? 200 : 0, overflow: 'hidden', transition: 'max-height 220ms ease-in-out' }}>
                  <div style={{ padding: '12px 16px', borderTop: `1px solid ${C.border}` }}>
                    <p style={{ fontSize: '13px', fontWeight: 400, color: '#7A8099', lineHeight: 1.6, margin: 0 }}>
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Panel Add Modal ──────────────────────────────────────── */

function PanelAddModal({ open, onClose, onAdd, title, fields }: {
  open: boolean; onClose: () => void;
  onAdd: (data: Record<string, string>) => void;
  title: string;
  fields: { key: string; label: string; placeholder: string; type: 'text' | 'number' }[];
}) {
  const [values, setValues] = useState<Record<string, string>>({});

  const handleAdd = () => {
    const allFilled = fields.every(f => values[f.key]?.trim());
    if (!allFilled) return;
    onAdd(values);
    setValues({});
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }} onClick={onClose}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 50 }}
          />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px', zIndex: 51, pointerEvents: 'none' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ width: '100%', background: C.white, borderRadius: R.lg, padding: '20px 16px', boxShadow: '0 8px 40px rgba(0,0,0,0.18)', pointerEvents: 'auto' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <p style={{ fontSize: T.title.fontSize, fontWeight: 700, color: C.black, margin: 0, letterSpacing: '-0.02em' }}>{title}</p>
                {/* × Light context close — 16px icon, 36×36 circle, 44×44 tap target */}
                <LightModalBtn onClick={onClose} ariaLabel="Close" style={{ marginRight: -4 }}>
                  <X size={16} strokeWidth={2.5} />
                </LightModalBtn>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {fields.map(field => (
                  <div key={field.key}>
                    <label style={labelStyle}>{field.label}</label>
                    {field.type === 'number' ? (
                      <NumberInput
                        placeholder={field.placeholder}
                        value={values[field.key] || ''}
                        onChange={val => setValues(prev => ({ ...prev, [field.key]: val }))}
                        style={{ height: 48 }}
                      />
                    ) : (
                      <input
                        placeholder={field.placeholder} type={field.type}
                        value={values[field.key] || ''}
                        onChange={e => setValues(prev => ({ ...prev, [field.key]: e.target.value }))}
                        style={{ ...inputStyle, height: 48 }}
                        onFocus={e => e.currentTarget.style.borderColor = C.black}
                        onBlur={e => e.currentTarget.style.borderColor = C.border}
                      />
                    )}
                  </div>
                ))}
              </div>
              <button onClick={handleAdd}
                onMouseEnter={e => (e.currentTarget.style.background = '#2A2A2A')}
                onMouseLeave={e => (e.currentTarget.style.background = C.black)}
                style={{ width: '100%', height: 48, background: C.black, color: C.white, border: 'none', borderRadius: R.xl, cursor: 'pointer', fontSize: T.input.fontSize, fontWeight: 700, letterSpacing: '-0.01em', marginTop: 20, transition: 'background 150ms' }}>
                Add
              </button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ── Shared sub-components ────────────────────────────────── */

function SubViewHeader({ title, onBack, right }: { title: string; onBack: () => void; right?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '0 0 0 4px', borderBottom: `1px solid ${C.border}`, flexShrink: 0, minHeight: 52, background: C.white }}>
      {/* ‹ Light context back — 18px icon, 36×36 circle, 44×44 tap target */}
      <LightModalBtn onClick={onBack} ariaLabel="Back">
        <ChevronLeft size={18} strokeWidth={2.5} />
      </LightModalBtn>
      <span style={{ flex: 1, fontSize: T.title.fontSize, fontWeight: 700, color: C.black, letterSpacing: '-0.02em' }}>{title}</span>
      {right}
    </div>
  );
}

function PanelCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: C.card ?? C.white, border: `1px solid ${C.border}`, borderRadius: R.xl, padding: 16 }}>
      <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: C.muted, margin: '0 0 14px' }}>{title}</p>
      {children}
    </div>
  );
}

function AddRowButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick}
      onMouseEnter={e => (e.currentTarget.style.background = C.surface)}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 10, paddingBottom: 4, background: 'transparent', border: 'none', cursor: 'pointer', minHeight: 44, width: '100%', borderRadius: R.sm, transition: 'background 150ms' }}>
      <div style={{ width: 20, height: 20, borderRadius: R.pill, background: C.surface, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Plus size={12} color={C.black} />
      </div>
      <span style={{ fontSize: '13px', fontWeight: 500, color: C.black }}>{label}</span>
    </button>
  );
}

function Divider() {
  return <div style={{ height: 1, background: C.border, flexShrink: 0 }} />;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.muted, padding: '16px 20px 8px', flexShrink: 0 }}>{children}</div>;
}

interface SheetRowProps {
  icon: React.ReactNode; label: string; labelColor?: string;
  badge?: string; onClick: () => void; last?: boolean; noChevron?: boolean;
  hoverBg?: string; activeBg?: string;
}

function SheetRow({ icon, label, labelColor, badge, onClick, last, noChevron, hoverBg = '#F0F0F0', activeBg = '#E8E8E8' }: SheetRowProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const bg = pressed ? activeBg : hovered ? hoverBg : 'transparent';

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => { setPressed(false); }}
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 14, height: 52,
        width: '100%', border: 'none',
        borderBottom: last ? 'none' : `1px solid ${C.border}`,
        background: bg, cursor: 'pointer', padding: '0 20px',
        transition: 'background 150ms ease-in-out',
        textAlign: 'left', flexShrink: 0,
      }}
    >
      <div style={{ width: 20, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
      <span style={{ flex: 1, fontSize: '15px', fontWeight: 500, color: labelColor || C.black }}>{label}</span>
      {badge && <span style={{ fontSize: '11px', fontWeight: 600, color: C.muted, background: C.surface, padding: '2px 8px', borderRadius: R.pill, border: `1px solid ${C.border}`, marginRight: 4 }}>{badge}</span>}
      {!noChevron && (
        <ChevronRight
          size={14} color="rgba(10,10,10,0.4)" strokeWidth={2.5}
          style={{ transition: 'transform 150ms ease-in-out', transform: hovered ? 'translateX(2px)' : 'translateX(0)' } as React.CSSProperties}
        />
      )}
    </button>
  );
}

/* ── Shared styles ────────────────────────────────────────── */



function EditProfileBtn({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        height: 32, padding: '0 14px',
        background: pressed ? '#BEBEBE' : hovered ? '#D4D4D4' : '#F0F0F0',
        border: '1.5px solid #0A0A0A',
        borderRadius: '12px', cursor: 'pointer',
        fontSize: T.pill.fontSize, fontWeight: 600, color: '#0A0A0A',
        transform: pressed ? 'scale(0.98)' : 'scale(1)',
        transition: 'background 150ms ease-in-out, transform 150ms ease-in-out',
      }}
    >
      <User size={11} strokeWidth={2.5} /> Edit profile
    </button>
  );
}

function InlineEditProfileBtn({ onClick }: { onClick: () => void }) {
  const [hov, setHov] = useState(false);
  const [prs, setPrs] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { setHov(false); setPrs(false); }}
      onPointerDown={() => setPrs(true)}
      onPointerUp={() => setPrs(false)}
      style={{
        background: 'none', border: 'none', padding: 0, cursor: 'pointer',
        fontSize: '13px', fontWeight: 500,
        color: prs ? 'rgba(10,10,10,0.5)' : hov ? 'rgba(10,10,10,0.65)' : C.black,
        marginTop: 4, display: 'inline-block', textAlign: 'left',
        textDecoration: hov ? 'underline' : 'none',
        textUnderlineOffset: '2px',
        transition: 'color 120ms ease-in-out',
      }}
    >
      Edit profile →
    </button>
  );
}



/* ── Sheet toggle switch ──────────────────────────────────── */
function SheetToggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: 44, height: 24, borderRadius: 12,
        background: checked ? C.black : C.border,
        border: 'none', cursor: 'pointer', padding: 0,
        position: 'relative', flexShrink: 0,
        transition: 'background 200ms',
      }}
      aria-checked={checked}
      role="switch"
    >
      <div style={{
        width: 18, height: 18, borderRadius: 9, background: C.white,
        position: 'absolute', top: 3,
        left: checked ? 23 : 3,
        transition: 'left 200ms',
      }} />
    </button>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: '10px', fontWeight: 600, color: C.muted,
  display: 'block', marginBottom: 6,
  letterSpacing: '0.08em', textTransform: 'uppercase',
};

const inputStyle: React.CSSProperties = {
  width: '100%', height: 44, background: C.white,
  border: `1px solid ${C.border}`, borderRadius: R.md,
  padding: '0 12px', fontSize: T.input.fontSize, color: C.black,
  outline: 'none', fontFamily: 'inherit',
  boxSizing: 'border-box', transition: 'border-color 150ms',
};