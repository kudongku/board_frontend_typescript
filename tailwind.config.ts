import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'media',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#3b82f6', // 라이트 모드 색상
          dark: '#1e40af', // 다크 모드 색상
        },
      },
    },
  },
  plugins: [],
};
export default config;
