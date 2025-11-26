export function formatMoney(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

export function calculateShippingCost(
  shippingDetail: {
    zip: string;
    city: string;
    state: string;
    country: string;
  } | null
) {
  if (!shippingDetail) {
    return 0;
  }

  if (shippingDetail.zip.toLowerCase() === "office") {
    return 0;
  }

  if (
    shippingDetail.country.toLowerCase() !== "nigeria" &&
    shippingDetail.country.toLowerCase() !== "nga"
  ) {
    return -1;
  }

  if (
    shippingDetail.state.toLowerCase() === "abuja" ||
    shippingDetail.city.toLowerCase() === "abuja" ||
    "fct" === shippingDetail.state.toLowerCase() ||
    "fct" === shippingDetail.city.toLowerCase() ||
    "abj" === shippingDetail.state.toLowerCase() ||
    "abj" === shippingDetail.city.toLowerCase()
  ) {
    return 2000;
  }

  return 3500;
}
