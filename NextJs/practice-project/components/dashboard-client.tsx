'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogOut, User, Plus, Trash2, Edit, Loader2, AlertCircle, Database, Settings, BarChart3, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { DataItem } from '@/lib/api/posts';
import { createPostAction, updatePostAction, deletePostAction, refreshPostsAction } from '@/lib/actions/posts';
import { useRouter } from 'next/navigation';

interface DashboardClientProps {
  initialPosts: DataItem[];
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

export default function DashboardClient({ initialPosts, currentPage, itemsPerPage, totalItems }: DashboardClientProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [posts, setPosts] = useState<DataItem[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const [localCreatedPosts, setLocalCreatedPosts] = useState<DataItem[]>([]);
  const [localUpdatedPosts, setLocalUpdatedPosts] = useState<Map<string, DataItem>>(new Map());

  // Sync state with server data when it's refreshed, applying local overrides
  useEffect(() => {
    // 1. Start with server posts
    let filteredPosts = initialPosts.filter(p => !deletedIds.has(p.id));

    // 2. Apply updates to server posts
    filteredPosts = filteredPosts.map(p => localUpdatedPosts.has(p.id) ? localUpdatedPosts.get(p.id)! : p);

    // 3. Add locally created posts (that aren't deleted)
    const newPosts = localCreatedPosts.filter(p => !deletedIds.has(p.id));

    // 4. Combine and update state
    setPosts([...newPosts, ...filteredPosts]);
  }, [initialPosts, deletedIds, localCreatedPosts, localUpdatedPosts]);

  // Form states
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Optimistic update helpers
  const getOptimisticPost = (basePost: DataItem, updates?: Partial<DataItem>): DataItem => ({
    ...basePost,
    ...updates,
    updatedAt: new Date().toISOString(),
  });

  // Create post with optimistic update
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;

    setError('');
    setSuccess('');
    setFormLoading(true);

    // Optimistic update - add temporary post
    const tempId = `temp-${Date.now()}`;
    const optimisticPost: DataItem = {
      id: tempId,
      title: formData.title,
      description: formData.description,
      userId: session?.user?.id || '1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setPosts(prev => [optimisticPost, ...prev]);

    try {
      const result = await createPostAction({
        title: formData.title,
        description: formData.description,
        userId: session?.user?.id || '1',
      });

      if (result.success && result.post) {
        // Persist the new post locally
        setLocalCreatedPosts(prev => [result.post!, ...prev]);
        setSuccess('Post created successfully!');
        setFormData({ title: '', description: '' });
      } else {
        throw new Error(result.error || 'Failed to create post');
      }
    } catch (error: any) {
      // Rollback on error
      setPosts(prev => prev.filter(p => p.id !== tempId));
      setError(error.message || 'Failed to create post');
    } finally {
      setFormLoading(false);
    }
  };

  // Update post with optimistic update
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost || (!formData.title && !formData.description)) return;

    setError('');
    setSuccess('');
    setFormLoading(true);

    // Store original post for rollback
    const originalPost = posts.find(p => p.id === editingPost);
    if (!originalPost) return;

    // Optimistic update
    const optimisticPost = getOptimisticPost(originalPost, {
      title: formData.title || originalPost.title,
      description: formData.description || originalPost.description,
    });

    setPosts(prev => prev.map(p => p.id === editingPost ? optimisticPost : p));

    try {
      const result = await updatePostAction(editingPost, {
        title: formData.title,
        description: formData.description,
      });

      if (result.success && result.post) {
        // Persist the update locally
        setLocalUpdatedPosts(prev => new Map(prev).set(editingPost, result.post!));
        setSuccess('Post updated successfully!');
        setFormData({ title: '', description: '' });
        setEditingPost(null);
      } else {
        throw new Error(result.error || 'Failed to update post');
      }
    } catch (error: any) {
      // Rollback on error
      setPosts(prev => prev.map(p => p.id === editingPost ? originalPost : p));
      setError(error.message || 'Failed to update post');
    } finally {
      setFormLoading(false);
    }
  };

  // Delete post with optimistic update
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    setError('');
    setSuccess('');

    // Store original post for rollback
    const originalPost = posts.find(p => p.id === id);
    if (!originalPost) return;

    // Optimistic update - remove immediately
    setPosts(prev => prev.filter(p => p.id !== id));

