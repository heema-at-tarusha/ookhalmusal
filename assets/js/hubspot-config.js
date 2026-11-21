/**
 * OOKHAL MUSAL (उखल मूसल) — HubSpot Lead Routing & Integration Architecture
 * 
 * This file handles all lead submissions from the "Invite Ookhal Musal to Your Apartment" forms.
 * 
 * HOW TO CONNECT YOUR HUBSPOT ACCOUNT:
 * 1. Log into your HubSpot portal (https://app.hubspot.com)
 * 2. Navigate to: Marketing > Lead Capture > Forms > Create Form > Embedded Form
 * 3. Copy your Hub ID (Portal ID) and Form GUID (Form ID)
 * 4. Paste them below into HUBSPOT_CONFIG.portalId and HUBSPOT_CONFIG.formId
 *    OR click the "⚙️ HubSpot Integration" button in the website footer/admin to set it live!
 */

window.HUBSPOT_CONFIG = {
  // Configured live with your HubSpot account:
  portalId: "248076388",
  formId: "fff92aa0-541d-4116-a37e-43d665200b73",
  
  // Set to true - Live submissions active
  isLive: true,

  // Property mappings
  fieldMap: {
    fullName: "firstname",
    phone: "phone",
    email: "email",
    societyName: "company",
    city: "city",
    pincode: "zip",
    notes: "message"
  }
};

// Check if user has saved credentials locally via the Admin Drawer
(function initializeHubspotConfig() {
  try {
    const saved = localStorage.getItem("ookhal_hubspot_settings");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.portalId && parsed.portalId !== "YOUR_HUBSPOT_PORTAL_ID") {
        window.HUBSPOT_CONFIG.portalId = parsed.portalId;
        window.HUBSPOT_CONFIG.formId = parsed.formId;
        window.HUBSPOT_CONFIG.isLive = true;
      }
    }
  } catch (e) {
    console.warn("Could not parse saved HubSpot settings", e);
  }
})();

/**
 * Submits an Apartment Invitation lead to HubSpot via Forms API v3
 * Falls back safely to localStorage & lead-store if HubSpot is not yet live.
 */
async function submitApartmentLeadToHubSpot(formData) {
  const timestamp = new Date().toISOString();
  const leadRecord = {
    id: "lead-" + Date.now(),
    submittedAt: timestamp,
    data: formData,
    status: "Captured"
  };

  // Always store locally so NO LEAD IS EVER LOST
  storeLeadLocally(leadRecord);

  // If live HubSpot credentials exist, post to HubSpot Forms v3 API
  if (
    window.HUBSPOT_CONFIG.isLive &&
    window.HUBSPOT_CONFIG.portalId !== "YOUR_HUBSPOT_PORTAL_ID" &&
    window.HUBSPOT_CONFIG.formId !== "YOUR_HUBSPOT_FORM_ID"
  ) {
    try {
      const hubspotEndpoint = `https://api.hsforms.com/submissions/v3/integration/submit/${window.HUBSPOT_CONFIG.portalId}/${window.HUBSPOT_CONFIG.formId}`;

      // Build fields array for HubSpot v3 API (splitting names cleanly)
      const nameParts = (formData.fullName || "").trim().split(/\s+/);
      const firstName = nameParts[0] || "Resident";
      const lastName = nameParts.slice(1).join(" ") || "";

      const fields = [
        { name: "firstname", value: firstName },
        { name: "phone", value: formData.phone || "" },
        { name: "company", value: formData.societyName || "" },
        { name: "city", value: formData.city || "" },
        { 
          name: "message", 
          value: `[Ookhal Musal Society Grinding Request]\nSociety: ${formData.societyName}\nTower/Flat: ${formData.flatNumber || 'N/A'}\nEstimated Households: ${formData.communitySize}\nPreferred Weekend Slot: ${formData.preferredDate}\nSpices Selected: ${formData.selectedSpices || 'Full Atelier Selection'}\nResident Role: ${formData.residentRole || 'Resident'}\nSpecial Notes: ${formData.notes || 'None'}` 
        }
      ];

      if (lastName) {
        fields.push({ name: "lastname", value: lastName });
      }
      if (formData.email) {
        fields.push({ name: "email", value: formData.email });
      }
      if (formData.pincode) {
        fields.push({ name: "zip", value: formData.pincode });
      }

      const payload = {
        submittedAt: Date.now(),
        fields: fields,
        context: {
          pageUri: window.location.href,
          pageName: "Ookhal Musal — Invite to Apartment"
        }
      };

      const response = await fetch(hubspotEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        console.log("✅ Lead successfully synced with HubSpot CRM!");
        leadRecord.hubspotSynced = true;
        updateLeadLocalStatus(leadRecord.id, "Synced to HubSpot");
        return { success: true, destination: "HubSpot CRM & Local Vault" };
      } else {
        const errorText = await response.text();
        console.warn("HubSpot returned non-200 response, saved to local lead vault:", errorText);
        return { success: true, destination: "Local Lead Vault (HubSpot Pending)", warning: errorText };
      }
    } catch (err) {
      console.warn("Network error during HubSpot sync, safely saved locally:", err);
      return { success: true, destination: "Local Lead Vault (Network Safe)", error: err.message };
    }
  } else {
    // Stored in local vault with notification
    console.log("ℹ️ HubSpot is in setup mode. Lead preserved securely in local vault.", leadRecord);
    return { 
      success: true, 
      destination: "Local Lead Vault (Ready for HubSpot)", 
      note: "Connect your HubSpot Portal ID in footer settings anytime to sync live."
    };
  }
}

