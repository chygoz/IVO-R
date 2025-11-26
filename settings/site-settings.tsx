export const siteSettings = {
  name: "IVO Stores Official Site | Dress Different. Dress IVO.",
  description: `<div>Discover a unique shopping experience at IVO Stores, where independent boutiques and local designers curate a collection unlike any other. Find statement pieces for women, men, and anyone who celebrates individuality. IVO Stores offers:
  <ul><li>Fashion Forward Finds: Unearth the latest trends and timeless staples.</li>
  <li>Local & Independent Labels: Support your community and discover one-of-a-kind pieces.</li>
  <li>Vibrant District: Immerse yourself in the energy and creativity of IVO Stores.</li></ul></div>`,
  author: {
    name: "IVO Stores",
    websiteUrl: "https://ivostores.com",
    address: "36 Sokode crescent, Wuse Zone 5, Abuja, Nigeria",
  },
  logo: {
    url: "/logo.png",
    alt: "IVO Stores",
    href: "/",
    width: 70,
    height: 70,
  },
  defaultLanguage: "en",
  currencyCode: "NGN",
  site_header: {
    menu: [
      
      {
        id: 2,
        path: "/store",
        label: "New in",
        columns: [
          {
            id: 2,
            columnItems: [
              {
                id: 1,
                path: "/store",
                label: "Store",
                
              },
            ],
          },
          {
            id: 3,
            columnItems: [
              {
                id: 1,
                path: "/store/clothing",
                label: "Clothing",
                columnItemItems: [
                  {
                    id: 1,
                    path: "/store/clothing",
                    label: "Shirts",
                  },
                  
                  {
                    id: 4,
                    path: "/store/clothing",
                    label: "Sweat Shirts",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 3,
        path: "/categories",
        label: "Categories",
        columns: [
          {
            id: 1,
            columnItems: [
              {
                id: 1,
                path: "/categories/accessories",
                label: "Accessories",
                columnItemItems: [
                  {
                    id: 1,
                    path: "/categories/accessories?q=bucket-hat",
                    label: "Bucket Hat",
                  },
                  {
                    id: 2,
                    path: "/categories/accessories?q=cap",
                    label: "Cap",
                  },
                  {
                    id: 3,
                    path: "/categories/accessories?q=phone-cases",
                    label: "Phone Cases",
                  },
                ],
              },
            ],
          },
          {
            id: 2,
            columnItems: [
              {
                id: 1,
                path: "/categories/men",
                label: "Men",
                columnItemItems: [
                  {
                    id: 1,
                    path: "/categories/men?q=shirts",
                    label: "Shirts",
                  },
                  {
                    id: 2,
                    path: "/categories/men?q=hoodies",
                    label: "Hoodies",
                  },
                  {
                    id: 3,
                    path: "/categories/men?q=sweat-shirts",
                    label: "Sweat Shirts",
                  },
                ],
              },
            ],
          },
          {
            id: 3,
            columnItems: [
              {
                id: 1,
                path: "/categories/women",
                label: "Women",
                columnItemItems: [
                  {
                    id: 1,
                    path: "/categories/women?q=crop-top",
                    label: "Crop Tops",
                  },
                  {
                    id: 2,
                    path: "/categories/women?q=hoodies",
                    label: "Hoodies",
                  },
                  {
                    id: 3,
                    path: "/categories/women?q=sweat-shirts",
                    label: "Sweat Shirts",
                  },
                  {
                    id: 4,
                    path: "/categories/women?q=shirts",
                    label: "Shirts",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 4,
        path: "/new-arrivals",
        label: "New Arrivals",
        columns: [
          {
            id: 2,
            columnItems: [
              {
                id: 1,
                path: "/new-arrivals/men",
                label: "New Arrivals Men",
                columnItemItems: [
                  {
                    id: 1,
                    path: "/new-arrivals/men?q=shirts",
                    label: "Shirts",
                  },
                  {
                    id: 2,
                    path: "/new-arrivals/men?q=hoodies",
                    label: "Hoodies",
                  },
                  {
                    id: 3,
                    path: "/new-arrivals/men?q=sweat-shirts",
                    label: "Sweat Shirts",
                  },
                ],
              },
            ],
          },
          {
            id: 3,
            columnItems: [
              {
                id: 1,
                path: "/new-arrivals/women",
                label: "New Arrivals Women",
                columnItemItems: [
                  {
                    id: 1,
                    path: "/new-arrivals/women?q=crop-top",
                    label: "Crop Tops",
                  },
                  {
                    id: 2,
                    path: "/new-arrivals/women?q=hoodies",
                    label: "Hoodies",
                  },
                  {
                    id: 3,
                    path: "/new-arrivals/women?q=sweat-shirts",
                    label: "Sweat Shirts",
                  },
                  {
                    id: 4,
                    path: "/new-arrivals/women?q=shirts",
                    label: "Shirts",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    mobileMenu: [
      
      {
        id: 1,
        path: "/store",
        label: "New In",
        
      },
      // {
      //   id: 2,
      //   path: "/Resortwear",
      //   label: "Resortwear",
        
      // },
      
      {
        id: 4,
        path: "/store/clothing",
        label: "Clothing",
        // subMenu: [
        //   {
        //     id: 1,
        //     path: "/categories/accessories",
        //     label: "Accessories",
        //   },
        //   {
        //     id: 2,
        //     path: "/categories/men",
        //     label: "Men",
        //   },
        //   {
        //     id: 3,
        //     path: "/categories/women",
        //     label: "Women",
        //   },
        // ],
      },
      {
        id: 5,
        path: "/store/accessories",
        label: "Accessories",
        // subMenu: [
        //   {
        //     id: 1,
        //     path: "/new-arrivals/accessories",
        //     label: "Accessories",
        //   },
        //   {
        //     id: 2,
        //     path: "/new-arrivals/men",
        //     label: "Men",
        //   },
        //   {
        //     id: 3,
        //     path: "/new-arrivals/women",
        //     label: "Women",
        //   },
        // ],
      },
    ],
  },
  storDetails: {
    _id: -1,
    address: "36 Hatlab Place, Sokode Crescent, Wuse Zone 5, Abuja",
  },
};
