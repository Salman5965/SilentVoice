import React from "react";
import { Badge } from "@/components/ui/badge";
import { Eye, User, Calendar, FolderOpen, Tag, X } from "lucide-react";

// Built-in Dialog components
const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      {/* Dialog content */}
      <div className="relative z-10 w-full max-w-4xl mx-4">
        {children}
      </div>
    </div>
  );
};

const DialogContent = ({ className = "", children, ...props }) => {
  return (
    <div 
      className={`relative bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const DialogHeader = ({ className = "", children, ...props }) => {
  return (
    <div className={`${className}`} {...props}>
      {children}
    </div>
  );
};

const DialogTitle = ({ className = "", children, ...props }) => {
  return (
    <h2 className={`text-lg font-semibold text-gray-900 dark:text-gray-100 ${className}`} {...props}>
      {children}
    </h2>
  );
};

// Built-in Badge component if you don't have it
const BadgeComponent = ({ variant = "default", className = "", children, ...props }) => {
  const variants = {
    default: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    outline: "border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300",
    secondary: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
  };

  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

const BlogPreviewModal = ({ blogData = {}, isOpen = false, onOpenChange }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatContent = (content) => {
    // Convert line breaks to paragraphs for better display
    return content.split('\n\n').map((paragraph, index) => (
      <p key={index} className="mb-4 leading-relaxed">
        {paragraph}
      </p>
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Blog Preview
            </DialogTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </DialogHeader>
        
        <div className="flex-1 px-6 pb-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            {/* Cover Image */}
            {blogData?.coverImage && (
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={blogData.coverImage}
                  alt="Cover"
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Title */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-gray-100">
                {blogData?.title || "Untitled Blog Post"}
              </h1>
              
              {/* Meta Information */}
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>Author Name</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(new Date())}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    blogData?.isPublished 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                  }`}>
                    {blogData?.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>
            </div>

            <hr className="border-t border-gray-200 dark:border-gray-700" />

            {/* Category */}
            {blogData?.category && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FolderOpen className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Category</span>
                </div>
                <Badge variant="outline" className="text-sm">
                  {blogData?.category}
                </Badge>
              </div>
            )}

            {/* Tags */}
            {blogData?.tags && blogData.tags.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Tags</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {blogData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Excerpt */}
            {blogData?.excerpt && (
              <div className="space-y-2">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-blue-500">
                  <p className="text-lg italic text-gray-600 dark:text-gray-400 leading-relaxed">
                    {blogData?.excerpt}
                  </p>
                </div>
              </div>
            )}

            <hr className="border-t border-gray-200 dark:border-gray-700" />

            {/* Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div className="text-base leading-relaxed text-gray-900 dark:text-gray-100">
                {blogData?.content ? (
                  formatContent(blogData.content)
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic">
                    No content available for preview.
                  </p>
                )}
              </div>
            </div>

            {/* Reading Stats */}
            <hr className="border-t border-gray-200 dark:border-gray-700" />
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 py-4">
              <div className="space-x-4">
                <span>{blogData?.content ? blogData.content.split(' ').length : 0} words</span>
                <span>{blogData?.content ? Math.ceil(blogData.content.split(' ').length / 200) : 0} min read</span>
              </div>
              <div className="text-xs">
                Preview generated on {formatDate(new Date())}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlogPreviewModal;