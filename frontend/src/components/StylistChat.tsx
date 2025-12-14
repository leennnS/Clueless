import { useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { askStylistThunk } from '../store/stylist/stylistSlice';
import type { ClothingItem, StylistItemSuggestion } from '../types/models';
import * as stylistChatStyles from '../styles/stylistChatStyles';
import { toAbsoluteImageUrl } from '../hooks/useClothingItems';

export default function StylistChat() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { messages, outfits, shoppingSuggestions, loading, error } = useAppSelector(
    (state) => state.stylist,
  );
  const clothingItems = useAppSelector((state) => state.clothingItems.data);
  const [draft, setDraft] = useState('');
  const chatRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const wardrobeMap = useMemo(() => {
    const map = new Map<number, ClothingItem>();
    clothingItems.forEach((item) => {
      map.set(item.item_id, {
        ...item,
        image_url: toAbsoluteImageUrl(item.image_url) ?? undefined,
      });
    });
    return map;
  }, [clothingItems]);

  if (!user) {
    return null;
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!user.user_id) {
      return;
    }
    const trimmed = draft.trim();
    if (!trimmed) {
      return;
    }
    dispatch(askStylistThunk({ userId: user.user_id, message: trimmed }));
    setDraft('');
  };

  const renderOutfitItems = (items: StylistItemSuggestion[]) =>
    items.map((item, index) => {
      const wardrobeItem = wardrobeMap.get(item.itemId);
      return (
        <div
          style={stylistChatStyles.outfitItemRow}
          key={`outfit-item-${item.itemId}-${index}`}
        >
          {wardrobeItem?.image_url ? (
            <img
              src={wardrobeItem.image_url}
              alt={wardrobeItem.name}
              style={stylistChatStyles.itemThumb}
            />
          ) : (
            <div style={stylistChatStyles.itemThumbFallback}>
              {wardrobeItem?.name?.slice(0, 2).toUpperCase() ?? `#${item.itemId}`}
            </div>
          )}
          <div style={stylistChatStyles.itemMeta}>
            <p style={stylistChatStyles.itemName}>
              {wardrobeItem?.name ?? `Item #${item.itemId}`}
            </p>
            {item.reason && <p style={stylistChatStyles.itemReason}>{item.reason}</p>}
          </div>
        </div>
      );
    });

  return (
    <div style={stylistChatStyles.container}>
      <div style={stylistChatStyles.headerRow}>
        <h3 style={stylistChatStyles.title}>AI Stylist</h3>
        <span style={stylistChatStyles.statusPill}>
          {loading ? 'Thinking...' : 'Ready'}
        </span>
      </div>

      <div style={stylistChatStyles.chatScrollArea} ref={chatRef}>
        {messages.length === 0 ? (
          <p style={stylistChatStyles.placeholderText}>
            Ask for outfit inspo, weather-aware looks, or missing wardrobe staples.
          </p>
        ) : (
          messages.map((message, index) => (
            <div
              key={`stylist-msg-${index}`}
              style={
                message.sender === 'user'
                  ? stylistChatStyles.userBubble
                  : stylistChatStyles.assistantBubble
              }
            >
              {message.text}
            </div>
          ))
        )}
      </div>

      {error && <p style={stylistChatStyles.errorText}>{error}</p>}

      <form style={stylistChatStyles.inputRow} onSubmit={handleSubmit}>
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="E.g., Need a rainy day look..."
          style={stylistChatStyles.inputField}
          disabled={loading}
        />
        <button
          type="submit"
          style={stylistChatStyles.sendButton}
          disabled={loading || !draft.trim()}
        >
          Send
        </button>
      </form>

      <div>
        <p style={stylistChatStyles.sectionTitle}>Suggested Outfits</p>
        {outfits.length === 0 ? (
          <p style={stylistChatStyles.helperText}>No looks yet—ask your stylist for ideas.</p>
        ) : (
          outfits.map((outfit, index) => (
            <div style={stylistChatStyles.outfitCard} key={`outfit-${index}-${outfit.name}`}>
              <h4 style={stylistChatStyles.outfitName}>{outfit.name}</h4>
              <p style={stylistChatStyles.outfitReason}>{outfit.reasoning}</p>
              {renderOutfitItems(outfit.items)}
            </div>
          ))
        )}
      </div>

      <div>
        <p style={stylistChatStyles.sectionTitle}>What to Buy Next</p>
        {shoppingSuggestions.length === 0 ? (
          <p style={stylistChatStyles.helperText}>Your closet might already be complete!</p>
        ) : (
          <ul style={stylistChatStyles.shoppingList}>
            {shoppingSuggestions.map((suggestion, index) => (
              <li style={stylistChatStyles.shoppingItem} key={`shopping-${index}`}>
                <strong>{suggestion.category}</strong>: {suggestion.reason}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
