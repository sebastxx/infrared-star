tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#CEF03C", // The lime green from the screenshot
                "background-light": "#F3F4F6",
                "background-dark": "#0e0e0e", // Glaido dark
                "surface-dark": "#1c1c1c", // Glaido surface
                "surface-light": "#FFFFFF",
                "border-dark": "#333333",
                "border-light": "#E5E7EB",
            },
            fontFamily: {
                display: ["Space Grotesk", "sans-serif"],
                body: ["Space Grotesk", "sans-serif"],
            },
            borderRadius: {
                DEFAULT: "0.5rem",
                "2xl": "1rem",
                "3xl": "1.5rem",
            },
        },
    },
};
