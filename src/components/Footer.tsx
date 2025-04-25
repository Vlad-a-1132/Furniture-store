'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';

const categories = [
  { name: 'Кровати', href: '/catalog?category=beds' },
  { name: 'Матрасы', href: '/catalog?category=mattresses' },
  { name: 'Диваны', href: '/catalog?category=sofas' },
  { name: 'Кресла', href: '/catalog?category=armchairs' },
  { name: 'Пуфы', href: '/catalog?category=poufs' },
  { name: 'Банкетки', href: '/catalog?category=benches' },
  { name: 'Шкафы', href: '/catalog?category=wardrobes' },
  { name: 'Стеллажи', href: '/catalog?category=shelving' },
  { name: 'Комоды', href: '/catalog?category=dressers' },
  { name: 'Тумбы', href: '/catalog?category=nightstands' },
  { name: 'Столы', href: '/catalog?category=tables' },
  { name: 'Стулья', href: '/catalog?category=chairs' },
  { name: 'Вешалки', href: '/catalog?category=hangers' },
];

const companyLinks = [
  { name: 'О компании', href: '/about' },
  { name: 'Доставка', href: '/delivery' },
  { name: 'Оплата', href: '/payment' },
  { name: 'Гарантия', href: '/warranty' },
  { name: 'Возврат', href: '/returns' },
  { name: 'Контакты', href: '/contacts' },
];

const contacts = [
  {
    icon: <Phone className="w-5 h-5" />,
    text: '+7 (800) 123-45-67',
    href: 'tel:+78001234567',
  },
  {
    icon: <Mail className="w-5 h-5" />,
    text: 'info@mebelstore.ru',
    href: 'mailto:info@mebelstore.ru',
  },
  {
    icon: <MapPin className="w-5 h-5" />,
    text: 'г. Москва, ул. Примерная, д. 1',
    href: 'https://maps.google.com',
  },
  {
    icon: <Clock className="w-5 h-5" />,
    text: 'Пн-Вс: 10:00 - 20:00',
    href: '/contacts',
  },
];

const socials = [
  {
    name: 'VK',
    icon: '/vk.svg',
    href: 'https://vk.com',
  },
  {
    name: 'Telegram',
    icon: '/telegram.svg',
    href: 'https://t.me',
  },
  {
    name: 'WhatsApp',
    icon: '/whatsapp.svg',
    href: 'https://wa.me/78001234567',
  },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет логика подписки на рассылку
    setSubscriptionStatus('success');
    setTimeout(() => setSubscriptionStatus('idle'), 3000);
    setEmail('');
  };

  return (
    <footer className="bg-white border-t border-olive/10">
      {/* Блок подписки на рассылку */}
      <div className="bg-beige py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-light text-graphite mb-4">
              Подпишитесь на нашу рассылку
            </h2>
            <p className="text-graphite/70 mb-8">
              Будьте в курсе новых коллекций, специальных предложений и акций
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Введите ваш email"
                className="flex-1 px-4 py-3 rounded-xl border border-olive/30 
                focus:outline-none focus:ring-2 focus:ring-olive/30 bg-white"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-graphite text-white rounded-xl 
                hover:bg-olive transition-colors duration-300 flex items-center gap-2"
              >
                <span>Подписаться</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
            {subscriptionStatus === 'success' && (
              <p className="text-olive mt-4 animate-fade-in">
                Спасибо за подписку! Мы отправили письмо для подтверждения.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Основной контент футера */}
      <div className="bg-graphite text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Контакты */}
            <div>
              <h3 className="text-xl font-medium mb-6">Контакты</h3>
              <div className="space-y-4">
                {contacts.map((contact, index) => (
                  <a
                    key={index}
                    href={contact.href}
                    target={contact.href.startsWith('http') ? '_blank' : undefined}
                    rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-3 text-white/80 hover:text-white 
                    transition-colors duration-300"
                  >
                    {contact.icon}
                    <span>{contact.text}</span>
                  </a>
                ))}
              </div>
              {/* Социальные сети */}
              <div className="flex gap-4 mt-6">
                {socials.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full 
                    bg-white/10 hover:bg-white/20 transition-colors duration-300"
                  >
                    <div className="relative w-5 h-5">
                      <Image
                        src={social.icon}
                        alt={social.name}
                        fill
                        className="text-white"
                      />
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Информация */}
            <div>
              <h3 className="text-xl font-medium mb-6">Информация</h3>
              <ul className="space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-white/80 hover:text-white transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Категории */}
            <div className="lg:col-span-2">
              <h3 className="text-xl font-medium mb-6">Категории</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    className="text-white/80 hover:text-white transition-colors duration-300"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Нижняя часть футера */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-white/60">
                © 2024 MebelStore. Все права защищены.
              </p>
              <div className="flex gap-6 text-sm text-white/60">
                <Link href="/privacy" className="hover:text-white transition-colors duration-300">
                  Политика конфиденциальности
                </Link>
                <Link href="/terms" className="hover:text-white transition-colors duration-300">
                  Пользовательское соглашение
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 