import {
  getRequestConfig,
  type GetRequestConfigParams,
} from "next-intl/server";

export default getRequestConfig(async ({ locale }: GetRequestConfigParams) => {
  // fallback to 'en' if locale is undefined
  const currentLocale = locale ?? "en";

  return {
    locale: currentLocale,
    messages: (await import(`../messages/${currentLocale}.json`)).default,
  };
});
