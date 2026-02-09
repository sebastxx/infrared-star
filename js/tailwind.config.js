tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#CEF03C", // The lime green from the screenshot
                "background-light": "#F3F4F6",
                "background-dark": "#050505", // Deep black background
                "surface-dark": "#0F0F0F", // Slightly lighter for cards
                "surface-light": "#FFFFFF",
                "border-dark": "#1F1F1F",
                "border-light": "#E5E7EB",
            },
            fontFamily: {
                display: ["Inter", "sans-serif"],
                body: ["Inter", "sans-serif"],
            },
            borderRadius: {
                DEFAULT: "0.5rem",
                "2xl": "1rem",
                "3xl": "1.5rem",
            },
        },
    },
};
