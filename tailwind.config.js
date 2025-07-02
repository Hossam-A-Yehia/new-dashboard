
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        main: "#f05b20",
        "main-hover": "#e74200",
        primary: "#3b82f6",
        "primary-hover": "#2563eb",
        secondary: "#6b7280",
        "secondary-hover": "#4b5563",
        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444",
        info: "#3b82f6",
        light: "#f3f4f6",
        dark: "#374151",
        "gray-light": "#D9D9D9",
        "gray-dark": "#4b5563",
        outline: "#3b82f6",
      },
      spacing: {
        xs: "0.25rem",
        small: "0.5rem",
        medium: "1rem",
        large: "1.5rem",
        xl: "2rem",
        "2xl": "3rem",
        "3xl": "4rem",
      },
      borderRadius: {
        sm: "0.125rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
      boxShadow: {
        xs: "0 1px 2px rgba(0, 0, 0, 0.05)",
        sm: "0 1px 3px rgba(0, 0, 0, 0.1)",
        md: "0 4px 6px rgba(0, 0, 0, 0.1)",
        lg: "0 10px 15px rgba(0, 0, 0, 0.1)",
        xl: "0 20px 25px rgba(0, 0, 0, 0.15)",
      },
      transitionDuration: {
        fast: "150ms",
        medium: "300ms",
        slow: "500ms",
      },
      backgroundImage: {
        "auth-wallpaper": 'url("/auth.png")',
      },
    },
  },
  plugins: [],
};
export default config;
