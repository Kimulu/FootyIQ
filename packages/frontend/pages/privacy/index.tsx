"use client";

import { LegalPageLayout } from "@/components/layout/LegalPageLayout";

export default function PrivacyPage() {
  return (
    <LegalPageLayout title="Privacy Policy">
      <p className="text-sm text-white/40 mb-8">
        Last Updated: {new Date().toLocaleDateString()}
      </p>

      <h3>1. Introduction</h3>
      <p>
        Welcome to <strong>FootyIQ</strong> ("we," "our," or "us"). We are
        committed to protecting your personal information and your right to
        privacy. This Privacy Policy explains how we collect, use, disclosure,
        and safeguard your information when you visit our website and use our
        subscription services.
      </p>
      <p>
        By accessing or using FootyIQ, you agree to the terms of this Privacy
        Policy. If you do not agree with the terms of this policy, please do not
        access the site.
      </p>

      <h3>2. Information We Collect</h3>
      <p>
        We collect information that you voluntarily provide to us when you
        register on the website or purchase a subscription.
      </p>
      <ul className="list-disc pl-5 space-y-2 mb-4">
        <li>
          <strong>Personal Data:</strong> Username, email address, and phone
          number (specifically for M-Pesa transactions).
        </li>
        <li>
          <strong>Financial Data:</strong> We <strong>do not</strong> store your
          credit card numbers or banking PINs. All payment processing is handled
          by our third-party processor, <strong>Paystack</strong>. We only store
          the transaction reference ID and your subscription status.
        </li>
        <li>
          <strong>Activity Data:</strong> Data regarding your betting
          statistics, tracked bets, and usage patterns within the dashboard to
          calculate your ROI and performance rankings.
        </li>
      </ul>

      <h3>3. How We Use Your Information</h3>
      <p>We use the information we collect or receive:</p>
      <ul className="list-disc pl-5 space-y-2 mb-4">
        <li>To facilitate account creation and logon processes.</li>
        <li>To process subscription payments via M-Pesa or Card.</li>
        <li>
          To generate your personalized betting statistics and performance
          badges.
        </li>
        <li>
          To send you administrative information, such as subscription expiries
          or password resets.
        </li>
        <li>
          To display your username on the Community Leaderboard (you can opt-out
          by contacting support).
        </li>
      </ul>

      <h3>4. Sharing Your Information</h3>
      <p>
        We do not sell, trade, or rent your personal identification information
        to others. We may share generic aggregated demographic information not
        linked to any personal identification information regarding visitors and
        users with our business partners.
      </p>
      <p>
        <strong>Third-Party Processors:</strong> We share payment data with
        Paystack to process M-Pesa and Card transactions. Please review
        Paystack&apos;s privacy policy for details on how they handle your
        financial data.
      </p>

      <h3>5. Data Retention</h3>
      <p>
        We will only keep your personal information for as long as it is
        necessary for the purposes set out in this privacy policy, unless a
        longer retention period is required or permitted by law (such as tax,
        accounting, or other legal requirements).
      </p>
      <p>
        If you delete your account via the Settings page, your personal data is
        removed from our live database immediately, though some transaction
        records may be retained for accounting purposes.
      </p>

      <h3>6. Security of Your Information</h3>
      <p>
        We use administrative, technical, and physical security measures to help
        protect your personal information. Passwords are hashed using bcrypt
        before storage. However, please be aware that no electronic transmission
        over the internet or information storage technology can be guaranteed to
        be 100% secure.
      </p>

      <h3>7. Your Rights</h3>
      <p>
        Depending on your location (including users in Kenya under the Data
        Protection Act), you have the right to:
      </p>
      <ul className="list-disc pl-5 space-y-2 mb-4">
        <li>Request access to the personal data we hold about you.</li>
        <li>Request correction of any data that is inaccurate.</li>
        <li>Request deletion of your data (Right to be Forgotten).</li>
        <li>Object to the processing of your data.</li>
      </ul>

      <h3>8. Contact Us</h3>
      <p>
        If you have questions or comments about this Privacy Policy, please
        contact us at:
      </p>
      <p className="mt-2 text-orange-500 font-bold">
        support@footyiq.com
        <br />
        Nairobi, Kenya
      </p>
    </LegalPageLayout>
  );
}
