"use client"
import React from "react";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const ContactUs = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow flex items-center justify-center py-16">
        <div className="bg-card rounded-xl shadow-lg p-8 max-w-md w-full border border-border">
          <h1 className="text-2xl font-bold text-card-foreground mb-6 text-center">
            Contact MORVILN Collective
          </h1>

          <div className="space-y-5 text-muted-foreground">
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary" />
              <span>0315 2439846</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <span>morvilncollective@gmail.com</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary" />
              <span>
                1234 Fashion St, Style City, SC 12345
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <span>Operational Hours: 12pm — 9pm</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactUs;
