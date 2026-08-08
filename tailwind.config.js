// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        navy: "#001F3F",        // lacivert ana renk
        navyLight: "#2c3e50",  // hafif lacivert (dark‑mode için)
        softWhite: "#F9FAFB"   // çok açık beyaz (light‑mode)
      }
    }
  },
  plugins: []
};
