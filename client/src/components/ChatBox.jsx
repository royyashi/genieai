import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import Message from './Message';

const ChatBox = () => {

    const containerRef = useRef(null);

    const { selectedChat, theme, user, axios, token, setUser } = useAppContext();

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [mode, setMode] = useState('text');
    const [isPublished, setIsPublished] = useState(false);

    const onSubmit = async (e) => {
        
        try {
            e.preventDefault()
            if(!user) return toast('Login to send message')
                setLoading(true)
                const promptCopy = prompt
                setPrompt('')
                setMessages(prev => [...prev, {role: 'user', content: prompt, timestamp: Date.now(), isImage: false}])
                const { data } = await axios.post(`/api/message/${mode}`, {chatId: selectedChat._id, prompt, isPublished},{headers: {Authorization: token}})

                if(data.success){
                    setMessages(prev => [...prev, data.reply])
                }
                else{
                    toast.error(data.message)
                    setPrompt(promptCopy)
                }
        } catch (error) {
            toast.error(error.message)
        }finally{
            setPrompt('')
            setLoading(false)
        }
    };

    useEffect(() => {
        if (selectedChat) {
            setMessages(selectedChat.messages);
        }
    }, [selectedChat]);

    useEffect(()=>{
        if(containerRef.current){
            containerRef.current.scrollTo({
                top: containerRef.current.scrollHeight,
                behavior: "smooth",
            })
        }
    },[messages])

    return (

        <div className='h-full w-full flex justify-center overflow-x-hidden'>

            <div className='w-full max-w-4xl flex flex-col h-full px-2 sm:px-4 md:px-6 relative'>

                {/* Messages */}
                <div ref={containerRef} className='flex-1 overflow-y-auto py-4 pb-32'>

                    {messages.length === 0 && (

                        <div className='h-full flex flex-col items-center justify-center gap-4 px-4'>


                            <p className='text-3xl sm:text-5xl text-center text-gray-400 dark:text-white font-medium'>
                                What's on your mind?
                            </p>

                        </div>
                    )}

                    {messages.map((message, index) => (
                        <Message
                            key={index}
                            message={message}
                        />
                    ))}

                    {/* Loading */}
                    {loading && (
                        <div className='loader flex items-center gap-1.5 px-2 py-2'>
                            <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
                            <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce delay-100'></div>
                            <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce delay-200'></div>
                        </div>
                    )}

                </div>

                {/* Publish Checkbox */}
                {mode === 'image' && (
    <div className='w-full flex justify-center mb-3'>
        <label className='inline-flex items-center gap-2 text-sm bg-white dark:bg-[#2a1d3d] px-4 py-2 rounded-full shadow-md'>
            
            <p className='text-xs text-gray-700 dark:text-gray-200'>
                Publish Generated Image to Community
            </p>

            <input
                type="checkbox"
                className='cursor-pointer'
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
            />
            
        </label>
    </div>
)}

                {/* Input Box */}
                <div className='w-full flex justify-center pb-4'>
    <form
        onSubmit={onSubmit}
        className='w-full max-w-2xl bg-primary/20 dark:bg-[#583C79]/30 border border-primary dark:border-[#80609F]/30 rounded-full p-3 pl-4 flex items-center gap-4 backdrop-blur-md shadow-lg'
    >

        <select
            onChange={(e) => setMode(e.target.value)}
            value={mode}
            className="text-sm pl-2 pr-2 outline-none bg-transparent dark:text-white"
        >
            <option className="dark:bg-purple-900" value="text">
                Text
            </option>

            <option className="dark:bg-purple-900" value="image">
                Image
            </option>
        </select>

        <input
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            className="flex-1 w-full text-sm outline-none bg-transparent dark:text-white placeholder-gray-500 dark:placeholder-gray-300"
            type="text"
            placeholder='Type your prompt here...'
            required
        />

        <button disabled={loading}>
            <img
                src={loading ? assets.stop_icon : assets.send_icon}
                className='w-8 cursor-pointer'
                alt=""
            />
        </button>

    </form>
</div>

            </div>
        </div>
    );
};

export default ChatBox;