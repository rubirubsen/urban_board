import React from 'react';
import { CyberAsset } from '../../types';
import { ExternalLink, AlertCircle, CheckCircle2, Terminal } from 'lucide-react';

interface CyberAssetsTableProps {
  assets: CyberAsset[];
  activeCity?: 'H' | 'HH';
}

export const CyberAssetsTable: React.FC<CyberAssetsTableProps> = ({ assets, activeCity = 'H' }) => {
  const cityName = activeCity === 'HH' ? 'Hamburg' : 'Hannover';
  const orgExamples = activeCity === 'HH' ? 'Hamburg (Dataport, HPA, HHLA, DESY)' : 'Hannover (enercity, Region, LUIS)';

  return (
    <div className="space-y-3 lg:space-y-4 text-xs font-mono w-full">
      {/* Cyber Overview Banner */}
      <div className="p-3 lg:p-4 rounded bg-anthrazit-900 border border-anthrazit-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1.5 text-anthrazit-300 min-w-0">
            <Terminal className="w-4 h-4 text-accent shrink-0" />
            <span className="font-bold text-xs text-anthrazit-200 uppercase truncate">Shodan & Censys Recon ({cityName})</span>
          </div>
          <span className="text-xs text-anthrazit-500 shrink-0">Auto-Index</span>
        </div>
        <p className="text-xs font-sans text-anthrazit-300">
          Überwachung städtischer IP-Subnetze, SCADA/ICS-Gateways und exponierter SSL-Endpunkte im Raum {orgExamples}.
        </p>
      </div>

      {/* Assets Table (Card Layout for Mobile-First) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs uppercase font-bold text-anthrazit-400">Exponierte Assets & Dienste</span>
          <span className="text-xs text-accent">{assets.length} überwacht</span>
        </div>

        <div className="space-y-2">
          {assets.map((asset) => {
            const hasVulns = asset.vulnerabilitiesCount > 0;
            return (
              <div
                key={asset.id}
                className="p-3 lg:p-4 rounded bg-anthrazit-900 border border-anthrazit-800 hover:border-anthrazit-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2 min-w-0">
                    <span className="font-bold text-anthrazit-100 truncate">{asset.target}</span>
                    <span className="text-xs px-2 py-1 rounded bg-anthrazit-800 text-anthrazit-300 shrink-0">
                      {asset.ip}
                    </span>
                  </div>
                  {hasVulns ? (
                    <span className="flex items-center space-x-1 text-xs px-2 py-1 rounded bg-accent/15 border border-accent/30 text-accent font-bold">
                      <AlertCircle className="w-4 h-4" />
                      <span>{asset.vulnerabilitiesCount} CVEs</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1 text-xs px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>SECURE</span>
                    </span>
                  )}
                </div>

                <div className="text-xs text-anthrazit-400 mb-3">
                  Organisation: <strong className="text-anthrazit-200">{asset.organization}</strong>
                </div>

                {/* Ports & Services */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-xs text-anthrazit-500 self-center mr-1">Offene Ports:</span>
                  {asset.openPorts.map((port) => (
                    <span
                      key={port}
                      className="px-2 py-1 min-h-[32px] rounded bg-anthrazit-850 border border-anthrazit-700 text-xs text-accent font-semibold flex items-center justify-center"
                    >
                      :{port}
                    </span>
                  ))}
                </div>

                {/* Footer Details & Shodan Dork Link */}
                <div className="flex items-center justify-between text-xs text-anthrazit-500 border-t border-anthrazit-800/60 pt-3">
                  <div className="flex items-center space-x-2">
                    <span>Service: <strong className="text-anthrazit-300">{asset.serviceType}</strong></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <a
                      href={`https://www.shodan.io/host/${asset.ip}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 px-3 py-2 min-h-[44px] rounded bg-anthrazit-850 hover:bg-anthrazit-800 text-accent transition-colors"
                    >
                      <span>Shodan Host</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
