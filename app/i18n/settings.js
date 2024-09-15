export const fallbackLng = "ar";
export const languages = [fallbackLng, "tr","en"];
export const defaultNS = "translation";
export const cookieName = "i18next";

export function getOptions(locale = fallbackLng, ns = defaultNS) {
  return {
    // debug: true,
    supportedLngs: languages,
    fallbackLng,
    locale,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  };
}
