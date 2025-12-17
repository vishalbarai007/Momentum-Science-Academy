// frontend/components/StructuredData.tsx
export default function StructuredData() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        "name": "Momentum Science Academy",
        "url": "https://momentum-academy.com",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Rashmi Divya Complex 6 Near Agarwal Circle, next to Galaxy Hotel Vasai East, Mumbai - 401208", 
            "addressLocality": "Mumbai",
            "addressRegion": "Maharashtra",
            "postalCode": "401208",
            "addressCountry": "IN"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": "19.3919",
            "longitude": "72.8397"
        },
        "sameAs": [
            "https://www.facebook.com/momentum",
            "https://www.instagram.com/momentum_science_acadmey/"
        ]
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    )
}