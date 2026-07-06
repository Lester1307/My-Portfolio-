import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Github, Linkedin, Mail, MapPin, Send, AlertCircle } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error');
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    setStatus('submitting');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Failed to connect to the server.');
    }
  };

  const contactDetails = [
    {
      icon: Mail,
      label: 'Email Address',
      value: 'dhruveshpatel2003@gmail.com',
      href: 'mailto:dhruveshpatel2003@gmail.com'
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      value: 'linkedin.com/in/dhruvesh-patel',
      href: 'https://linkedin.com'
    },
    {
      icon: Github,
      label: 'GitHub Profile',
      value: 'github.com/dhruvesh-patel',
      href: 'https://github.com'
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Gujarat, India',
      href: null
    }
  ];

  return (
    <section id="contact" className="bg-slate-50/50 py-16 sm:py-24 border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="text-center md:text-left mb-12 space-y-2">
          <h2 className="font-sans font-bold text-3xl tracking-tight text-slate-900 sm:text-4xl">
            Get In Touch
          </h2>
          <p className="max-w-2xl text-sm text-slate-500 leading-relaxed font-normal">
            Have an internship opportunity, project idea, or just want to connect? Shoot me a message!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details Cards */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="font-sans font-bold text-xl text-slate-900 mb-4">Contact Details</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {contactDetails.map((detail, index) => {
                const Icon = detail.icon;
                const CardContent = (
                  <div className="flex items-center space-x-4 rounded-xl border border-slate-200 bg-white p-4 hover:border-blue-400 hover:shadow-xs transition-all duration-200">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="overflow-hidden">
                      <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">{detail.label}</span>
                      <span className="block text-xs font-mono font-medium text-slate-700 truncate mt-0.5">{detail.value}</span>
                    </div>
                  </div>
                );

                return detail.href ? (
                  <a 
                    key={index} 
                    href={detail.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    {CardContent}
                  </a>
                ) : (
                  <div key={index}>{CardContent}</div>
                );
              })}
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            <h3 className="font-sans font-bold text-xl text-slate-900 mb-6">Send Me a Message</h3>

            {status === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-xl border border-green-200 bg-green-50/50 p-6 text-center space-y-4 animate-fade-in"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-lg text-slate-900">Message Sent Successfully!</h4>
                  <p className="text-xs text-slate-500 mt-1">Thank you for reaching out. I will respond to your email shortly.</p>
                </div>
                <button
                  onClick={() => setStatus('idle')}
                  className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-sans font-semibold px-5 py-2.5 text-xs transition-colors duration-200 cursor-pointer shadow-xs"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name Input */}
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="block text-xs font-semibold text-slate-600">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:bg-white transition-colors"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="block text-xs font-semibold text-slate-600">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                {/* Subject Input */}
                <div className="space-y-1.5">
                  <label htmlFor="subject" className="block text-xs font-semibold text-slate-600">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Project inquiry, collaboration, etc."
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  />
                </div>

                {/* Message Input */}
                <div className="space-y-1.5">
                  <label htmlFor="message" className="block text-xs font-semibold text-slate-600">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe your project, ideas, or questions..."
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:bg-white transition-colors resize-none"
                  />
                </div>

                {/* Error Banner */}
                {status === 'error' && (
                  <div className="flex items-center space-x-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-lg bg-blue-600 hover:bg-blue-700 px-5 py-3 text-xs font-sans font-bold uppercase tracking-wider text-white transition-all duration-200 disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {status === 'submitting' ? (
                    <>
                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
