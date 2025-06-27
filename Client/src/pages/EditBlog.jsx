// import React, { useState, useRef, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { PageWrapper } from "@/components/layout/PageWrapper";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { Switch } from "@/components/ui/switch";
// import { Badge } from "@/components/ui/badge";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { useBlogEditor } from "@/hooks/useBlogEditor";
// import { useBlogStore } from "@/features/blogs/blogStore";
// import { ROUTES } from "@/utils/constant";
// import {
//   ArrowLeft,
//   Save,
//   Eye,
//   Plus,
//   X,
//   Loader2,
//   FolderOpen,
//   ChevronDown,
//   Upload,
//   Link,
//   Image,
//   AlertCircle,
// } from "lucide-react";
// import BlogPreviewModal from "@/components/ui/previewDialog";

// const BLOG_CATEGORIES = [
//   "Technology",
//   "Programming",
//   "Web Development",
//   "Mobile Development",
//   "Data Science",
//   "Machine Learning",
//   "Artificial Intelligence",
//   "Cybersecurity",
//   "DevOps",
//   "Tutorial",
//   "News",
//   "Opinion",
//   "Review",
//   "Guide",
//   "Tips",
//   "Business",
//   "Career",
//   "Personal",
//   "Lifestyle",
//   "Health",
//   "Travel",
//   "Food",
//   "Entertainment",
//   "Sports",
//   "Education",
// ];

// const CustomSelect = ({ value, onValueChange, placeholder, options }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   const selectedOption = options.find((option) => option.value === value);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleSelect = (optionValue) => {
//     setIsOpen(false);

//     if (onValueChange) {
//       onValueChange(optionValue);
//     }
//   };

//   return (
//     <div className="relative" ref={dropdownRef}>
//       <button
//         type="button"
//         className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <span
//           className={
//             selectedOption ? "text-foreground" : "text-muted-foreground"
//           }
//         >
//           {selectedOption ? selectedOption.label : placeholder}
//         </span>
//         <ChevronDown
//           className={`h-4 w-4 opacity-50 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
//         />
//       </button>

//       {isOpen && (
//         <div className="absolute z-[99999] mt-1 w-full max-h-60 overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95">
//           {options.map((option) => (
//             <button
//               key={option.value}
//               type="button"
//               className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
//               onClick={() => handleSelect(option.value)}
//             >
//               {option.label}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export const EditBlog = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const {
//     updateBlog,
//     getBlogById,
//     currentBlog,
//     isLoading: storeLoading,
//   } = useBlogStore();
//   const [newTag, setNewTag] = useState("");
//   const [isSaving, setIsSaving] = useState(false);
//   const [isInitialLoading, setIsInitialLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isPreviewOpen, setIsPreviewOpen] = useState(false);
//   const [imageUploadMode, setImageUploadMode] = useState("url");
//   const [isUploading, setIsUploading] = useState(false);
//   const fileInputRef = useRef(null);

//   const {
//     title,
//     content,
//     excerpt,
//     coverImage,
//     category,
//     tags,
//     isPublished,
//     isDirty,
//     setTitle,
//     setContent,
//     setExcerpt,
//     setCoverImage,
//     setCategory,
//     setIsPublished,
//     addTag,
//     removeTag,
//     generateExcerpt,
//     getBlogData,
//     reset,
//     populateFromBlog,
//   } = useBlogEditor({
//     autoSave: false, // Disable auto-save for editing
//   });

//   // Load blog data on component mount
//   useEffect(() => {
//     const loadBlogData = async () => {
//       if (!id) {
//         setError("Blog ID is required");
//         setIsInitialLoading(false);
//         return;
//       }

//       try {
//         setIsInitialLoading(true);
//         setError(null);

//         // Fetch blog data
//         const blog = await getBlogById(id);

//         if (blog) {
//           // Populate form with blog data
//           populateFromBlog(blog);
//         } else {
//           setError("Blog not found");
//         }
//       } catch (err) {
//         console.error("Error loading blog:", err);
//         setError(err instanceof Error ? err.message : "Failed to load blog");
//       } finally {
//         setIsInitialLoading(false);
//       }
//     };

