import type { CSSProperties } from 'react';

export const container: CSSProperties = {
  background: 'rgba(255,255,255,0.92)',
  borderRadius: '24px',
  padding: '20px',
  boxShadow: '0 16px 32px rgba(0,0,0,0.08)',
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
  minHeight: '480px',
};

export const headerRow: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
};

export const title: CSSProperties = {
  fontSize: '1rem',
  fontWeight: 700,
  margin: 0,
  color: '#2f2f3a',
};

export const statusPill: CSSProperties = {
  fontSize: '0.75rem',
  color: '#d81b60',
};

export const chatScrollArea: CSSProperties = {
  flex: '1 1 auto',
  minHeight: '160px',
  maxHeight: '220px',
  overflowY: 'auto',
  borderRadius: '18px',
  background: 'rgba(236,64,122,0.05)',
  padding: '12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
};

export const placeholderText: CSSProperties = {
  fontSize: '0.85rem',
  color: '#7a7a85',
  textAlign: 'center',
  margin: '0 auto',
};

export const messageBubbleBase: CSSProperties = {
  padding: '10px 14px',
  borderRadius: '16px',
  fontSize: '0.9rem',
  lineHeight: 1.4,
  maxWidth: '80%',
  boxShadow: '0 6px 14px rgba(0,0,0,0.06)',
};

export const assistantBubble: CSSProperties = {
  ...messageBubbleBase,
  background: '#ffffff',
  color: '#3c3c47',
  alignSelf: 'flex-start',
};

export const userBubble: CSSProperties = {
  ...messageBubbleBase,
  background: '#ec407a',
  color: '#fff',
  alignSelf: 'flex-end',
};

export const inputRow: CSSProperties = {
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
  width: '100%',
  flexWrap: 'nowrap',
};

export const inputField: CSSProperties = {
  flex: 1,
  borderRadius: '999px',
  border: '1px solid rgba(0,0,0,0.12)',
  padding: '10px 16px',
  fontSize: '0.9rem',
  minWidth: 0,
};

export const sendButton: CSSProperties = {
  border: 'none',
  borderRadius: '999px',
  background: '#ec407a',
  color: '#fff',
  padding: '10px 18px',
  fontWeight: 600,
  cursor: 'pointer',
  minWidth: '72px',
  boxShadow: '0 10px 22px rgba(236,64,122,0.25)',
  flexShrink: 0,
};

export const sectionTitle: CSSProperties = {
  fontSize: '0.95rem',
  margin: '8px 0 0',
  color: '#2f2f3a',
  fontWeight: 600,
};

export const outfitCard: CSSProperties = {
  marginTop: '8px',
  borderRadius: '16px',
  border: '1px solid rgba(0,0,0,0.08)',
  padding: '12px',
  background: 'rgba(236,64,122,0.04)',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

export const outfitName: CSSProperties = {
  margin: 0,
  fontSize: '0.95rem',
  fontWeight: 600,
  color: '#2f2f3a',
};

export const outfitReason: CSSProperties = {
  margin: 0,
  fontSize: '0.85rem',
  color: '#5b5b66',
};

export const outfitItemRow: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  borderRadius: '12px',
  background: '#fff',
  padding: '6px 8px',
};

export const itemThumb: CSSProperties = {
  width: '40px',
  height: '40px',
  borderRadius: '10px',
  objectFit: 'cover',
  background: 'rgba(236,64,122,0.12)',
};

export const itemThumbFallback: CSSProperties = {
  ...itemThumb,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#d81b60',
  fontSize: '0.85rem',
  fontWeight: 600,
};

export const itemMeta: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
};

export const itemName: CSSProperties = {
  margin: 0,
  fontSize: '0.85rem',
  color: '#2f2f3a',
  fontWeight: 600,
};

export const itemReason: CSSProperties = {
  margin: 0,
  fontSize: '0.75rem',
  color: '#7a7a85',
};

export const shoppingList: CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: '8px 0 0',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
};

export const shoppingItem: CSSProperties = {
  padding: '8px 10px',
  borderRadius: '12px',
  background: 'rgba(33,33,33,0.04)',
  fontSize: '0.85rem',
  color: '#3c3c47',
};

export const helperText: CSSProperties = {
  fontSize: '0.8rem',
  color: '#7a7a85',
};

export const errorText: CSSProperties = {
  fontSize: '0.8rem',
  color: '#c62828',
  margin: 0,
};
