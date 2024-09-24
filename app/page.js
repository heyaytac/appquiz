"use client"

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import Confetti from 'react-confetti'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import html2canvas from 'html2canvas'

const characters = [
  { name: "Privacy Pro", image: "/placeholder.svg?height=100&width=100", description: "Master of data protection" },
  { name: "Consent Champion", image: "/placeholder.svg?height=100&width=100", description: "Expert in user permissions" },
  { name: "Compliance Crusader", image: "/placeholder.svg?height=100&width=100", description: "Guardian of regulations" },
  { name: "Data Detective", image: "/placeholder.svg?height=100&width=100", description: "Sleuth of information flows" },
]

const questions = [
  {
    question: "What is the primary purpose of our App SDK?",
    options: [
      "To make coffee",
      "To build mobile applications",
      "To manage user consent",
      "To order pizza"
    ],
    correctAnswer: 2
  },
  {
    question: "Which regulation is NOT directly related to our App SDK?",
    options: ["GDPR", "CCPA", "HIPAA", "ePrivacy"],
    correctAnswer: 2
  },
  {
    question: "What is the way to initialize our SDK in an app?",
    options: [
      "UsercentricsCore.configure()",
      "SDKApp.start()",
      "InitializeSDK()",
      "Usercentrics.initialize()"
    ],
    correctAnswer: 0
  },
  {
    question: "Which of these is NOT a feature of our App SDK?",
    options: [
      "Google Consent Mode",
      "Consent Mediation",
      "Time Travel",
      "Custom UI"
    ],
    correctAnswer: 2
  },
  {
    question: "What's the maximum number of consent purposes our SDK supports?",
    options: ["10", "50", "100", "Unlimited"],
    correctAnswer: 3
  },
  {
    question: "What's the newest SDK Version?",
    options: ["2.18", "2.15", "2.17", "2.16"],
    correctAnswer: 2
  },
  {
    question: "Which of the following is NOT a supported SDK for consent mediation in the App SDK?",
    options: ["ironSource", "Crashlytics", "Chartboost", "Facebook SDK"],
    correctAnswer: 3
  }
]

