import ContactForm from "./components/contact-form";
import HeaderSection from "./components/header-section";
import WorksSection from "./components/works-section";

export default function Home() {
  return (
    <main className="flex-grow">
      <div
        className="pattern-cross pattern-gray-500 pattern-bg-white 
  pattern-size-8 pattern-opacity-10 h-full w-full fixed top-0 left-0 -z-10"
      ></div>
      <div className="h-screen">
        <HeaderSection />
      </div>
      <WorksSection />
      <ContactForm />
    </main>
  );
}
