// src/app/views/Community.tsx
import React, { useState } from 'react';

// 定义帖子的数据结构
interface Post {
  id: string;
  author: string;
  avatar: string;
  imageUrl: string;
  description: string;
  likes: number;
}

// 假数据：用于测试 UI 渲染
const MOCK_POSTS: Post[] = [
  {
    id: '1',
    author: 'Design_Pioneer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    imageUrl: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=800&q=80', // 替换成实际生成的生命结构图
    description: 'Exploring the head/tail breaks in urban street networks. Parameters: Depth 5, Variance 0.8.',
    likes: 124,
  },
  {
    id: '2',
    author: 'Arch_Student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    description: 'A beautiful living structure generated using the recursive algorithm!',
    likes: 89,
  },
];

const Community: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);

  const handleLike = (id: string) => {
    // 简单的点赞交互逻辑
    setPosts(posts.map(post => 
      post.id === id ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Discovery Community</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition">
          Share My Creation
        </button>
      </div>

      {/* 瀑布流网格布局 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
            {/* 图片展示区 */}
            <div className="aspect-square bg-gray-100 relative">
              <img 
                src={post.imageUrl} 
                alt="Creation" 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* 内容信息区 */}
            <div className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <img src={post.avatar} alt="avatar" className="w-8 h-8 rounded-full bg-gray-200" />
                <span className="font-medium text-gray-700 text-sm">{post.author}</span>
              </div>
              <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                {post.description}
              </p>
              
              <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                <button 
                  onClick={() => handleLike(post.id)}
                  className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="text-sm">{post.likes}</span>
                </button>
                
                <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                  Fork Parameters
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;