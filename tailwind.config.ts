import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                'image-default': 'url("/bg.webp")',
            }
        },
    },
    plugins: [],
};
export default config;
