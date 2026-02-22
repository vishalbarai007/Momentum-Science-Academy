import Script from "next/script";

export default function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Momentum Science Academy",
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
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "19.404938",
      "longitude": "72.829092"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-98237-88328",
      "contactType": "admissions"
    },
    "url": "https://momentumscienceacademy.com",
    "telephone": "+919823788328",
    "openingHours": "Mo-Sa 09:00-21:00",
    "image": "https://momentumscienceacademy.com/Logo/logo1.png",
    "sameAs": [
      "https://www.facebook.com/momentumscienceacademy",
      "https://www.instagram.com/momentumscienceacademy",
      "https://www.linkedin.com/in/momentum-science-academy-0279aa3a8/"
    ],
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
      },
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