import { FaFacebookF, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaTwitter } from 'react-icons/fa6';

function Footer() {
  return (
      <footer className="bg-[var(--color-secondary)] text-white mt-10 ">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/aboutUs" className="hover:text-[var(--color-primary)] transition">About Us</a></li>
              <li><a href="/features" className="hover:text-[var(--color-primary)] transition">Features</a></li>
              <li><a href="/pricing" className="hover:text-[var(--color-primary)] transition">Pricing</a></li>
              <li><a href="/contactUs" className="hover:text-[var(--color-primary)] transition">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-[var(--color-primary)] transition">
                <FaTwitter />
              </a>
              <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-[var(--color-primary)] transition">
                <FaLinkedin />
              </a>
              <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-[var(--color-primary)] transition">
                <FaInstagram />
              </a>
              <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-[var(--color-primary)] transition">
                <FaFacebookF />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-2 rounded-md bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-primary-hover)] transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/20 py-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} YourCompany. All rights reserved.</p>
          <div className="flex justify-center space-x-6 mt-3">
            <a href="/privacy" className="hover:text-[var(--color-primary)] transition">Privacy Policy</a>
            <a href="/terms" className="hover:text-[var(--color-primary)] transition">Terms of Service</a>
            <a href="/cookies" className="hover:text-[var(--color-primary)] transition">Cookie Policy</a>
          </div>
        </div>
      </footer>
  );
}

export default Footer;
