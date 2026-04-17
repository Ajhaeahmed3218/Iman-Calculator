'use client'
import React, { useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCards } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-cards'
import Link from 'next/link'

function QuizBanner() {
    const { data: session } = useSession()
    const swiperRef = useRef(null)
    const [activeIndex, setActiveIndex] = useState(0)
    const [answers, setAnswers] = useState(Array(4).fill(null))
    const [totalScore, setTotalScore] = useState(0)
    const [showModal, setShowModal] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [saveStatus, setSaveStatus] = useState(null)

    const slides = [
        {
            question: '১. আপনি কি পাঁচ ওয়াক্ত সালাত নিয়মিত আদায় করেন, এমনকি যখন সময় কম বা ক্লান্ত থাকেন?',
            options: [
                'হ্যাঁ, আমি সবসময় সময় মতো সালাত আদায় করি, কোনভাবেই ছাড়ি না।',
                'আমি চেষ্টা করি, কিন্তু মাঝে মাঝে সময় বা পরিস্থিতির কারণে মিস হয়।',
                'আমি মাঝে মাঝে পড়ি, নিয়মিত না।',
                'না, আমি সাধারণত সালাত আদায় করি না।',
            ],
            scores: [4, 3, 2, 1],
        },
        {
            question: '২. আপনি কি আল্লাহর হুকুমকে নিজের চাওয়ার উপরে প্রাধান্য দেন, এমনকি তা কঠিন মনে হলেও?',
            options: [
                'হ্যাঁ, আমি সবসময় আল্লাহর হুকুমকে অগ্রাধিকার দিই, যত কঠিনই হোক।',
                'আমি চেষ্টা করি, কিন্তু অনেক সময় নিজের চাওয়া প্রাধান্য পেয়ে যায়।',
                'আমি বুঝি এটা গুরুত্বপূর্ণ, কিন্তু বাস্তবে তা অনুসরণ করা কঠিন লাগে।',
                'না, আমি সাধারণত নিজের ইচ্ছাকেই অনুসরণ করি।',
            ],
            scores: [4, 3, 2, 1],
        },
        {
            question: '৩. আপনি গোপনে কোন পাপ করলে কি অন্তরে ভয় অনুভব করেন এবং তাওবা করেন?',
            options: [
                'হ্যাঁ, সাথে সাথেই অনুশোচনা হয় এবং আমি তাওবা করি।',
                'কখনো কখনো অনুশোচনা হয়, কিন্তু তাওবা করার বিষয়ে দেরি হয়।',
                'আমি জানি এটা পাপ, কিন্তু ভয় খুব বেশি অনুভব করি না।',
                'না, তেমন কোনো ভয় বা তাওবার অনুভব হয় না।',
            ],
            scores: [4, 3, 2, 1],
        },
        {
            question: '৪. আপনি কি আল্লাহর উপর ভরসা রাখেন, বিশেষ করে যখন পরিস্থিতি আপনার বিরুদ্ধে যায়?',
            options: [
                'হ্যাঁ, আমি তখনও বিশ্বাস রাখি যে তিনিই আমার জন্য উত্তম নির্ধারণ করেন',
                'মাঝে মাঝে সংশয়ে পড়ে যাই, তবে শেষে আল্লাহর উপর ভরসা করি।',
                'আমি চেষ্টা করি বিশ্বাস রাখতে, তবে হতাশ হয়ে পড়ি।',
                'না, তখন মনে হয় সব নিয়ন্ত্রণ আমার হাতেই থাকা উচিত।',
            ],
            scores: [4, 3, 2, 1],
        },
    ]

    const handleOptionClick = (slideIndex, optionIndex) => {
        const updated = [...answers]
        updated[slideIndex] = optionIndex
        setAnswers(updated)
    }

    const saveQuizResult = async (score) => {
        if (!session) return
        
        setIsSaving(true)
        setSaveStatus(null)
        
        try {
            const res = await fetch('/api/quiz-results', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    score,
                    totalQuestions: slides.length,
                    answers,
                }),
            })
            
            if (res.ok) {
                setSaveStatus('saved')
            } else {
                setSaveStatus('error')
            }
        } catch (error) {
            console.error('Error saving quiz result:', error)
            setSaveStatus('error')
        } finally {
            setIsSaving(false)
        }
    }

    const handleNext = async () => {
        if (activeIndex === slides.length - 1) {
            const score = answers.reduce((acc, selectedIndex, i) => {
                return acc + (slides[i].scores[selectedIndex] || 0)
            }, 0)
            setTotalScore(score)
            setShowModal(true)
            
            // Save result if user is authenticated
            if (session) {
                await saveQuizResult(score)
            }
        } else {
            swiperRef.current?.slideNext()
        }
    }

    const handleRestart = () => {
        swiperRef.current?.slideTo(0)
        setAnswers(Array(slides.length).fill(null))
        setShowModal(false)
        setTotalScore(0)
        setSaveStatus(null)
    }

    const getImanMessage = (score) => {
        const percentage = (score / (slides.length * 4)) * 100
        if (percentage >= 85) {
            return 'মাশাআল্লাহ! আপনার ইমান অনেক দৃঢ়। আল্লাহর পথে অবিচল থাকুন।'
        } else if (percentage >= 60) {
            return 'ইমান ভালো আছে, কিন্তু আরও ইখলাস ও আমল দরকার। চেষ্টাটা চালিয়ে যান।'
        } else if (percentage >= 40) {
            return 'আপনি চেষ্টা করছেন, তবে ইমান দুর্বল। নিজেকে ফিরে দেখার সময় এসেছে।'
        } else {
            return 'ইমান খুবই দুর্বল। এখনই তাওবা করুন এবং আল্লাহর দিকে ফিরে যান।'
        }
    }

    const getImanLevel = (score) => {
        const percentage = (score / (slides.length * 4)) * 100
        if (percentage >= 85) return { level: 'Strong', color: 'text-green-400' }
        if (percentage >= 60) return { level: 'Good', color: 'text-blue-400' }
        if (percentage >= 40) return { level: 'Moderate', color: 'text-yellow-400' }
        return { level: 'Needs Work', color: 'text-red-400' }
    }

    return (
        <div className="w-full flex flex-col justify-center items-center py-4 gap-4 relative">
            <div className="w-[700px] h-[400px] rounded-lg shadow-lg overflow-hidden relative">
                <Swiper
                    effect={'cards'}
                    grabCursor={true}
                    modules={[EffectCards]}
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper
                    }}
                    onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                    className="mySwiper"
                >
                    {slides.map((slide, slideIndex) => (
                        <SwiperSlide
                            key={slideIndex}
                            className="w-full h-[400px] flex items-center justify-center text-2xl font-bold"
                        >
                            <div className="w-[700px] h-[400px] bg-[#3d5a80] rounded-xl shadow-2xl p-6 flex flex-col justify-between">
                                <div className="border-2 border-[#98c1d9] h-[150px] rounded-lg flex items-center justify-center text-center text-white text-2xl font-bold shadow-inner">
                                    {slide.question}
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-6 px-4">
                                    {slide.options.map((option, optionIndex) => (
                                        <button
                                            key={optionIndex}
                                            onClick={() => handleOptionClick(slideIndex, optionIndex)}
                                            className={`py-4 rounded-lg transition duration-200 text-[16px] font-semibold border-2 ${answers[slideIndex] === optionIndex
                                                    ? 'bg-green-400 text-[#2b3a55] border-white'
                                                    : 'bg-[#4772ab] text-white border-[#98c1d9] hover:bg-green-300 hover:text-[#4772ab]'
                                                }`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-4">
                <button
                    onClick={() => swiperRef.current?.slidePrev()}
                    className="px-4 py-2 bg-[#4772ab] text-white rounded hover:bg-purple-600 transition"
                >
                    Prev
                </button>
                <button
                    onClick={handleNext}
                    disabled={answers[activeIndex] === null}
                    className={`px-4 py-2 rounded transition ${answers[activeIndex] === null
                            ? 'bg-gray-400 text-white cursor-not-allowed'
                            : 'bg-[#4772ab] text-white hover:bg-purple-600'
                        }`}
                >
                    {activeIndex === slides.length - 1 ? 'Calculate' : 'Next'}
                </button>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-2xl w-[90%] max-w-md p-6 text-center space-y-4">
                        <h2 className="text-2xl font-bold text-[#2b3a55]">আপনার ইমান লেভেল</h2>
                        <div className={`text-3xl font-bold ${getImanLevel(totalScore).color}`}>
                            {Math.round((totalScore / (slides.length * 4)) * 100)}%
                        </div>
                        <p className="text-lg text-gray-700">{getImanMessage(totalScore)}</p>
                        
                        {/* Save Status */}
                        {session && (
                            <div className="text-sm">
                                {isSaving && <p className="text-blue-500">Saving your result...</p>}
                                {saveStatus === 'saved' && (
                                    <p className="text-green-500">Result saved to your profile!</p>
                                )}
                                {saveStatus === 'error' && (
                                    <p className="text-red-500">Failed to save result</p>
                                )}
                            </div>
                        )}
                        
                        {/* Sign in prompt for non-authenticated users */}
                        {!session && (
                            <div className="bg-[#9543FF]/10 rounded-lg p-3 border border-[#9543FF]/30">
                                <p className="text-sm text-gray-600 mb-2">
                                    Sign in to save your results and track your progress!
                                </p>
                                <Link
                                    href="/signin"
                                    className="inline-block px-4 py-2 bg-[#9543FF] text-white text-sm rounded-lg hover:bg-[#7a35d4] transition"
                                >
                                    Sign In
                                </Link>
                            </div>
                        )}
                        
                        <div className="flex gap-3 justify-center pt-2">
                            <button
                                onClick={handleRestart}
                                className="px-6 py-2 bg-[#4772ab] text-white rounded hover:bg-purple-700 transition"
                            >
                                আবার শুরু করুন
                            </button>
                            {session && (
                                <Link
                                    href="/profile"
                                    className="px-6 py-2 bg-[#9543FF] text-white rounded hover:bg-[#7a35d4] transition"
                                >
                                    View Profile
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default QuizBanner
