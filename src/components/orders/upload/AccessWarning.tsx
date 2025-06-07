
import React from 'react';
import { UserProfile } from '@/stores/authStore';

interface AccessWarningProps {
  profile: UserProfile | null;
}

const AccessWarning = ({ profile }: AccessWarningProps) => {
  const hasBakeryAccess = !!profile?.bakery_id;

  if (hasBakeryAccess) return null;

  return (
    <div className="mb-4 p-4 bg-red-50 rounded-lg">
      <h4 className="font-semibold text-red-800 mb-2">Mangler bakeri-tilgang:</h4>
      <p className="text-sm text-red-700">
        Du må tilhøre et bakeri for å kunne laste opp data. Kontakt en administrator for å få tildelt bakeri-tilgang.
      </p>
      <p className="text-xs text-red-600 mt-2">
        Teknisk info: bakery_id er {profile?.bakery_id ? `"${profile.bakery_id}"` : 'null/undefined'}
      </p>
    </div>
  );
};

export default AccessWarning;
