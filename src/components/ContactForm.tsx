"use client";

import { useState } from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { LinkedInIcon, InstagramIcon, WhatsAppIcon } from '@/components/Icons';
import AslanLogo from '@/components/AslanLogo';

export default function ContactForm() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'success' | 'error' | 'loading' | null>(null);

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    if (!formData.name.trim()) tempErrors.name = t('contact.formName').replace(' *', '') + ' zorunludur.';
    if (!formData.phone.trim()) tempErrors.phone = t('contact.formPhone').replace(' *', '') + ' zorunludur.';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      tempErrors.email = t('contact.formEmail').replace(' *', '') + ' zorunludur.';
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = 'Geçersiz e-posta adresi.';
    }

    if (!formData.message.trim()) tempErrors.message = t('contact.formMessage').replace(' *', '') + ' zorunludur.';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setStatus('loading');
      setTimeout(() => {
        setStatus('success');
        setFormData({
          name: '',
          phone: '',
          email: '',
          subject: '',
          message: ''
        });
      }, 1000);
    } else {
      setStatus('error');
    }
  };
  return (
    <section id="contact" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-bg-primary relative border-t border-navy-primary/10">
      {/* Red Thread vertical detail */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-16 bg-navy-primary/20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <span className="text-[0.65rem] font-sans font-semibold tracking-[0.25em] text-navy-primary uppercase block mb-3">
            {t('contact.badge')}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-text-primary mb-4 relative inline-block pb-3 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-12 after:h-[1px] after:bg-navy-primary">
            {t('contact.title')}
          </h2>
          <p className="text-sm text-text-secondary max-w-xl mx-auto mt-4 font-light leading-relaxed px-2 sm:px-0">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-stretch">
          {/* Contact Details Column */}
          <div className="flex flex-col gap-6 justify-between h-full">
            <div className="flex flex-col gap-4">
              {/* Phone Card */}
              <div className="p-5 bg-white/[0.02] dark:bg-white/[0.03] border border-stone-200/60 dark:border-white/10 rounded-2xl hover:border-navy-primary/40 dark:hover:border-navy-primary/50 transition-all duration-300 shadow-sm flex gap-4 items-start">
                <div className="w-10 h-10 bg-navy-primary/5 dark:bg-navy-primary/10 text-navy-primary dark:text-navy-light flex items-center justify-center rounded-xl flex-shrink-0 transition-colors">
                  <Phone size={18} />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-xs tracking-widest text-text-primary dark:text-stone-300 uppercase mb-1.5">{t('contact.phone')}</h4>
                  <p className="text-sm font-semibold text-text-secondary dark:text-white">0546 263 8990</p>
                  <p className="text-xs text-text-muted mt-1">{t('contact.phoneSub')}</p>
                </div>
              </div>

              {/* Email Card */}
              <div className="p-5 bg-white/[0.02] dark:bg-white/[0.03] border border-stone-200/60 dark:border-white/10 rounded-2xl hover:border-navy-primary/40 dark:hover:border-navy-primary/50 transition-all duration-300 shadow-sm flex gap-4 items-start">
                <div className="w-10 h-10 bg-navy-primary/5 dark:bg-navy-primary/10 text-navy-primary dark:text-navy-light flex items-center justify-center rounded-xl flex-shrink-0 transition-colors">
                  <Mail size={18} />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-xs tracking-widest text-text-primary dark:text-stone-300 uppercase mb-1.5">{t('contact.email')}</h4>
                  <p className="text-sm font-semibold text-text-secondary dark:text-white">info@nedimaslan.av.tr</p>
                </div>
              </div>

              {/* Address Card */}
              <div className="p-5 bg-white/[0.02] dark:bg-white/[0.03] border border-stone-200/60 dark:border-white/10 rounded-2xl hover:border-navy-primary/40 dark:hover:border-navy-primary/50 transition-all duration-300 shadow-sm flex gap-4 items-start">
                <div className="w-10 h-10 bg-navy-primary/5 dark:bg-navy-primary/10 text-navy-primary dark:text-navy-light flex items-center justify-center rounded-xl flex-shrink-0 transition-colors">
                  <MapPin size={18} />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-xs tracking-widest text-text-primary dark:text-stone-300 uppercase mb-1.5">{t('contact.address')}</h4>
                  <p className="text-sm font-semibold text-text-secondary dark:text-white leading-relaxed">
                    Göztepe Mahallesi, Bosna Caddesi No: 24/2,<br />
                    Kemeroğulları İş Merkezi, Bağcılar / İstanbul
                  </p>
                </div>
              </div>

              {/* Office Hours Card */}
              <div className="p-5 bg-white/[0.02] dark:bg-white/[0.03] border border-stone-200/60 dark:border-white/10 rounded-2xl hover:border-navy-primary/40 dark:hover:border-navy-primary/50 transition-all duration-300 shadow-sm flex gap-4 items-start">
                <div className="w-10 h-10 bg-navy-primary/5 dark:bg-navy-primary/10 text-navy-primary dark:text-navy-light flex items-center justify-center rounded-xl flex-shrink-0 transition-colors">
                  <Clock size={18} />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-xs tracking-widest text-text-primary dark:text-stone-300 uppercase mb-1.5">{t('contact.hours')}</h4>
                  <p className="text-sm font-semibold text-text-secondary dark:text-white">{t('contact.hoursWeekdays')}</p>
                  <p className="text-xs text-text-muted mt-1">{t('contact.hoursWeekend')}</p>
                </div>
              </div>

              {/* Social Media Card */}
              <div className="p-5 bg-white/[0.02] dark:bg-white/[0.03] border border-stone-200/60 dark:border-white/10 rounded-2xl hover:border-navy-primary/40 dark:hover:border-navy-primary/50 transition-all duration-300 shadow-sm flex gap-4 items-start">
                <div className="w-10 h-10 bg-navy-primary/5 dark:bg-navy-primary/10 text-navy-primary dark:text-navy-light flex items-center justify-center rounded-xl flex-shrink-0 transition-colors">
                  <LinkedInIcon size={18} />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-xs tracking-widest text-text-primary dark:text-stone-300 uppercase mb-1.5">{t('contact.social')}</h4>
                  <div className="flex gap-3 mt-2">
                    <a
                      href="https://www.linkedin.com/in/av-nedim-aslan-a5bb49200/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-navy-primary/5 dark:bg-white/5 hover:bg-navy-primary hover:text-white dark:hover:bg-navy-primary dark:hover:text-white transition-all duration-300 flex items-center justify-center text-navy-primary dark:text-navy-light"
                      aria-label="LinkedIn"
                    >
                      <LinkedInIcon size={16} />
                    </a>
                    <a
                      href="https://www.instagram.com/av.nedimaslan?utm_source=qr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-navy-primary/5 dark:bg-white/5 hover:bg-navy-primary hover:text-white dark:hover:bg-navy-primary dark:hover:text-white transition-all duration-300 flex items-center justify-center text-navy-primary dark:text-navy-light"
                      aria-label="Instagram"
                    >
                      <InstagramIcon size={16} />
                    </a>
                    <a
                      href="https://wa.me/qr/NIZTP7IGZ24SP1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-navy-primary/5 dark:bg-white/5 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white transition-all duration-300 flex items-center justify-center text-navy-primary dark:text-navy-light"
                      aria-label="WhatsApp"
                    >
                      <WhatsAppIcon size={16} />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-64 border border-stone-200/60 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm flex-grow min-h-[250px] mt-4 relative group">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3008.5452800688086!2d28.828558276139923!3d41.057072071343754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caa52865179fd9%3A0x9bc77299faf6b7b6!2zS2VtZXJvxJ91bGxhcsSxIMSwxZ8gTWVya2V6aQ!5e0!3m2!1str!2str!4v1786206157978!5m2!1str!2str"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps Location"
                className="pointer-events-none"
              ></iframe>

              {/* Custom Pin Overlay with Lion Logo */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-20 mt-[-20px]">
                {/* Glowing pulse ring */}
                <div className="absolute w-12 h-12 rounded-full bg-navy-primary/25 animate-ping"></div>

                {/* Pin Container */}
                <div className="relative flex items-center justify-center w-11 h-11 rounded-full bg-navy-primary border-2 border-white dark:border-stone-900 shadow-[0_4px_15px_rgba(0,0,0,0.35)]">
                  <AslanLogo size={24} className="text-white" />

                  {/* Pin point tail */}
                  <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3.5 h-3.5 rotate-45 bg-navy-primary border-r-2 border-b-2 border-white dark:border-stone-900"></div>
                </div>
              </div>

              {/* Clickable Overlay Link to Google Maps */}
              <a
                href="https://www.google.com/maps/search/?api=1&query=G%C3%B6ztepe+Mahallesi%2C+Bosna+Caddesi+No%3A+24%2F2%2C+Kemero%C4%9Fullar%C4%B1+%C4%B0%C5%9F+Merkezi%2C+Ba%C4%9Fc%C4%B1lar+%2F+%C4%B0stanbul"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 bg-transparent z-10 cursor-pointer"
                aria-label="Google Haritalarda Aç"
              >
                {/* Hover Indicator */}
                <div className="absolute bottom-4 right-4 bg-bg-primary/95 dark:bg-stone-950/95 backdrop-blur-md border border-stone-200/60 dark:border-white/10 px-3 py-1.5 rounded-xl shadow-lg text-[0.6rem] font-sans font-bold tracking-widest text-text-primary uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Haritada Aç
                </div>
              </a>
            </div>
          </div>

          {/* Form Column */}
          <div className="p-5 sm:p-6 md:p-8 lg:p-10 border border-stone-200/60 dark:border-white/10 bg-white/[0.01] dark:bg-white/[0.02] backdrop-blur-sm shadow-sm relative rounded-2xl flex flex-col justify-between h-full">
            <div className="absolute top-0 right-0 w-8 h-[1px] bg-navy-primary/30 dark:bg-navy-primary/50"></div>
            <div className="absolute top-0 right-0 w-[1px] h-8 bg-navy-primary/30 dark:bg-navy-primary/50"></div>

            <div>
              <h3 className="text-xl font-serif font-bold text-text-primary mb-2">{t('contact.formTitle')}</h3>
              <p className="text-xs text-text-secondary font-light mb-8">{t('contact.formSub')}</p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-[0.65rem] font-sans font-bold tracking-widest text-text-primary dark:text-stone-300 uppercase mb-2">{t('contact.formName')}</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-xs border border-stone-200 dark:border-white/10 bg-white/50 dark:bg-white/[0.02] text-text-primary rounded-xl focus:outline-none focus:border-navy-primary dark:focus:border-navy-primary focus:ring-1 focus:ring-navy-primary transition-all duration-200"
                    />
                    {errors.name && <span className="text-[0.65rem] text-red-600 dark:text-red-400 mt-1 block">{errors.name}</span>}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-[0.65rem] font-sans font-bold tracking-widest text-text-primary dark:text-stone-300 uppercase mb-2">{t('contact.formPhone')}</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="0 (555) 000 00 00"
                      className="w-full px-4 py-3 text-xs border border-stone-200 dark:border-white/10 bg-white/50 dark:bg-white/[0.02] text-text-primary rounded-xl focus:outline-none focus:border-navy-primary dark:focus:border-navy-primary focus:ring-1 focus:ring-navy-primary transition-all duration-200"
                    />
                    {errors.phone && <span className="text-[0.65rem] text-red-700 mt-1 block">{errors.phone}</span>}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-[0.65rem] font-sans font-bold tracking-widest text-text-primary dark:text-stone-300 uppercase mb-2">{t('contact.formEmail')}</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-xs border border-stone-200 dark:border-white/10 bg-white/50 dark:bg-white/[0.02] text-text-primary rounded-xl focus:outline-none focus:border-navy-primary dark:focus:border-navy-primary focus:ring-1 focus:ring-navy-primary transition-all duration-200"
                  />
                  {errors.email && <span className="text-[0.65rem] text-red-700 mt-1 block">{errors.email}</span>}
                </div>

                <div>
                  <label htmlFor="subject" className="block text-[0.65rem] font-sans font-bold tracking-widest text-text-primary dark:text-stone-300 uppercase mb-2">{t('contact.formSubject')}</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-xs border border-stone-200 dark:border-white/10 bg-white/50 dark:bg-white/[0.02] text-text-primary rounded-xl focus:outline-none focus:border-navy-primary dark:focus:border-navy-primary focus:ring-1 focus:ring-navy-primary transition-all duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-[0.65rem] font-sans font-bold tracking-widest text-text-primary dark:text-stone-300 uppercase mb-2">{t('contact.formMessage')}</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 text-xs border border-stone-200 dark:border-white/10 bg-white/50 dark:bg-white/[0.02] text-text-primary rounded-xl focus:outline-none focus:border-navy-primary dark:focus:border-navy-primary focus:ring-1 focus:ring-navy-primary transition-all duration-200 resize-y"
                  ></textarea>
                  {errors.message && <span className="text-[0.65rem] text-red-700 mt-1 block">{errors.message}</span>}
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-3.5 bg-navy-primary text-white hover:bg-navy-secondary font-sans font-semibold tracking-widest text-xs uppercase transition-all duration-300 rounded-xl cursor-pointer disabled:opacity-50 mt-2 shadow-sm hover:shadow-md"
                >
                  {status === 'loading' ? t('contact.formSending') : t('contact.formSend')}
                </button>

                {status === 'success' && (
                  <div className="p-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold text-center rounded-xl mt-2">
                    {t('contact.formSuccess')}
                  </div>
                )}

                {status === 'error' && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/30 text-xs font-semibold text-center rounded-xl mt-2">
                    {t('contact.formError')}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
