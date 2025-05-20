"use client"

import { useState } from "react"
import Link from "next/link"

export default function FAQPage() {
  const faqs = [
    {
      question: "What are subliminal affirmations?",
      answer:
        "Subliminal affirmations are positive statements designed to be perceived by your subconscious mind without conscious awareness. Our technology embeds these affirmations within pleasant background music at a volume level that's below conscious hearing threshold, allowing them to bypass critical thinking and directly influence your subconscious mind.",
    },
    {
      question: "How do subliminal audio tracks work?",
      answer:
        "Subliminal audio works by presenting affirmations at a volume level that's below the threshold of conscious perception. While your conscious mind is engaged with the music, the affirmations are being processed by your subconscious mind. Over time, these positive messages can help reshape limiting beliefs and support personal growth.",
    },
    {
      question: "How often should I listen to my subliminal tracks?",
      answer:
        "For optimal results, we recommend listening to your subliminal tracks for at least 30 minutes daily. Consistency is key - regular listening over several weeks typically yields the best results. Many users incorporate listening into their daily routines, such as during meditation, exercise, work, or before sleep.",
    },
    {
      question: "Can I listen while sleeping?",
      answer:
        "Yes! In fact, listening during sleep can be particularly effective as your conscious mind is less active, potentially allowing for deeper subconscious absorption. Our platform offers specially designed tracks with soothing sounds perfect for nighttime listening.",
    },
    {
      question: "How long until I see results?",
      answer:
        "Results vary from person to person. Some users report noticing subtle changes in their thinking patterns or behaviors within a few days, while more significant changes typically develop over 3-8 weeks of consistent listening. Factors such as your openness to change, consistency in listening, and the specific goals you're working on all influence your timeline.",
    },
    {
      question: "Can I create multiple audio tracks?",
      answer:
        "Yes! Depending on your subscription plan, you can create multiple custom audio tracks to address different areas of your life. Our Premium plan allows unlimited track creation, while our Basic plan includes up to 3 custom tracks per month.",
    },
    {
      question: "Are there any side effects?",
      answer:
        "Subliminal audio is generally considered safe with no known negative side effects. Some users report increased dream activity or emotional processing as their subconscious mind integrates the new affirmations. If you have any concerns or experience discomfort, we recommend pausing use and consulting with a healthcare professional.",
    },
    {
      question: "Can I customize the background music?",
      answer:
        "Our platform offers a variety of background sounds including ambient music, nature sounds, binaural beats, and white noise. You can select the background that resonates most with you or suits your listening environment.",
    },
    {
      question: "What subscription plans do you offer?",
      answer: (
        <>
          We offer several subscription options to meet different needs:
          <ul className="list-disc pl-5 mt-2">
            <li>
              <strong>Free Plan:</strong> Create 1 basic subliminal track with limited customization options
            </li>
            <li>
              <strong>Basic Plan ($9.99/month):</strong> Create up to 3 custom tracks per month with standard
              customization
            </li>
            <li>
              <strong>Premium Plan ($19.99/month):</strong> Unlimited track creation with advanced customization options
            </li>
          </ul>
          Visit our{" "}
          <Link href="/pricing" className="text-primary-600 hover:underline">
            pricing page
          </Link>{" "}
          for more details.
        </>
      ),
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer:
        "Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period. We don't lock you into long-term contracts.",
    },
    {
      question: "Is my personal information secure?",
      answer:
        "We take data privacy seriously. All personal information and custom affirmations are encrypted and securely stored. We never share your data with third parties. For more details, please review our Privacy Policy.",
    },
    {
      question: "Can I download my audio tracks?",
      answer:
        "Yes! All subscription plans allow you to download your custom subliminal tracks as MP3 files, so you can listen offline on any device.",
    },
  ]

  const [openIndex, setOpenIndex] = useState(null)

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex justify-center items-center">
      <div className="container mx-auto px-4 py-16 w-full">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-2 text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-center mb-12 text-gray-600 dark:text-gray-300">
            Everything you need to know about Sublmnl and subliminal audio
          </p>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-primary-500"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={openIndex === index}
                >
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{faq.question}</h3>
                  <svg
                    className={`w-5 h-5 text-gray-500 dark:text-gray-300 transition-transform duration-200 ${openIndex === index ? "transform rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {openIndex === index && (
                  <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
                    <div className="text-gray-700 dark:text-gray-300">
                      {typeof faq.answer === "string" ? <p>{faq.answer}</p> : faq.answer}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Still have questions?</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">We're here to help! Reach out to our support team.</p>
            <Link
              href="/contact"
              className="inline-block px-6 py-3 bg-secondary text-white font-medium rounded-lg hover:bg-secondary-700 transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

