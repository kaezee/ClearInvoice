import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { C, T, R } from '../../tokens';
import { ServiceItem, RateCardItem } from '../../types';

export type { ServiceItem };

interface Props {
  services: ServiceItem[];
  onChange: (services: ServiceItem[]) => void;
  rateCard: RateCardItem[];
  currencySymbol: string;
  /** 'quote' or 'invoice' when a document of that type has already been sent */
  sentDoc?: 'quote' | 'invoice';
  onAddToRateCard?: (name: string, price: number) => void;
  onNavigateToRateCard?: () => void;
}

/* ────────────────────────────────────────────────────────────
   Sub-components
──────────────────────────────────────────────────────────── */

/** × remove button — 24×24 tap target, hover: red icon + dangerLight circle */
function RemoveBtn({ onClick }: { onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      aria-label="Remove service"
      style={{
        width: 24, height: 24, border: 'none', borderRadius: '50%',
        background: hov ? C.dangerLight : 'transparent',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, transition: 'background 150ms',
      }}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path
          d="M2 2L10 10M10 2L2 10"
          stroke={hov ? C.danger : C.disabled}
          strokeWidth="1.5" strokeLinecap="round"
        />
      </svg>
    </button>
  );
}

/** Single row in the services list (Zone 2) */
function RcRow({
  item, currencySymbol, isLast, onClick,
}: { item: RateCardItem; currencySymbol: string; isLast: boolean; onClick: () => void }) {
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
        width: '100%', height: 48, padding: '0 14px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: prs ? '#F0F0F0' : hov ? C.surface : C.white,
        border: 'none',
        borderBottom: isLast ? 'none' : `1px solid ${C.border}`,
        cursor: 'pointer',
        transform: prs ? 'scale(0.99)' : 'scale(1)',
        transition: 'background 150ms ease-in-out, transform 100ms',
        fontFamily: 'inherit', textAlign: 'left', boxSizing: 'border-box',
      }}
    >
      <span style={{
        fontSize: T.sm.fontSize, fontWeight: 500, color: C.black,
        flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {item.service}
      </span>
      <span style={{ fontSize: T.sm.fontSize, fontWeight: 400, color: C.muted, flexShrink: 0 }}>
        {currencySymbol}{item.price.toLocaleString()}
      </span>
    </button>
  );
}

