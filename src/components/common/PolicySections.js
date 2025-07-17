import { ShieldCheck, PersonCircle, CardList, Share, Lock, Pen, Envelope } from 'react-bootstrap-icons';

export const policySections = [
    {
        id: 'introduction',
        icon: <ShieldCheck size={24} />,
        question: 'Introduction: What is this policy about?',
        summary: 'This policy explains what information we collect from you, how we use it, and how we keep it safe. Your privacy is important to us, and we are committed to protecting it.',
        details: 'Welcome to Taxly Academy. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us. When you visit our website and use our services, you trust us with your personal information. We take your privacy very seriously. In this privacy notice, we describe our privacy policy. We seek to explain to you in the clearest way possible what information we collect, how we use it and what rights you have in relation to it.'
    },
    {
        id: 'info-we-collect',
        icon: <PersonCircle size={24} />,
        question: 'What information do we collect?',
        summary: 'We collect information you provide to us directly, like your name and email when you enroll, and information collected automatically, like your browser type and how you use our site.',
        details: '<strong>Information You Provide to Us:</strong> We collect personal information that you voluntarily provide to us when you register for a course, express an interest in obtaining information about us or our products and services, when you participate in activities on the website or otherwise when you contact us. The personal information that we collect depends on the context of your interactions with us and the website, the choices you make and the products and features you use. The personal information we collect can include the following: Name and Contact Data, Credentials, and Payment Data.<br/><br/><strong>Information Automatically Collected:</strong> We automatically collect certain information when you visit, use or navigate the website. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our website and other technical information.'
    },
    {
        id: 'how-we-use-info',
        icon: <CardList size={24} />,
        question: 'How do we use your information?',
        summary: 'We use your information to provide and improve our services, process your transactions, communicate with you, and for security purposes.',
        details: 'We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations. We use the information we collect or receive: <br/><ul><li>To facilitate account creation and logon process.</li><li>To send administrative information to you.</li><li>To fulfill and manage your orders, payments, returns, and exchanges.</li><li>To post testimonials with your consent.</li><li>To request feedback and to contact you about your use of our website.</li><li>To protect our site and for fraud monitoring and prevention.</li></ul>'
    },
    {
        id: 'sharing-info',
        icon: <Share size={24} />,
        question: 'Will your information be shared with anyone?',
        summary: 'We only share information with your consent, to comply with laws, to provide you with services (like with our payment processors), or to protect your rights.',
        details: 'We may process or share data based on the following legal basis: <br/><ul><li><strong>Consent:</strong> We may process your data if you have given us specific consent to use your personal information for a specific purpose.</li><li><strong>Legitimate Interests:</strong> We may process your data when it is reasonably necessary to achieve our legitimate business interests.</li><li><strong>Performance of a Contract:</strong> Where we have entered into a contract with you, we may process your personal information to fulfill the terms of our contract.</li><li><strong>Legal Obligations:</strong> We may disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process.</li></ul>'
    },
    {
        id: 'data-security',
        icon: <Lock size={24} />,
        question: 'How do we keep your information safe?',
        summary: 'We use a combination of technical and organizational security measures to keep your data safe. However, no system is 100% secure.',
        details: 'We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security, and improperly collect, access, steal, or modify your information. Although we will do our best to protect your personal information, transmission of personal information to and from our website is at your own risk.'
    },
    {
        id: 'policy-updates',
        icon: <Pen size={24} />,
        question: 'Do we make updates to this policy?',
        summary: 'Yes, we will update this policy as necessary to stay compliant with relevant laws. We will notify you of any major changes.',
        details: 'We may update this privacy policy from time to time. The updated version will be indicated by an updated "Revised" date and the updated version will be effective as soon as it is accessible. If we make material changes to this privacy policy, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this privacy policy frequently to be informed of how we are protecting your information.'
    },
];

export default policySections;