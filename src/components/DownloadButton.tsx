"use client";

import React, { useState } from 'react';
import { Download } from 'lucide-react';

interface DownloadButtonProps {
    targetUrl: string;
}

const ADSTERRA_LINK = 'https://www.effectivegatecpm.com/a63nr2vkf?key=32845369cebc05b9e5fdda4d685251fc';

export const DownloadButton: React.FC<DownloadButtonProps> = ({ targetUrl }) => {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDownloading(true);

        // 1. Open Adsterra link in a new tab
        window.open(ADSTERRA_LINK, '_blank');

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
