interface ProductInput {
  _id: string;
  customization: {
    basePrice: {
      currency: string;
      value: string;
    };
    selectedVariants: Array<{
      color: any;
      size: any;
      variantId: string;
      selected: boolean;
      quantity: number;
      colorCode: string;
      colorName: string;
      colorHex: string;
      sizeCode: string;
      sizeName: string;
      sizeDisplayName: string;
    }>;
  };
}

interface TransformedProduct {
  productId: string;
  price: {
    currency: string;
    value: string;
  };
  customizations: Array<{
    name: string;
    sizes: Array<{
      quantity: number;
      sizeCode: string;
    }>;
  }>;
}

export const transformProducts = (
  products: ProductInput[]
): TransformedProduct[] => {
  return products.map((product) => {
    // Group selected variants by color name
    const variantGroups = product.customization.selectedVariants
      .filter((variant) => variant.selected)
      .reduce((acc, variant) => {
        const colorName = variant.colorName;

        if (!acc[colorName]) {
          acc[colorName] = [];
        }

        acc[colorName].push({
          quantity: variant.quantity,
          sizeCode: variant.sizeCode,
        });

        return acc;
      }, {} as Record<string, Array<{ quantity: number; sizeCode: string }>>);

    // Transform to the desired structure
    const customizations = Object.entries(variantGroups).map(
      ([colorName, sizes]) => ({
        name: colorName,
        sizes,
      })
    );

    return {
      productId: product._id,
      price: product.customization.basePrice,
      customizations,
    };
  });
};
