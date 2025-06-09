// import React, { useState } from "react";
// import { PageWrapper } from "@/components/layout/PageWrapper";
// import { 
//   PlusCircle, 
//   Edit3, 
//   Eye, 
//   Heart, 
//   MessageCircle, 
//   Users, 
//   TrendingUp, 
//   Calendar,
//   Settings,
//   BarChart3,
//   FileText,
//   Clock,
//   Globe
// } from "lucide-react";

// export const Dashboard = () => {
//   const [selectedPeriod, setSelectedPeriod] = useState('7d');

//   // Mock data - in real app, this would come from API
//   const stats = {
//     totalPosts: 24,
//     totalViews: 12845,
//     totalLikes: 1567,
//     totalComments: 342,
//     subscribers: 892
//   };

//   const recentPosts = [
//     {
//       id: 1,
//       title: "Getting Started with React Hooks",
//       status: "published",
//       views: 1234,
//       likes: 89,
//       comments: 23,
//       publishedAt: "2 days ago"
//     },
//     {
//       id: 2,
//       title: "Advanced CSS Techniques",
//       status: "draft",
//       views: 0,
//       likes: 0,
//       comments: 0,
//       publishedAt: null
//     },
//     {
//       id: 3,
//       title: "JavaScript Performance Tips",
//       status: "published",
//       views: 2156,
//       likes: 145,
//       comments: 34,
//       publishedAt: "5 days ago"
//     },
//     {
//       id: 4,
//       title: "Building Responsive Layouts",
//       status: "published",
//       views: 876,
//       likes: 67,
//       comments: 12,
//       publishedAt: "1 week ago"
//     }
//   ];

//   const analyticsData = [
//     { day: 'Mon', views: 120, likes: 15 },
//     { day: 'Tue', views: 180, likes: 23 },
//     { day: 'Wed', views: 250, likes: 31 },
//     { day: 'Thu', views: 200, likes: 28 },
//     { day: 'Fri', views: 320, likes: 45 },
//     { day: 'Sat', views: 280, likes: 38 },
//     { day: 'Sun', views: 190, likes: 25 }
//   ];

//   const StatCard = ({ icon: Icon, title, value, change, color = "blue" }) => (
//     <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-sm font-medium text-gray-600">{title}</p>
//           <p className="text-2xl font-bold text-gray-900 mt-1">{value.toLocaleString()}</p>
//           {change && (
//             <p className={`text-sm mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
//               {change >= 0 ? '+' : ''}{change}% from last week
//             </p>
//           )}
//         </div>
//         <div className={`p-3 rounded-full bg-${color}-50`}>
//           <Icon className={`h-6 w-6 text-${color}-600`} />
//         </div>
//       </div>
//     </div>
//   );

