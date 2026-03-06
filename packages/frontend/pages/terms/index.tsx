"use client";

import { LegalPageLayout } from "@/components/layout/LegalPageLayout";

export default function TermsPage() {
  return (
    <LegalPageLayout title="Terms of Service">
      <p className="text-sm text-white/40 mb-8">
        Last Updated: {new Date().toLocaleDateString()}
      </p>

      <h3>1. Acceptance of Terms</h3>
      <p>
        By creating an account, upgrading to a premium subscription, or
        accessing FootyIQ, you agree to be bound by these Terms of Service. If
        you do not agree to these terms, you may not access or use the Service.
      </p>
      <p>
        You must be at least 18 years of age to use this Service. By using
        FootyIQ, you warrant that you are at least 18 years old and have the
        legal capacity to enter into binding contracts.
      </p>

      <h3>2. Nature of Service (Disclaimer)</h3>
      <p>
        <strong>
          FootyIQ is an informational and analytical tool. We are NOT a
          bookmaker, betting site, or gambling operator.
        </strong>
      </p>
      <p>
        We provide statistical analysis, AI-driven probabilities, and match
        predictions for informational purposes only. We do not accept bets or
        facilitate gambling transactions.
      </p>
      <p className="text-orange-400">
        <strong>Risk Warning:</strong> Betting involves significant risk. Past
        performance of our tips or AI models does not guarantee future results.
        You acknowledge that any money you bet on third-party platforms is done
        entirely at your own risk. FootyIQ and its developers are not liable for
        any financial losses incurred by following our analysis.
      </p>

      <h3>3. User Accounts</h3>
      <p>
        To access certain features, you must register for an account. You agree
        to:
      </p>
      <ul className="list-disc pl-5 space-y-2 mb-4">
        <li>
          Provide accurate and current information (specifically your M-Pesa
          phone number for payments).
        </li>
        <li>Maintain the security of your password.</li>
        <li>Notify us immediately of any unauthorized use of your account.</li>
      </ul>
      <p>
        <strong>Account Sharing:</strong> Premium accounts are for individual
        use only. Sharing your login credentials with others is strictly
        prohibited and will result in immediate account termination without
        refund.
      </p>

      <h3>4. Subscriptions and Payments</h3>
      <p>
        <strong>Billing:</strong> We offer Daily, Monthly, and Yearly
        subscriptions. Payments are processed securely via{" "}
        <strong>Paystack</strong> (supporting M-Pesa and Card).
      </p>
      <p>
        <strong>Immediate Access:</strong> Upon successful payment, your account
        is instantly upgraded to Premium status, granting access to digital
        content (locked tips, accumulators, AI data).
      </p>
      <p>
        <strong>Refund Policy:</strong> Due to the digital nature of our content
        (immediate access to information),{" "}
        <strong>we do not offer refunds</strong> once a subscription period has
        started, except where required by Kenyan law. Please cancel auto-renewal
        if you do not wish to be charged for the next cycle.
      </p>

      <h3>5. Intellectual Property</h3>
      <p>
        The content on FootyIQ, including the AI algorithms, design, text,
        graphics, and prediction data, is owned by FootyIQ and protected by
        copyright and intellectual property laws.
      </p>
      <p>
        You may not reproduce, distribute, scrape, or create derivative works
        from our content without our express written permission. Automated
        scraping of our data is strictly prohibited.
      </p>

      <h3>6. User Conduct</h3>
      <p>You agree not to use the Service to:</p>
      <ul className="list-disc pl-5 space-y-2 mb-4">
        <li>Resell our premium tips to third parties.</li>
        <li>
          Harass, abuse, or harm another person via our community features.
        </li>
        <li>Upload viruses or malicious code.</li>
        <li>Attempt to bypass our subscription paywalls ("hacking").</li>
      </ul>

      <h3>7. Limitation of Liability</h3>
      <p>
        To the fullest extent permitted by law, FootyIQ shall not be liable for
        any indirect, incidental, special, consequential, or punitive damages,
        including without limitation, loss of profits, data, use, or goodwill,
        resulting from your use of the Service.
      </p>

      <h3>8. Governing Law</h3>
      <p>
        These Terms shall be governed and construed in accordance with the laws
        of <strong>Kenya</strong>, without regard to its conflict of law
        provisions.
      </p>

      <h3>9. Changes to Terms</h3>
      <p>
        We reserve the right to modify or replace these Terms at any time. If a
        revision is material, we will try to provide at least 30 days' notice
        prior to any new terms taking effect. What constitutes a material change
        will be determined at our sole discretion.
      </p>

      <h3>10. Contact Us</h3>
      <p>
        For any questions regarding these Terms, please contact us at:{" "}
        <span className="text-orange-500">support@footyiq.com</span>
      </p>
    </LegalPageLayout>
  );
}
