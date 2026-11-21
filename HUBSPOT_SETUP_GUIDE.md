# OOKHAL MUSAL (उखल मूसल) — HubSpot Integration & Setup Guide

This guide gives you complete step-by-step instructions to create the **"Invite Ookhal Musal to Your Apartment"** lead capture form in HubSpot, invite team members, get your credentials, and connect it with your website.

---

## 1. Accessing HubSpot & Creating an Account

If you or your team do not have a HubSpot portal yet:
1. Go to [https://www.hubspot.com/pricing/marketing](https://www.hubspot.com/pricing/marketing) or [https://app.hubspot.com/signup](https://app.hubspot.com/signup).
2. Choose **Free Marketing Tools / Free CRM** (100% free forever for unlimited forms and up to 1,000,000 contacts).
3. Sign up with your business email (e.g., `info@ookhalmusal.com` or your Google Workspace account).
4. Complete the initial setup with company name: **Ookhal Musal LLP** and domain.

---

## 2. Giving Team Members Access to Create & Edit Forms in HubSpot

If one of your team members already owns the HubSpot portal and needs to give you (or someone else) access to create forms:

1. Log into [https://app.hubspot.com](https://app.hubspot.com).
2. In the top navigation bar, click the **Settings (gear icon ⚙️)** in the upper right.
3. In the left sidebar menu, navigate to **Users & Teams**.
4. Click the orange **Create user** button in the upper right.
5. Enter the email address of the team member.
6. Under **Choose access level**, grant:
   - **Marketing Access:** Enable **Forms** (Read, Write, and Publish permissions).
   - **CRM Access:** Enable **Contacts** (Edit and View permissions).
7. Click **Next** and send the invitation.
8. The invited user will receive an email with an activation link to set their password and log in immediately.

---

## 3. Creating the "Apartment Invitation" Form in HubSpot

Once logged into HubSpot:

1. In the main top navigation, go to:
   - **Marketing** &rarr; **Lead Capture** &rarr; **Forms**
   *(In newer HubSpot navigation menus, you can also search "Forms" in the global search bar)*
2. Click the orange button: **Create form**.
3. Choose **Embedded form** &rarr; Click **Next**.
4. Choose **Blank template** (or "Registration" template) &rarr; Click **Start**.
5. Rename the form in the upper left from *Untitled Form* to:  
   `Ookhal Musal — Apartment Grinding Invitations`

### Recommended Form Fields & Contact Properties:

Drag and drop or add the following properties onto your form:

| Field Name | HubSpot Internal Property | Type | Required? |
| :--- | :--- | :--- | :--- |
| **Full Name** | `firstname` | Single-line text | Yes |
| **Phone Number (WhatsApp)** | `phone` | Phone number | Yes |
| **Email Address** | `email` | Email | Optional |
| **Apartment / Society Name** | `company` (or custom property `apartment_society_name`) | Single-line text | Yes |
| **Flat / Tower No.** | Custom property: `apartment_flat_tower` | Single-line text | Optional |
| **City & Area** | `city` | Single-line text | Yes |
| **Approx. Households** | Custom property: `number_of_households` | Dropdown or Single-line text | Optional |
| **Preferred Weekend Slot** | Custom property: `preferred_visit_date` | Dropdown or Single-line text | Optional |
| **Selected Spices** | Custom property: `interested_spices` | Multi-line text | Optional |
| **Notes / Gate Permissions** | `message` | Multi-line text | Optional |

> **Tip for Custom Properties:**  
> If you want dedicated properties like `apartment_society_name` or `interested_spices`, go to **Settings (gear icon) &rarr; Properties &rarr; Create property &rarr; Contact**. Otherwise, our website automatically packs these details cleanly into the standard `company` and `message` fields so you don't even have to create custom fields!

6. In the top right, click **Update** / **Publish**.

---

## 4. Where to Find Your Portal ID & Form ID

After publishing your form in HubSpot:

1. Click the **Embed** button in the top right of the form editor.
2. You will see a small code snippet like this:
   ```html
   <script charset="utf-8" type="text/javascript" src="//js.hsforms.net/forms/embed/v2.js"></script>
   <script>
     hbspt.forms.create({
       region: "na1",
       portalId: "48192038",
       formId: "4a2b91f0-78c2-48a3-9521-789bc4512e0a"
     });
   </script>
   ```
3. Copy the two values:
   - **`portalId`** (also known as your **Hub ID**, usually 7 to 9 digits, e.g., `48192038`). You can also see this anytime by clicking your profile picture in the top-right corner of HubSpot.
   - **`formId`** (a 36-character hyphenated alphanumeric code, e.g., `4a2b91f0-78c2-48a3-9521-789bc4512e0a`).

---

## 5. Connecting Your HubSpot IDs to the Website

You have **two simple ways** to connect the credentials:

### Method A: Directly on the Website (No Coding Required)
1. Open `index.html` in your browser.
2. Scroll to the footer and click **"⚙️ HubSpot Lead Settings"**.
3. Paste your **Portal ID** and **Form ID**.
4. Click **Save & Connect Live HubSpot Form**.  
*Done! All submissions will now flow live into your HubSpot CRM.*

### Method B: In the Configuration File
Open [assets/js/hubspot-config.js](file:///c:/1.%20OM/assets/js/hubspot-config.js) and paste the values:
```javascript
window.HUBSPOT_CONFIG = {
  portalId: "248076388",
  formId: "fff92aa0-541d-4116-a37e-43d665200b73",
  isLive: true,
  ...
};
```

---

## 6. Zero Lead Loss Guarantee (The Safety Vault)

Even before you create the HubSpot form:
- The website is **100% active and collecting leads right now**.
- Every time a user submits their society details, the lead is safely recorded in the browser's **Lead Vault**.
- Click **"📊 View Recorded Leads (Vault)"** in the footer to inspect every submission and click **"📥 Download CSV"** to open them in Excel or Google Sheets at any time!
