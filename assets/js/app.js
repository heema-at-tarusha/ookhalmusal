/**
 * OOKHAL MUSAL (उखल मूसल) — Main Web Application & Interactivity Engine
 */

document.addEventListener("DOMContentLoaded", () => {
  // State
  let allSpices = getStoredSpices();
  let currentFilter = "all";
  let searchQuery = "";
  let selectedSpicesForVisit = [];

  // DOM Elements
  const spicesContainer = document.getElementById("spices-grid-container");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const searchInput = document.getElementById("spice-search-input");
  const selectedSpicesBox = document.getElementById("selected-spices-tag-box");
  const selectedSpicesInput = document.getElementById("form-selected-spices-hidden");
  const wishlistBar = document.getElementById("wishlist-summary-bar");
  const wishlistCounter = document.getElementById("wishlist-count-badge");
  const wishlistPillCount = document.getElementById("wishlist-count-num");
  const householdButtons = document.querySelectorAll(".size-btn");
  const householdInput = document.getElementById("form-household-size");

  // Booking Forms
  const inlineBookingForm = document.getElementById("apartment-booking-form");
  const modalBookingForm = document.getElementById("modal-apartment-booking-form");

  // Modals
  const bookingModal = document.getElementById("booking-modal-overlay");
  const toastNotice = document.getElementById("toast-notice");
  const toastMessage = document.getElementById("toast-message");

  // =========================================================================
  // 1. RENDER SPICE CATALOG
  // =========================================================================
  function renderSpices() {
    if (!spicesContainer) return;

    let filtered = allSpices.filter(spice => {
      // Category filter
      let matchesCategory = true;
      if (currentFilter === "new-launches") {
        matchesCategory = spice.isNewLaunch === true;
      } else if (currentFilter === "in-stock") {
        matchesCategory = spice.isAvailable === true;
      } else if (currentFilter !== "all") {
        matchesCategory = spice.category === currentFilter;
      }

      // Search query filter
      let matchesSearch = true;
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        matchesSearch = (
          (spice.name && spice.name.toLowerCase().includes(q)) ||
          (spice.hindiName && spice.hindiName.toLowerCase().includes(q)) ||
          (spice.origin && spice.origin.toLowerCase().includes(q)) ||
          (spice.description && spice.description.toLowerCase().includes(q))
        );
      }

      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      spicesContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: #FFFDF9; border-radius: 12px; border: 1px dashed var(--border-light);">
          <div style="font-size: 2.4rem; margin-bottom: 12px;">🌾</div>
          <h3 style="font-family: var(--font-serif); font-size: 1.6rem; margin-bottom: 8px;">No Spices Found</h3>
          <p style="color: var(--sage); max-width: 400px; margin: 0 auto 16px;">We couldn't find any spices matching "${searchQuery}". Try selecting another category or clear your search.</p>
          <button class="btn btn-secondary btn-sm" id="btn-reset-filters">Show All Spices</button>
        </div>
      `;
      const resetBtn = document.getElementById("btn-reset-filters");
      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          currentFilter = "all";
          searchQuery = "";
          if (searchInput) searchInput.value = "";
          filterButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.filter === "all"));
          renderSpices();
        });
      }
      return;
    }

    spicesContainer.innerHTML = filtered.map(spice => {
      const isSelected = selectedSpicesForVisit.some(s => s.id === spice.id);
      const isAvailable = spice.isAvailable !== false;
      const grindTags = (spice.grindOptions || []).map(g => `<span class="grind-tag">${g}</span>`).join("");
      
      let badgeHtml = "";
      if (spice.isNewLaunch) {
        badgeHtml = `<span class="badge-tag badge-launch">🌟 New Launch</span>`;
      } else if (spice.badge) {
        badgeHtml = `<span class="badge-tag badge-gold">${spice.badge}</span>`;
      }

      const stockBadge = isAvailable 
        ? `<span style="display: inline-flex; align-items: center; gap: 4px; font-size: 0.72rem; color: #2F855A; font-weight: 600;"><span style="width: 6px; height: 6px; border-radius: 50%; background: #38A169;"></span> Fresh Harvest</span>`
        : `<span style="display: inline-flex; align-items: center; gap: 4px; font-size: 0.72rem; color: #C53030; font-weight: 600;"><span style="width: 6px; height: 6px; border-radius: 50%; background: #E53E3E;"></span> Next Harvest Soon</span>`;

      return `
        <article class="spice-card" data-id="${spice.id}">
          <div class="spice-card-header">
            <div class="spice-icon-wrap">${spice.icon || '🌿'}</div>
            <div>${badgeHtml}</div>
          </div>
          <div class="spice-card-body">
            <div style="margin-bottom: 6px;">${stockBadge}</div>
            <h3 class="spice-name">${spice.name}</h3>
            <span class="spice-hindi">${spice.hindiName || ''}</span>
            <div class="spice-origin">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              ${spice.origin || 'Heirloom Origin'}
            </div>
            <p class="spice-desc">${spice.description || ''}</p>
            ${spice.aromaProfile ? `
              <div class="aroma-note">
                <strong>Aroma Profile:</strong> ${spice.aromaProfile}
              </div>
            ` : ''}
            <div class="spice-grind-types">
              <span class="grind-label">Doorstep Grinding Styles:</span>
              <div class="grind-tags">${grindTags}</div>
            </div>
          </div>
          <div class="spice-card-footer">
            <div class="spice-price">${spice.pricePer100g || ''}</div>
            <button 
              class="btn-wishlist ${isSelected ? 'selected' : ''}" 
              data-id="${spice.id}"
              ${!isAvailable ? 'disabled title="Currently waiting for fresh harvest"' : ''}>
              ${isSelected ? '✓ Added to Visit' : '+ Add to Doorstep Visit'}
            </button>
          </div>
        </article>
      `;
    }).join("");

    // Bind Wishlist buttons
    const wishlistButtons = spicesContainer.querySelectorAll(".btn-wishlist");
    wishlistButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        toggleSpiceInVisitList(id);
      });
    });
  }

  // Toggle spice in user's apartment visit list
  function toggleSpiceInVisitList(spiceId) {
    const spice = allSpices.find(s => s.id === spiceId);
    if (!spice) return;

    const index = selectedSpicesForVisit.findIndex(s => s.id === spiceId);
    if (index > -1) {
      selectedSpicesForVisit.splice(index, 1);
      showToast(`Removed "${spice.name}" from your visit list.`);
    } else {
      selectedSpicesForVisit.push(spice);
      showToast(`✨ Added "${spice.name}" to your Doorstep Grinding Visit!`);
    }

    updateWishlistUI();
    renderSpices();
  }

  // Update Wishlist Bar & Form Input
  function updateWishlistUI() {
    const count = selectedSpicesForVisit.length;

    if (wishlistCounter) wishlistCounter.textContent = count;
    if (wishlistPillCount) wishlistPillCount.textContent = count;

    if (wishlistBar) {
      if (count > 0) {
        wishlistBar.style.display = "flex";
      } else {
        wishlistBar.style.display = "none";
      }
    }

    // Update tags in the booking form
    const spiceNames = selectedSpicesForVisit.map(s => s.name);
    if (selectedSpicesInput) {
      selectedSpicesInput.value = spiceNames.join(", ");
    }

    if (selectedSpicesBox) {
      if (count === 0) {
        selectedSpicesBox.innerHTML = `<span style="font-size: 0.85rem; color: #8C7E72; font-style: italic;">No specific spices selected yet. Pick your favorite spices above or enter your preferences below!</span>`;
      } else {
        selectedSpicesBox.innerHTML = selectedSpicesForVisit.map(s => `
          <span class="selected-spice-pill">
            ${s.icon || '🌿'} ${s.name}
            <button type="button" data-id="${s.id}" title="Remove spice">&times;</button>
          </span>
        `).join("");

        // Bind delete buttons inside pills
        selectedSpicesBox.querySelectorAll("button").forEach(btn => {
          btn.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleSpiceInVisitList(btn.dataset.id);
          });
        });
      }
    }

    // Also update modal selected spices box if present
    const modalTagBox = document.getElementById("modal-selected-spices-tag-box");
    const modalSpicesInput = document.getElementById("modal-form-selected-spices-hidden");
    if (modalSpicesInput) modalSpicesInput.value = spiceNames.join(", ");
    if (modalTagBox) {
      if (count === 0) {
        modalTagBox.innerHTML = `<span style="font-size: 0.85rem; color: #8C7E72; font-style: italic;">No specific spices picked yet. We will bring our full atelier!</span>`;
      } else {
        modalTagBox.innerHTML = selectedSpicesForVisit.map(s => `
          <span class="selected-spice-pill">${s.icon || '🌿'} ${s.name}</span>
        `).join("");
      }
    }
  }

  // =========================================================================
  // 2. FILTER & SEARCH LISTENERS
  // =========================================================================
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.filter;
      renderSpices();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      renderSpices();
    });
  }

  // Quick Household Size Buttons
  householdButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      householdButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      if (householdInput) {
        householdInput.value = btn.dataset.size;
      }
      // Also sync modal size buttons if present
      const modalSizeInput = document.getElementById("modal-form-household-size");
      if (modalSizeInput) modalSizeInput.value = btn.dataset.size;
    });
  });

  // Modal Household Buttons
  const modalHouseholdBtns = document.querySelectorAll(".modal-size-btn");
  modalHouseholdBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      modalHouseholdBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const modalSizeInput = document.getElementById("modal-form-household-size");
      if (modalSizeInput) modalSizeInput.value = btn.dataset.size;
    });
  });

  // =========================================================================
  // 3. BOOKING FORM HANDLERS (HUBSPOT READY)
  // =========================================================================
  async function handleBookingSubmit(formElement, isModal = false) {
    const submitBtn = formElement.querySelector("button[type='submit']");
    const originalBtnText = submitBtn ? submitBtn.innerHTML : "Submit";
    
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>⏳ Reserving Your Society Slot...</span>`;
    }

    const formData = {
      fullName: formElement.querySelector("[name='fullName']").value.trim(),
      phone: formElement.querySelector("[name='phone']").value.trim(),
      email: formElement.querySelector("[name='email']") ? formElement.querySelector("[name='email']").value.trim() : "",
      societyName: formElement.querySelector("[name='societyName']").value.trim(),
      flatNumber: formElement.querySelector("[name='flatNumber']") ? formElement.querySelector("[name='flatNumber']").value.trim() : "",
      city: formElement.querySelector("[name='city']").value.trim(),
      pincode: formElement.querySelector("[name='pincode']") ? formElement.querySelector("[name='pincode']").value.trim() : "",
      communitySize: formElement.querySelector("[name='communitySize']").value || "10-25 Households",
      preferredDate: formElement.querySelector("[name='preferredDate']").value || "Upcoming Saturday Morning",
      residentRole: formElement.querySelector("[name='residentRole']") ? formElement.querySelector("[name='residentRole']").value : "Resident",
      selectedSpices: selectedSpicesForVisit.map(s => s.name).join(", ") || "Full Atelier Selection",
      notes: formElement.querySelector("[name='notes']") ? formElement.querySelector("[name='notes']").value.trim() : ""
    };

    // Validation
    if (!formData.fullName || !formData.phone || !formData.societyName || !formData.city) {
      alert("Please fill in the required fields: Full Name, WhatsApp Number, Society Name, and City.");
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
      return;
    }

    try {
      const result = await submitApartmentLeadToHubSpot(formData);
      
      // Close modal if open
      if (isModal && bookingModal) {
        bookingModal.classList.remove("active");
      }

      // Show luxury confirmation modal
      showBookingSuccessModal(formData, result);

      // Reset form
      formElement.reset();
      selectedSpicesForVisit = [];
      updateWishlistUI();
      renderSpices();

    } catch (err) {
      console.error("Submission error:", err);
      alert("There was an error saving your request. Please WhatsApp us directly at +91 98765 43210.");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    }
  }

  if (inlineBookingForm) {
    inlineBookingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleBookingSubmit(inlineBookingForm, false);
    });
  }

  if (modalBookingForm) {
    modalBookingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleBookingSubmit(modalBookingForm, true);
    });
  }

  // Luxury Success Confirmation Modal
  function showBookingSuccessModal(formData, result) {
    const successModal = document.getElementById("booking-success-modal");
    const societySpan = document.getElementById("success-society-name");
    const dateSpan = document.getElementById("success-date-slot");
    const leadRouteSpan = document.getElementById("success-lead-destination");

    if (societySpan) societySpan.textContent = formData.societyName;
    if (dateSpan) dateSpan.textContent = formData.preferredDate || "Upcoming Weekend";
    if (leadRouteSpan) {
      leadRouteSpan.textContent = window.HUBSPOT_CONFIG.isLive 
        ? "✓ Successfully Synced to HubSpot CRM" 
        : "✓ Lead Captured Safely in Lead Vault (HubSpot Ready)";
    }

    if (successModal) {
      successModal.classList.add("active");
    } else {
      alert(`Thank you ${formData.fullName}! Your request to bring Ookhal Musal to ${formData.societyName} has been received.`);
    }
  }

  // =========================================================================
  // 4. FLOATING CTA & MODAL OPEN/CLOSE
  // =========================================================================
  const floatingBtn = document.getElementById("floating-booking-btn");
  const openModalBtns = document.querySelectorAll(".btn-open-booking-modal");
  const modalCloseBtns = document.querySelectorAll(".modal-close-trigger");

  function openBookingModal() {
    if (bookingModal) {
      updateWishlistUI();
      bookingModal.classList.add("active");
    }
  }

  if (floatingBtn) {
    floatingBtn.addEventListener("click", () => {
      openBookingModal();
    });
  }

  openModalBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openBookingModal();
    });
  });

  modalCloseBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".modal-overlay").forEach(m => m.classList.remove("active"));
    });
  });

  // Close modals on backdrop click
  document.querySelectorAll(".modal-overlay").forEach(modal => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("active");
      }
    });
  });

  // =========================================================================
  // 7. TOAST NOTIFICATION UTILITY
  // =========================================================================
  function showToast(message) {
    if (!toastNotice || !toastMessage) return;
    toastMessage.textContent = message;
    toastNotice.classList.add("show");
    setTimeout(() => {
      toastNotice.classList.remove("show");
    }, 3800);
  }

  // Initial Run
  renderSpices();
  updateWishlistUI();
});
