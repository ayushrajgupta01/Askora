import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "./MyContext.jsx";
import {PulseLoader} from "react-spinners";

function ChatWindow() {
    const {prompt, setPrompt, reply, setReply, currThreadId, setPrevChats, setNewChat} = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const getReply = async() => {
        setLoading(true);
        setNewChat(false);
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId
            })
        };
        try {
            const response = await fetch("http://localhost:8080/api/chat", options);
            const res = await response.json();
            setReply(res.reply);
        } catch(err) {
            console.log(err);
        }
        setLoading(false);
    }

    useEffect(() => {
        if(prompt && reply) {
            setPrevChats(prevChats => (
                [...prevChats, {
                    role: "user",
                    content: prompt
                }, {
                    role: "assistant",
                    content: reply
                }]
            ));
            setPrompt("");
        }
    }, [reply]);

const handleProfileClick=() => {
    setIsOpen(!isOpen);
}
    return (
        <div className="chatWindow">
            <div className="navbar">
                <span className="logoname">Askora</span>
                <h3><i>knowledge cutoff 2023</i></h3>
                <div className="userIconDiv" onClick={handleProfileClick}>
                    <span className="shareIcon"><i className="fa-solid fa-arrow-up-from-bracket"></i>&nbsp;Share</span>
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>
            </div>
            {
                isOpen && 
                <div className="dropDown">
                    <div className="dropDownItem">Feature is not developed yet!</div>
                </div>
            }

            <Chat></Chat>

            <PulseLoader color="#fff" loading={loading}></PulseLoader>
            <div className="chatInput">
                <div className="inputBox">
                    <input placeholder="Ask anything"
                           value={prompt}
                           onChange={(event) => setPrompt(event.target.value)}
                            onKeyDown={(event) => event.key === 'Enter' ? getReply() : ''}
                    >
                    </input>
                    <div id="submit" onClick={getReply}>
                        <i className="fa-solid fa-paper-plane"></i>
                    </div>
                </div>
                <p className="info">
                    SigmaGPT can make mistakes. Check important info. See Cookie Preferences.
                </p>
            </div>
            
        </div>
    )
}
export default ChatWindow;