//     loadBlogData();
//   }, [id, getBlogById, populateFromBlog]);

//   const handleAddTag = () => {
//     if (newTag.trim()) {
//       addTag(newTag.trim());
//       setNewTag("");
//     }
//   };

//   const handleSave = async (publish = null) => {
//     try {
//       setError(null);
//       setIsSaving(true);

//       const updatedData = {
//         ...getBlogData(),
//         status:
//           publish !== null ? (publish ? "published" : "draft") : undefined,
//       };

//       // Remove undefined values
//       Object.keys(updatedData).forEach((key) => {
//         if (updatedData[key] === undefined) {
//           delete updatedData[key];
//         }
//       });

//       const updatedBlog = await updateBlog(id, updatedData);

//       if (updatedBlog) {
//         // Navigate based on publish status
//         if (publish === true) {
//           navigate(
//             `${ROUTES.BLOG_DETAILS}/${updatedBlog.slug || updatedBlog._id}`,
//           );
//         } else {
//           navigate(ROUTES.MY_BLOGS);
//         }
//       }
//     } catch (err) {
//       console.error("Error saving blog:", err);
//       setError(err instanceof Error ? err.message : "Failed to save blog");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handlePreview = () => {
//     setIsPreviewOpen(true);
//   };

//   // Handle file upload
//   const handleFileUpload = async (event) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     // Validate file type
//     if (!file.type.startsWith("image/")) {
//       setError("Please select a valid image file");
//       return;
//     }

//     // Validate file size (5MB limit)
//     if (file.size > 5 * 1024 * 1024) {
//       setError("Image size should be less than 5MB");
//       return;
//     }

//     try {
//       setIsUploading(true);
//       setError(null);

//       // Convert file to base64 (replace with actual upload logic)
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setCoverImage(e.target?.result);
//       };
//       reader.readAsDataURL(file);
//     } catch (err) {
//       setError("Failed to upload image");
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const isFormValid =
//     title.trim().length > 0 &&
//     content.trim().length > 0 &&
//     category &&
//     category.length > 0;

//   // Helper function to get category label from slug
//   const getCategoryLabel = (categorySlug) => {
//     return (
//       BLOG_CATEGORIES.find(
//         (cat) => cat.toLowerCase().replace(/\s+/g, "-") === categorySlug,
//       ) || categorySlug
//     );
//   };

//   // Prepare category options for CustomSelect
//   const categoryOptions = BLOG_CATEGORIES.map((cat) => ({
//     value: cat.toLowerCase().replace(/\s+/g, "-"),
//     label: cat,
//   }));

//   // Handle category change
//   const handleCategoryChange = (selectedCategory) => {
//     setCategory(selectedCategory);
//   };

//   // Show loading spinner while fetching blog data
//   if (isInitialLoading) {
//     return (
//       <PageWrapper className="py-8" maxWidth="4xl">
//         <div className="flex items-center justify-center min-h-[400px]">
//           <div className="text-center">
//             <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
//             <p className="text-muted-foreground">Loading blog data...</p>
//           </div>
//         </div>
//       </PageWrapper>
//     );
//   }