//   const PostRow = ({ post }) => (
//     <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
//       <div className="flex-1">
//         <h3 className="font-medium text-gray-900">{post.title}</h3>
//         <div className="flex items-center space-x-4 mt-1">
//           <span className={`px-2 py-1 text-xs rounded-full ${
//             post.status === 'published' 
//               ? 'bg-green-100 text-green-800' 
//               : post.status === 'draft'
//               ? 'bg-yellow-100 text-yellow-800'
//               : 'bg-gray-100 text-gray-800'
//           }`}>
//             {post.status}
//           </span>
//           {post.publishedAt && (
//             <span className="text-sm text-gray-500">{post.publishedAt}</span>
//           )}
//         </div>
//       </div>
//       <div className="flex items-center space-x-6 text-sm text-gray-600">
//         <div className="flex items-center space-x-1">
//           <Eye className="h-4 w-4" />
//           <span>{post.views}</span>
//         </div>
//         <div className="flex items-center space-x-1">
//           <Heart className="h-4 w-4" />
//           <span>{post.likes}</span>
//         </div>
//         <div className="flex items-center space-x-1">
//           <MessageCircle className="h-4 w-4" />
//           <span>{post.comments}</span>
//         </div>
//         <button className="p-1 hover:bg-gray-200 rounded">
//           <Edit3 className="h-4 w-4" />
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <PageWrapper className="py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
//             <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your blog.</p>
//           </div>
//           <div className="flex items-center space-x-3 mt-4 sm:mt-0">
//             <select 
//               value={selectedPeriod}
//               onChange={(e) => setSelectedPeriod(e.target.value)}
//               className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="7d">Last 7 days</option>
//               <option value="30d">Last 30 days</option>
//               <option value="90d">Last 90 days</option>
//             </select>
//           </div>
//         </div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
//           <StatCard 
//             icon={FileText} 
//             title="Total Posts" 
//             value={stats.totalPosts} 
//             change={12}
//             color="blue"
//           />
//           <StatCard 
//             icon={Eye} 
//             title="Total Views" 
//             value={stats.totalViews} 
//             change={8}
//             color="green"
//           />
//           <StatCard 
//             icon={Heart} 
//             title="Total Likes" 
//             value={stats.totalLikes} 
//             change={15}
//             color="red"
//           />
//           <StatCard 
//             icon={MessageCircle} 
//             title="Comments" 
//             value={stats.totalComments} 
//             change={-3}
//             color="purple"
//           />
//           <StatCard 
//             icon={Users} 
//             title="Subscribers" 
//             value={stats.subscribers} 
//             change={22}
//             color="indigo"
//           />
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Recent Posts */}
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-lg shadow-sm border">
//               <div className="p-6 border-b border-gray-200">
//                 <div className="flex items-center justify-between">
//                   <h2 className="text-lg font-semibold text-gray-900">Recent Posts</h2>
//                   <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
//                     View all
//                   </button>
//                 </div>
//               </div>
//               <div className="divide-y divide-gray-200">
//                 {recentPosts.map((post) => (
//                   <PostRow key={post.id} post={post} />
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Quick Actions & Analytics */}
//           <div className="space-y-8">
//             {/* Quick Actions */}
//             <div className="bg-white rounded-lg shadow-sm border p-6">
//               <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
//               <div className="space-y-3">
//                 <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
//                   <PlusCircle className="h-5 w-5 text-blue-600" />
//                   <span className="font-medium">Create New Post</span>
//                 </button>
//                 <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
//                   <BarChart3 className="h-5 w-5 text-green-600" />
//                   <span className="font-medium">View Analytics</span>
//                 </button>
//                 <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
//                   <Users className="h-5 w-5 text-purple-600" />
//                   <span className="font-medium">Manage Subscribers</span>
//                 </button>
//                 <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
//                   <Settings className="h-5 w-5 text-gray-600" />
//                   <span className="font-medium">Blog Settings</span>
//                 </button>
//               </div>
//             </div>

//             {/* Mini Analytics */}
//             <div className="bg-white rounded-lg shadow-sm border p-6">
//               <h2 className="text-lg font-semibold text-gray-900 mb-4">This Week</h2>
//               <div className="space-y-4">
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-600">Views</span>
//                   <span className="font-semibold">1,847</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div className="bg-blue-600 h-2 rounded-full" style={{width: '72%'}}></div>
//                 </div>
                
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-600">Engagement</span>
//                   <span className="font-semibold">8.4%</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div className="bg-green-600 h-2 rounded-full" style={{width: '84%'}}></div>
//                 </div>

//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-600">New Subscribers</span>
//                   <span className="font-semibold">23</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div className="bg-purple-600 h-2 rounded-full" style={{width: '46%'}}></div>
//                 </div>
//               </div>
//             </div>

//             {/* Recent Activity */}
//             <div className="bg-white rounded-lg shadow-sm border p-6">
//               <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
//               <div className="space-y-3">
//                 <div className="flex items-start space-x-3">
//                   <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
//                   <div className="flex-1">
//                     <p className="text-sm text-gray-900">New comment on "React Hooks"</p>
//                     <p className="text-xs text-gray-500">2 minutes ago</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start space-x-3">
//                   <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
//                   <div className="flex-1">
//                     <p className="text-sm text-gray-900">3 new subscribers</p>
//                     <p className="text-xs text-gray-500">1 hour ago</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start space-x-3">
//                   <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
//                   <div className="flex-1">
//                     <p className="text-sm text-gray-900">Post "CSS Techniques" published</p>
//                     <p className="text-xs text-gray-500">3 hours ago</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </PageWrapper>
//   );
// };

// export default Dashboard;

import React, { useState } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import {
  PlusCircle,
  Edit3,
  Eye,
  Heart,
  MessageCircle,
  Users,
  TrendingUp,
  Calendar,
  Settings,
  BarChart3,
  FileText,
} from "lucide-react";

