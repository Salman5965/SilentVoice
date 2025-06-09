import React, { useState, useEffect, useRef } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Share2, 
  Calendar, 
  Clock, 
  Eye,
  Heart,
  MessageCircle,
  ExternalLink,
  Copy,
  Twitter,
  Facebook,
  Linkedin,
  Mail,
  Loader2,
  AlertCircle,
  Search,
  Filter
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { blogService } from "@/services/blogService"; 

// Custom Select Component
const Select = ({ value, onValueChange, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);
  
  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const handleSelect = (newValue) => {
    setSelectedValue(newValue);
    onValueChange(newValue);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {React.Children.map(children, child => {
        if (child.type === SelectTrigger) {
          return React.cloneElement(child, {
            onClick: () => setIsOpen(!isOpen),
            isOpen,
            selectedValue
          });
        }
        if (child.type === SelectContent) {
          return isOpen ? React.cloneElement(child, {
            onSelect: handleSelect,
            onClose: () => setIsOpen(false)
          }) : null;
        }
        return child;
      })}
    </div>
  );
};

const SelectTrigger = ({ children, onClick, isOpen, selectedValue, className = "" }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
  >
    <span>{children}</span>
    <svg
      className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9l6 6 6-6" />
    </svg>
  </button>
);

const SelectValue = ({ placeholder, children }) => {
  const parent = React.useContext(React.createContext());
  return <span>{children || placeholder}</span>;
};

const SelectContent = ({ children, onSelect, onClose }) => {
  const ref = useRef();
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute top-full left-0 z-50 min-w-[8rem] w-full overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95"
    >
      {React.Children.map(children, child => 
        React.cloneElement(child, { onSelect })
      )}
    </div>
  );
};

const SelectItem = ({ value, children, onSelect }) => (
  <button
    type="button"
    onClick={() => onSelect(value)}
    className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
  >
    {children}
  </button>
);

