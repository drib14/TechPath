import React from 'react';
import { Link } from 'react-router-dom';
import { TechPathLogo } from './TechPathLogo';
import {
  BookOpen,
  Github,
  Twitter,
  Mail,
  Heart,
  Globe,
  Shield,
  Zap,
  Code2,
  Cloud,
  Database,
  Brain,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const domainLinks = [
    { name: 'Web Development', slug: 'web-development', icon: <Globe className="w-3.5 h-3.5" /> },
    { name: 'Cybersecurity', slug: 'cybersecurity', icon: <Shield className="w-3.5 h-3.5" /> },
    { name: 'Cloud Computing', slug: 'cloud-computing', icon: <Cloud className="w-3.5 h-3.5" /> },
    { name: 'Databases', slug: 'databases', icon: <Database className="w-3.5 h-3.5" /> },
    { name: 'AI & ML', slug: 'artificial-intelligence', icon: <Brain className="w-3.5 h-3.5" /> },
    { name: 'Programming', slug: 'programming', icon: <Code2 className="w-3.5 h-3.5" /> },
  ];

  const resourceLinks = [
    { name: 'All Courses', path: '/courses' },
    { name: 'Domains', path: '/domains' },
    { name: 'Getting Started', path: '/courses' },
    { name: 'Learning Paths', path: '/domains' },
  ];

  const companyLinks = [
    { name: 'About TechPath', path: '/' },
    { name: 'Contact Us', path: '/' },
    { name: 'Privacy Policy', path: '/' },
    { name: 'Terms of Service', path: '/' },
  ];

  return (
    <footer className="bg-surface-900 text-surface-300">
      {/* Newsletter / CTA */}
      <div className="border-b border-surface-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">
                Start learning today
              </h3>
              <p className="text-surface-400">
                Explore hundreds of free technology courses and tutorials.
              </p>
            </div>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl"
            >
              <Zap className="w-4 h-4" />
              Browse Courses
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <TechPathLogo size="md" />
            </Link>
            <p className="text-sm text-surface-400 mb-4 leading-relaxed">
              A free, open learning platform for technology education. Learn web development,
              cloud computing, cybersecurity, AI, and more.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-surface-800 flex items-center justify-center hover:bg-surface-700 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-surface-800 flex items-center justify-center hover:bg-surface-700 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-surface-800 flex items-center justify-center hover:bg-surface-700 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Popular Domains */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Popular Domains
            </h4>
            <ul className="space-y-2.5">
              {domainLinks.map((link) => (
                <li key={link.slug}>
                  <Link
                    to={`/domains/${link.slug}`}
                    className="flex items-center gap-2 text-sm text-surface-400 hover:text-white transition-colors"
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-surface-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-surface-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-surface-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-surface-500">
              © {currentYear} TechPath. All rights reserved.
            </p>
            <p className="text-sm text-surface-500 flex items-center gap-1">
              Made with <Heart className="w-3.5 h-3.5 text-red-400" /> for the tech community
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
