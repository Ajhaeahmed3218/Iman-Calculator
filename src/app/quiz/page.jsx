import QuizBanner from '@/components/Quiz/quizBanner'
import React from 'react'

function QuizPage() {
    return (
        <div
            className="min-h-screen bg-cover bg-center"
            style={{
                backgroundImage: 'url("/quiz-bg.jpg")',
            }}
        >
            
            <QuizBanner/>
        </div>
    )
}

export default QuizPage
