import Script from "next/script";

export default function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Momentum Science Academy",
    "url": "https://momentumscienceacademy.com",
    "logo": "https://momentumscienceacademy.com/Logo/logo1.png",
    "description": "Premier coaching for 8th, 9th, 10th, JEE, NEET, MHT-CET, and 11th-12th Science in Vasai Virar East.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Rashmi Villa Complex 6, Vasai East",
      "addressLocality": "Vasai",
      "addressRegion": "Maharashtra",
      "postalCode": "401208",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-98237-88328",
      "contactType": "admissions"
    },
    "hasCourse": [
      {
        "@type": "Course",
        "name": "JEE Main & Advanced Coaching",
        "description": "Intensive engineering entrance preparation."
      },
      {
        "@type": "Course",
        "name": "NEET Medical Entrance Prep",
        "description": "Specialized coaching for medical aspirants."
      },
      {
        "@type": "Course",
        "name": "MHT-CET Crash Course",
        "description": "Focused preparation for Maharashtra state engineering entrance."
      }
      {
        "@type": "Course",
        "name": "10th Std SSC ",
        "description": "Productive Environment for Boards Excellence."
      }
    ]
  };

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}