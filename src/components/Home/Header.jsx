import React from 'react'
import { Poppins } from 'next/font/google'
import TextType from '@/app/Animations/TextAnimation'
import Link from 'next/link'
function Header() {

    return (
        <div className={`${""} flex`}>
            <div className='w-[50%] h-screen text-start p-14 pl-15 pt-18 ' >
                <h1 className='text-[70px] font-bold text-[#9543FF]'> Iman Calculator</h1>
                <p className='text-[40px] font-normal'>Check Your Iman Easily</p>
                {/* <p className='text-[25px] font-bold mt-2'>"O you who believe! Fear Allah, and let every soul look to what it has sent forth for tomorrow." <br />
                    — Surah Al-Hashr (59:18)</p> */}
                <TextType
                    text={["O you who believe! Fear Allah, and let every soul look to what it has sent forth for tomorrow.  — Surah Al-Hashr (59:18)"]}
                    typingSpeed={75}
                    pauseDuration={1500}
                    showCursor={true}
                    cursorCharacter="|"
                />
                <br />

                <button className='bg-[#9543FF] text-white text-2xl px-6 py-2 rounded-[10px] transition duration-300 ease-in-out hover:bg-[#5a2e8c] hover:scale-105 active:scale-95 shadow-md hover:shadow-xl mt-6'>
                    <span><Link href={"/quiz"}>Evaluate Your Iman</Link></span>
                </button>
            </div>

            <div className='w-[50%] h-screen text-6xl text-center' >
                <div className='w-[400] h-[550px] relative mx-auto '>
                    <img
                        className='w-[100%] h-[100%] '
                        src="header-img.png" alt="" srcset="" />
                </div>
            </div>
        </div>
    )
}

export default Header