const ShareButton = ({ blog, className = "" }) => {
  const [copied, setCopied] = useState(false);
  
  const blogUrl = `${window.location.origin}/blog/${blog.slug}`;
  
  const shareOptions = [
    {
      name: "Copy Link",
      icon: Copy,
      action: () => {
        navigator.clipboard.writeText(blogUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    },
    {
      name: "Twitter",
      icon: Twitter,
      action: () => {
        const text = `Check out this blog: ${blog.title}`;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(blogUrl)}`, '_blank');
      }
    },
    {
      name: "Facebook",
      icon: Facebook,
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(blogUrl)}`, '_blank');
      }
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      action: () => {
        const text = `Check out this blog: ${blog.title}`;
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(blogUrl)}&title=${encodeURIComponent(text)}`, '_blank');
      }
    },
    {
      name: "Email",
      icon: Mail,
      action: () => {
        const subject = `Check out this blog: ${blog.title}`;
        const body = `I thought you might find this blog interesting:\n\n${blog.title}\n${blog.excerpt}\n\nRead more: ${blogUrl}`;
        window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
      }
    }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {shareOptions.map((option) => {
          const Icon = option.icon;
          return (
            <DropdownMenuItem key={option.name} onClick={option.action}>
              <Icon className="h-4 w-4 mr-2" />
              {option.name === "Copy Link" && copied ? "Copied!" : option.name}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const BlogCard = ({ blog, onLike }) => {
  const [isLiking, setIsLiking] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleLike = async () => {
    if (isLiking) return;
    
    try {
      setIsLiking(true);
      await blogService.likeBlog(blog.id);
      if (onLike) onLike(blog.id);
    } catch (error) {
      console.error('Error toggling like:', error);
      // Try unlike if like failed
      try {
        await blogService.unlikeBlog(blog.id);
        if (onLike) onLike(blog.id);
      } catch (unlikeError) {
        console.error('Error toggling unlike:', unlikeError);
      }
    } finally {
      setIsLiking(false);
    }
  };

  const handleReadMore = async () => {
    try {
      // Increment view count when user clicks read more
      await blogService.incrementViewCount(blog.id);
      // Navigate to blog detail page
      window.open(`/blog/${blog.slug}`, '_blank');
    } catch (error) {
      console.error('Error incrementing views:', error);
      // Still navigate even if view increment fails
      window.open(`/blog/${blog.slug}`, '_blank');
    }
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-video w-full overflow-hidden rounded-t-lg">
        <img 
          src={blog.image || blog.featuredImage || '/api/placeholder/400/225'} 
          alt={blog.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary">{blog.category || 'Uncategorized'}</Badge>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(blog.publishedAt || blog.createdAt)}
          </div>
        </div>
        <CardTitle className="text-xl leading-tight hover:text-primary transition-colors cursor-pointer">
          {blog.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-muted-foreground mb-4 line-clamp-3">
          {blog.excerpt || blog.description}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {(blog.tags || []).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {blog.readTime || blog.reading_time || 5} min read
            </div>
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              {(blog.views || 0).toLocaleString()}
            </div>
            <button 
              className={`flex items-center hover:text-red-500 transition-colors ${isLiking ? 'opacity-50' : ''}`}
              onClick={handleLike}
              disabled={isLiking}
            >
              <Heart className={`h-4 w-4 mr-1 ${blog.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              {blog.likes || 0}
            </button>
            <div className="flex items-center">
              <MessageCircle className="h-4 w-4 mr-1" />
              {blog.comments || blog.commentsCount || 0}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <Button variant="default" className="flex-1 mr-2" onClick={handleReadMore}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Read More
          </Button>
          <ShareButton blog={blog} />
        </div>
      </CardContent>
    </Card>
  );
};

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <Card key={i} className="h-full">
        <div className="aspect-video w-full bg-muted animate-pulse rounded-t-lg" />
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <div className="h-6 w-16 bg-muted animate-pulse rounded" />
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          </div>
          <div className="h-6 w-3/4 bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2 mb-4">
            <div className="h-4 w-full bg-muted animate-pulse rounded" />
            <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
          </div>
          <div className="flex gap-2 mb-4">
            <div className="h-6 w-12 bg-muted animate-pulse rounded" />
            <div className="h-6 w-16 bg-muted animate-pulse rounded" />
          </div>
          <div className="flex items-center justify-between">
            <div className="h-10 w-24 bg-muted animate-pulse rounded" />
            <div className="h-10 w-20 bg-muted animate-pulse rounded" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export const MyBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [categories, setCategories] = useState(['all']);

  const loadBlogs = async (page = 1, search = searchTerm, author = selectedCategory) => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query object for your BlogService
      const query = {
        page,
        limit: 6,
        isPublished: true, // Only fetch published blogs
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };

      // Add search if provided
      if (search) {
        query.search = search;
      }

      // Add author filter if not 'all'
      if (author && author !== 'all') {
        query.author = author;
      }

      const response = await blogService.getBlogs(query);
      
      // Handle the response structure from your BlogService
      const blogsData = response.blogs || response.data || [];
      const pagination = response.pagination || {};
      
      setBlogs(blogsData);
      setTotalPages(pagination.totalPages || Math.ceil((pagination.total || blogsData.length) / 6));
      setTotalBlogs(pagination.total || blogsData.length);
      setCurrentPage(pagination.page || page);
      
    } catch (err) {
      setError(err.message || 'Failed to load blogs. Please try again later.');
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadTags = async () => {
    try {
      const tags = await blogService.getTags();
      // Convert tags to categories (assuming tags can be used as categories)
      const tagsList = Array.isArray(tags) ? tags : (tags.data || []);
      setCategories(['all', ...tagsList]);
    } catch (err) {
      console.error('Error fetching tags:', err);
      // Keep default categories if fetch fails
      setCategories(['all', 'React', 'Node.js', 'CSS', 'TypeScript', 'API', 'Performance']);
    }
  };

  useEffect(() => {
    loadTags();
    loadBlogs();
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
    loadBlogs(1, value, selectedCategory);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    loadBlogs(1, searchTerm, category);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    loadBlogs(page, searchTerm, selectedCategory);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLike = (blogId) => {
    // Update the blog's like count in the local state
    setBlogs(prevBlogs => 
      prevBlogs.map(b => 
        b.id === blogId 
          ? { ...b, likes: (b.likes || 0) + (b.isLiked ? -1 : 1), isLiked: !b.isLiked }
          : b
      )
    );
  };

  if (error) {
    return (
      <PageWrapper className="py-8">
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
        <div className="text-center mt-4">
          <Button onClick={() => loadBlogs()} variant="outline">
            Try Again
          </Button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">My Blogs</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore my thoughts on web development, programming, and technology
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select category">
                  {selectedCategory === 'all' ? 'All Categories' : selectedCategory}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Summary */}
        {!loading && (
          <div className="mb-6">
            <p className="text-muted-foreground">
              Showing {blogs.length} of {totalBlogs} blog{totalBlogs !== 1 ? 's' : ''}
              {searchTerm && ` for "${searchTerm}"`}
              {selectedCategory !== 'all' && ` in ${selectedCategory}`}
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && <LoadingSkeleton />}

        {/* Blogs Grid */}
        {!loading && blogs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {blogs.map((blog) => (
              <BlogCard 
                key={blog.id} 
                blog={blog} 
                onLike={handleLike}
              />
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && blogs.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-semibold mb-2">No blogs found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedCategory !== 'all'
                  ? "Try adjusting your search or filter criteria."
                  : "No blogs have been published yet."}
              </p>
              {(searchTerm || selectedCategory !== 'all') && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    loadBlogs(1, '', 'all');
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              const isCurrentPage = page === currentPage;
              
              return (
                <Button
                  key={page}
                  variant={isCurrentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className="min-w-[40px]"
                >
                  {page}
                </Button>
              );
            })}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default MyBlogs;