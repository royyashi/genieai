import React, { useEffect, useState } from 'react';
import Loading from './Loading';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Community = () => {

    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    const { axios } = useAppContext();

    const fetchImages = async () => {

        try {

            const { data } = await axios.get('/api/user/published-images');

            if(data.success){
                setImages(data.images || [])
            } else {
                toast.error(data.message);
            }

        } catch (error) {

            toast.error(error.message);

        }

        setLoading(false);
    };

    useEffect(() => {
        fetchImages();
    }, []);

    if (loading) return <Loading />;

    return (
        <div className='flex-1 h-screen overflow-y-auto bg-white dark:bg-[#0F0F1A] p-6 pt-12 xl:px-12 2xl:px-20'>

            <h2 className='text-2xl font-semibold mb-8 text-gray-800 dark:text-white'>
                Community Images
            </h2>

            {images?.length > 0 ? (

                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>

                    {images.map((item, index) => (

                        <a
                            key={index}
                            href={item.imageUrl}
                            target='_blank'
                            rel='noreferrer'
                            className='relative group rounded-xl overflow-hidden border border-gray-200 dark:border-purple-700 shadow-sm hover:shadow-lg transition duration-300'
                        >

                            <img
                                src={item.imageUrl}
                                alt=''
                                className='w-full h-52 object-cover group-hover:scale-105 transition duration-300'
                            />

                            <p className='absolute bottom-0 right-0 text-xs bg-black/60 text-white px-4 py-1 rounded-tl-xl opacity-0 group-hover:opacity-100 transition duration-300'>
                                Created by {item.userName}
                            </p>

                        </a>

                    ))}

                </div>

            ) : (

                <p className='text-center text-gray-600 dark:text-purple-200 mt-10'>
                    No Images Available
                </p>

            )}

        </div>
    );
};

export default Community;