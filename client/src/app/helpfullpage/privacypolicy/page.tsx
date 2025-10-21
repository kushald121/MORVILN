"use client";
import React, { useState } from "react";
import {
  ShieldCheck,
  Users,
  LockKeyhole,
  Globe,
  Baby,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
} from "lucide-react";


const AccordionItem = ({
  id,
  title,
  icon: Icon,
  children,
  isOpen,
  onToggle,
}: {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: (id: string) => void;
}) => {
  return (
    <div className="border-b border-border">
      <dt>
        <button
          onClick={() => onToggle(id)}
          className="flex w-full items-center justify-between py-6 text-left text-foreground"
        >
          <div className="flex items-center gap-x-4">
            <Icon className="h-7 w-7 text-primary" aria-hidden="true" />
            <span className="text-lg font-semibold leading-7">{title}</span>
          </div>
          <span className="ml-6 flex h-7 items-center">
            <ChevronDown
              className={`h-6 w-6 transform text-muted-foreground transition-transform duration-300 ${
                isOpen ? "-rotate-180" : "rotate-0"
              }`}
              aria-hidden="true"
            />
          </span>
        </button>
      </dt>
      <dd
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-[1000px] pb-6" : "max-h-0"
        }`}
      >
        <div className="prose prose-slate max-w-none text-muted-foreground prose-strong:text-foreground prose-a:text-primary hover:prose-a:text-primary/80">
          {children}
        </div>
      </dd>
    </div>
  );
};

const PrivacyPolicy = () => {
  const [openId, setOpenId] = useState<string | null>("introduction");

  const handleToggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const policySections = [
    {
      id: "introduction",
      title: "Our Commitment to Your Privacy",
      icon: ShieldCheck,
      content: (
        <>
          <p>
            This Privacy Policy describes how Ajeeb Collective (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or
            &ldquo;our&rdquo;) collects, uses, and discloses your personal information when
            you visit, use our services, or make a purchase from
            ajeebcollective.com.
          </p>
          <p>
            By using and accessing any of our Services, you agree to the
            collection and use of your information as described here. If you do
            not agree, please do not use our Services. We may update this policy
            from time to time; we will post the revised policy and update the
            &ldquo;Last updated&rdquo; date.
          </p>
        </>
      ),
    },
    {
      id: "collect-and-use",
      title: "How We Collect & Use Your Information",
      icon: Users,
      content: (
        <>
          <h4>Information You Provide Directly</h4>
          <p>
            This includes basic contact details, order and account information,
            and any communications you send to customer support.
          </p>
          <h4>Information from Cookies</h4>
          <p>
            We use cookies and similar technologies to automatically collect
            Usage Data, like your device information, IP address, and how you
            interact with our Services.
          </p>
          <h4>How We Use It</h4>
          <ul>
            <li>
              <strong>To Provide Services:</strong> Fulfilling orders, managing
              your account, and processing payments.
            </li>
            <li>
              <strong>Marketing:</strong> Sending you promotions and tailoring
              ads to your interests.
            </li>
            <li>
              <strong>Security:</strong> Preventing fraud and protecting our
              platform.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "disclosure",
      title: "How We Disclose Your Information",
      icon: LockKeyhole,
      content: (
        <p>
          We may share your information with trusted third parties who perform
          services on our behalf (like payment processors and shipping
          partners), with marketing partners like Shopify, or within our
          corporate group. We also disclose information if required for a legal
          obligation or business transaction like a merger.
        </p>
      ),
    },
    {
      id: "international-users",
      title: "International Users",
      icon: Globe,
      content: (
        <p>
          Your personal information may be transferred, stored, and processed
          outside the country you live in, including the United States. When we
          transfer your information out of Europe, we rely on recognized
          transfer mechanisms like the European Commission&rsquo;s Standard
          Contractual Clauses.
        </p>
      ),
    },
    {
      id: "childrens-data",
      title: "Children&rsquo;s Data",
      icon: Baby,
      content: (
        <p>
          Our Services are not intended for children, and we do not knowingly
          collect personal information from them. If you are a parent or
          guardian and believe your child has provided us with their
          information, please contact us to request its deletion.
        </p>
      ),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      

      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative isolate overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Your Privacy, Protected
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              We believe in transparency. Here&rsquo;s a clear breakdown of how we
              handle your data to provide you with the best possible experience.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Last Updated: November 20, 2024
            </p>
          </div>
          <div className="absolute inset-x-0 top-0 -z-10 flex transform-gpu justify-center overflow-hidden blur-3xl">
            <div
              className="aspect-[1500/1036] w-[90rem] flex-none bg-gradient-to-r from-[#00c4ff] to-[#34d399] opacity-25"
              style={{
                clipPath:
                  "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 1.3% 63.9%, 12.9% 24.9%, 27.2% 38.6%, 73.6% 51.7%)",
              }}
            />
          </div>
        </div>

        {/* Accordion Policy Section */}
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <dl className="space-y-2">
            {policySections.map((section) => (
              <AccordionItem
                key={section.id}
                id={section.id}
                title={section.title}
                icon={section.icon}
                isOpen={openId === section.id}
                onToggle={handleToggle}
              >
                {section.content}
              </AccordionItem>
            ))}
          </dl>
        </div>

        {/* Contact Section */}
        <div className="mx-auto my-24 max-w-4xl px-6 sm:my-32 lg:px-8">
          <div className="rounded-2xl bg-card p-8 ring-1 ring-border shadow-xl border">
            <h2 className="text-2xl font-bold tracking-tight text-card-foreground text-center">
              Have Questions?
            </h2>
            <p className="mt-2 text-center text-muted-foreground">
              If you&rsquo;d like to exercise your rights or have questions about our
              privacy practices, please contact us.
            </p>
            <div className="mt-8 space-y-5 text-muted-foreground">
              <div className="flex items-center gap-4">
                <Phone className="h-6 w-6 text-primary flex-shrink-0" />
                <span>+91 315 2439846</span>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="h-6 w-6 text-primary flex-shrink-0" />
                <span>rachnacollective@gmail.com</span>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <span>
                  1234 Fashion St, Style City, SC 12345
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default PrivacyPolicy;
