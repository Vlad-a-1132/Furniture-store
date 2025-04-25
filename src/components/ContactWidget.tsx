'use client';

import { useState } from 'react';
import { Phone, MessageCircle, X } from 'lucide-react';
import Image from 'next/image';

const contacts = [
  {
    id: 'phone',
    icon: <Phone className="w-6 h-6" />,
    label: 'Телефон',
    href: 'tel:+78001234567',
    color: 'bg-green-500',
  },
  {
    id: 'telegram',
    icon: <div className="w-6 h-6 relative"><Image src="/telegram.svg" fill alt="Telegram" className="text-white" /></div>,
    label: 'Telegram',
    href: 'https://t.me/yourstore',
    color: 'bg-[#229ED9]',
  },
  {
    id: 'whatsapp',
    icon: <div className="w-6 h-6 relative"><Image src="/whatsapp.svg" fill alt="WhatsApp" className="text-white" /></div>,
    label: 'WhatsApp',
    href: 'https://wa.me/78001234567',
    color: 'bg-[#25D366]',
  },
  {
    id: 'vk',
    icon: <div className="w-6 h-6 relative"><Image src="/vk.svg" fill alt="VK" className="text-white" /></div>,
    label: 'VKontakte',
    href: 'https://vk.com/yourstore',
    color: 'bg-[#0077FF]',
  },
];

export default function ContactWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Кнопки контактов */}
      <div className={`flex flex-col items-end space-y-4 mb-4 transition-all duration-300 ${
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      }`}>
        {contacts.map((contact) => (
          <a
            key={contact.id}
            href={contact.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-between gap-3 ${contact.color} text-white px-6 py-3 rounded-full 
            min-w-[180px] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 
            hover:-translate-y-1`}
          >
            <span className="text-sm font-medium">
              {contact.label}
            </span>
            {contact.icon}
          </a>
        ))}
      </div>

      {/* Основная кнопка */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full bg-olive text-white shadow-lg 
        hover:shadow-xl transition-all duration-300 flex items-center justify-center 
        transform hover:scale-105 ${isOpen ? 'rotate-45' : 'hover:rotate-12'}`}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>
    </div>
  );
} 