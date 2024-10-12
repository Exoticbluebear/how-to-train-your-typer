import React, { useState, useEffect, useRef } from 'react';
import './TyperTrain.scss';
import TypingArea from './TypingArea';
import DifficultySelector from './DifficultySelector';

const TyperTrain = () => {
    const paragraphs = {
        Easy: [
            "The cat sits on the mat.",
            "Birds can fly in the sky."
        ],
        Medium: [
            "A plant is one of the most important living things that develop on the earth.",
            "The root is the part of the plant that grows in the soil."
        ],
        Hard: [
            "An aunt is a bassoon from the right perspective.",
            "One cannot separate foods from blowzy bows."
        ],
    };

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

    const loadParagraph = () => {
        if (!selectedDifficulty) return;
        const ranIndex = Math.floor(Math.random() * paragraphs[selectedDifficulty].length);
        const selectedText = paragraphs[selectedDifficulty][ranIndex];
        setCurrentParagraph(selectedText);
        const content = Array.from(selectedText).map((letter, index) => (
            <span
                key={index}
                style={{ color: (letter !== ' ') ? 'black' : 'transparent' }}
                className={`char ${index === 0 ? 'active' : ''}`}
            >
                {(letter !== ' ') ? letter : '_'}
            </span>
        ));
        setTypingText(content);
        setInpFieldValue('');
        setCharIndex(0);
        setMistakes(0);
        setIsTyping(false);
        inputRef.current.focus();
    };

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
            span.classList.remove("correct");
            span.classList.remove('wrong');
            span.classList.remove('active');
        });
        loadParagraph();
    };

    const initTyping = (event) => {
        const characters = document.querySelectorAll('.char');
        let typedChar = event.target.value;
        if (charIndex < characters.length && timeLeft > 0) {
            let currentChar = characters[charIndex].innerText;
            if (currentChar === '_') currentChar = ' ';
            if (!isTyping) {
                setIsTyping(true);
            }
            if (typedChar === currentChar) {
                setCharIndex(charIndex + 1);
                if (charIndex + 1 < characters.length) characters[charIndex + 1].classList.add('active');
                characters[charIndex].classList.remove('active');
                characters[charIndex].classList.add('correct');
            } else {
                setCharIndex(charIndex + 1);
                setMistakes(mistakes + 1);
                characters[charIndex].classList.remove('active');
                if (charIndex + 1 < characters.length) characters[charIndex + 1].classList.add('active');
                characters[charIndex].classList.add('wrong');
            }

            if (charIndex === characters.length - 1) setIsTyping(false);

            let wpm = Math.round(((charIndex - mistakes) / 5) / (maxTime - timeLeft) * 60);
            wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
            setWPM(wpm);

            let cpm = (charIndex - mistakes) * (60 / (maxTime - timeLeft));
            cpm = cpm < 0 || !cpm || cpm === Infinity ? 0 : cpm;
            setCPM(parseInt(cpm, 10));
        } else {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (event) => {
        const characters = document.querySelectorAll('.char');
        if (event.key === 'Backspace' && charIndex > 0 && charIndex < characters.length && timeLeft > 0) {
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
            let cpm = (charIndex - mistakes - 1) * (60 / (maxTime - timeLeft));
            cpm = cpm < 0 || !cpm || cpm === Infinity ? 0 : cpm;
            setCPM(parseInt(cpm, 10));
            let wpm = Math.round(((charIndex - mistakes) / 5) / (maxTime - timeLeft) * 60);
            wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
            setWPM(wpm);
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

                <p><p><p>

                <p class="instructions-head" style="text-decoration: underline;"><strong>Instructions for Reading the Report:</strong></p>

                <p><strong>Typed Paragraph:</strong> The paragraph you attempted to type is displayed with your progress.</p>

                <p><strong>Underlined Text:</strong> The portion of the text that you typed correctly is underlined.</p>

                <p><strong>Total Characters:</strong> This shows the total number of characters in the paragraph you were typing.</p>

                <p><strong>Mistakes:</strong> This indicates the number of incorrect characters you typed, which are not underlined.</p>

                <p><strong>WPM (Words Per Minute):</strong> This metric represents your typing speed based on the number of correctly typed words in a minute.</p>

                <p><strong>CPM (Characters Per Minute):</strong> This displays the number of characters you typed correctly per minute.</p>

                </p>
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
    }, [selectedDifficulty]);

    useEffect(() => {
        let interval;
        if (isTyping && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
                let cpm = (charIndex - mistakes) * (60 / (maxTime - timeLeft));
                cpm = cpm < 0 || !cpm || cpm === Infinity ? 0 : cpm;
                setCPM(parseInt(cpm, 10));
                let wpm = Math.round(((charIndex - mistakes) / 5) / (maxTime - timeLeft) * 60);
                wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
                setWPM(wpm);
            }, 1000);
        } else if (timeLeft === 0) {
            clearInterval(interval);
            setIsTyping(false);
        }
        return () => {
            clearInterval(interval);
        };
    }, [isTyping, timeLeft]);

    return (
        <div className="container">
            { !selectedDifficulty ? (
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
