
import React from 'react';

const UploadInstructions = () => {
  return (
    <div className="mb-4 p-4 bg-blue-50 rounded-lg">
      <h4 className="font-semibold text-blue-800 mb-2">Viktig rekkefølge:</h4>
      <ol className="text-sm text-blue-700 space-y-1">
        <li>1. Last opp produkter (.PRD filer) først</li>
        <li>2. Last opp kunder (.CUS filer) deretter</li>
        <li>3. Last opp ordrer (.OD0 filer) til slutt</li>
      </ol>
      <p className="text-xs text-blue-600 mt-2">
        Systemet lager automatisk mapping mellom numeriske ID-er i filene og database UUID-er.
      </p>
    </div>
  );
};

export default UploadInstructions;
