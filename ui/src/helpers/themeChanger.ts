export const changeTheme = (theme: string) => {
    document.querySelector("html")?.setAttribute("data-theme", theme);
};

// src/utils/styleAdjustments.ts
export const adjustFontSize = (size: string) => {
    document.documentElement.style.setProperty('--custom-font-size', size);
  };

// src/utils/styleAdjustments.js or styleAdjustments.ts
export const adjustTextAndHeaderColor = (theme: string) => {
  document.querySelector("html")?.setAttribute('data-theme', theme);
  document.querySelector("html")?.setAttribute('data-theme', theme);
};
  
  export const adjustTextHeaderColor = (color: string) => {
    document.documentElement.style.setProperty('--custom-text-header-color', color);
  };