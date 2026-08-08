"use client";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';


export default function ContactPage() {


  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-bg-primary pt-20 sm:pt-24 md:pt-28 transition-colors duration-300">
        <ContactForm />
      </main>

      <Footer />
    </>
  );
}