/** "Add" button in the custom service form */
function AddBtn({ enabled, onClick }: { enabled: boolean; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  const [prs, setPrs] = useState(false);
  return (
    <button
      onClick={enabled ? onClick : undefined}
      onMouseEnter={() => { if (enabled) setHov(true); }}
      onMouseLeave={() => { setHov(false); setPrs(false); }}
      onPointerDown={() => { if (enabled) setPrs(true); }}
      onPointerUp={() => setPrs(false)}
      disabled={!enabled}
      style={{
        height: 32, padding: '0 14px', borderRadius: R.md,
        background: prs ? '#3A3A3A' : hov ? '#2A2A2A' : C.black,
        color: C.white, border: `1.5px solid ${C.black}`,
        cursor: enabled ? 'pointer' : 'default',
        fontSize: T.pill.fontSize, fontWeight: 600, fontFamily: 'inherit',
        opacity: enabled ? 1 : 0.3,
        transform: prs ? 'scale(0.98)' : 'scale(1)',
        transition: 'background 120ms, transform 100ms, opacity 150ms',
        flexShrink: 0,
      }}
    >
      Add
    </button>
  );
}

/* ────────────────────────────────────────────────────────────
   Main component
──────────────────────────────────────────────────────────── */

export function ServicesSection({
  services, onChange, rateCard, currencySymbol,
  sentDoc, onAddToRateCard, onNavigateToRateCard,
}: Props) {
  const [search,         setSearch]         = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customName,     setCustomName]     = useState('');
  const [customPrice,    setCustomPrice]    = useState('');
  const [saveToCard,     setSaveToCard]     = useState(false);
  const [editingId,      setEditingId]      = useState<string | null>(null);
  const [editingVal,     setEditingVal]     = useState('');
  const [pendingId,      setPendingId]      = useState<string | null>(null);

  /* ── Derived ─────────────────────────────────────── */
  const addedRcIds  = new Set(services.filter(s => s.rateCardId).map(s => s.rateCardId!));
  const total       = services.reduce((sum, s) => sum + s.price, 0);
  const availableRc = rateCard.filter(item => !addedRcIds.has(item.id));
  const trimmed     = search.trim();
  const filteredRc  = trimmed
    ? availableRc.filter(item => item.service.toLowerCase().includes(trimmed.toLowerCase()))
    : availableRc;
  const noResults   = trimmed.length > 0 && filteredRc.length === 0;
  const canAdd      = customName.trim().length > 0 && parseFloat(customPrice) > 0;

  /* ── Handlers ────────────────────────────────────── */
  const addRcItem = (item: RateCardItem) => {
    onChange([...services, {
      id: `rc-${item.id}-${Date.now()}`,
      name: item.service, price: item.price,
      rateCardId: item.id,
    }]);
  };

  const removeService = (svc: ServiceItem) => {
    if (sentDoc) {
      setPendingId(svc.id === pendingId ? null : svc.id);
    } else {
      onChange(services.filter(s => s.id !== svc.id));
    }
  };

  const confirmRemove = (id: string) => {
    onChange(services.filter(s => s.id !== id));
    setPendingId(null);
  };

  const startEdit  = (svc: ServiceItem) => { setEditingId(svc.id); setEditingVal(String(svc.price)); };
  const commitEdit = (id: string) => {
    const val = parseFloat(editingVal);
    // spec: empty or zero → revert (no-op — parent state unchanged)
    if (!isNaN(val) && val > 0) {
      onChange(services.map(s => s.id === id ? { ...s, price: val } : s));
    }
    setEditingId(null);
  };

  const addCustom = () => {
    const name  = customName.trim();
    const price = parseFloat(customPrice);
    if (!name || isNaN(price) || price <= 0) return;
    onChange([...services, { id: `c-${Date.now()}`, name, price }]);
    if (saveToCard && onAddToRateCard) onAddToRateCard(name, price);
    setCustomName(''); setCustomPrice(''); setSaveToCard(false); setShowCustomForm(false);
  };

  const openCustomFromSearch = () => {
    setCustomName(trimmed);
    setSearch('');
    setShowCustomForm(true);
  };

  /* ── Shared input style ──────────────────────────── */
  const formInput = (extraStyle?: React.CSSProperties): React.CSSProperties => ({
    height: 36, background: C.white,
    border: `1px solid ${C.border}`, borderRadius: 8,
    padding: '0 10px', fontSize: T.sm.fontSize, color: C.black,
    outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
    transition: 'border-color 150ms',
    ...extraStyle,
  });

  /* ── Render ──────────────────────────────────────── */
  return (
    <div>

      {/* ════════════════════════════════════════════
          Zone 1 — Selected services
      ════════════════════════════════════════════ */}
      {services.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '12px 0',
          fontSize: T.sm.fontSize, fontWeight: 400, color: C.disabled,
        }}>
          No services added yet
        </div>
      ) : (
        <div>
          {services.map((svc, idx) => {
            const isLast    = idx === services.length - 1;
            const isPending = pendingId === svc.id;
            return (
              <div key={svc.id}>
                {/* Service row */}
                <div style={{
                  height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: C.white,
                  borderBottom: !isLast || isPending ? `1px solid ${C.border}` : 'none',
                }}>
                  {/* Name */}
                  <span style={{
                    fontSize: T.sm.fontSize, fontWeight: 600, color: C.black,
                    flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap', paddingRight: 8,
                  }}>
                    {svc.name}
                  </span>

                  {/* Price (tappable) + remove */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                    {editingId === svc.id ? (
                      <input
                        autoFocus
                        type="text"
                        inputMode="decimal"
                        value={editingVal}
                        onChange={e => setEditingVal(e.target.value.replace(/[^0-9.]/g, ''))}
                        onBlur={() => commitEdit(svc.id)}
                        onKeyDown={e => {
                          if (e.key === 'Enter')  commitEdit(svc.id);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                        style={{
                          width: 84, textAlign: 'right',
                          fontSize: T.sm.fontSize, fontWeight: 500, color: C.black,
                          border: 'none', borderBottom: `1.5px solid ${C.black}`,
                          outline: 'none', background: 'transparent',
                          fontFamily: 'inherit', padding: '0 2px',
                        }}
                      />
                    ) : (
                      <button
                        onClick={() => startEdit(svc)}
                        title="Tap to edit price"
                        style={{
                          fontSize: T.sm.fontSize, fontWeight: 500, color: C.black,
                          background: 'none', border: 'none', cursor: 'pointer',
                          padding: '2px 4px', borderRadius: R.sm,
                          fontFamily: 'inherit', transition: 'background 100ms',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = C.surface)}
                        onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                      >
                        {currencySymbol}{svc.price.toLocaleString()}
                      </button>
                    )}
                    <RemoveBtn onClick={() => removeService(svc)} />
                  </div>
                </div>

                {/* Sent-doc removal warning */}
                {isPending && (
                  <div style={{
                    padding: '6px 0 10px',
                    borderBottom: isLast ? 'none' : `1px solid ${C.border}`,
                  }}>
                    <p style={{ fontSize: T.xs.fontSize, fontWeight: 400, color: C.amberText, margin: '0 0 6px', lineHeight: 1.5 }}>
                      On a sent document — removing won't update it.
                    </p>
                    <div style={{ display: 'flex', gap: 14 }}>
                      <button
                        onClick={() => confirmRemove(svc.id)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          fontSize: T.xs.fontSize, fontWeight: 500, color: C.danger,
                          padding: '2px 6px', borderRadius: R.sm, fontFamily: 'inherit',
                          transition: 'background 150ms',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = C.dangerLight)}
                        onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                      >
                        Remove anyway
                      </button>
                      <button
                        onClick={() => setPendingId(null)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          fontSize: T.xs.fontSize, fontWeight: 500, color: C.muted,
                          padding: '2px 6px', borderRadius: R.sm, fontFamily: 'inherit',
                          transition: 'background 150ms',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#F0F0F0')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                      >
                        Keep it
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Total row */}
          <div style={{
            borderTop: `1.5px solid ${C.black}`,
            paddingTop: 10, marginTop: 6,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: T.pill.fontSize, fontWeight: 500, color: C.muted }}>Total</span>
            <span style={{ fontSize: T.md.fontSize, fontWeight: 600, color: C.black }}>
              {currencySymbol}{total.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════
          Divider
      ════════════════════════════════════════════ */}
      <div style={{ margin: '14px 0 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ flex: 1, height: 1, background: C.border }} />
        <span style={{ fontSize: T.label.fontSize, fontWeight: 500, color: C.disabled, whiteSpace: 'nowrap' }}>
          Listed services
        </span>
        <div style={{ flex: 1, height: 1, background: C.border }} />
      </div>

      {/* ════════════════════════════════════════════
          Zone 2 — Services list
      ════════════════════════════════════════════ */}
      {rateCard.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '10px 0 4px' }}>
          <p style={{ fontSize: T.sm.fontSize, fontWeight: 400, color: C.disabled, margin: '0 0 6px', lineHeight: 1.5 }}>
            No services added to your list yet.
          </p>
          {onNavigateToRateCard && (
            <button
              onClick={onNavigateToRateCard}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: T.sm.fontSize, fontWeight: 500, color: C.black,
                padding: 0, fontFamily: 'inherit',
              }}
            >
              Set up services →
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Search input */}
          <div style={{ position: 'relative', marginBottom: 8 }}>
            <Search
              size={14}
              style={{
                position: 'absolute', left: 10, top: '50%',
                transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search your services..."
              style={{
                width: '100%', height: 36,
                background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.md,
                padding: '0 12px 0 32px', fontSize: T.sm.fontSize, color: C.black,
                outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
                transition: 'border-color 150ms',
              }}
              onFocus={e  => (e.currentTarget.style.borderColor = C.black)}
              onBlur={e   => (e.currentTarget.style.borderColor = C.border)}
            />
          </div>

          {/* No-results state */}
          {noResults ? (
            <div style={{ textAlign: 'center', paddingBottom: 4 }}>
              <p style={{ fontSize: T.sm.fontSize, fontWeight: 400, color: C.disabled, margin: '0 0 4px' }}>
                No match for "{trimmed}"
              </p>
              <button
                onClick={openCustomFromSearch}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: T.sm.fontSize, fontWeight: 500, color: C.black,
                  padding: '6px 12px', borderRadius: R.md, fontFamily: 'inherit',
                  transition: 'background 150ms',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#F0F0F0')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                + Add "{trimmed}" as custom →
              </button>
            </div>
          ) : (
            /* Services list */
            <div style={{
              maxHeight: 240, overflowY: 'auto',
              border: `1px solid ${C.border}`, borderRadius: R.md,
            }}>
              {filteredRc.length === 0 ? (
                /* All items already added */
                <div style={{
                  textAlign: 'center', padding: 16,
                  fontSize: T.sm.fontSize, fontWeight: 400, color: C.disabled,
                }}>
                  All your services have been added
                </div>
              ) : (
                filteredRc.map((item, idx) => (
                  <RcRow
                    key={item.id}
                    item={item}
                    currencySymbol={currencySymbol}
                    isLast={idx === filteredRc.length - 1}
                    onClick={() => addRcItem(item)}
                  />
                ))
              )}
            </div>
          )}
        </>
      )}

      {/* ════════════════════════════════════════════
          Custom service — always below Zone 2
      ════════════════════════════════════════════ */}
      {!showCustomForm && (
        <button
          onClick={() => setShowCustomForm(true)}
          style={{
            display: 'block', background: 'none', border: 'none',
            cursor: 'pointer', fontSize: T.sm.fontSize, fontWeight: 500, color: C.muted,
            padding: '8px 14px', marginTop: 8,
            fontFamily: 'inherit', borderRadius: R.md,
            transition: 'background 150ms',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#F0F0F0'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
          onPointerDown={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.06)')}
          onPointerUp={e   => (e.currentTarget.style.background = '#F0F0F0')}
        >
          + Custom service
        </button>
      )}

      {/* Custom service inline form */}
      {showCustomForm && (
        <div style={{ background: C.surface, borderRadius: R.md, padding: 12, marginTop: 8 }}>
          {/* Row 1: name + price */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 10 }}>
            <input
              autoFocus
              placeholder="e.g. Illustration"
              value={customName}
              onChange={e => setCustomName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && canAdd) addCustom(); }}
              style={{ ...formInput({ flex: 1 } as React.CSSProperties) }}
              onFocus={e => (e.currentTarget.style.borderColor = C.black)}
              onBlur={e  => (e.currentTarget.style.borderColor = C.border)}
            />
            {/* Price with currency prefix */}
            <div style={{ position: 'relative', width: 90, flexShrink: 0 }}>
              <span style={{
                position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
                fontSize: T.sm.fontSize, color: C.muted, pointerEvents: 'none',
              }}>
                {currencySymbol}
              </span>
              <input
                placeholder="0.00"
                value={customPrice}
                inputMode="decimal"
                onChange={e => setCustomPrice(e.target.value.replace(/[^0-9.]/g, ''))}
                onKeyDown={e => { if (e.key === 'Enter' && canAdd) addCustom(); }}
                style={{ ...formInput({ width: '100%', paddingLeft: currencySymbol.length > 1 ? 24 : 20 }) }}
                onFocus={e => (e.currentTarget.style.borderColor = C.black)}
                onBlur={e  => (e.currentTarget.style.borderColor = C.border)}
              />
            </div>
          </div>

          {/* Row 2: save to card + cancel + add */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={saveToCard}
                onChange={e => setSaveToCard(e.target.checked)}
                style={{ width: 14, height: 14, cursor: 'pointer', accentColor: C.black }}
              />
              <span style={{ fontSize: T.xs.fontSize, fontWeight: 400, color: C.muted }}>Save to services</span>
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                onClick={() => {
                  setShowCustomForm(false);
                  setCustomName(''); setCustomPrice(''); setSaveToCard(false);
                }}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: T.pill.fontSize, fontWeight: 400, color: C.muted,
                  padding: '4px 8px', borderRadius: R.md, fontFamily: 'inherit',
                  transition: 'background 150ms',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#F0F0F0')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                Cancel
              </button>
              <AddBtn enabled={canAdd} onClick={addCustom} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}