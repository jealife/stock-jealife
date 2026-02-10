'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollToTop() {
    const pathname = usePathname();

    useEffect(() => {
        window.scrollTo(0, 0);
        // Au cas où le scroll serait géré par un conteneur spécifique, on peut cibler body/html aussi
        document.documentElement.scrollTo(0, 0);
        document.body.scrollTo(0, 0);
    }, [pathname]);

    return null;
}