//   // Show error state if blog couldn't be loaded
//   if (error && !currentBlog) {
//     return (
//       <PageWrapper className="py-8" maxWidth="4xl">
//         <div className="flex items-center justify-center min-h-[400px]">
//           <div className="text-center">
//             <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
//             <h2 className="text-xl font-semibold mb-2">Failed to Load Blog</h2>
//             <p className="text-muted-foreground mb-4">{error}</p>
//             <div className="space-x-2">
//               <Button
//                 variant="outline"
//                 onClick={() => navigate(ROUTES.MY_BLOGS)}
//               >
//                 Back to My Blogs
//               </Button>
//               <Button onClick={() => window.location.reload()}>
//                 Try Again
//               </Button>
//             </div>
//           </div>
//         </div>
//       </PageWrapper>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <PageWrapper className="py-8" maxWidth="4xl">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div className="flex items-center space-x-4">
//             <Button variant="ghost" onClick={() => navigate(ROUTES.MY_BLOGS)}>
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               Back to My Blogs
//             </Button>
//             <div>
//               <h1 className="text-2xl font-bold">Edit Blog</h1>
//               {currentBlog && (
//                 <p className="text-sm text-muted-foreground">
//                   Last updated:{" "}
//                   {new Date(currentBlog.updatedAt).toLocaleDateString()}
//                 </p>
//               )}
//             </div>
//           </div>

//           <div className="flex items-center space-x-2">
//             <Button
//               variant="outline"
//               onClick={handlePreview}
//               disabled={!isFormValid}
//             >
//               <Eye className="h-4 w-4 mr-2" />
//               Preview
//             </Button>

//             <Button
//               variant="outline"
//               onClick={() => handleSave(false)}
//               disabled={!isFormValid || isSaving}
//             >
//               {isSaving ? (
//                 <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//               ) : (
//                 <Save className="h-4 w-4 mr-2" />
//               )}
//               Save Draft
//             </Button>

//             <Button
//               onClick={() => handleSave(true)}
//               disabled={!isFormValid || isSaving}
//             >
//               {isSaving ? (
//                 <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//               ) : null}
//               Update & Publish
//             </Button>
//           </div>
//         </div>

//         {error && (
//           <Alert variant="destructive" className="mb-6">
//             <AlertDescription>{error}</AlertDescription>
//           </Alert>
//         )}

//         {/* Form */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Main Content */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Title */}
//             <div className="space-y-2">
//               <Label htmlFor="title">Title *</Label>
//               <Input
//                 id="title"
//                 placeholder="Enter your blog title..."
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 className="text-xl font-semibold"
//               />
//             </div>

//             {/* Cover Image */}
//             <div className="space-y-2">
//               <Label>Cover Image</Label>

//               {/* Image Upload Mode Toggle */}
//               <div className="flex items-center space-x-2 mb-3">
//                 <Button
//                   type="button"
//                   variant={imageUploadMode === "url" ? "default" : "outline"}
//                   size="sm"
//                   onClick={() => setImageUploadMode("url")}
//                 >
//                   <Link className="h-4 w-4 mr-2" />
//                   URL
//                 </Button>
//                 <Button
//                   type="button"
//                   variant={imageUploadMode === "upload" ? "default" : "outline"}
//                   size="sm"
//                   onClick={() => setImageUploadMode("upload")}
//                 >
//                   <Upload className="h-4 w-4 mr-2" />
//                   Upload
//                 </Button>
//               </div>

//               {imageUploadMode === "url" ? (
//                 <Input
//                   placeholder="https://example.com/image.jpg"
//                   value={coverImage}
//                   onChange={(e) => setCoverImage(e.target.value)}
//                   onPaste={(e) => {
//                     e.stopPropagation();
//                   }}
//                 />
//               ) : (
//                 <div className="flex items-center space-x-2">
//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     accept="image/*"
//                     onChange={handleFileUpload}
//                     className="hidden"
//                   />
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={() => fileInputRef.current?.click()}
//                     disabled={isUploading}
//                     className="flex-1"
//                   >
//                     {isUploading ? (
//                       <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                     ) : (
//                       <Image className="h-4 w-4 mr-2" />
//                     )}
//                     {isUploading ? "Uploading..." : "Choose Image"}
//                   </Button>
//                   {coverImage && (
//                     <Button
//                       type="button"
//                       variant="outline"
//                       size="sm"
//                       onClick={() => setCoverImage("")}
//                     >
//                       <X className="h-4 w-4" />
//                     </Button>
//                   )}
//                 </div>
//               )}

