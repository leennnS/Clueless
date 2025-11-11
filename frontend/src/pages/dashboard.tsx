import WeatherWidget from "../components/WeatherWidget";
import {
  CANVAS_ITEM_SIZE,
  CLOTHING_CATEGORY_OPTIONS,
  PRESET_TAG_OPTIONS,
  STUDIO_SPARKLES,
  WARDROBE_CATEGORY_TABS,
  useDashboardPage,
} from "../hooks/useDashboardPage";
import * as dashboardStyles from "../styles/dashboardStyles";

/**
 * Main studio experience where users assemble outfits, schedule looks, and monitor notifications.
 *
 * Preconditions:
 * - User must be authenticated; otherwise the hook redirects to `/login`.
 *
 * Postconditions:
 * - Uses `useDashboardPage` to render wardrobe, canvas, dialogs, and inbox hearts.
 */
export default function Dashboard() {
  const {
    user,
    headerProfileInitials,
    todaysLikes,
    hasInboxLove,
    latestLove,
    handleOpenFeed,
    handleOpenInboxFromNotification,
    handleOpenProfile,
    handleLogout,
    wardrobeSearch,
    setWardrobeSearch,
    refetch,
    handleOpenAddItemDialog,
    activeWardrobeCategory,
    handleWardrobeCategoryChange,
    loading,
    error,
    filteredWardrobeItems,
    handleDragStart,
    setSelectedItem,
    selectedItem,
    handleDragOverCanvas,
    handleDrop,
    loadingEditContext,
    editingContext,
    handleExitEditing,
    editContextError,
    handleSaveOutfit,
    canvasRef,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    endCanvasDrag,
    canvasItems,
    isExporting,
    activeCanvasItemId,
    dragState,
    resizeState,
    rotateState,
    beginDragFromCanvas,
    setActiveCanvasItemId,
    removeCanvasItem,
    beginRotateHandle,
    beginResizeHandle,
    statusMessage,
    statusError,
    detailItem,
    showAddItemDialog,
    addItemSubmitting,
    handleCloseAddItemDialog,
    addItemForm,
    handleAddItemFieldChange,
    handleImageSelection,
    handleToggleTagSelection,
    addItemError,
    handleSubmitNewItem,
    showSaveDialog,
    closeSaveDialog,
    savingOutfit,
    handleConfirmSaveOutfit,
    saveFormName,
    setSaveFormName,
    saveDialogError,
    setSaveDialogError,
    saveFormIsPublic,
    setSaveFormIsPublic,
    saveFormScheduleDate,
    setSaveFormScheduleDate,
    todayIso,
  } = useDashboardPage();

  return (
    <div style={dashboardStyles.containerStyle}>
      <style>
        {`
          @keyframes sparkleFloat {
            0% { transform: translateY(0); opacity: 0.8; }
            50% { transform: translateY(-10px); opacity: 1; }
            100% { transform: translateY(0); opacity: 0.8; }
          }
          @keyframes heartPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.15); }
            100% { transform: scale(1); }
          }
          @keyframes heartDrift {
            0% { transform: translateY(0) scale(0.9); opacity: 0.9; }
            100% { transform: translateY(-30px) scale(1.1); opacity: 0; }
          }
        `}
      </style>
      <div style={dashboardStyles.sparkleLayerStyle} aria-hidden="true">
        {STUDIO_SPARKLES.map((sparkle, index) => (
          <span
            key={`sparkle-${index}`}
            style={{
              ...dashboardStyles.sparkleStyle,
              fontSize: sparkle.size,
              animationDelay: sparkle.delay,
              ...(sparkle.top ? { top: sparkle.top } : {}),
              ...(sparkle.bottom ? { bottom: sparkle.bottom } : {}),
              ...(sparkle.left ? { left: sparkle.left } : {}),
              ...(sparkle.right ? { right: sparkle.right } : {}),
            }}
          >
            {"\u2728"}
          </span>
        ))}
        {hasInboxLove &&
          todaysLikes.slice(0, 3).map((record, index) => (
            <span
              key={`heart-${record.like_id}-${index}`}
              style={{
                ...dashboardStyles.heartFloatStyle,
                left: `${120 + index * 60}px`,
                animationDelay: `${index * 0.4}s`,
              }}
            >
              {"\u2764\uFE0F"}
            </span>
          ))}
      </div>

      <header style={dashboardStyles.headerStyle}>
        <div style={dashboardStyles.headerIntroStyle}>
          <h1 style={dashboardStyles.studioTitleStyle}>Your Closet Studio</h1>
          <p style={dashboardStyles.headerSubtitleStyle}>
            Drag pieces into the canvas to build your next look.
          </p>
          <div style={dashboardStyles.headerActionsRowStyle}>
            <button
              type="button"
              onClick={handleOpenFeed}
              style={dashboardStyles.feedLinkButtonStyle}
              onMouseEnter={(event) => {
                event.currentTarget.style.transform = "translateY(-2px)";
                event.currentTarget.style.boxShadow =
                  "0 16px 26px rgba(236,64,122,0.25)";
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.transform = "translateY(0)";
                event.currentTarget.style.boxShadow =
                  "0 10px 20px rgba(236,64,122,0.2)";
              }}
            >
              View community feed
            </button>
          </div>
        </div>
        <div style={dashboardStyles.headerCenterStackStyle}>
          <div style={dashboardStyles.weatherCardStyle}>
            <WeatherWidget />
          </div>
          {hasInboxLove && (
            <button
              type="button"
              onClick={handleOpenInboxFromNotification}
              style={dashboardStyles.likeNotificationStyle}
            >
              <span style={dashboardStyles.likeNotificationHeartStyle} aria-hidden="true">
                {"\u{1F496}"}
              </span>
              <div>
                <strong>
                  {todaysLikes.length === 1
                    ? "New love today"
                    : `${todaysLikes.length} fresh likes today`}
                </strong>
                <p style={dashboardStyles.likeNotificationBodyStyle}>
                  {latestLove?.user?.username
                    ? `@${latestLove.user.username} just liked your look`
                    : "Stylist fans are stopping by your closet."}
                </p>
              </div>
            </button>
          )}
        </div>
        <div style={dashboardStyles.profileWrapperStyle}>
          <button
            type="button"
            onClick={() => handleOpenProfile()}
            style={dashboardStyles.profileSummaryButtonStyle}
          >
            <div style={dashboardStyles.profileAvatarStyle}>
              {user?.profile_image_url ? (
                <img
                  src={user.profile_image_url}
                  alt={`${user?.username ?? "Stylist"} avatar`}
                  style={dashboardStyles.profileAvatarImageStyle}
                />
              ) : (
                <span>{headerProfileInitials}</span>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
              <span style={{ fontWeight: 600, color: "#303039" }}>
                {user?.username ?? "Stylist"}
              </span>
              <span style={{ fontSize: "0.8rem", color: "#777" }}>
                {user?.email ?? "guest"}
              </span>
            </div>
          </button>
          <button type="button" onClick={handleLogout} style={dashboardStyles.logoutButtonStyle}>
            Logout
          </button>
        </div>
      </header>

      <main style={dashboardStyles.mainLayoutStyle}>
        <section style={dashboardStyles.inventorySectionStyle}>
          <div style={dashboardStyles.panelHeaderStyle}>
            <h2 style={{ margin: 0, fontSize: "1.1rem" }}>Wardrobe</h2>
            <div style={dashboardStyles.wardrobeControlsStyle}>
              <input
                type="search"
                value={wardrobeSearch}
                onChange={(event) => setWardrobeSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    setWardrobeSearch("");
                  }
                }}
                placeholder="Search pieces..."
                aria-label="Search wardrobe items"
                style={dashboardStyles.wardrobeSearchInputStyle}
              />
              <button
                type="button"
                onClick={() => refetch().catch(() => undefined)}
                style={dashboardStyles.refreshButtonStyle}
              >
                Refresh
              </button>
              <button
                type="button"
                onClick={handleOpenAddItemDialog}
                style={dashboardStyles.wardrobeAddButtonStyle}
                aria-label="Add new wardrobe item"
              >
                +
              </button>
            </div>
          </div>
          <div
            style={dashboardStyles.wardrobeCategoryTabsStyle}
            role="group"
            aria-label="Filter wardrobe by category"
          >
            {WARDROBE_CATEGORY_TABS.map((tab) => {
              const isActive = activeWardrobeCategory === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => handleWardrobeCategoryChange(tab.value)}
                  style={{
                    ...dashboardStyles.wardrobeCategoryTabButtonStyle,
                    ...(isActive ? dashboardStyles.wardrobeCategoryTabButtonActiveStyle : {}),
                  }}
                  aria-pressed={isActive}
                  aria-label={tab.label}
                  title={tab.label}
                >
                  <span aria-hidden="true" style={{ fontSize: "1.25rem" }}>
                    {tab.icon}
                  </span>
                  <span style={dashboardStyles.srOnlyStyle}>{tab.label}</span>
                </button>
              );
            })}
          </div>
          {loading && (
            <p style={dashboardStyles.infoTextStyle}>Loading your closet...</p>
          )}
          {error && (
            <p style={{ ...dashboardStyles.infoTextStyle, color: "#c62828" }}>{error}</p>
          )}
          <div style={dashboardStyles.inventoryListStyle}>
            {filteredWardrobeItems.length === 0 && !loading && !error ? (
              <div style={dashboardStyles.inventoryEmptyStateStyle}>
                No wardrobe pieces match your search.
              </div>
            ) : (
              filteredWardrobeItems.map((item) => (
                <div
                  key={item.item_id}
                  draggable
                  onDragStart={handleDragStart(item)}
                  onClick={() => setSelectedItem(item)}
                  style={{
                    ...dashboardStyles.inventoryCardStyle,
                    border:
                      selectedItem?.item_id === item.item_id
                        ? "2px solid #ec407a"
                        : "1px solid rgba(0,0,0,0.08)",
                  }}
                >
                  <div style={dashboardStyles.inventoryImageWrapperStyle}>
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "12px",
                        }}
                      />
                    ) : (
                      <div style={dashboardStyles.fallbackThumbnailStyle}>
                        {item.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
        <section
          style={dashboardStyles.canvasSectionStyle}
          onDragOver={handleDragOverCanvas}
          onDrop={handleDrop}
        >
          {loadingEditContext && (
            <div style={dashboardStyles.editContextBannerStyle}>
              <span style={dashboardStyles.editContextStatusBadgeStyle}>Loading outfit&hellip;</span>
            </div>
          )}
          {editingContext && !loadingEditContext && (
            <div style={dashboardStyles.editContextBannerStyle}>
              <span style={dashboardStyles.editContextStatusBadgeStyle}>
                Editing: {editingContext.name ?? `Outfit #${editingContext.outfitId}`}
              </span>
              <span
                style={{
                  ...dashboardStyles.editContextPrivacyBadgeStyle,
                  backgroundColor: editingContext.isPublic
                    ? "rgba(76,175,80,0.14)"
                    : "rgba(229,57,53,0.14)",
                  color: editingContext.isPublic ? "#2e7d32" : "#c62828",
                }}
              >
                {editingContext.isPublic ? "Public" : "Private"}
              </span>
              <button
                type="button"
                onClick={handleExitEditing}
                style={dashboardStyles.editContextExitButtonStyle}
              >
                Exit edit mode
              </button>
            </div>
          )}
          {editContextError && !loadingEditContext && (
            <div style={dashboardStyles.editContextErrorStyle}>{editContextError}</div>
          )}
          <div style={dashboardStyles.panelHeaderStyle}>
            <h2 style={{ margin: 0, fontSize: "1.1rem" }}>Canvas</h2>
            <button
              type="button"
              onClick={handleSaveOutfit}
              style={{
                ...dashboardStyles.primaryButtonStyle,
                ...(loadingEditContext ? dashboardStyles.buttonDisabledStyle : {}),
              }}
              disabled={loadingEditContext}
            >
              {editingContext ? "Update Outfit" : "Save Outfit"}
            </button>
          </div>
          <div
            id="outfit-canvas"
            ref={canvasRef}
            style={dashboardStyles.canvasStyle}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={endCanvasDrag}
            onMouseLeave={endCanvasDrag}
          >
            {canvasItems.length === 0 && (
              <p style={dashboardStyles.placeholderTextStyle}>
                Drag items here to start styling your outfit.
              </p>
            )}
            {!isExporting && (
              <div
                style={dashboardStyles.canvasGuidelineStyle}
                data-html2canvas-ignore="true"
              />
            )}
            {canvasItems.map((canvasItem) => {
              const itemSize = CANVAS_ITEM_SIZE * canvasItem.scale;
              const isActive = activeCanvasItemId === canvasItem.instanceId;
              const isDragging =
                dragState?.instanceId === canvasItem.instanceId;
              const isResizing =
                resizeState?.instanceId === canvasItem.instanceId;
              const isRotating =
                rotateState?.instanceId === canvasItem.instanceId;

              return (
                <div
                  key={canvasItem.instanceId}
                  style={{
                    ...dashboardStyles.canvasItemStyle,
                    left: `${canvasItem.x}px`,
                    top: `${canvasItem.y}px`,
                    width: `${itemSize}px`,
                    height: `${itemSize}px`,
                    zIndex: canvasItem.z,
                    outline:
                      isActive && !isExporting ? "2px solid #ec407a" : "none",
                    cursor: isDragging
                      ? "grabbing"
                      : isResizing
                      ? "nwse-resize"
                      : isRotating
                      ? "grabbing"
                      : "grab",
                  }}
                  onMouseDown={beginDragFromCanvas(canvasItem.instanceId)}
                  onFocus={() => setActiveCanvasItemId(canvasItem.instanceId)}
                  role="button"
                  tabIndex={0}
                  data-canvas-item="true"
                >
                  {!isExporting && isActive && (
                    <>
                      <button
                        type="button"
                        data-html2canvas-ignore="true"
                        onClick={(event) => {
                          event.stopPropagation();
                          removeCanvasItem(canvasItem.instanceId);
                        }}
                        onMouseDown={(event) => {
                          event.stopPropagation();
                          event.preventDefault();
                        }}
                        style={dashboardStyles.canvasDeleteButtonStyle}
                        aria-label="Remove item"
                        title="Remove item"
                      >
                        <span aria-hidden="true">{"\u00D7"}</span>
                      </button>
                      <button
                        type="button"
                        data-html2canvas-ignore="true"
                        onMouseDown={beginRotateHandle(canvasItem.instanceId)}
                        onClick={(event) => event.preventDefault()}
                        style={dashboardStyles.canvasRotateHandleStyle}
                        aria-label="Rotate item"
                        title="Rotate item"
                      >
                        <span aria-hidden="true">{"\u21bb"}</span>
                      </button>
                      <button
                        type="button"
                        data-html2canvas-ignore="true"
                        onMouseDown={beginResizeHandle(canvasItem.instanceId)}
                        onClick={(event) => event.preventDefault()}
                        style={dashboardStyles.canvasResizeHandleStyle}
                        aria-label="Resize item"
                        title="Resize item"
                      >
                        <span aria-hidden="true">{"\u2198"}</span>
                      </button>
                    </>
                  )}
                  <div
                    style={{
                      ...dashboardStyles.canvasVisualWrapperStyle,
                      transform: `rotate(${canvasItem.rotation}deg)`,
                    }}
                  >
                    {canvasItem.item.image_url ? (
                      <img
                        src={canvasItem.item.image_url}
                        alt={canvasItem.item.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          borderRadius: "12px",
                        }}
                        draggable={false}
                      />
                    ) : (
                      <div style={dashboardStyles.canvasFallbackStyle}>
                        {canvasItem.item.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {(statusMessage || statusError) && (
            <div
              style={{
                marginTop: "14px",
                padding: "12px 16px",
                borderRadius: "14px",
                background: statusError
                  ? "rgba(229,57,53,0.12)"
                  : "rgba(76,175,80,0.12)",
                color: statusError ? "#c62828" : "#2e7d32",
                fontSize: "0.9rem",
              }}
            >
              {statusError ?? statusMessage}
            </div>
          )}
        </section>
        <aside style={dashboardStyles.detailsSectionStyle}>
          <h2 style={{ margin: "0 0 16px", fontSize: "1.1rem" }}>
            Item Details
          </h2>
          {detailItem ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={dashboardStyles.detailPreviewWrapperStyle}>
                {detailItem.image_url ? (
                  <img
                    src={detailItem.image_url}
                    alt={detailItem.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "20px",
                    }}
                  />
                ) : (
                  <div style={dashboardStyles.detailFallbackPreviewStyle}>
                    <span>{detailItem.name.slice(0, 1).toUpperCase()}</span>
                  </div>
                )}
              </div>
              <h3 style={{ margin: "0", color: "#2f2f3a" }}>{detailItem.name}</h3>
              <p style={dashboardStyles.detailMetaStyle}>
                Category: <strong>{detailItem.category}</strong>
              </p>
              <p style={dashboardStyles.detailMetaStyle}>
                Color: <strong>{detailItem.color ?? "N/A"}</strong>
              </p>
              <p style={dashboardStyles.detailMetaStyle}>
                Owner: <strong>{detailItem.user?.username ?? "You"}</strong>
              </p>
            </div>
          ) : (
            <p style={dashboardStyles.infoTextStyle}>Select an item to view details.</p>
          )}
        </aside>
      </main>

      {showAddItemDialog && (
        <div
          style={dashboardStyles.saveDialogOverlayStyle}
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-item-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !addItemSubmitting) {
              handleCloseAddItemDialog();
            }
          }}
        >
          <div
            style={dashboardStyles.addItemDialogContentStyle}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div style={dashboardStyles.addItemDialogHeaderStyle}>
              <h2 id="add-item-title" style={dashboardStyles.addItemDialogTitleStyle}>
                Add Wardrobe Piece
              </h2>
              <button
                type="button"
                onClick={handleCloseAddItemDialog}
                style={{
                  ...dashboardStyles.saveDialogCloseButtonStyle,
                  ...(addItemSubmitting ? dashboardStyles.buttonDisabledStyle : {}),
                }}
                disabled={addItemSubmitting}
              >
                x
              </button>
            </div>
            <div style={dashboardStyles.addItemGuidanceStyle}>
              Upload a clear, front-facing photo on a neutral or white background.
              For best results, try{" "}
              <a
                href="https://www.remove.bg/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#d81b60", fontWeight: 600 }}
              >
                remove.bg
              </a>{" "}
              to remove busy backgrounds before posting.
            </div>
            <div style={dashboardStyles.addItemDialogBodyStyle}>
              <label style={dashboardStyles.saveDialogLabelStyle} htmlFor="add-item-name">
                Item name
                <input
                  id="add-item-name"
                  type="text"
                  value={addItemForm.name}
                  onChange={(event) =>
                    handleAddItemFieldChange("name", event.target.value)
                  }
                  style={dashboardStyles.addItemInputStyle}
                  placeholder="e.g., Cream Oversized Blazer"
                  disabled={addItemSubmitting}
                />
              </label>
              <label style={dashboardStyles.saveDialogLabelStyle} htmlFor="add-item-category">
                Category
                <select
                  id="add-item-category"
                  value={addItemForm.category}
                  onChange={(event) =>
                    handleAddItemFieldChange("category", event.target.value)
                  }
                  style={{
                    ...dashboardStyles.addItemInputStyle,
                    appearance: "none",
                    cursor: "pointer",
                  }}
                  disabled={addItemSubmitting}
                >
                  {CLOTHING_CATEGORY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label style={dashboardStyles.saveDialogLabelStyle} htmlFor="add-item-color">
                Color
                <input
                  id="add-item-color"
                  type="text"
                  value={addItemForm.color}
                  onChange={(event) =>
                    handleAddItemFieldChange("color", event.target.value)
                  }
                  style={dashboardStyles.addItemInputStyle}
                  placeholder="e.g., Cream"
                  disabled={addItemSubmitting}
                />
              </label>
              <label style={dashboardStyles.saveDialogLabelStyle} htmlFor="add-item-image">
                Item photo
                <input
                  id="add-item-image"
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    handleImageSelection(event.target.files?.[0] ?? null)
                  }
                  style={dashboardStyles.addItemInputStyle}
                  disabled={addItemSubmitting}
                />
              </label>
              <div style={dashboardStyles.addItemPreviewStyle}>
                {addItemForm.previewUrl ? (
                  <img
                    src={addItemForm.previewUrl}
                    alt="Selected wardrobe preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <span style={{ color: "#c48b9f", fontSize: "0.9rem" }}>
                    Your preview will appear here after you choose a photo.
                  </span>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ fontWeight: 600, color: "#5b5b66" }}>
                  Tags
                </span>
                <div style={dashboardStyles.addItemTagGridStyle}>
                  {PRESET_TAG_OPTIONS.map((tag) => {
                    const selected = addItemForm.tags.includes(tag.value);
                    return (
                      <button
                        key={tag.value}
                        type="button"
                        onClick={() => handleToggleTagSelection(tag.value)}
                        style={{
                          ...dashboardStyles.addItemTagOptionStyle,
                          background: selected
                            ? "rgba(236,64,122,0.18)"
                            : dashboardStyles.addItemTagOptionStyle.background,
                          border: selected
                            ? "1px solid rgba(236,64,122,0.35)"
                            : dashboardStyles.addItemTagOptionStyle.border,
                          color: selected ? "#d81b60" : "#322f3d",
                        }}
                        disabled={addItemSubmitting}
                        aria-pressed={selected}
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          readOnly
                          aria-hidden="true"
                        />
                        {tag.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              {addItemError && (
                <div style={{ color: "#c62828", fontSize: "0.85rem" }}>
                  {addItemError}
                </div>
              )}
            </div>
            <div style={dashboardStyles.saveDialogActionsStyle}>
              <button
                type="button"
                onClick={handleCloseAddItemDialog}
                style={{
                  ...dashboardStyles.saveDialogSecondaryButtonStyle,
                  ...(addItemSubmitting ? dashboardStyles.buttonDisabledStyle : {}),
                }}
                disabled={addItemSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitNewItem}
                style={{
                  ...dashboardStyles.saveDialogPrimaryButtonStyle,
                  ...(addItemSubmitting ? dashboardStyles.buttonDisabledStyle : {}),
                }}
                disabled={addItemSubmitting}
              >
                {addItemSubmitting ? "Adding..." : "Add to Wardrobe"}
              </button>
            </div>
          </div>
        </div>
      )}
      {showSaveDialog && (
        <div
          style={dashboardStyles.saveDialogOverlayStyle}
          role="dialog"
          aria-modal="true"
          aria-labelledby="save-outfit-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !savingOutfit) {
              closeSaveDialog();
            }
          }}
        >
          <div
            style={dashboardStyles.saveDialogContentStyle}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div style={dashboardStyles.saveDialogHeaderStyle}>
              <h2 id="save-outfit-title" style={dashboardStyles.saveDialogTitleStyle}>
                {editingContext ? "Update Your Outfit" : "Save Your Outfit"}
              </h2>
              <button
                type="button"
                onClick={closeSaveDialog}
                onMouseDown={(event) => event.stopPropagation()}
                style={{
                  ...dashboardStyles.saveDialogCloseButtonStyle,
                  ...(savingOutfit ? dashboardStyles.buttonDisabledStyle : {}),
                }}
                disabled={savingOutfit}
              >
                X
              </button>
            </div>
            <div style={dashboardStyles.saveDialogBodyStyle}>
              <label style={dashboardStyles.saveDialogLabelStyle} htmlFor="outfit-name-input">
                Outfit name
                <input
                  id="outfit-name-input"
                  type="text"
                  value={saveFormName}
                  onChange={(event) => {
                    setSaveFormName(event.target.value);
                    if (saveDialogError) {
                      setSaveDialogError(null);
                    }
                  }}
                  style={dashboardStyles.saveDialogInputStyle}
                  placeholder="Enter a standout name..."
                  disabled={savingOutfit}
                />
              </label>
              <label style={dashboardStyles.saveDialogCheckboxRowStyle} htmlFor="outfit-public-checkbox">
                <input
                  id="outfit-public-checkbox"
                  type="checkbox"
                  checked={saveFormIsPublic}
                  onChange={(event) => {
                    setSaveFormIsPublic(event.target.checked);
                    if (saveDialogError) {
                      setSaveDialogError(null);
                    }
                  }}
                  disabled={savingOutfit}
                />
                Make this outfit public so it can appear on the community feed later.
              </label>
              <label style={dashboardStyles.saveDialogLabelStyle} htmlFor="outfit-schedule-date">
                Optional: add a calendar date
                <input
                  id="outfit-schedule-date"
                  type="date"
                  value={saveFormScheduleDate}
                  min={todayIso}
                  onChange={(event) => setSaveFormScheduleDate(event.target.value)}
                  style={dashboardStyles.saveDialogInputStyle}
                  disabled={savingOutfit}
                />
              </label>
              {saveFormScheduleDate && (
                <div style={dashboardStyles.saveDialogHintStyle}>
                  {"\u2764\uFE0F"} We'll add a heart to {new Date(`${saveFormScheduleDate}T00:00:00`).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}.
                </div>
              )}
              {saveDialogError && <p style={dashboardStyles.saveDialogErrorStyle}>{saveDialogError}</p>}
            </div>
            <div style={dashboardStyles.saveDialogActionsStyle}>
              <button
                type="button"
                onClick={closeSaveDialog}
                style={{
                  ...dashboardStyles.saveDialogSecondaryButtonStyle,
                  ...(savingOutfit ? dashboardStyles.buttonDisabledStyle : {}),
                }}
                disabled={savingOutfit}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSaveOutfit}
                style={{
                  ...dashboardStyles.saveDialogPrimaryButtonStyle,
                  ...(savingOutfit ? dashboardStyles.buttonDisabledStyle : {}),
                }}
                disabled={savingOutfit}
              >
                {savingOutfit
                  ? editingContext
                    ? "Updating..."
                    : "Saving..."
                  : editingContext
                    ? "Update Outfit"
                    : "Save Outfit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
