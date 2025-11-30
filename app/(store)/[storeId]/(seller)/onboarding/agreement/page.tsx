"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useStore } from "@/contexts/reseller-store-context";
import dayjs from "dayjs";
import Image from "next/image";
import signature from "@/app/assets/ivo-sign.png";
import { capitalizeFirstLetter } from "@/lib/utils";

export default function AgreementPage() {
  const { signAgreement, isLoading, isInternalSeller } = useAuth();
  const { store } = useStore();

  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const data = {
    date: dayjs().format("DD MMMM YYYY") as string,
    resellerName: capitalizeFirstLetter(
      (store as any)?.storefront?.domain?.subdomain || store?.name || ""
    ),
    resellerAddress: store?.owner?.address,
    resellerLocation: store?.owner?.address,
    ownerName: store?.owner
      ? `${capitalizeFirstLetter(
          store.owner.firstName
        )} ${capitalizeFirstLetter(store.owner.lastName)}`
      : "",
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!agreed) {
      setError("You must agree to the terms to continue");
      return;
    }

    try {
      const result = await signAgreement(agreed);

      if (!result.success) {
        setError(result.error || "Failed to process agreement");
      }
    } catch (error) {
      console.error("Agreement error:", error);
      setError("An unexpected error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg p-8 w-full max-w-3xl"
      >
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">
            IVÓ WHITE LABEL RESELLER AGREEMENT
          </h1>
          <p className="text-gray-600">
            This White Label Reseller Agreement (&ldquo;Agreement&ldquo;) is
            entered into as of {data.date}, by and between:
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <ScrollArea className="h-64 border rounded-md p-4 mb-6">
          <div className="space-y-4">
            <div className="font-bold">
              <p>IVÓ, a Trademark of COUTURE LIVING LIMITED</p>
              <p>9 Atakpame Street, Wuse 2,</p>
              <p>Abuja, F.C.T.</p>
              <p>
                (Hereinafter referred to as the &ldquo;Supplier&ldquo; or
                &ldquo;Brand&ldquo;)
              </p>
            </div>

            <div className="font-bold mt-4">
              <p>{data.resellerName}</p>
              <p>{data.resellerAddress}</p>
              <p>{data.resellerLocation}</p>
              <p>(Hereinafter referred to as the &ldquo;Reseller&ldquo;)</p>
            </div>

            <div className="space-y-4">
              <p>
                <strong>WHEREAS,</strong> the Supplier is in the business of
                manufacturing and distributing fashion apparel, accessories,
                fabrics, skin care products and other complimentary fashion
                items;
              </p>
              <p>
                <strong>WHEREAS,</strong> the Reseller desires to resell the
                Supplier&apos;s products under its own private label (white
                label);
              </p>
              <p>
                <strong>WHEREAS,</strong> the Reseller desires to sell its own
                products in the Supplier&apos;s platform subject to alignment
                with strict quality and standards of Supplier and approval of
                Supplier for sale;
              </p>
              <p>
                <strong>NOW, THEREFORE,</strong> the parties hereby agree as
                follows:
              </p>
            </div>

            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-bold mb-2">1. Definitions</h2>
                <div className="pl-4 space-y-2">
                  <p>
                    1.1 &ldquo;Products&ldquo; means the fashion apparel items
                    listed in product catalogue section of the platform.
                  </p>
                  <p>1.2 &ldquo;Territory&ldquo; means IVO Store</p>
                  <p>
                    1.3 &ldquo;Brand Name&ldquo; refers to the Supplier&apos;s
                    trademark and logo.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-2">2. Grant of License</h2>
                <div className="pl-4 space-y-2">
                  <p>
                    2.1 The Supplier grants the Reseller a non-exclusive,
                    non-transferable right to sell the Products within the
                    Territory under the Reseller&apos;s own label and branding,
                    provided that all products are sold with the same
                    specifications, quality, and standards as supplied by the
                    Supplier.
                  </p>
                  <p>
                    2.2 The Reseller is not permitted to use the Supplier&apos;s
                    trademarks or brand name unless specifically authorized by
                    the Supplier in writing.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-2">
                  3. Reseller Obligations
                </h2>
                <div className="pl-4 space-y-2">
                  <p>3.1 The Reseller agrees to:</p>
                  <ul className="list-disc pl-8 space-y-2">
                    <li>
                      Market, promote, and sell the Products to customers within
                      the Territory.
                    </li>
                    <li>
                      Ensure all Products are sold in compliance with applicable
                      laws and regulations, including labeling and packaging
                      laws.
                    </li>
                    <li>
                      Maintain appropriate virtual inventory levels on the
                      Suppliers platform and handle all customer service
                      inquiries, including returns, warranties, and complaints.
                    </li>
                  </ul>
                  <p>
                    3.2 The Reseller must not sell the Products on third-party
                    marketplaces (e.g., Amazon, eBay) unless prior written
                    consent from the Supplier is obtained.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-2">
                  4. Supplier Obligations
                </h2>
                <div className="pl-4 space-y-2">
                  <p>4.1 The Supplier agrees to:</p>
                  <ul className="list-disc pl-8 space-y-2">
                    <li>
                      Provide the Products to the Reseller at agreed-upon prices
                      listed in Exhibit B.
                    </li>
                    <li>
                      Ensure that the Products meet the quality standards
                      specified by the Supplier.
                    </li>
                    <li>
                      Ship the Products to the Reseller or customer on time and
                      in accordance with the Supplier&apos;s shipping policies.
                    </li>
                  </ul>
                  <p>
                    4.2 The Supplier reserves the right to adjust the product
                    prices and terms upon 14 days written notice to the
                    Reseller.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-2">
                  5. Pricing and Payment
                </h2>
                <div className="pl-4 space-y-2">
                  <p>
                    5.1 The Supplier shall pay the Reseller all profits accrued
                    from mark up of pricing agreed for sale of the Products
                    according to the pricing terms set on the dashboard less any
                    administrative fees and server hosting fees charged.
                  </p>
                  <p>
                    5.2 Payments will be made via Digital Channels on a monthly
                    basis, or as otherwise agreed.
                  </p>
                  <p>
                    5.3 All payments are due within 24 hrs from the date of
                    invoice.
                  </p>
                  <p>
                    5.4 Reseller is permitted to mark up the prices agreed upon
                    with Supplier provided Reseller can sell products at that
                    price point.
                  </p>
                  <p>
                    5.5 Reseller is required to pay a reseller fee to join the
                    platform and sell on the platform. Provision is made for
                    Resellers under the ISI ALUMNI PROGRAM who will be required
                    to pay the required server hosting and admin fee ONLY.
                  </p>
                  <p>
                    5.6 Payment is made through the Suppliers payment gateway
                    and all remittances are made after sale as stipulated above
                    per agreement.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-2">
                  6. Intellectual Property
                </h2>
                <div className="pl-4 space-y-2">
                  <p>
                    6.1 The Supplier retains all intellectual property rights,
                    including patents, trademarks, copyrights, and trade
                    secrets, associated with the Products and any related
                    materials.
                  </p>
                  <p>
                    6.2 The Reseller shall not infringe upon these rights and
                    shall use the Supplier&apos;s intellectual property only as
                    authorized under this Agreement.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-2">7. Confidentiality</h2>
                <div className="pl-4 space-y-2">
                  <p>
                    7.1 Both parties agree to keep all proprietary information,
                    including pricing, product designs, and business strategies,
                    confidential and shall not disclose it to third parties
                    without written consent, except as required by law.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-2">
                  8. Term and Termination
                </h2>
                <div className="pl-4 space-y-2">
                  <p>
                    8.1 This Agreement will commence on the effective date and
                    continue for an initial term of 5 years unless terminated
                    earlier as provided herein.
                  </p>
                  <p>
                    8.2 Either party may terminate this Agreement with 15 days
                    written notice to the other party.
                  </p>
                  <p>
                    8.3 Either party may terminate this Agreement immediately if
                    the other party breaches any material term of this Agreement
                    and fails to remedy the breach within 15 after receiving
                    notice of such breach.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-2">
                  9. Limitation of Liability
                </h2>
                <div className="pl-4 space-y-2">
                  <p>
                    9.1 The Supplier&apos;s liability under this Agreement is
                    limited to the price paid for the Products that are the
                    subject of the claim.
                  </p>
                  <p>
                    9.2 In no event shall either party be liable for indirect,
                    incidental, or consequential damages arising out of or in
                    connection with this Agreement.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-2">10. Indemnification</h2>
                <div className="pl-4 space-y-2">
                  <p>
                    10.1 The Reseller agrees to indemnify and hold the Supplier
                    harmless from any claims, losses, or damages resulting from
                    the Reseller&apos;s marketing, sale, or distribution of the
                    Products.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-2">
                  11. Dispute Resolution
                </h2>
                <div className="pl-4 space-y-2">
                  <p>
                    11.1 Any disputes under this Agreement will be resolved
                    through arbitration in accordance with the rules of
                    arbitration in Nigeria.
                  </p>
                  <p>
                    11.2 The prevailing party in any legal action shall be
                    entitled to recover reasonable attorney&apos;s fees and
                    costs.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-2">12. Miscellaneous</h2>
                <div className="pl-4 space-y-2">
                  <p>
                    12.1 <strong>Entire Agreement:</strong> This Agreement
                    constitutes the entire agreement between the parties with
                    respect to the subject matter hereof and supersedes all
                    prior agreements and understandings.
                  </p>
                  <p>
                    12.2 <strong>Amendments:</strong> Any amendment or
                    modification of this Agreement must be in writing and signed
                    by both parties.
                  </p>
                  <p>
                    12.3 <strong>Governing Law:</strong> This Agreement will be
                    governed by and construed in accordance with the laws of
                    Nigeria.
                  </p>
                  <p>
                    12.4 <strong>Force Majeure:</strong> Neither party shall be
                    liable for failure to perform due to causes beyond their
                    reasonable control, including but not limited to natural
                    disasters, acts of war, or labor strikes.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-4">Signatures</h2>
                <div className="space-y-6">
                  <div className="border p-4 rounded">
                    <h3 className="font-bold mb-2">
                      IVÓ a Trademark of COUTURE LIVING LIMITED
                    </h3>
                    <div className="space-y-1">
                      <p>Name: Oyidiya Ajike-Mbah</p>
                      <p>Title: CEO</p>
                      <p>Date: {data.date}</p>
                      <Image
                        className="object-contain w-[100px] h-[50px]"
                        width={200}
                        height={75}
                        src={signature}
                        alt="supplier sign"
                      />
                    </div>
                  </div>

                  <div className="border p-4 rounded">
                    <h3 className="font-bold mb-2">{data.resellerName}</h3>
                    <div className="space-y-1">
                      <p>Name: {data.ownerName}</p>
                      <p>Date: {data.date}</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="agreement"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked === true)}
              disabled={isLoading}
            />
            <label
              htmlFor="agreement"
              className="text-sm text-gray-700 leading-tight"
            >
              I have read and agree to the White Label Reseller Agreement. I
              understand that these terms govern my use of the platform as a
              reseller.
            </label>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !agreed}
          >
            {isLoading ? "Processing..." : "Accept and Continue"}
          </Button>
        </form>
      </motion.div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          Step {isInternalSeller ? "2 of 3" : "1 of 3"}: White Label Reseller
          Agreement
        </p>
      </div>
    </div>
  );
}
