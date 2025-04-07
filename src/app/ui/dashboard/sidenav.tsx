'use client'

import Link from 'next/link';
import {usePathname} from 'next/navigation';

const NavLinks = () => {
    const pathname = usePathname();

    const links = [
        {name: 'Dashboard', href: '/dashboard'},
        {name: 'Activities', href: '/dashboard/activities'},
    ];

    return (
        <div className="flex flex-col space-y-2 md:space-y-4">
            {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                    <Link
                        key={link.name}
                        href={link.href}
                        className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                            isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        {link.name}
                    </Link>
                );
            })}
        </div>
    );
};

const Sidenav = () => {
    return (
        <div className="flex h-full flex-col px-3 py-4 md:px-2">
            <div className="mb-6">
                <h1 className="mb-4 text-xl font-bold">StravaDASH</h1>
            </div>
            <NavLinks/>
        </div>
    );
};

export default Sidenav;