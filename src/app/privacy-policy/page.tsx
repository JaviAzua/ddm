import React from "react";

const PrivacyTermsPage = () => {
  return (
    <div className="container mx-auto p-6 mt-20">
      <h1 className="text-3xl font-bold mb-4">
        Política de Privacidad y Términos de Servicio
      </h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Política de Privacidad</h2>
        <p>
          En DDM, valoramos su privacidad. Esta política explica cómo
          recopilamos, utilizamos y protegemos su información personal. No
          compartimos sus datos con terceros sin su consentimiento expreso.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Términos de Servicio</h2>
        <p>
          Al utilizar nuestros servicios, acepta cumplir con nuestras normas y
          regulaciones. Nos reservamos el derecho de modificar estos términos en
          cualquier momento.
        </p>
      </section>

      <hr className="my-6" />

      <h1 className="text-3xl font-bold mb-4">
        Privacy Policy & Terms of Service
      </h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Privacy Policy</h2>
        <p>
          At DDM, we value your privacy. This policy explains how we collect,
          use, and protect your personal information. We do not share your data
          with third parties without your explicit consent.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Terms of Service</h2>
        <p>
          By using our services, you agree to comply with our rules and
          regulations. We reserve the right to modify these terms at any time.
        </p>
      </section>
    </div>
  );
};

export default PrivacyTermsPage;
