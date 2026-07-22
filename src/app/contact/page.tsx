'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Contact from '../../components/Contact';
import { useApp } from '../../providers/AppProvider';

export default function ContactPage() {
  const router = useRouter();
  const { settings, addContactMessage } = useApp();

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsgText, setContactMsgText] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMsgText) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      name: contactName,
      email: contactEmail,
      message: contactMsgText,
      dateCreated: new Date().toISOString(),
    };

    addContactMessage(newMsg);
    setContactSubmitted(true);
    setContactName('');
    setContactEmail('');
    setContactMsgText('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      <Header currentPage="contact" />
      <main className="flex-grow pt-20 sm:pt-24 px-4 sm:px-6 max-w-4xl mx-auto w-full pb-16">
        <Contact
          shopPhone={settings.shopPhone}
          shopEmail={settings.shopEmail}
          shopAddress={settings.shopAddress}
          shopFacebook={settings.shopFacebook}
          shopInstagram={settings.shopInstagram}
          contactName={contactName}
          setContactName={setContactName}
          contactEmail={contactEmail}
          setContactEmail={setContactEmail}
          contactMsgText={contactMsgText}
          setContactMsgText={setContactMsgText}
          contactSubmitted={contactSubmitted}
          onSubmitContact={handleSubmitContact}
          onNavigate={(page) => router.push(`/${page}`)}
        />
      </main>
      <Footer />
    </div>
  );
}
