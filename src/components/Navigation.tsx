'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const menuItems = [
  { href: '/', label: 'TOP' },
  { href: '/about', label: 'ABOUT' },
  { href: '/journal', label: 'JOURNAL' },
  { href: '/philosophy', label: 'PHILOSOPHY' },
  { href: '/voices', label: 'VOICES' },
  { href: '/research', label: 'RESEARCH' },
  { href: '/contact', label: 'CONTACT' },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 w-full bg-stone-50/80 backdrop-blur-sm z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-serif text-xl font-medium">
            ME≠LABEL
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm hover:text-accent transition-colors ${
                  pathname === item.href ? 'text-accent' : 'text-primary'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Navigation Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="メニューを開く"
          >
            <div className="space-y-2">
              <span className={`block w-8 h-0.5 bg-primary transition-transform ${isOpen ? 'rotate-45 translate-y-2.5' : ''}`} />
              <span className={`block w-8 h-0.5 bg-primary transition-opacity ${isOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-8 h-0.5 bg-primary transition-transform ${isOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          } overflow-hidden`}
        >
          <div className="py-4 space-y-4">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block text-sm hover:text-accent transition-colors ${
                  pathname === item.href ? 'text-accent' : 'text-primary'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
} 