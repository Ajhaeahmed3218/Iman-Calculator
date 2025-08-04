import React from 'react'
import { VscAccount, VscArchive, VscHome, VscSettingsGear } from 'react-icons/vsc';
import { MdOutlineQuiz } from "react-icons/md";
import Dock from './NabAnimetion';
import Link from 'next/link';

function Navbar() {
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
    {
      icon: (
        <Link href="/profile">
          <span className="text-gray-300 hover:text-white">
            <VscAccount size={20} />
          </span>
        </Link>
      ),
      label: 'Profile',
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
  ]
    return (
       <Dock
                className="z-50"
                 items={items}
                 panelHeight={68}
                 baseItemSize={50}
                 magnification={70}
               />
    )
}

export default Navbar
