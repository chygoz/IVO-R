export class UrlParamHandler {
  static encodeParam(value: string): string {
    // Double encode to prevent browser from automatically decoding once
    return encodeURIComponent(encodeURIComponent(value));
  }

  static decodeParam(value: string): string {
    // Double decode to handle the double encoding
    return decodeURIComponent(decodeURIComponent(value));
  }

  static buildUrl(
    baseUrl: string,
    params: Record<string, string>,
    requestUrl: string
  ): URL {
    const urlParams = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
      urlParams.append(key, this.encodeParam(value));
    }

    return new URL(`${baseUrl}?${urlParams.toString()}`, requestUrl);
  }
}