//               {coverImage && (
//                 <div className="mt-2">
//                   <img
//                     src={coverImage}
//                     alt="Cover preview"
//                     className="w-full h-48 object-cover rounded-md border"
//                     onError={() => {
//                       setCoverImage("");
//                       setError(
//                         "Failed to load image. Please check the URL or try a different image.",
//                       );
//                     }}
//                   />
//                 </div>
//               )}
//             </div>

//             {/* Category */}
//             <div className="space-y-2">
//               <Label htmlFor="category">Category *</Label>
//               <CustomSelect
//                 value={category}
//                 onValueChange={handleCategoryChange}
//                 placeholder="Select a category..."
//                 options={categoryOptions}
//               />
//             </div>

//             {/* Content */}
//             <div className="space-y-2">
//               <Label htmlFor="content">Content *</Label>
//               <Textarea
//                 id="content"
//                 placeholder="Write your blog content here..."
//                 value={content}
//                 onChange={(e) => setContent(e.target.value)}
//                 className="min-h-[400px] resize-none"
//                 onPaste={(e) => {
//                   e.stopPropagation();
//                 }}
//               />
//               <p className="text-sm text-muted-foreground">
//                 {content.length} characters
//               </p>
//             </div>
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-6">
//             {/* Blog Status */}
//             {currentBlog && (
//               <div className="p-4 border rounded-lg space-y-4">
//                 <h3 className="font-semibold">Blog Status</h3>
//                 <div className="space-y-2">
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm font-medium">Status:</span>
//                     <Badge
//                       variant={
//                         currentBlog.status === "published"
//                           ? "default"
//                           : "secondary"
//                       }
//                     >
//                       {currentBlog.status || "draft"}
//                     </Badge>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm font-medium">Views:</span>
//                     <span className="text-sm text-muted-foreground">
//                       {currentBlog.views || 0}
//                     </span>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm font-medium">Likes:</span>
//                     <span className="text-sm text-muted-foreground">
//                       {currentBlog.likes?.length || 0}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Publish Settings */}
//             <div className="p-4 border rounded-lg space-y-4">
//               <h3 className="font-semibold">Publish Settings</h3>

//               <div className="flex items-center justify-between">
//                 <Label htmlFor="published">Publish after update</Label>
//                 <Switch
//                   id="published"
//                   checked={isPublished}
//                   onCheckedChange={setIsPublished}
//                 />
//               </div>

//               {/* Category Display */}
//               {category && (
//                 <div className="space-y-2">
//                   <Label className="text-sm font-medium">
//                     Selected Category
//                   </Label>
//                   <div className="flex items-center gap-2">
//                     <FolderOpen className="h-4 w-4 text-muted-foreground" />
//                     <Badge variant="secondary" className="text-xs">
//                       {getCategoryLabel(category)}
//                     </Badge>
//                   </div>
//                 </div>
//               )}

//               {isDirty && (
//                 <p className="text-sm text-muted-foreground">
//                   You have unsaved changes
//                 </p>
//               )}
//             </div>

//             {/* Excerpt */}
//             <div className="p-4 border rounded-lg space-y-4">
//               <div className="flex items-center justify-between">
//                 <h3 className="font-semibold">Excerpt</h3>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={generateExcerpt}
//                   disabled={!content.trim()}
//                 >
//                   Auto-generate
//                 </Button>
//               </div>

//               <Textarea
//                 placeholder="Brief description of your blog..."
//                 value={excerpt}
//                 onChange={(e) => setExcerpt(e.target.value)}
//                 className="resize-none"
//                 rows={3}
//                 maxLength={200}
//               />
//               <p className="text-sm text-muted-foreground">
//                 {excerpt.length}/200 characters
//               </p>
//             </div>

//             {/* Tags */}
//             <div className="p-4 border rounded-lg space-y-4">
//               <h3 className="font-semibold">Tags</h3>

