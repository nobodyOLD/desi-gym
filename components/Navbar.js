'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Dumbbell } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-gray-950/95 border-b border-gray-800 shadow-lg shadow-black/30 backdrop-blur-md py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <Dumbbell className="h-8 w-8 text-orange-500" />
              <span className="text-xl font-black tracking-wider text-white">
                DESI <span className="text-orange-500">GYM</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-gray-300 hover:text-orange-500 transition-colors duration-200"
            >
              How It Works
            </Link>
            <Link
              href="#goals"
              className="text-sm font-medium text-gray-300 hover:text-orange-500 transition-colors duration-200"
            >
              Workout
            </Link>
            <Link
              href="#nutrition"
              className="text-sm font-medium text-gray-300 hover:text-orange-500 transition-colors duration-200"
            >
              Nutrition
            </Link>
            <Link
              href="#science"
              className="text-sm font-medium text-gray-300 hover:text-orange-500 transition-colors duration-200"
            >
              Science
            </Link>
          </div>

          {/* CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/dashboard/profile"
              className="text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 px-6 py-2.5 rounded-xl shadow-md shadow-orange-500/20 hover:shadow-orange-600/30 transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Start Free
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none transition-colors duration-250"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3 bg-gray-900 border-b border-gray-800">
          <Link
            href="#how-it-works"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-3 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800"
          >
            How It Works
          </Link>
          <Link
            href="#goals"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-3 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800"
          >
            Workout
          </Link>
          <Link
            href="#nutrition"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-3 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800"
          >
            Nutrition
          </Link>
          <Link
            href="#science"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-3 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800"
          >
            Science
          </Link>
          <div className="pt-4 pb-2 border-t border-gray-800 flex flex-col space-y-3 px-3">
            <Link
              href="/dashboard/profile"
              onClick={() => setIsOpen(false)}
              className="text-center text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 py-3 rounded-xl transition-all duration-200"
            >
              Start Free
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
