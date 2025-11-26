const URL = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/v1/coupons/verify`;

const verifyCoupon = async (
  coupon: string
): Promise<{ data: { discount: number } }> => {
  const res = await fetch(`${URL}/${coupon.toUpperCase()}`, {
    cache: "no-cache",
  });

  return res.json();
};

export default verifyCoupon;
