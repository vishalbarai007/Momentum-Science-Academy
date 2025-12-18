import { Footer } from "@/components/public/footer";
import { Navbar } from "@/components/public/navbar";
import React from "react";

const Page = () => {
    return (
        <>
            <Navbar />
            <main className="max-w-5xl mx-auto px-6 py-10 text-gray-800 leading-relaxed my-15">

                <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

                <p className="mb-4">
                    This Privacy Policy discloses the privacy practices for{" "}
                    <strong>Momentum Science Academy</strong> (“MSA”) with regard to your
                    use of our website, applications, products, or services (“Services”),
                    including usage at our physical centers, workshops, and events.
                </p>

                <p className="mb-4">
                    This Privacy Policy, along with our Terms of Use, describes how we
                    collect, store, use, share, and secure your personal information and
                    your choices related to that information.
                </p>

                <p className="mb-6">
                    By accessing or using our website <strong>https://momentum-science-academy.vercel.app/</strong>,
                    you agree to this Privacy Policy. If you do not agree, please do not
                    use our Services.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">
                    Collection of Information
                </h2>

                <p className="mb-4">
                    You may browse our Website without providing Personal Data. However,
                    when you register, enroll in courses, contact us, or use paid
                    services, we may collect Personal Data to provide a better experience.
                </p>

                <ul className="list-disc ml-6 mb-6 space-y-2">
                    <li>
                        <strong>Contact Information:</strong> Name, email address, phone
                        number, IP address, geographic location.
                    </li>
                    <li>
                        <strong>Verification Information:</strong> Date of birth, academic
                        records, government-issued ID (if required).
                    </li>
                    <li>
                        <strong>Academic Details:</strong> Course preferences, test data,
                        learning progress.
                    </li>
                    <li>City, State
                        <strong>Billing Information:</strong> Processed securely through
                        third-party payment gateways.
                    </li>
                    <li>
                        <strong>Account Credentials:</strong> Username and encrypted
                        passwords.
                    </li>
                </ul>

                <h2 className="text-2xl font-semibold mt-8 mb-4">
                    Usage and Retention of Information
                </h2>

                <p className="mb-4">
                    We use your information to provide and improve our Services, personalize
                    learning experiences, communicate with you, provide support, prevent
                    fraud, and comply with legal obligations.
                </p>

                <p className="mb-6">
                    We retain Personal Data only as long as necessary to fulfill the
                    purposes for which it was collected or as required by law.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">
                    Sharing of Information
                </h2>

                <ul className="list-disc ml-6 mb-6 space-y-2">
                    <li>Legal and regulatory authorities when required by law</li>
                    <li>Trusted service providers for payments, hosting, and analytics</li>
                    <li>Banking partners for financial aid processing (with consent)</li>
                    <li>Corporate restructuring or mergers</li>
                </ul>

                <p className="mb-6">
                    We do not sell or rent your Personal Data to third parties.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">Security</h2>

                <p className="mb-6">
                    We use SSL encryption, secure servers, access control, and data
                    protection practices to safeguard your information. However, no
                    system is 100% secure.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">
                    Use by Children
                </h2>

                <p className="mb-6">
                    Users under the age of 18 must use our Services under the supervision
                    of a parent or legal guardian who agrees to this Privacy Policy.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">Cookies</h2>

                <p className="mb-6">
                    We use cookies to enhance user experience and analyze website traffic.
                    Cookies do not store Personal Data. You may disable cookies in your
                    browser settings.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">
                    Third-Party Links
                </h2>

                <p className="mb-6">
                    Our Website may contain links to third-party websites. We are not
                    responsible for their privacy practices.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">Consent</h2>

                <p className="mb-6">
                    By using our Services, you consent to the collection and use of your
                    information as described in this Privacy Policy.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">
                    Grievance Officer
                </h2>

                <p className="mb-2">
                    <strong>Name:</strong> Prof. RP Singh
                </p>
                <p className="mb-6">
                    <strong>Email:</strong> grievance@[yourdomain].com
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">Governing Law</h2>

                <p className="mb-6">
                    This Privacy Policy shall be governed by Indian law. Any disputes shall
                    be subject to the jurisdiction of courts in{" "}
                    <strong>Mumbai, Maharashtra, India</strong>.
                </p>

                <p className="text-sm text-gray-500 mt-10">
                    Last updated: 29th December, 2025
                </p>

            </main>
            <Footer />
        </>
    );
};

export default Page;
