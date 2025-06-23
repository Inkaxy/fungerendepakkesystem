
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-2xl font-bold">Loaf & Load</h3>
            <p className="text-gray-400">Bakeri pakking- og leveringssystem</p>
          </div>
          <div className="text-gray-400">
            © 2024 Loaf & Load. Alle rettigheter forbeholdt.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
