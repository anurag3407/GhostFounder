'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  IconNews,
  IconRefresh,
  IconExternalLink,
  IconClock,
  IconTrendingUp,
  IconRocket,
  IconCurrencyDollar,
  IconBulb,
  IconFilter,
  IconBookmark,
  IconSearch,
  IconLoader2
} from '@tabler/icons-react';
import { useAuth } from '@/context/AuthContext';

export default function NewsBanshePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [news, setNews] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedArticles, setSavedArticles] = useState([]);

  useEffect(() => {
    fetchNews();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, selectedCategory]);

  const fetchNews = async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const categoryParam = selectedCategory !== 'all' ? `&category=${selectedCategory}` : '';
      const res = await fetch(`/api/agents/news-banshee?userId=${user.uid}${categoryParam}&limit=20`);
      const data = await res.json();
      if (data.success) {
        setNews(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch news:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshNews = async () => {
    if (!user?.uid) return;
    setRefreshing(true);
    try {
      await fetch('/api/agents/news-banshee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          categories: categories.map(c => c.id).filter(c => c !== 'all'),
          keywords: searchQuery ? [searchQuery] : []
        })
      });
      await fetchNews();
    } catch (error) {
      console.error('Failed to refresh news:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const toggleSave = (article) => {
    if (savedArticles.find(a => a.url === article.url)) {
      setSavedArticles(savedArticles.filter(a => a.url !== article.url));
    } else {
      setSavedArticles([...savedArticles, article]);
    }
  };

  const categories = [
    { id: 'all', label: 'All News', icon: IconNews, color: 'ghost-blue' },
    { id: 'funding', label: 'Funding', icon: IconCurrencyDollar, color: 'neon-green' },
    { id: 'startups', label: 'Startups', icon: IconRocket, color: 'ghost-gold' },
    { id: 'technology', label: 'Tech', icon: IconBulb, color: 'cyan-500' },
    { id: 'trends', label: 'Trends', icon: IconTrendingUp, color: 'pink-500' }
  ];

  const getCategoryColor = (category) => {
    const cat = categories.find(c => c.id === category);
    return cat?.color || 'ghost-blue';
  };

  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.id === category);
    return cat?.icon || IconNews;
  };

  const filteredNews = news.filter(article => 
    !searchQuery || 
    article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.summary?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-neon-green/20 to-neon-green/5 flex items-center justify-center border border-neon-green/30">
              <IconNews className="w-8 h-8 text-neon-green" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">News Banshee</h1>
              <p className="text-gray-400">Daily Startup & Tech News Aggregator</p>
            </div>
          </div>
          
          <button
            onClick={refreshNews}
            disabled={refreshing}
            className="px-6 py-3 bg-neon-green text-black font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
          >
            {refreshing ? (
              <IconLoader2 className="w-5 h-5 animate-spin" />
            ) : (
              <IconRefresh className="w-5 h-5" />
            )}
            Refresh News
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          {/* Search */}
          <div className="relative flex-1">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news..."
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-neon-green/50 focus:outline-none transition-colors"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                  selectedCategory === cat.id
                    ? `bg-${cat.color} text-black`
                    : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                }`}
              >
                <cat.icon className="w-4 h-4" />
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Articles', value: news.length, icon: IconNews, color: 'ghost-blue' },
          { label: 'Funding News', value: news.filter(n => n.category === 'funding').length, icon: IconCurrencyDollar, color: 'neon-green' },
          { label: 'Startup News', value: news.filter(n => n.category === 'startups').length, icon: IconRocket, color: 'ghost-gold' },
          { label: 'Saved', value: savedArticles.length, icon: IconBookmark, color: 'pink-500' }
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-ghost-dark/50 border border-white/10 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-6 h-6 text-${stat.color}`} />
              <span className={`text-2xl font-bold text-${stat.color}`}>{stat.value}</span>
            </div>
            <p className="text-gray-400 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* News Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-3 border-neon-green border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredNews.length === 0 ? (
        <div className="text-center py-20">
          <IconNews className="w-20 h-20 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-2">No news articles yet</p>
          <p className="text-gray-500">Click &quot;Refresh News&quot; to fetch the latest articles</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredNews.map((article, i) => {
              const CategoryIcon = getCategoryIcon(article.category);
              const isSaved = savedArticles.find(a => a.url === article.url);
              
              return (
                <motion.div
                  key={article.url || i}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.03 }}
                  className="bg-ghost-dark/50 border border-white/10 rounded-xl overflow-hidden hover:border-neon-green/30 transition-colors group"
                >
                  {/* Image */}
                  {article.imageUrl && (
                    <div className="relative h-40 overflow-hidden">
                      <Image 
                        src={article.imageUrl} 
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ghost-dark to-transparent" />
                      <span className={`absolute bottom-2 left-2 px-2 py-1 rounded text-xs bg-${getCategoryColor(article.category)}/20 text-${getCategoryColor(article.category)} flex items-center gap-1`}>
                        <CategoryIcon className="w-3 h-3" />
                        {article.category}
                      </span>
                    </div>
                  )}

                  <div className="p-4">
                    {/* Source & Time */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500">{article.source}</span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <IconClock className="w-3 h-3" />
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-white font-semibold mb-2 line-clamp-2 group-hover:text-neon-green transition-colors">
                      {article.title}
                    </h3>

                    {/* Summary */}
                    <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                      {article.summary || article.description}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neon-green text-sm flex items-center gap-1 hover:underline"
                      >
                        Read More
                        <IconExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => toggleSave(article)}
                        className={`p-2 rounded-lg transition-colors ${
                          isSaved 
                            ? 'bg-neon-green/20 text-neon-green' 
                            : 'hover:bg-white/10 text-gray-400'
                        }`}
                      >
                        <IconBookmark className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Saved Articles Sidebar */}
      {savedArticles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed right-4 top-24 w-80 bg-ghost-dark border border-white/10 rounded-xl p-4 max-h-[80vh] overflow-hidden shadow-2xl"
        >
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <IconBookmark className="w-5 h-5 text-neon-green" />
            Saved Articles ({savedArticles.length})
          </h3>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {savedArticles.map((article, i) => (
              <div 
                key={i}
                className="p-3 bg-white/5 rounded-lg"
              >
                <p className="text-white text-sm line-clamp-2 mb-1">{article.title}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{article.source}</span>
                  <button
                    onClick={() => toggleSave(article)}
                    className="text-xs text-red-400 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Filter Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-8 p-4 bg-ghost-dark/30 border border-white/5 rounded-xl flex items-center gap-3"
      >
        <IconFilter className="w-5 h-5 text-gray-500" />
        <p className="text-gray-500 text-sm">
          News is automatically refreshed daily. Articles are curated based on relevance to startups, technology, and venture funding.
        </p>
      </motion.div>
    </div>
  );
}