export const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("7d");

  const stats = {
    totalPosts: 24,
    totalViews: 12845,
    totalLikes: 1567,
    totalComments: 342,
    subscribers: 892,
  };

  const recentPosts = [
    {
      id: 1,
      title: "Getting Started with React Hooks",
      status: "published",
      views: 1234,
      likes: 89,
      comments: 23,
      publishedAt: "2 days ago",
    },
    {
      id: 2,
      title: "Advanced CSS Techniques",
      status: "draft",
      views: 0,
      likes: 0,
      comments: 0,
      publishedAt: null,
    },
    {
      id: 3,
      title: "JavaScript Performance Tips",
      status: "published",
      views: 2156,
      likes: 145,
      comments: 34,
      publishedAt: "5 days ago",
    },
    {
      id: 4,
      title: "Building Responsive Layouts",
      status: "published",
      views: 876,
      likes: 67,
      comments: 12,
      publishedAt: "1 week ago",
    },
  ];

  const StatCard = ({ icon: Icon, title, value, change, color = "blue" }) => (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value.toLocaleString()}</p>
          {change !== undefined && (
            <p className={`text-sm mt-1 ${change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {change >= 0 ? '+' : ''}{change}% from last week
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-50 dark:bg-${color}-900/20`}>
          <Icon className={`h-6 w-6 text-${color}-600 dark:text-${color}-400`} />
        </div>
      </div>
    </div>
  );

  const PostRow = ({ post }) => (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
      <div className="flex-1">
        <h3 className="font-medium text-gray-900 dark:text-white">{post.title}</h3>
        <div className="flex items-center space-x-4 mt-1">
          <span className={`px-2 py-1 text-xs rounded-full ${
            post.status === 'published'
              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300'
              : post.status === 'draft'
              ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
          }`}>
            {post.status}
          </span>
          {post.publishedAt && (
            <span className="text-sm text-gray-500 dark:text-gray-400">{post.publishedAt}</span>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center space-x-1">
          <Eye className="h-4 w-4" />
          <span>{post.views}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Heart className="h-4 w-4" />
          <span>{post.likes}</span>
        </div>
        <div className="flex items-center space-x-1">
          <MessageCircle className="h-4 w-4" />
          <span>{post.comments}</span>
        </div>
        <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
          <Edit3 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  return (
    <PageWrapper className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back! Here's what's happening with your blog.</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard icon={FileText} title="Total Posts" value={stats.totalPosts} change={12} color="blue" />
          <StatCard icon={Eye} title="Total Views" value={stats.totalViews} change={8} color="green" />
          <StatCard icon={Heart} title="Total Likes" value={stats.totalLikes} change={15} color="red" />
          <StatCard icon={MessageCircle} title="Comments" value={stats.totalComments} change={-3} color="purple" />
          <StatCard icon={Users} title="Subscribers" value={stats.subscribers} change={22} color="indigo" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Posts */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Posts</h2>
                  <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
                    View all
                  </button>
                </div>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentPosts.map((post) => (
                  <PostRow key={post.id} post={post} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Side Cards */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <PlusCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium">Create New Post</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <BarChart3 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="font-medium">View Analytics</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <span className="font-medium">Manage Subscribers</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <span className="font-medium">Blog Settings</span>
                </button>
              </div>
            </div>

            {/* Mini Analytics */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">This Week</h2>
              <div className="space-y-4">
                {[
                  { label: "Views", value: "1,847", width: "72%", color: "bg-blue-600" },
                  { label: "Engagement", value: "8.4%", width: "84%", color: "bg-green-600" },
                  { label: "New Subscribers", value: "23", width: "46%", color: "bg-purple-600" },
                ].map(({ label, value, width, color }) => (
                  <div key={label}>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{value}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                      <div className={`${color} h-2 rounded-full`} style={{ width }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
              <div className="space-y-3 text-sm">
                {[
                  { color: "bg-green-500", text: 'New comment on "React Hooks"', time: "2 minutes ago" },
                  { color: "bg-blue-500", text: "3 new subscribers", time: "1 hour ago" },
                  { color: "bg-purple-500", text: 'Post "CSS Techniques" published', time: "3 hours ago" },
                ].map(({ color, text, time }, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${color}`}></div>
                    <div className="flex-1">
                      <p className="text-gray-900 dark:text-white">{text}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Dashboard;
