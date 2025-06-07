
import React from 'react';
import { Profile } from '@/types/profile';
import { IdMapping } from './types';

interface DebugInfoProps {
  profile: Profile | null;
  productIdMapping: IdMapping;
  customerIdMapping: IdMapping;
}

const DebugInfo = ({ profile, productIdMapping, customerIdMapping }: DebugInfoProps) => {
  const hasBakeryAccess = !!profile?.bakery_id;

  return (
    <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm">
      <div><strong>Debug info:</strong></div>
      <div>Bruker: {profile?.name || 'Ikke lastet'}</div>
      <div>Bakeri ID: {profile?.bakery_id || 'Ikke satt'}</div>
      <div>Bakeri navn: {profile?.bakery_name || 'Ikke satt'}</div>
      <div>Rolle: {profile?.role || 'Ikke satt'}</div>
      <div>Har bakeri-tilgang: {hasBakeryAccess ? 'Ja' : 'Nei'}</div>
      <div>Produkter mappet: {Object.keys(productIdMapping).length}</div>
      <div>Kunder mappet: {Object.keys(customerIdMapping).length}</div>
    </div>
  );
};

export default DebugInfo;
