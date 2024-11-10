import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './TyperTrain.scss';
import TypingArea from './TypingArea';
import DifficultySelector from './DifficultySelector';

const TyperTrain = () => {
    const paragraphs = useMemo(() => ({
        Easy: [
            "The cat stretched lazily on the windowsill, enjoying the warmth of the sun. It watched as birds flitted about in the garden, chirping happily. Every now and then, it would twitch its tail, pretending to be ready to pounce, but mostly it just wanted to nap.",
            "At the park, children laughed and played on the swings. Some were riding bicycles, while others were flying kites. The laughter echoed through the trees, creating a cheerful atmosphere. Parents watched from nearby benches, sipping their coffee and enjoying the lovely day.",
            "The smell of fresh cookies wafted through the kitchen. Mom was baking chocolate chip cookies, and I couldn’t wait to have one. I helped her mix the batter, and we had fun adding in extra chocolate chips. Soon, the cookies were ready, and the kitchen was filled with warmth and sweetness.",
            "My favorite hobby is painting. I love to spend my afternoons creating colorful landscapes and portraits. The brush glides over the canvas, and I feel a sense of peace as I mix colors. Painting allows me to express my emotions and capture the beauty of the world around me.",
            "On weekends, my family likes to go hiking in the mountains. The trails are surrounded by tall trees and vibrant wildflowers. We pack a picnic and enjoy the fresh air while exploring nature. Each hike brings new adventures and beautiful views that we love to capture with photos."
        ],
        Medium: [
            "Technology has transformed our lives in countless ways. From communication to entertainment, the advancements are remarkable. We can connect with people across the globe in an instant.",
            "The forest is a vital ecosystem that supports a diverse range of wildlife. Trees provide shelter, while streams offer water. Preserving these natural habitats is crucial for maintaining biodiversity.",
            "Art has the power to inspire and provoke thought. Whether through painting, music, or dance, creative expressions can evoke emotions and tell stories that resonate deeply with individuals.",
            "Healthy eating habits are essential for overall well-being. A balanced diet filled with fruits, vegetables, and whole grains can boost energy levels and improve mood. It's important to make mindful food choices.",
            "Traveling opens up new perspectives and experiences. Exploring different cultures allows us to appreciate diversity and understand global issues better. Each journey enriches our knowledge and broadens our horizons."
        ],
        Hard: [
            "Quantum mechanics challenges our understanding of reality, delving into the behavior of subatomic particles. The principles often defy classical physics, leading to perplexing phenomena that scientists continue to explore.",
            "The existential questions posed by philosophers have shaped human thought for centuries. Concepts of free will, morality, and the nature of existence remain central to philosophical discourse, prompting introspection and debate.",
            "In the realm of literature, postmodernism blurs the boundaries between fiction and reality. Authors employ unconventional narrative structures, often subverting traditional storytelling techniques to reflect the complexities of modern life.",
            "The concept of time is not merely a linear progression but a multifaceted experience influenced by perception. Philosophers and scientists alike grapple with understanding its true nature, questioning whether it is an absolute or a relative construct.",
            "Globalization has interconnected economies, cultures, and political systems, fostering both collaboration and conflict. While it offers opportunities for growth and exchange, it also raises concerns about cultural homogenization and environmental sustainability."
        ],
    }), []);

    const [selectedDifficulty, setSelectedDifficulty] = useState(null);
    const [typingText, setTypingText] = useState([]);
    const [inpFieldValue, setInpFieldValue] = useState('');
    const maxTime = 60;
    const [timeLeft, setTimeLeft] = useState(maxTime);
    const [charIndex, setCharIndex] = useState(0);
    const [mistakes, setMistakes] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [WPM, setWPM] = useState(0);
    const [CPM, setCPM] = useState(0);
    const inputRef = useRef();
    const [currentParagraph, setCurrentParagraph] = useState('');


    const loadParagraph = useCallback(() => {
        if (!selectedDifficulty) return;
        const ranIndex = Math.floor(Math.random() * paragraphs[selectedDifficulty].length);
        const selectedText = paragraphs[selectedDifficulty][ranIndex];
        setCurrentParagraph(selectedText);
        const content = Array.from(selectedText).map((letter, index) => (
            <span
                key={index}
                style={{ color: letter !== ' ' ? 'black' : 'transparent' }}
                className={`char ${index === 0 ? 'active' : ''}`}
            >
                {letter !== ' ' ? letter : '_'}
            </span>
        ));
        setTypingText(content);
        setInpFieldValue('');
        setCharIndex(0);
        setMistakes(0);
        setIsTyping(false);
        inputRef.current.focus();
    }, [selectedDifficulty, paragraphs]);

    const handleDifficultyChange = (difficulty) => {
        setSelectedDifficulty(difficulty);
        resetGame();
    };

    const resetGame = () => {
        setIsTyping(false);
        setTimeLeft(maxTime);
        setCharIndex(0);
        setMistakes(0);
        setTypingText([]);
        setCPM(0);
        setWPM(0);
        const characters = document.querySelectorAll('.char');
        characters.forEach(span => {
            span.classList.remove("correct", "wrong", "active");
        });
        loadParagraph();
    };

    const initTyping = (event) => {
        const characters = document.querySelectorAll('.char');
        let typedChar = event.target.value;
        if (charIndex < characters.length && timeLeft > 0) {
            let currentChar = characters[charIndex].innerText;
            if (currentChar === '_') currentChar = ' ';
            // Start the timer and set start time
            if (!isTyping) {
                setIsTyping(true);
            }
            if (typedChar === currentChar) {
                setCharIndex(charIndex + 1);
                if (charIndex + 1 < characters.length) characters[charIndex + 1].classList.add('active');
                characters[charIndex].classList.remove('active');
                characters[charIndex].classList.add('correct');
            } else {
                setMistakes(mistakes + 1);
                setCharIndex(charIndex + 1);
                characters[charIndex].classList.remove('active');
                if (charIndex + 1 < characters.length) characters[charIndex + 1].classList.add('active');
                characters[charIndex].classList.add('wrong');
            }

          
        }
    };


    const handleKeyDown = (event) => {
        const characters = document.querySelectorAll('.char');
        if (event.key === 'Backspace' && charIndex > 0 && timeLeft > 0) {
            if (characters[charIndex - 1].classList.contains('correct')) {
                characters[charIndex - 1].classList.remove('correct');
            }
            if (characters[charIndex - 1].classList.contains('wrong')) {
                characters[charIndex - 1].classList.remove('wrong');
                setMistakes(mistakes - 1);
            }
            characters[charIndex].classList.remove('active');
            characters[charIndex - 1].classList.add('active');
            setCharIndex(charIndex - 1);
        }
    };

    const printReport = () => {
        const completedText = currentParagraph.slice(0, charIndex);
        const remainingText = currentParagraph.slice(charIndex);

        const reportContent = `
            <html>
            <head>
                <title>Typing Test Report</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    h1 { color: #333; }
                    p { font-size: 18px; }
                    .completed { text-decoration: underline; }
                </style>
            </head>
            <body>
                <h1>Typing Test Report</h1>
                <p><strong>Paragraph:</strong></p>
                <p>
                    <span class="completed">${completedText}</span><span>${remainingText}</span>
                </p>
                <p><strong>Mistakes:</strong> ${mistakes}</p>
                <p><strong>Words Per Minute (WPM):</strong> ${WPM}</p>
                <p><strong>Characters Per Minute (CPM):</strong> ${CPM}</p>
            </body>
            </html>
        `;

        const newWindow = window.open('', '_blank');
        newWindow.document.write(reportContent);
        newWindow.document.close();
        newWindow.print();
    };

    useEffect(() => {
        if (selectedDifficulty) {
            loadParagraph();
        }
    }, [selectedDifficulty, loadParagraph]);

    useEffect(() => {
        let interval;

        if (isTyping && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setIsTyping(false); // Stop typing when time runs out
                        return 0;
                    }
                    return prev - 1;
                });
                
            }, 1000);
        } else if (timeLeft === 0) {
            clearInterval(interval);
            setIsTyping(false);
        }

        return () => clearInterval(interval); // Cleanup on unmount
    }, [isTyping, timeLeft]);

    return (
        <div className="container">
            {!selectedDifficulty ? (
                <DifficultySelector onSelectDifficulty={handleDifficultyChange} />
            ) : (
                <>
                    <input
                        ref={inputRef}
                        type="text"
                        className="input-field"
                        value={inpFieldValue}
                        onChange={initTyping}
                        onKeyDown={handleKeyDown}
                    />
                    <TypingArea
                        typingText={typingText}
                        inpFieldValue={inpFieldValue}
                        timeLeft={timeLeft}
                        mistakes={mistakes}
                        WPM={WPM}
                        CPM={CPM}
                        resetGame={resetGame}
                    />
                    <button className="print-report-button" onClick={printReport}>
                        Print Report
                    </button>
                    <button className="change-difficulty-button" onClick={() => setSelectedDifficulty(null)}>
                        Change Difficulty
                    </button>
                </>
            )}
        </div>
    );
};

export default TyperTrain;
