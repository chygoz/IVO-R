import React from "react";
import PublicHeader from "./public/header";
import Footer from "./public/footer";

type AppLayoutProps = {
  children: React.ReactNode;
};
function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex flex-col w-full">
      <PublicHeader />
      <main
        className="min-h-screen"
        style={{
          minHeight: "-webkit-fill-available",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default AppLayout;