//               <div className="flex space-x-2">
//                 <Input
//                   placeholder="Add a tag..."
//                   value={newTag}
//                   onChange={(e) => setNewTag(e.target.value)}
//                   onKeyPress={(e) => {
//                     if (e.key === "Enter") {
//                       e.preventDefault();
//                       handleAddTag();
//                     }
//                   }}
//                   maxLength={50}
//                 />
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={handleAddTag}
//                   disabled={!newTag.trim()}
//                 >
//                   <Plus className="h-4 w-4" />
//                 </Button>
//               </div>

//               {tags.length > 0 && (
//                 <div className="flex flex-wrap gap-2">
//                   {tags.map((tag) => (
//                     <Badge key={tag} variant="secondary" className="group">
//                       {tag}
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         className="ml-1 h-auto p-0 opacity-0 group-hover:opacity-100 transition-opacity"
//                         onClick={() => removeTag(tag)}
//                       >
//                         <X className="h-3 w-3" />
//                       </Button>
//                     </Badge>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Preview Modal */}
//         <BlogPreviewModal
//           blogData={getBlogData()}
//           isOpen={isPreviewOpen}
//           onOpenChange={setIsPreviewOpen}
//         />
//       </PageWrapper>
//     </div>
//   );
// };

// export default EditBlog;