/**
 * Local Lead Storage Helpers
 */
function storeLeadLocally(leadRecord) {
  try {
    const existing = JSON.parse(localStorage.getItem("ookhal_apartment_leads") || "[]");
    existing.unshift(leadRecord);
    localStorage.setItem("ookhal_apartment_leads", JSON.stringify(existing));
  } catch (e) {
    console.error("Local storage error:", e);
  }
}

function updateLeadLocalStatus(leadId, status) {
  try {
    const existing = JSON.parse(localStorage.getItem("ookhal_apartment_leads") || "[]");
    const item = existing.find(l => l.id === leadId);
    if (item) {
      item.status = status;
      localStorage.setItem("ookhal_apartment_leads", JSON.stringify(existing));
    }
  } catch (e) {
    console.error("Local storage update error:", e);
  }
}

function getStoredLeads() {
  try {
    return JSON.parse(localStorage.getItem("ookhal_apartment_leads") || "[]");
  } catch (e) {
    return [];
  }
}

function exportLeadsToCSV() {
  const leads = getStoredLeads();
  if (!leads.length) {
    alert("No leads have been received yet.");
    return;
  }

  const headers = [
    "Date", "Host Name", "Phone", "Email", "Society Name", 
    "Tower/Flat", "City", "Pincode", "Estimated Households", 
    "Preferred Slot", "Selected Spices", "Role", "Notes", "Status"
  ];

  const rows = leads.map(l => [
    `"${l.submittedAt || ''}"`,
    `"${(l.data.fullName || '').replace(/"/g, '""')}"`,
    `"${(l.data.phone || '').replace(/"/g, '""')}"`,
    `"${(l.data.email || '').replace(/"/g, '""')}"`,
    `"${(l.data.societyName || '').replace(/"/g, '""')}"`,
    `"${(l.data.flatNumber || '').replace(/"/g, '""')}"`,
    `"${(l.data.city || '').replace(/"/g, '""')}"`,
    `"${(l.data.pincode || '').replace(/"/g, '""')}"`,
    `"${(l.data.communitySize || '').replace(/"/g, '""')}"`,
    `"${(l.data.preferredDate || '').replace(/"/g, '""')}"`,
    `"${(l.data.selectedSpices || '').replace(/"/g, '""')}"`,
    `"${(l.data.residentRole || '').replace(/"/g, '""')}"`,
    `"${(l.data.notes || '').replace(/"/g, '""')}"`,
    `"${l.status || 'Captured'}"`
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `ookhal_apartment_leads_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Alias used by admin.html
const exportLeadsAsCSV = exportLeadsToCSV;
