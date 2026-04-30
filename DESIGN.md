# Design System: Solar Lead Pro PV-Konfigurator
**Project ID:** 3955599241460119046

## 1. Visual Theme & Atmosphere
The design system is engineered for a "Corporate Modern" aesthetic that balances industrial reliability with digital seamlessness. The atmosphere is **Airy, Trustworthy, and Structured**, utilizing generous whitespace and a clear information hierarchy to reduce cognitive load during the technical configuration process. The brand personality is authoritative yet accessible, fostering a partnership-based relationship with the user.

## 2. Color Palette & Roles
*   **Deep Muted Navy (#0D2137):** The anchor color, conveying stability and professional depth. Used for primary branding, navigation, and core headline typography.
*   **Solar Energy Orange (#F59E0B):** A high-visibility accent color symbolizing energy and sunlight. Reserved exclusively for primary Calls to Action (CTAs) and interactive highlights.
*   **Crisp White (#FFFFFF):** Used for component cards and input surfaces to make them "pop" against the background.
*   **Low-Glare Cloud Gray (#FBF9FB):** The primary background color, providing a soft, low-glare canvas for the entire application.
*   **Slate Typography (#1B1C1D):** High-contrast color for main body text to ensure maximum readability.
*   **Subtle Outline Gray (#C4C6CD):** Used for secondary borders and inactive states to maintain a clean, open feel.

## 3. Typography Rules
The system utilizes **Inter** across all levels of the hierarchy for its technical clarity and modern feel.
*   **Headlines (headline-xl/lg):** Tight letter-spacing (-0.01em to -0.02em) with bold weights (700) to establish strong section breaks.
*   **Body Copy (body-lg/md):** Standard weighting (400) with generous line-height (1.5 - 1.6) for ease of reading.
*   **Technical Labels (label-md):** Semi-bold (600) with increased letter-spacing (0.05em) for clarity in complex forms.

## 4. Component Stylings
*   **Buttons:** 
    *   *Primary:* Solar Energy Orange background with Navy text. Bold weight, subtly rounded corners (8px).
    *   *Secondary:* Navy outline with Navy text, used for "Back" or "Edit" actions.
*   **Cards/Containers:** 
    *   Generously rounded corners (24px / `rounded-xl`) for main wizard containers.
    *   Soft, diffused **Ambient Shadows** (0px 4px 20px rgba(13, 33, 55, 0.05)) instead of heavy borders.
*   **Inputs/Forms:** 
    *   White background with a 1px Subtle Outline Gray stroke.
    *   Transitions to a Navy border on focus.
    *   Selectable cards use a 2px Orange border highlight when active.

## 5. Layout Principles
*   **Fixed Grid Model:** Content is centered with a maximum width of **1200px** to maintain user focus.
*   **Vertical Rhythm:** Based on an **8px baseline grid** (spacing tokens: 8, 12, 24, 32, 48, 80).
*   **Whitespace Strategy:** Large section padding (**80px**) separates configuration steps from trust signals and legal footers to ensure the user is never overwhelmed.
*   **Mobile-First:** Stacking layouts that maintain accessibility and touch-target sizes for sliders and radio cards.
