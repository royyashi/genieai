import React, { useEffect } from 'react';
import { assets } from '../assets/assets';
import moment from 'moment';
import Markdown from 'react-markdown'
import Prism from 'prismjs'


const Message = ({ message }) => {

    useEffect(()=>{
        Prism.highlightAll()
    },[message.content])

    return (
        <div className='w-full'>

            {message.role === "user" ? (

                <div className='flex justify-end items-start gap-2 my-4 w-full'>

                    <div className='flex flex-col gap-2 px-4 py-2 rounded-xl bg-slate-50 dark:bg-[#57317C]/30 border border-[#80609F]/30 max-w-[80%] break-words'>

                        <p className='text-sm dark:text-primary break-words'>
                            {message.content}
                        </p>

                        <span className='text-xs text-gray-400 dark:text-[#B1A6C0]'>
                            {moment(message.timestamp).fromNow()}
                        </span>

                    </div>

                    <img
                        src={assets.user_icon}
                        alt=""
                        className='w-8 h-8 rounded-full shrink-0'
                    />

                </div>

            ) : (

                <div className='flex justify-start my-4 w-full'>

                    <div className='flex flex-col gap-2 px-4 py-2 rounded-xl bg-primary/20 dark:bg-[#57317C]/30 border border-[#80609F]/30 max-w-[80%] break-words'>

                        {message.isImage ? (

                            <img
                                src={message.content}
                                alt=""
                                className='w-full max-w-xs rounded-lg'
                            />

                        ) : (

                            <div className='text-sm dark:text-primary break-words reset-tw'>
                               <Markdown>{message.content}</Markdown> 
                            </div>

                        )}

                        <span className='text-xs text-gray-400 dark:text-[#B1A6C0]'>
                            {moment(message.timestamp).fromNow()}
                        </span>

                    </div>

                </div>

            )}

        </div>
    );
};

export default Message;