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
    <div className="space-y-4 text-xs font-mono w-full max-w-full overflow-x-hidden">
      {/* Cyber Overview Banner */}
      <div className="p-3 rounded bg-anthrazit-900 border border-anthrazit-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1.5 text-anthrazit-300 min-w-0">
            <Terminal className="w-3.5 h-3.5 text-accent shrink-0" />
            <span className="font-bold text-[11px] text-anthrazit-200 uppercase truncate">Shodan & Censys Recon ({cityName})</span>
          </div>
          <span className="text-[10px] text-anthrazit-500 shrink-0">Auto-Index</span>
        </div>
        <p className="text-[11px] font-sans text-anthrazit-300">
          Überwachung städtischer IP-Subnetze, SCADA/ICS-Gateways und exponierter SSL-Endpunkte im Raum {orgExamples}.
        </p>
      </div>

      {/* Assets Table */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] uppercase font-bold text-anthrazit-400">Exponierte Assets & Dienste</span>
          <span className="text-[10px] text-accent">{assets.length} überwacht</span>
        </div>

        <div className="space-y-2">
          {assets.map((asset) => {
            const hasVulns = asset.vulnerabilitiesCount > 0;
            return (
              <div
                key={asset.id}
                className="p-3 rounded bg-anthrazit-900 border border-anthrazit-800 hover:border-anthrazit-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2 min-w-0">
                    <span className="font-bold text-anthrazit-100 truncate">{asset.target}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-anthrazit-800 text-anthrazit-300 shrink-0">
                      {asset.ip}
                    </span>
                  </div>
                  {hasVulns ? (
                    <span className="flex items-center space-x-1 text-[10px] px-1.5 py-0.5 rounded bg-accent/15 border border-accent/30 text-accent font-bold">
                      <AlertCircle className="w-3 h-3" />
                      <span>{asset.vulnerabilitiesCount} CVEs</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1 text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>SECURE</span>
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-anthrazit-400 mb-2">
                  Organisation: <strong className="text-anthrazit-200">{asset.organization}</strong>
                </div>

                {/* Ports & Services */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  <span className="text-[10px] text-anthrazit-500 self-center mr-1">Offene Ports:</span>
                  {asset.openPorts.map((port) => (
                    <span
                      key={port}
                      className="px-1.5 py-0.5 rounded bg-anthrazit-850 border border-anthrazit-700 text-[10px] text-accent font-semibold"
                    >
                      :{port}
                    </span>
                  ))}
                </div>

                {/* Footer Details & Shodan Dork Link */}
                <div className="flex items-center justify-between text-[10px] text-anthrazit-500 border-t border-anthrazit-800/60 pt-2">
                  <div className="flex items-center space-x-2">
                    <span>Service: <strong className="text-anthrazit-300">{asset.serviceType}</strong></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <a
                      href={`https://www.shodan.io/host/${asset.ip}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-accent hover:underline"
                    >
                      <span>Shodan Host</span>
                      <ExternalLink className="w-2.5 h-2.5" />
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