import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useBlogEditor } from "@/hooks/useBlogEditor";
import { useBlogStore } from "@/features/blogs/blogStore";
import { ROUTES } from "@/utils/constant";
import {
  ArrowLeft,
  Save,
  Eye,
  Plus,
  X,
  Loader2,
  FolderOpen,
  ChevronDown,
  Upload,
  Link,
  Image,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import BlogPreviewModal from "@/components/ui/previewDialog";

const BLOG_CATEGORIES = [
  "Technology",
  "Programming",
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Machine Learning",
  "Artificial Intelligence",
  "Cybersecurity",
  "DevOps",
  "Tutorial",
  "News",
  "Opinion",
  "Review",
  "Guide",
  "Tips",
  "Business",
  "Career",
  "Personal",
  "Lifestyle",
  "Health",
  "Travel",
  "Food",
  "Entertainment",
  "Sports",
  "Education",
];

const CustomSelect = ({ value, onValueChange, placeholder, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find((option) => option.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    setIsOpen(false);

    if (onValueChange) {
      onValueChange(optionValue);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span
          className={
            selectedOption ? "text-foreground" : "text-muted-foreground"
          }
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`h-4 w-4 opacity-50 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-[99999] mt-1 w-full max-h-60 overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    updateBlog,
    getBlogById,
    currentBlog,
    isLoading: storeLoading,
  } = useBlogStore();
  const [newTag, setNewTag] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [imageUploadMode, setImageUploadMode] = useState("url");
  const [isUploading, setIsUploading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const fileInputRef = useRef(null);

  const {
    title,
    content,
    excerpt,
    coverImage,
    category,
    tags,
    isPublished,
    isDirty,
    setTitle,
    setContent,
    setExcerpt,
    setCoverImage,
    setCategory,
    setIsPublished,
    addTag,
    removeTag,
    generateExcerpt,
    getBlogData,
    reset,
    populateFromBlog,
  } = useBlogEditor({
    autoSave: false, // Disable auto-save for editing
  });

  // Load blog data on component mount
  useEffect(() => {
    const loadBlogData = async () => {
      if (!id) {
        setError("Blog ID is required");
        setIsInitialLoading(false);
        return;
      }

      try {
        setIsInitialLoading(true);
        setError(null);

        // Fetch blog data
        const blog = await getBlogById(id);

        if (blog) {
          // Populate form with blog data
          populateFromBlog(blog);
        } else {
          setError("Blog not found");
        }
      } catch (err) {
        console.error("Error loading blog:", err);
        setError(err instanceof Error ? err.message : "Failed to load blog");
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadBlogData();
  }, [id, getBlogById, populateFromBlog]);

  // Track unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(isDirty);
  }, [isDirty]);

  // Warn user about unsaved changes when leaving
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleAddTag = () => {
    if (newTag.trim()) {
      addTag(newTag.trim());
      setNewTag("");
    }
  };

  const handleSave = async (publish = null) => {
    try {
      setError(null);
      setSuccessMessage(null);
      setIsSaving(true);

      // Validate required fields
      if (!title.trim()) {
        setError("Title is required");
        return;
      }
      if (!content.trim()) {
        setError("Content is required");
        return;
      }
      if (!category) {
        setError("Category is required");
        return;
      }

      const updatedData = {
        ...getBlogData(),
        status:
          publish !== null ? (publish ? "published" : "draft") : undefined,
      };

      // Remove undefined values
      Object.keys(updatedData).forEach((key) => {
        if (updatedData[key] === undefined) {
          delete updatedData[key];
        }
      });

      const updatedBlog = await updateBlog(id, updatedData);

      if (updatedBlog) {
        setSuccessMessage(
          `Blog ${publish ? "published" : "saved"} successfully!`,
        );
        setHasUnsavedChanges(false);

        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);

        // Navigate based on publish status
        if (publish === true) {
          setTimeout(() => {
            navigate(
              `${ROUTES.BLOG_DETAILS}/${updatedBlog.slug || updatedBlog._id}`,
            );
          }, 1500);
        } else if (publish === false) {
          setTimeout(() => {
            navigate(ROUTES.MY_BLOGS);
          }, 1500);
        }
      }
    } catch (err) {
      console.error("Error saving blog:", err);
      setError(err instanceof Error ? err.message : "Failed to save blog");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    setIsPreviewOpen(true);
  };

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      // Convert file to base64 (replace with actual upload logic)
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverImage(e.target?.result);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const isFormValid =
    title.trim().length > 0 &&
    content.trim().length > 0 &&
    category &&
    category.length > 0;

  // Helper function to get category label from slug
  const getCategoryLabel = (categorySlug) => {
    return (
      BLOG_CATEGORIES.find(
        (cat) => cat.toLowerCase().replace(/\s+/g, "-") === categorySlug,
      ) || categorySlug
    );
  };

  // Prepare category options for CustomSelect
  const categoryOptions = BLOG_CATEGORIES.map((cat) => ({
    value: cat.toLowerCase().replace(/\s+/g, "-"),
    label: cat,
  }));

  // Handle category change
  const handleCategoryChange = (selectedCategory) => {
    setCategory(selectedCategory);
  };

  // Auto-save draft periodically if there are changes
  useEffect(() => {
    if (isDirty && isFormValid) {
      const autoSaveTimer = setTimeout(() => {
        handleSave(false);
      }, 30000); // Auto-save every 30 seconds

      return () => clearTimeout(autoSaveTimer);
    }
  }, [isDirty, isFormValid]);

  // Show loading spinner while fetching blog data
  if (isInitialLoading) {
    return (
      <PageWrapper className="py-8" maxWidth="4xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading blog data...</p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  // Show error state if blog couldn't be loaded
  if (error && !currentBlog) {
    return (
      <PageWrapper className="py-8" maxWidth="4xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Failed to Load Blog</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={() => navigate(ROUTES.MY_BLOGS)}
              >
                Back to My Blogs
              </Button>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PageWrapper className="py-8" maxWidth="4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate(ROUTES.MY_BLOGS)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Blogs
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Edit Blog</h1>
              {currentBlog && (
                <p className="text-sm text-muted-foreground">
                  Last updated:{" "}
                  {new Date(currentBlog.updatedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={handlePreview}
              disabled={!isFormValid}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>

            <Button
              variant="outline"
              onClick={() => handleSave(false)}
              disabled={!isFormValid || isSaving}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Draft
            </Button>

            <Button
              onClick={() => handleSave(true)}
              disabled={!isFormValid || isSaving}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Update & Publish
            </Button>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <Alert className="mb-6 border-green-200 bg-green-50 text-green-800">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Unsaved Changes Warning */}
        {hasUnsavedChanges && (
          <Alert className="mb-6 border-yellow-200 bg-yellow-50 text-yellow-800">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You have unsaved changes. Don't forget to save your work!
            </AlertDescription>
          </Alert>
        )}

        {/* Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter your blog title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-xl font-semibold"
              />
            </div>

            {/* Cover Image */}
            <div className="space-y-2">
              <Label>Cover Image</Label>

              {/* Image Upload Mode Toggle */}
              <div className="flex items-center space-x-2 mb-3">
                <Button
                  type="button"
                  variant={imageUploadMode === "url" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setImageUploadMode("url")}
                >
                  <Link className="h-4 w-4 mr-2" />
                  URL
                </Button>
                <Button
                  type="button"
                  variant={imageUploadMode === "upload" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setImageUploadMode("upload")}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>

              {imageUploadMode === "url" ? (
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  onPaste={(e) => {
                    e.stopPropagation();
                  }}
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex-1"
                  >
                    {isUploading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Image className="h-4 w-4 mr-2" />
                    )}
                    {isUploading ? "Uploading..." : "Choose Image"}
                  </Button>
                  {coverImage && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setCoverImage("")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}

              {coverImage && (
                <div className="mt-2">
                  <img
                    src={coverImage}
                    alt="Cover preview"
                    className="w-full h-48 object-cover rounded-md border"
                    onError={() => {
                      setCoverImage("");
                      setError(
                        "Failed to load image. Please check the URL or try a different image.",
                      );
                    }}
                  />
                </div>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <CustomSelect
                value={category}
                onValueChange={handleCategoryChange}
                placeholder="Select a category..."
                options={categoryOptions}
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                placeholder="Write your blog content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[400px] resize-none"
                onPaste={(e) => {
                  e.stopPropagation();
                }}
              />
              <p className="text-sm text-muted-foreground">
                {content.length} characters
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Blog Status */}
            {currentBlog && (
              <div className="p-4 border rounded-lg space-y-4">
                <h3 className="font-semibold">Blog Status</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status:</span>
                    <Badge
                      variant={
                        currentBlog.status === "published"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {currentBlog.status || "draft"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Views:</span>
                    <span className="text-sm text-muted-foreground">
                      {currentBlog.views || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Likes:</span>
                    <span className="text-sm text-muted-foreground">
                      {currentBlog.likes?.length || 0}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Publish Settings */}
            <div className="p-4 border rounded-lg space-y-4">
              <h3 className="font-semibold">Publish Settings</h3>

              <div className="flex items-center justify-between">
                <Label htmlFor="published">Publish after update</Label>
                <Switch
                  id="published"
                  checked={isPublished}
                  onCheckedChange={setIsPublished}
                />
              </div>

              {/* Category Display */}
              {category && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Selected Category
                  </Label>
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="secondary" className="text-xs">
                      {getCategoryLabel(category)}
                    </Badge>
                  </div>
                </div>
              )}

              {hasUnsavedChanges && (
                <p className="text-sm text-muted-foreground">
                  You have unsaved changes
                </p>
              )}
            </div>

            {/* Excerpt */}
            <div className="p-4 border rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Excerpt</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateExcerpt}
                  disabled={!content.trim()}
                >
                  Auto-generate
                </Button>
              </div>

              <Textarea
                placeholder="Brief description of your blog..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="resize-none"
                rows={3}
                maxLength={200}
              />
              <p className="text-sm text-muted-foreground">
                {excerpt.length}/200 characters
              </p>
            </div>

            {/* Tags */}
            <div className="p-4 border rounded-lg space-y-4">
              <h3 className="font-semibold">Tags</h3>

              <div className="flex space-x-2">
                <Input
                  placeholder="Add a tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  maxLength={50}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddTag}
                  disabled={!newTag.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="group">
                      {tag}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-auto p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        <BlogPreviewModal
          blogData={getBlogData()}
          isOpen={isPreviewOpen}
          onOpenChange={setIsPreviewOpen}
        />
      </PageWrapper>
    </div>
  );
};

export default EditBlog;
