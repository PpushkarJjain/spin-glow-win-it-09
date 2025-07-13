# ✨ Cline UI Modernization Guidelines

These are foundational rules for safely improving UI in our app while maintaining consistent logic and user flow.

---

## ✅ Allowed UI Enhancements

- Use **modern gradients**, soft shadows, and glassmorphism to enhance visual appeal
- Apply **rounded corners** and consistent padding/margin based on an 8pt grid
- Use **vibrant, brand-aligned color schemes** (do not alter CTA color logic)
- Introduce **hover, focus, and transition animations** for interactivity
- Replace default buttons with styled components (`e.g., Tailwind or component library`)
- Improve **typography** using font pairing: `Poppins` (UI) + `Playfair Display` (titles)

---

## ⚠️ Do NOT Change

- Component functionality or behavior (e.g. how the spinner works)
- Any core navigation logic (e.g. what happens after a spin)
- Text content, conditions, or validations without explicit request
- Offer probability, backend data, or form validation structure

---

## 🔁 Example Transformations

| BEFORE         | AFTER                           |
|----------------|----------------------------------|
| Plain button   | Rounded button with glow hover  |
| Static layout  | Responsive, flex/grid layout    |
| Hard shadows   | Soft shadows & gradient cards   |
| Flat icons     | Fluent/3D styled icons          |

---

## 🛠 Tools Preference

- Use **TailwindCSS** for styles
- Use **Framer Motion** or **GSAP** for animation logic (if needed)
- Maintain accessibility (contrast, font sizes, focus outlines)

---

## 📌 Reminder

The goal is to **beautify without breaking**. Ask before removing or deeply refactoring structural elements.
