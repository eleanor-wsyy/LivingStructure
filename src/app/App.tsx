import React, { useState } from "react";
import { Layout } from "@/app/components/Layout";
import { Discover } from "@/app/views/Discover";
import { Theory } from "@/app/views/Theory";
import { Analyze } from "@/app/views/Analyze";
import { Practice } from "@/app/views/Practice";
import { Library } from "@/app/views/Library";
import { Construct } from "@/app/views/Construct";
import { LanguageProvider } from "@/app/i18n/LanguageContext";

export default function App() {
  const [currentPage, setCurrentPage] = useState("discover");

  const renderPage = () => {
    switch (currentPage) {
      case "discover":
        return <Discover onNavigate={setCurrentPage} />;
      case "theory":
        return <Theory />;
      case "analyze":
        return <Analyze />;
      case "construct":
        return <Construct />;
      case "practice":
        return <Practice />;
      case "library":
        return <Library />;
      default:
        return <Discover onNavigate={setCurrentPage} />;
    }
  };

  return (
    <LanguageProvider>
      <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
        {renderPage()}
      </Layout>
    </LanguageProvider>
  );
}
