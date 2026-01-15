const config: {
  base_url: {
    base: string;
    dev: string;
    pro: string;
    test: string;
  };
  result_code: number | string;
  default_headers: any;
  request_timeout: number;
} = {
  /**
   * api
   */
  base_url: {
    // base url
    base: "https://transitportal.skytechet.com/api/v1",

    // dev url
    dev: "https://transitportal.skytechet.com/api/v1",

    // prod url
    pro: "https://transitportal.skytechet.com/api/v1",

    // test url
    test: "https://transitportal.skytechet.com/api/v1",
  },

  /**
   * Status code
   */
  result_code: "0000",

  /**
   * request timeout
   */
  request_timeout: 60000,

  /**
   * header type
   */
  default_headers: "application/json",
};

export { config };
