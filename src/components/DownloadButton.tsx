"use client";

import React, { useState } from 'react';
import { Download } from 'lucide-react';

interface DownloadButtonProps {
    targetUrl: string;
}

const AD_LINKS = [
    'https://www.effectivegatecpm.com/a63nr2vkf?key=32845369cebc05b9e5fdda4d685251fc',
    'https://www.effectivegatecpm.com/iwdza7r813?key=0227d1f7e8aff32e837d52d2386373eb',
    'https://www.effectivegatecpm.com/vi0xnbvpx?key=cad9200283ad563f0d44d66e7c04119e',
    'https://www.effectivegatecpm.com/h08kpmtgdm?key=91a1339dbaae7172a9099bbfd502be8c',
    'https://www.effectivegatecpm.com/gn1sy1w6?key=6186c42796aba59a4659efa24aabb10e'
];

export const DownloadButton: React.FC<DownloadButtonProps> = ({ targetUrl }) => {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDownloading(true);

        // 1. Pick a random ad link and open it in a new tab
        const randomIndex = Math.floor(Math.random() * AD_LINKS.length);
        const randomAdLink = AD_LINKS[randomIndex];
        window.open(randomAdLink, '_blank');

        // 2. Wait 500ms (as requested)
        setTimeout(() => {
            // 3. Trigger download / redirect to Mega link
            window.location.href = targetUrl;
            setIsDownloading(false);
        }, 500);
    };

    return (
        <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
        >
            <Download size={18} />
            {isDownloading ? 'Redirecting...' : 'Download Now'}
        </button>
    );
};
