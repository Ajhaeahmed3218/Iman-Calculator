"use client";

import React from 'react';
import { useSession } from 'next-auth/react';
import { VscAccount, VscHome, VscSettingsGear, VscSignIn } from 'react-icons/vsc';
import { MdOutlineQuiz } from "react-icons/md";
import Dock from './NabAnimetion';
import Link from 'next/link';

function Navbar() {
    const { data: session, status } = useSession();
    const isLoading = status === "loading";

    const items = [
        {
            icon: (
                <Link href="/">
                    <span className="text-gray-300 hover:text-white">
                        <VscHome size={20} />
                    </span>
                </Link>
            ),
            label: 'Home',
        },
        {
            icon: (
                <Link href="/quiz">
                    <span className="text-gray-300 hover:text-white">
                        <MdOutlineQuiz size={20} />
                    </span>
                </Link>
            ),
            label: 'Quiz',
        },
        // Profile link - changes based on auth state
        {
            icon: (
                <Link href={session ? "/profile" : "/signin"}>
                    <span className="text-gray-300 hover:text-white">
                        {isLoading ? (
                            <VscAccount size={20} />
                        ) : session ? (
                            session.user?.image ? (
                                <img 
                                    src={session.user.image} 
                                    alt="Profile" 
                                    className="w-5 h-5 rounded-full"
                                />
                            ) : (
                                <VscAccount size={20} />
                            )
                        ) : (
                            <VscSignIn size={20} />
                        )}
                    </span>
                </Link>
            ),
            label: session ? 'Profile' : 'Sign In',
        },
        {
            icon: (
                <Link href="/settings">
                    <span className="text-gray-300 hover:text-white">
                        <VscSettingsGear size={20} />
                    </span>
                </Link>
            ),
            label: 'Settings',
        },
    ];

    return (
        <Dock
            className="z-50"
            items={items}
            panelHeight={68}
            baseItemSize={50}
            magnification={70}
        />
    );
}

export default Navbar;