export default function Page () {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [selectedCharacter, setSelectedCharacter] = useState(null)
  const [timeRemaining, setTimeRemaining] = useState(300) // 5 minutes in seconds
  const [quizStarted, setQuizStarted] = useState(false)
  const certificateRef = useRef(null)

  useEffect(() => {
    let timer
    if (quizStarted && timeRemaining > 0 && !showResult) {
      timer = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1)
      }, 1000)
    } else if (timeRemaining === 0) {
      setShowResult(true)
    }
    return () => clearInterval(timer)
  }, [quizStarted, timeRemaining, showResult])

  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character)
    setQuizStarted(true)
  }

  const handleSelect = (selectedIndex) => {
    if (!isSubmitted) {
      setSelectedAnswer(selectedIndex)
    }
  }

  const handleSubmit = () => {
    if (selectedAnswer !== null && !isSubmitted) {
      setIsSubmitted(true)
      const correct = selectedAnswer === questions[currentQuestion].correctAnswer
      if (correct) {
        setScore(score + 1)
      }
      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1)
          setSelectedAnswer(null)
          setIsSubmitted(false)
        } else {
          setShowResult(true)
        }
      }, 1500)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setScore(0)
    setShowResult(false)
    setSelectedAnswer(null)
    setIsSubmitted(false)
    setSelectedCharacter(null)
    setTimeRemaining(300)
    setQuizStarted(false)
  }

  const getResultMessage = () => {
    const percentage = (score / questions.length) * 100
    if (percentage === 100) return "Perfect score! You're an App SDK master!"
    if (percentage >= 80) return "Great job! You're almost an expert!"
    if (percentage >= 60) return "Good effort! Keep learning and you'll be a pro soon!"
    return "Don't worry, practice makes perfect! Try again!"
  }

  const downloadCertificate = () => {
    console.log("Download certificate function called");
    if (certificateRef.current) {
      console.log("Certificate ref is available");
      
      // Temporarily make the certificate visible if it's hidden
      const originalDisplay = certificateRef.current.style.display;
      certificateRef.current.style.display = 'block';
      
      html2canvas(certificateRef.current).then((canvas) => {
        console.log("Canvas created");
        
        // Convert canvas to blob
        canvas.toBlob((blob) => {
          // Create object URL
          const url = URL.createObjectURL(blob);
          
          // Open new window with the image
          const newWindow = window.open(url, '_blank');
          
          if (newWindow) {
            newWindow.document.title = 'Usercentrics App SDK Certificate';
            newWindow.document.body.innerHTML = `
              <div style="text-align: center;">
                <img src="${url}" alt="Certificate" style="max-width: 100%; height: auto;" />
                <p>If the download doesn't start automatically, right-click the image and select "Save image as..."</p>
              </div>
            `;
          } else {
            console.log("Popup blocked, falling back to current window");
            window.location.href = url;
          }
          
          // Cleanup
          URL.revokeObjectURL(url);
        }, 'image/png');
        
        // Restore original display style
        certificateRef.current.style.display = originalDisplay;
      }).catch(error => console.error("html2canvas error:", error));
    } else {
      console.log("Certificate ref is not available");
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
  }

  return (
    <div className="bg-black min-h-screen text-white font-sans p-4">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 mr-2">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
          <span className="font-bold text-xl">USERCENTRICS</span>
        </div>
      </header>
      
      <main className="max-w-2xl mx-auto">
        {!selectedCharacter ? (
          <div>
            <h1 className="text-3xl font-bold mb-6 text-blue-400">Choose Your Privacy Champion</h1>
            <div className="grid grid-cols-2 gap-4">
              {characters.map((character) => (
                <motion.div
                  key={character.name}
                  className="bg-gray-800 p-4 rounded-lg cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCharacterSelect(character)}
                >
                  <Image
                    src={character.image}
                    alt={character.name}
                    width={100}
                    height={100}
                    className="mx-auto mb-2"
                  />
                  <h3 className="text-center font-bold">{character.name}</h3>
                  <p className="text-center text-sm text-gray-400">{character.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        ) : !showResult ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Image
                  src={selectedCharacter.image}
                  alt={selectedCharacter.name}
                  width={50}
                  height={50}
                  className="mr-4"
                />
                <h1 className="text-3xl font-bold text-blue-400">APP SDK QUIZ CHALLENGE</h1>
              </div>
              <div className="text-xl font-bold text-blue-400">
                Time: {formatTime(timeRemaining)}
              </div>
            </div>
            <Progress value={(currentQuestion / questions.length) * 100} className="mb-6" />
            <h2 className="text-xl font-semibold mb-4">{questions[currentQuestion].question}</h2>
            <div className="grid gap-4 mb-6">
              {questions[currentQuestion].options.map((option, index) => (
                <motion.div key={index} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant={isSubmitted ? (selectedAnswer === index ? (selectedAnswer === questions[currentQuestion].correctAnswer ? "success" : "destructive") : "outline") : selectedAnswer === index ? "secondary" : "outline"}
                    className={`w-full text-left justify-start h-auto py-3 px-4 transition-colors ${
                      isSubmitted && selectedAnswer === index
                        ? selectedAnswer === questions[currentQuestion].correctAnswer
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                        : "bg-gray-800 text-white hover:bg-gray-700"
                    }`}
                    onClick={() => handleSelect(index)}
                    disabled={isSubmitted}
                  >
                    {option}
                  </Button>
                </motion.div>
              ))}
            </div>
            <Button 
              onClick={handleSubmit} 
              disabled={selectedAnswer === null || isSubmitted}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-lg text-lg font-semibold"
            >
              Submit Answer
            </Button>
            {isSubmitted && (
              <p className="mt-4 text-center font-semibold text-blue-400">
                {selectedAnswer === questions[currentQuestion].correctAnswer 
                  ? "Correct! Well done!" 
                  : `Oops! The correct answer was: ${questions[currentQuestion].options[questions[currentQuestion].correctAnswer]}`}
              </p>
            )}
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6 text-blue-400">Quiz Complete!</h2>
            <div className="flex justify-center items-center mb-4">
              <Image
                src={selectedCharacter.image}
                alt={selectedCharacter.name}
                width={100}
                height={100}
                className="mr-4"
              />
              <div>
                <p className="text-xl mb-2">Your character: {selectedCharacter.name}</p>
                <p className="text-xl">Your score: {score} out of {questions.length}</p>
                <p className="text-xl">Time remaining: {formatTime(timeRemaining)}</p>
              </div>
            </div>
            <p className="text-lg mb-6">{getResultMessage()}</p>
            <div className="flex justify-center space-x-4">
              <Button onClick={resetQuiz} className="bg-blue-500 hover:bg-blue-600 text-white py-4 px-8 rounded-lg text-lg font-semibold">
                Play Again
              </Button>
              <Button onClick={downloadCertificate} className="bg-green-500 hover:bg-green-600 text-white py-4 px-8 rounded-lg text-lg font-semibold">
                Download Certificate
              </Button>
            </div>
            {score === questions.length && <Confetti />}
            <div ref={certificateRef} className="mt-8 p-8 bg-white text-black rounded-lg shadow-lg" style={{display: 'none'}}>
              <h2 className="text-3xl font-bold mb-4">Certificate of Completion</h2>
              <p className="text-xl mb-2">This certifies that</p>
              <p className="text-2xl font-bold mb-4">{selectedCharacter.name}</p>
              <p className="text-xl mb-4">has completed the Usercentrics App SDK Quiz</p>
              <p className="text-2xl font-bold mb-4">Score: {score}/{questions.length}</p>
              <p className="text-xl mb-4">Time remaining: {formatTime(timeRemaining)}</p>
              <p className="text-lg">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}