"use client"
import React, { useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    comment: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // Add your form submission logic here
  };

  // Subscribe form state
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subError, setSubError] = useState('');

  const handleSubscribe = () => {
    setSubError('');
    const email = subscribeEmail.trim();
    // simple email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setSubError('Please enter an email address');
      return;
    }
    if (!emailRegex.test(email)) {
      setSubError('Please enter a valid email address');
      return;
    }

    // Simulate submission (replace with real API call if needed)
    console.log('Subscribed:', email);
    setIsSubscribed(true);
    setSubscribeEmail('');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header/Navigation */}
      
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-8 py-16">
        <h1 className="text-5xl font-serif text-center mb-16">Contact</h1>

        <div className="space-y-6">
          {/* Name and Email Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
               className="w-full px-4 py-3 bg-[#C9C9C9] border-2 border-white rounded-md text-black placeholder-gray-600 focus:outline-none focus:border-gray-300 transition-colors 
                hover:bg-black hover:text-white focus:bg-black focus:text-white" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
                 className="w-full px-4 py-3 bg-[#C9C9C9] border-2 border-white rounded-md text-black placeholder-gray-600 focus:outline-none focus:border-gray-300 transition-colors 
                hover:bg-black hover:text-white focus:bg-black focus:text-white"
            />
          </div>

          {/* Phone */}
          <input
            type="tel"
            name="phone"
            placeholder="Phone number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-[#C9C9C9] border-2 border-white rounded-md text-black placeholder-gray-600 focus:outline-none focus:border-gray-300 transition-colors 
                hover:bg-black hover:text-white focus:bg-black focus:text-white"
          />

          {/* Comment */}
          <textarea
            name="comment"
            placeholder="Comments"
            value={formData.comment}
            onChange={handleChange}
            rows={8}
             className="w-full px-4 py-3 bg-[#C9C9C9] border-2 border-white rounded-md text-black placeholder-gray-600 focus:outline-none focus:border-gray-300 transition-colors 
                hover:bg-black hover:text-white focus:bg-black focus:text-white"
          />

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="px-8 py-3 bg-black text-white border-2 border-white hover:bg-white hover:text-black transition-colors font-medium"
          >
            Submit
          </button>
        </div>
      </main>

      {/* Join the Club Section */}
      <section className="max-w-6xl mx-auto px-8 py-20 mt-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-4xl font-serif mb-3">Join the club</h2>
          </div>

          <div className="w-full md:w-auto md:flex-1 md:max-w-xl">
            <div className="relative">
              <input
                type="email"
                placeholder="Email address"
                value={subscribeEmail}
                onChange={(e) => setSubscribeEmail(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSubscribe(); } }}
                className="w-full rounded-full px-6 py-3 bg-[#C9C9C9] text-black placeholder-gray-600 focus:outline-none focus:ring-0"
              />

              <button
                onClick={handleSubscribe}
                aria-label="Subscribe"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white text-black rounded-md flex items-center justify-center shadow"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {isSubscribed && (
              <div className="mt-4 flex items-center gap-2 text-sm text-green-500">
                <Check className="w-4 h-4" />
                <span>Thanks for subscribing!</span>
              </div>
            )}

            {subError && (
              <p className="mt-3 text-sm text-red-500">{subError}</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}