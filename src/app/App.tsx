import React, { useState } from "react";
import { Layout } from "@/app/components/Layout";
import { Discover } from "@/app/views/Discover";
import { Theory } from "@/app/views/Theory";
import { Analyze } from "@/app/views/Analyze";
import { Practice } from "@/app/views/Practice";
import { Library } from "@/app/views/Library";
import { Construct } from "@/app/views/Construct";
// 👇 修改 1：引入你刚才新建的 Community 组件
import Community from "@/app/views/Community"; 
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
      // 👇 修改 2：告诉 React，当 currentPage 是 community 时，渲染这个页面
      case "community":
        return <Community />;
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