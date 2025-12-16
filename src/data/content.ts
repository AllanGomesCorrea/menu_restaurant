/**
 * Conteúdo estático do site
 * Centraliza todos os textos e dados para fácil manutenção
 */

import type { NavLink, InfoItem, ContactInfo } from '../types';

// Links de navegação
export const navLinks: NavLink[] = [
  {
    id: 'reservas',
    label: 'Reservas',
    href: '/reservas',
    external: false,
  },
  {
    id: 'cardapio',
    label: 'Cardápio',
    href: '/cardapio',
    external: false,
  },
  {
    id: 'delivery',
    label: 'Delivery',
    href: 'https://www.ifood.com.br/delivery/sao-paulo-sp/a-casa-do-porco-republica/f34186af-ac6b-44a7-8319-d53aab067372',
    external: true,
  },
  {
    id: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/acasadoporcobar/',
    external: true,
  },
];

// Informações sobre reservas
export const reservationInfo: InfoItem[] = [
  {
    id: '1',
    text: 'Temos mesas todos os dias por ordem de chegada.',
  },
  {
    id: '2',
    text: 'Deixe o nome com a hostess, a partir das 11h, e ela dará uma previsão de espera.',
  },
  {
    id: '3',
    text: 'Horários mais tranquilos: 2ªf à 5ªf das 15h às 18h30.',
  },
  {
    id: '4',
    text: 'Sábados, domingos e feriados são mais cheios, chegue antes das 11h ou de 2h a 3h antes.',
  },
];

// Informações de contato
export const contactInfo: ContactInfo = {
  address: 'R. Araújo, 124 - República, São Paulo - SP',
  email: 'eventos@acasadoporco.com.br',
  phone: '(11) 3258-2578',
};



