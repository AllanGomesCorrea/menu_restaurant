/**
 * Componente LocationMap
 * Exibe um mapa do Google Maps incorporado com a localização do restaurante
 */

import React from 'react';
import { motion } from 'framer-motion';

interface LocationMapProps {
  address?: string;
  className?: string;
}

/**
 * Mapa de localização usando Google Maps Embed
 * Mostra o endereço do restaurante de forma interativa
 */
export const LocationMap: React.FC<LocationMapProps> = ({
  address = 'R. Araújo, 124 - República, São Paulo - SP',
  className = '',
}) => {
  // Encode do endereço para a URL do Google Maps
  const encodedAddress = encodeURIComponent(address);
  
  // URL do Google Maps Embed (não requer API key)
  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodedAddress}&zoom=16`;
  
  // URL alternativa usando o iframe padrão (mais simples, sem necessidade de API key)
  const mapSrcAlternative = `https://www.google.com/maps?q=${encodedAddress}&output=embed`;

  return (
    <motion.div
      className={`w-full ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
    >
      {/* Container do mapa */}
      <div className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-2xl">
        {/* Iframe do Google Maps */}
        <iframe
          src={mapSrcAlternative}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Mapa de localização: ${address}`}
          className="w-full h-full"
        />
      </div>

      {/* Informações de endereço abaixo do mapa */}
      <motion.div
        className="mt-6 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="inline-flex items-center gap-3 bg-white rounded-lg shadow-md px-6 py-4">
          <svg
            className="w-6 h-6 text-primary-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <div className="text-left">
            <p className="text-sm text-primary-600 font-medium">Endereço</p>
            <p className="text-base text-primary-900 font-semibold">{address}</p>
          </div>
          <motion.a
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Como Chegar
          </motion.a>
        </div>
      </motion.div>
    </motion.div>
  );
};

