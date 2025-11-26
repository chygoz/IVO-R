"use client";
import React from "react";
import Container from "@/components/ui/container";
import Accordion from "@/components/common/accordion";
import PageHeader from "@/components/common/page-header";
import { faq } from "@/settings/faq.settings";
import Subscription from "../common/subscription";

function FaqComponent() {
  return (
    <>
      <PageHeader pageHeader="FREQUENTLY ASKED QUESTIONS" />
      <Container>
        <div className="py-16 lg:py-20 px-0 max-w-5xl mx-auto space-y-4">
          <Accordion items={faq} />
        </div>
        <Subscription />
      </Container>
    </>
  );
}

export default FaqComponent;
