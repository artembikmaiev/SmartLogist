// Головна сторінка веб-додатка SmartLogist, що слугує лендінгом для нових користувачів.
import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Roles from '@/components/landing/Roles';
import CTA from '@/components/landing/CTA';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <Roles />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