    try {
      const result = await deletePostAction(id);
      if (result.success) {
        // Persist the delete locally since the mock API doesn't actually delete
        setDeletedIds(prev => new Set(prev).add(id));
        setSuccess('Post deleted successfully!');
      } else {
        throw new Error(result.error || 'Failed to delete post');
      }
    } catch (error: any) {
      // Rollback on error
      setPosts(prev => [...prev, originalPost]);
      setError(error.message || 'Failed to delete post');
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    const url = new URL(window.location.href);
    url.searchParams.set('page', page.toString());
    router.push(url.toString());
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  // Edit post
  const handleEdit = (post: DataItem) => {
    setFormData({ title: post.title, description: post.description });
    setEditingPost(post.id);
  };

  // Refresh data from server (bypasses cache)
  const handleRefresh = async () => {
    setError('');
    setSuccess('');
    setRefreshing(true);

    try {
      // Trigger server-side revalidation using Server Action
      await refreshPostsAction();
      // Refresh the page data
      router.refresh();
      setSuccess('Data refreshed from server!');
    } catch (error: any) {
      setError(error.message || 'Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  // Sign out
  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard </h1>
                <p className="text-sm text-gray-500">Welcome back, {session?.user?.name}</p>
              </div>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="border-gray-300 hover:bg-gray-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Alerts */}
        {error && (
          <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <AlertCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-900">Success</AlertTitle>
            <AlertDescription className="text-green-700">{success}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Posts</p>
                  <p className="text-3xl font-bold">{totalItems}</p>
                </div>
                <Database className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Cache Status</p>
                  <p className="text-3xl font-bold">Active</p>
                </div>
                <Settings className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Optimistic UI</p>
                  <p className="text-3xl font-bold">Enabled</p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* User Profile Card */}
          <Card className="lg:col-span-1">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center mb-6">
                {session?.user?.image ? (
                  <img
                    src={session.user.image}
                    alt="Profile"
                    className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <User className="w-10 h-10 text-white" />
                  </div>
                )}
                <h3 className="font-semibold text-lg text-gray-900">{session?.user?.name}</h3>
                <p className="text-sm text-gray-500">{session?.user?.email}</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Account Type</span>
                  <span className="text-sm font-medium text-gray-900">Premium</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Cache Layer</span>
                  <span className="text-sm font-medium text-blue-600">Next.js 16</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className="text-sm font-medium text-green-600">Active</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Management Card */}
          <Card className="lg:col-span-2">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <BarChart3 className="h-5 w-5" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {/* Form */}
              <form onSubmit={editingPost ? handleUpdate : handleCreate} className="space-y-4 mb-8 p-6 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-800 mb-4">
                  {editingPost ? 'Edit Post' : 'Create New Post'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-gray-700 font-medium">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter post title"
                      required
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-gray-700 font-medium">Description</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter post description"
                      required
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={formLoading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingPost ? 'Update Post' : 'Create Post'}
                  </Button>
                  {editingPost && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditingPost(null);
                        setFormData({ title: '', description: '' });
                      }}
                      className="border-gray-300 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>

              {/* Posts List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">Your Posts ({totalItems})</h3>
                  <Button
                    onClick={handleRefresh}
                    variant="outline"
                    size="sm"
                    disabled={refreshing}
                    className="border-gray-300 hover:bg-gray-50"
                  >
                    <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>

                {posts.length === 0 ? (
                  <div className="text-center py-12">
                    <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No posts found. Create your first post!</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {posts.map((post) => (
                      <Card key={post.id} className="border border-gray-200 hover:border-blue-300 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-2">{post.title}</h4>
                              <p className="text-gray-600 text-sm mb-2">{post.description}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>ID: {post.id}</span>
                                <span>Updated: {new Date(post.updatedAt).toLocaleTimeString()}</span>
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(post)}
                                className="border-gray-300 hover:bg-gray-50"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(post.id)}
                                className="border-gray-300 hover:bg-gray-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Pagination Controls */}
                <div className="mt-8 ml-90 flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 pt-6 gap-4">

                  <div className="flex items-center gap-1 order-1 sm:order-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage <= 1}
                      onClick={() => goToPage(currentPage - 1)}
                      className="border-gray-300 h-9 w-9 p-0"
                    >
                      <span className="sr-only">Previous</span>
                      &lt;
                    </Button>

                    {getPageNumbers().map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(page)}
                        className={`h-9 w-9 p-0 ${currentPage === page ? "bg-blue-600 hover:bg-blue-700" : "border-gray-300"}`}
                      >
                        {page}
                      </Button>
                    ))}

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage >= totalPages}
                      onClick={() => goToPage(currentPage + 1)}
                      className="border-gray-300 h-9 w-9 p-0"
                    >
                      <span className="sr-only">Next</span>
                      &gt;
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
