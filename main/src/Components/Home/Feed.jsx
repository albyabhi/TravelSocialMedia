import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import PostWidget from './Widgets/PostWidget';
import axios from 'axios';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef(null);

  useEffect(() => {
    console.log('Effect triggered!');
    const fetchPosts = async () => {
      try {
        console.log(`Fetching posts from http://localhost:5000/posts/all?page=${page}`);
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/posts/all?page=${page}`);
        if (response.data.length > 0) {
          setPosts((prevPosts) => [...prevPosts, ...response.data]);
          setPage((prevPage) => prevPage + 1);
          console.log('Fetched Posts:', response.data);
        } else {
          // No more posts to fetch, stop observing the sentinel element
          observer.disconnect();
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        if (error.response) {
          // The request was made and the server responded with a status code
          console.error('Response status:', error.response.status);
          console.error('Response data:', error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('No response received. Check your network connection.');
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error setting up the request:', error.message);
        }
      } finally {
        setLoading(false);
      }
    };
  
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !loading) {
        fetchPosts();
      }
    }, { threshold: 1 });
  
    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }
  
    // Call fetchPosts only once when the component mounts
    if (page === 1) {
      fetchPosts();
    }
  
    // Cleanup function
    return () => observer.disconnect();
  }, [page, loading]);

  console.log('Current Posts:', posts); // Log current posts to the console

  return (
    <Box flex={4} padding={2}>
      {posts.map((post, index) => (
  <React.Fragment key={post._id}>
    <PostWidget post={post} />
    {index === posts.length - 1 && <div key="sentinel" ref={sentinelRef} style={{ height: '1px' }} />}
  </React.Fragment>
))}
    </Box>
  );
};

export default Feed;
