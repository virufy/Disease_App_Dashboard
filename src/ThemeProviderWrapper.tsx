// // ThemeProviderWrapper.tsx
// import React, { createContext, useContext, useState } from "react";
// import { ThemeProvider } from "styled-components";
// import { themes } from "./styles/theme"; // classic + stripe theme

// type LanguageType = "en" | "ar" | "ja";
// type ThemeName = "classic" | "stripe";

// interface AppContextProps {
//   language: LanguageType;
//   setLanguage: (lang: LanguageType) => void;
//   themeName: ThemeName;
//   setThemeName: (theme: ThemeName) => void;
// }

// const AppContext = createContext<AppContextProps | null>(null);
// export const useAppContext = () => useContext(AppContext)!;

// export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [language, setLanguage] = useState<LanguageType>("en");
//   const [themeName, setThemeName] = useState<ThemeName>("classic");

//   const isRTL = language === "ar";

//   return (
//     <AppContext.Provider
//       value={{
//         language,
//         setLanguage,
//         themeName,
//         setThemeName,
//       }}
//     >
//       {/* Set document direction for Arabic */}
//       <div dir={isRTL ? "rtl" : "ltr"}>
//         <ThemeProvider theme={themes[themeName]}>{children}</ThemeProvider>
//       </div>
//     </AppContext.Provider>
//   );
// };
