import React from "react"
import Link from "next/link"
import { Navbar } from "@/components/public/navbar"
import { Footer } from "@/components/public/footer"

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col mt-15">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12 md:px-8 max-w-5xl">
        <div className="space-y-6">
          <div className="border-b pb-6">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Terms and Conditions</h1>
            <p className="text-muted-foreground mt-2">Last Updated: December 2024</p>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
            {/* Introduction */}
            <section className="space-y-4">
              <p>
                These Terms & Conditions of (a) use of our website, our applications or any products or services in connection with the Application, Website/products (“Services”) or (b) any modes of registrations or usage of products, including through digital storage devices, tablets or other storage/transmitting device are between <strong>Momentum Science Academy</strong> (“MSA”) and its users.
              </p>
              <p>
                These Terms constitute an electronic record in accordance with the provisions of the Information Technology Act, 2000 and the Information Technology (Intermediaries guidelines) Rules, 2011 thereunder, as amended from time to time.
              </p>
              <p>
                Please read the Terms and the privacy policy of the Company (“Privacy Policy”) with respect to registration with us, the use of the Application, Website, Services and products carefully before using the Application, Website, Services or products. In the event of any discrepancy between the Terms and any other policies with respect to the Application or Website or Services or products, the provisions of the Terms shall prevail.
              </p>
              <p>
                Your use/access/browsing of the Application or Website or the Services or products or registration (with or without payment/with or without subscription) through any means shall signify Your acceptance of the Terms and Your agreement to be legally bound by the same.
              </p>
              <p>
                If you do not agree with the Terms or the Privacy Policy, please do not use the Application or Website or avail the Services or products. Any access to our Services /Application /products through registrations/subscription is non-transferable.
              </p>
            </section>

            {/* List Items */}
            <div className="space-y-8">
              {/* 1. Proprietary Information */}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">1. Proprietary Information</h3>
                <p>
                  Except as mentioned below, all information, content, material, trademarks, services marks, trade names, and trade secrets including but not limited to the software, text, images, graphics, video, script and audio, contained in the Application, Website, Services and products are proprietary property of the Company (“Proprietary Information”). No Proprietary Information may be copied, downloaded, reproduced, modified, republished, uploaded, posted, transmitted or distributed in any way without obtaining prior written permission from the Company and nothing on this Application or Website or Services shall be or products deemed to confer a license of or any other right, interest or title to or in any of the intellectual property rights belonging to the Company, to the User. You may own the medium on which the information, content or materials resides, but the Company shall at all times retain full and complete title to the information, content or materials and all intellectual property rights inserted by the Company on such medium. Certain contents on the Website may belong to third parties. Such contents have been reproduced after taking prior consent from said party and all rights relating to such content will remain with such third party. Further, you recognize and acknowledge that the ownership of all trademarks, copyright, logos, service marks and other intellectual property owned by any third party shall continue to vest with such party and You are not permitted to use the same without the consent of the respective third party.
                </p>
              </div>

              {/* 2. Usage Restrictions */}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">2. Usage Restrictions</h3>
                <p>
                  Your use of our products, Website, Application and Services is solely for Your personal and non-commercial use. Any use of the Application, Website, Services or products or their contents other than for personal purposes is prohibited. Your personal and non-commercial use of this Application, Website, products and / or our Services shall be subjected to the following restrictions:
                </p>
                <p>
                  You may not decompile, reverse engineer, or disassemble the contents of the Application and/or our Website and/or Services/ products or modify, copy, distribute, transmit, display, perform, reproduce, publish, license, create derivative works from, transfer, or sell any information or software obtained from the Application and/or our Website and/or Services/products, or remove any copyright, trademark registration, or other proprietary notices from the contents of the Application and/or our Website and/or Services/products.
                </p>
                <p className="font-medium mt-4">You will not:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Use this Application and/or our Website and/or any of our product/s or Service/s for commercial purposes of any kind.</li>
                  <li>Advertise or sell the Application or any products, Services or domain names or otherwise (whether or not for profit), or solicit others (including, without limitation, solicitations for contributions or donations) or use any public forum for commercial purposes of any kind.</li>
                  <li>Use the Application and/or Website/our products and Services in any way that is unlawful, or harms the Company or any other person or entity as determined by the Company.</li>
                </ul>
                <p className="font-medium mt-4">No User shall be permitted to perform any of the following prohibited activities while availing our Services:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Making available any content that is misleading, unlawful, harmful, threatening, abusive, tortious, defamatory, libelous, vulgar, obscene, child-pornographic, lewd, lascivious, profane, invasive of another&apos;s privacy, hateful, or racially, ethnically or otherwise objectionable;</li>
                  <li>Stalking, intimidating and/or harassing another and/or inciting others to commit violence;</li>
                  <li>Transmitting material that encourages anyone to commit a criminal offence, that results in civil liability or otherwise breaches any relevant laws, regulations or code of practice;</li>
                  <li>Interfering with any other person&apos;s use or enjoyment of the Application /Website /Services;</li>
                  <li>Making, transmitting or storing electronic copies of materials protected by copyright without the permission of the owner, committing any act that amounts to the infringement of intellectual property or making available any material that infringes any intellectual property rights or other proprietary rights of anyone else;</li>
                  <li>Make available any content or material that You do not have a right to make available under any law or contractual or fiduciary relationship, unless You own or control the rights thereto or have received all necessary consents for such use of the content;</li>
                  <li>Impersonate any person or entity, or falsely state or otherwise misrepresent Your affiliation with a person or entity;</li>
                  <li>Post, transmit or make available any material that contains viruses, trojan horses, worms, spyware, time bombs, cancelbots, or other computer programming routines, code, files or such other programs that may harm the Application/services, interests or rights of other users or limit the functionality of any computer software, hardware or telecommunications, or that may harvest or collect any data or personal information about other Users without their consent;</li>
                  <li>Access or use the Application /Website /Services /products in any manner that could damage, disable, overburden or impair any of the Application&apos;s/Website&apos;s servers or the networks connected to any of the servers on which the Application/Website is hosted;</li>
                  <li>Intentionally or unintentionally interfere with or disrupt the services or violate any applicable laws related to the access to or use of the Application /Website /Services /products, violate any requirements, procedures, policies or regulations of networks connected to the Application /Website /Services /products, or engage in any activity prohibited by these Terms;</li>
                  <li>Disrupt or interfere with the security of, or otherwise cause harm to, the Application /Website /Services /products, materials, systems resources, or gain unauthorized access to user accounts, passwords, servers or networks connected to or accessible through the Application /Website /Services /products or any affiliated or linked sites;</li>
                  <li>Interfere with, or inhibit any user from using and enjoying access to the /Website /Services /products, or other affiliated sites, or engage in disruptive attacks such as denial of service attack on the Application /Website /Services /products;</li>
                  <li>Use deep-links, page-scrape, robot, spider or other automatic device, program, algorithm or methodology, or any similar or equivalent manual process, to increase traffic to the Application /Website /Services /products, to access, acquire, copy or monitor any portion of the Application /Website /Services /products, or in any way reproduce or circumvent the navigational structure or presentation of the Application, or any content, to obtain or attempt to obtain any content, documents or information through any means not specifically made available through the Application /Website /Services /products;</li>
                  <li>Alter or modify any part of the Services;</li>
                  <li>Use the Services for purposes that are not permitted by: (i) these Terms; and (ii) any applicable law, regulation or generally accepted practices or guidelines in the relevant jurisdiction; or</li>
                  <li>Violate any of the terms specified under the Terms for the use of the Application /Website /Services /products.</li>
                </ul>
              </div>

              {/* 3. Accuracy of Information */}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">3. Accuracy of Information</h3>
                <p>
                  In the preparation of the Application /Website /Services /products and contents therein, every effort has been made to offer the most current, correct, and clearly expressed information possible. Nevertheless, inadvertent errors may occur. In particular, but without limiting anything here, the Company disclaims any responsibility for any errors and inaccuracy of the information that may be contained in the Application. Any feedback from User is most welcome to make the Application and contents thereof error free and user friendly. Company also reserves the right and discretion to make any changes/corrections or withdraw/add contents at any time without notice. Neither the Company nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials found or offered on Application /Website /Services /products for any particular purpose. You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.
                </p>
              </div>

              {/* 4. GDPR Compliance */}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">4. GDPR Compliance Statement</h3>
                <p>MSA respects and complies with the EU General Data Protection Regulations (GDPR). Some of the key ways we comply with these regulations are:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Consent:</strong> We explain what you’re consenting to clearly and without ‘legalese’, and ask that you explicitly consent to contact from us.</li>
                  <li><strong>Breach Notification:</strong> In the event of a breach, we will notify affected users within 72 hours of first having become aware of the breach.</li>
                  <li><strong>Right to Access:</strong> Users can request confirmation as to whether or not personal data concerning them is being processed, where and for what purpose. Further, we shall provide a copy of the personal data, in an electronic format.</li>
                  <li><strong>Right to be Forgotten:</strong> Once we have compared your (the subjects&apos;) rights to &apos;the public interest in the availability of the data&apos;, we may delete your personal data where you have requested this.</li>
                  <li><strong>Data Portability:</strong> We allow you to receive the personal data concerning you, which we will provide in a &apos;commonly used and machine readable format&apos; and you have the right to transmit that data to another ‘controller’.</li>
                  <li><strong>Privacy by Design:</strong> We implement appropriate technical and organisational measures, in an effective way and protect the subjects&apos; rights of data. We hold and process only the data absolutely necessary for the completion of our duties (data minimisation), as well as limiting the access to personal data to those needing to act out the processing.</li>
                  <li><strong>Termination of Account:</strong> You may terminate your account at any time by sending us an email at <strong>support@momentum.in</strong>. If you terminate your Account, any confirmed enrollment will be automatically canceled and any refund shall be as per the terms of the applicable cancellation policy.</li>
                </ul>
              </div>

              {/* 5. Information & Links */}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">5. Third-Party Links</h3>
                <p>
                  Our Website provides Users with access to compiled educational information and related sources. Such information is provided on an &quot;As Is&quot; basis and We assume no liability for the accuracy or completeness or use or non obsolescence of such information. We shall not be liable to update or ensure continuity of such information contained on the Website. We would not be responsible for any errors, which might appear in such information, which is compiled from third party sources or for any unavailability of such information. From time to time the Website may also include links to other websites. These links are provided for your convenience to provide further information. They do not signify that we endorse the website(s). We have no responsibility for the content of the linked website(s). You may not create a link to the Website from another website or document without the Company&apos;s prior written consent.
                </p>
              </div>

              {/* 6. Curriculum & Admission */}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">6. Curriculum & Admission Disclaimer</h3>
                <p>
                  The contents of the Application /Services /products are developed on the concepts covered in the structured curriculum syllabus prescribed for students of various courses. The usage of the Application /Services /products is not endorsed as a substitution to the curriculum based education provided by the educational institutions but is intended to supplement the same by explaining and presenting the concepts in a manner enabling easy understanding. The basic definitions and formulae of the subject matter would remain the same. Subscription to the Application or usage of our Services/Website/products does not in any manner guarantee admission to any educational institutions or passing of any exams or achievement of any specified percentage of marks in any examinations.
                </p>
              </div>

              {/* 7. Opinions */}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">7. Opinions and Views</h3>
                <p>
                  Certain contents in the Application /Services /Website /products may contain opinions and views of Others. The Company shall not be responsible for such opinions or any claims resulting from them. Further, the Company makes no warranties or representations whatsoever regarding the quality, content, completeness, or adequacy of such information and data.
                </p>
              </div>

              {/* 8. User Contributions */}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">8. User Contributions</h3>
                <p>
                  Some parts of the Services are interactive, and we encourage contributions by Users, which may or may not be subject to editorial control prior to being posted. The Company accepts no responsibility or liability for any material communicated by third parties in this way. The Company reserves the right at its sole discretion to remove, review, edit or delete any content. Similarly, We will not be responsible or liable for any content uploaded by Users directly on the Website, irrespective of whether We have certified any answer uploaded by the User.
                </p>
              </div>

              {/* 9. Communication */}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">9. Communication</h3>
                <p>
                  The Company (including but not limited to its subsidiaries/affiliates) may, based on any form of access to the Application (including free download/trials) or Services or Website or registrations through any source whatsoever, contact the User through SMS, email and call, to give information about their offerings and products as well as notifications on various important updates. The User expressly grants such permission to contact him/her through telephone, SMS, e-mail and holds the Company indemnified against any liabilities including financial penalties, damages, expenses in case the User&apos;s mobile number is registered with Do not Call (DNC) database.
                </p>
              </div>

              {/* 15. Cancellations and Refunds */}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">15. Cancellations and Refunds</h3>
                <p>
                  If, as a Student, you wish to cancel a confirmed enrolment made via the Site or the Application, after enrolment to the Course, the cancellation policy contained in the applicable Listing will apply to such cancellation provided that no refund will be made in respect of tuitions already provided. Our ability to refund the Course Fees and other amounts charged to you will depend upon the terms of the applicable cancellation policy and financial charges applicable in case of course payment through No Cost EMI options.
                </p>
                <p>
                   As a student, You also have the option to exchange the phase (alternate starting date) of the product purchased. A nominal charge is applicable on phase change requests, which should be paid by the student before the request can be processed. Students need to call our support team for any refund / phase change requests.
                </p>
              </div>

              {/* 16. Account Registration */}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">16. Account Registration</h3>
                <p>
                  In order to access the Services and to avail the use of the Application/products, You shall be required to register yourself with the Application /Services /products, and maintain an account. You will be required to furnish certain information and details, including Your name, mobile number, e-mail address, residential address, grade/class of the student, payment information (credit/debit card details) if required, and any other information deemed necessary.
                </p>
                <p>
                  It is Your sole responsibility to ensure that the account information provided by You is accurate, complete and latest. You shall be responsible for maintaining the confidentiality of the account information and for all activities that occur under Your account.
                </p>
              </div>

              {/* 17. Eligibility */}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">17. Eligibility</h3>
                <p>
                  Persons who are &apos;competent/capable&apos; of contracting within the meaning of the Indian Contract Act, 1872 shall be eligible to register for the Application and all Our products or Services. Persons who are minors, un-discharged insolvents etc. are not eligible to register for Our products or Services. As a minor if You wish to use Our products or Services, such use shall be made available to You by Your legal guardian or parents, who has agreed to these Terms.
                </p>
              </div>

              {/* 18. Indemnification */}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">18. Indemnification</h3>
                <p>
                  You agree to defend, indemnify and hold harmless the Company, its officers, directors, employees and agents, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney&apos;s fees) arising from: Your use of and access of the Application /Website /Services; Your violation of any term of these Terms or any other policy of the Company; Your violation of any third party right, including without limitation, any copyright, property, or privacy right.
                </p>
              </div>

              {/* 19. Limitation of Liability */}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">19. Limitation of Liability</h3>
                <p>
                  In no event shall the Company, its officers, directors, employees, partners or agents be liable to You or any third party for any special, incidental, indirect, consequential or punitive damages whatsoever, including those resulting from loss of use, data or profits or any other claim arising out, of or in connection with, Your use of, or access to, the Application.
                </p>
              </div>

              {/* 22. Governing Law */}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">22. Governing Law</h3>
                <p>
                  The Terms shall be governed by and construed in accordance with the laws of India, without regard to conflict of law principles. Further, the Terms shall be subject to the exclusive jurisdiction of the competent courts located in <strong>[City]</strong> and You hereby accede to and accept the jurisdiction of such courts.
                </p>
              </div>

              {/* 24. Disclaimer */}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">24. Disclaimer</h3>
                <p>
                  This website, the application and the services are provided on an &apos;as is&apos; basis with all faults and without any warranty of any kind. The company hereby disclaims all warranties and conditions with regard to the website, application/products and the services, including without limitation, all implied warranties and conditions of merchantability, fitness for a particular purpose, title, accuracy, timeliness, performance, completeness, suitability and non-infringement.
                </p>
              </div>

              {/* 25. General Provisions */}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">25. General Provisions</h3>
                <p>
                  You consent to Momentum Science Academy having the exclusive right to use your information for marketing and publicity purposes including in case of your selection in the medical / engineering entrance exams, national or international Olympiads, and other examinations.
                </p>
                <p>
                  <strong>Notice:</strong> All notices served by the Company shall be provided via email to Your account or as a general notification on the Application. Any notice to be provided to the Company should be sent to <strong>support@momentum.in</strong>.
                </p>
              </div>

              {/* 26. Feedback */}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">26. Feedback</h3>
                <p>
                  Any feedback You provide with respect to the Application shall be deemed to be non-confidential. The Application shall be free to use such information on an unrestricted basis. Under no circumstances shall the Company be held responsible in any manner for any content provided by other users even if such content is offensive, hurtful or offensive.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}