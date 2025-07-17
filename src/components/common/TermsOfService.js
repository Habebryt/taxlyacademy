import { FileEarmarkText, PersonCheck, Mortarboard, ShieldLock, ExclamationTriangle } from 'react-bootstrap-icons';


export const termsSections = [
    {
        id: 'agreement',
        icon: <FileEarmarkText size={24} />,
        question: '1. Agreement to Terms',
        summary: 'By using our website and services, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.',
        details: 'By accessing the website of Taxly Academy, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.'
    },
    {
        id: 'accounts',
        icon: <PersonCheck size={24} />,
        question: '2. User Accounts & Responsibilities',
        summary: 'You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account. You must provide accurate information.',
        details: 'When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. You agree not to disclose your password to any third party.'
    },
    {
        id: 'enrollment',
        icon: <Mortarboard size={24} />,
        question: '3. Course Enrollment and Access',
        summary: 'We offer free enrollment to all courses. A fee is only required if you wish to obtain a professional certificate upon completion.',
        details: 'Taxly Academy provides free access to all course materials, including video lectures and community forums, upon enrollment. This access is granted for your personal, non-commercial use. A one-time fee is required for the "Certificate Upgrade" path, which includes the issuance of a formal certificate upon successful completion of all course requirements. This fee is for verification, assessment, and certification processing.'
    },
    {
        id: 'conduct',
        icon: <ShieldLock size={24} />,
        question: '4. User Conduct and Community Guidelines',
        summary: 'We expect all users to interact respectfully. We do not tolerate harassment, spam, or any form of academic dishonesty.',
        details: 'You agree not to use the Service to: <br/><ul><li>Post or transmit any content that is disruptive, uncivil, abusive, vulgar, profane, obscene, hateful, fraudulent, threatening, harassing, defamatory, or which discloses private or personal matters concerning any person.</li><li>Engage in any form of academic dishonesty, including but not limited to plagiarism or cheating.</li><li>Violate any applicable law or regulation, including, without limitation, the rules and regulations of the U.S. Securities and Exchange Commission and the national or other securities exchanges.</li></ul> We reserve the right to terminate your access to the community and a course for any violation of these guidelines.'
    },
    {
        id: 'liability',
        icon: <ExclamationTriangle size={24} />,
        question: '5. Limitation of Liability & Disclaimers',
        summary: 'Our courses are provided "as is." We make no guarantees about job placement or income. Our liability is limited to the amount you paid for our services.',
        details: 'The materials on Taxly Academy\'s website are provided on an \'as is\' basis. Taxly Academy makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights. Further, Taxly Academy does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site. In no event shall Taxly Academy or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website.'
    },
];

export default termsSections