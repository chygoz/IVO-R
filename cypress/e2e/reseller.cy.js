describe("Navigation", () => {
    it("should navigate to the reseller landing page", () => {
      // Start from the index page
      cy.visit("http://premium.localhost:3000");
  
      // Find a link with an href attribute containing "about" and click it
      cy.get('a[href*="storefront"]').click();
  
      // The new url should include "/dresses"
      cy.url().should("include", "/dresses");


      // The new url should include "/shirts"
      cy.url().should("include", "/shirts");
  
    //   // The new page should contain an h1 with "About"
    //   cy.get("h1").contains("About");
    });
  });
  