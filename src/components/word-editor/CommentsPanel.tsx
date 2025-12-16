import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { X, MessageSquare, Send, Trash2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Comment {
  id: string;
  author: string;
  authorEmail: string;
  content: string;
  createdAt: Date;
  resolved: boolean;
  replies: CommentReply[];
}

export interface CommentReply {
  id: string;
  author: string;
  authorEmail: string;
  content: string;
  createdAt: Date;
}

interface CommentsPanelProps {
  open: boolean;
  onClose: () => void;
  comments: Comment[];
  onAddComment: (content: string) => void;
  onResolveComment: (id: string) => void;
  onDeleteComment: (id: string) => void;
  onReplyToComment: (id: string, content: string) => void;
  currentUserEmail: string;
}

export function CommentsPanel({
  open,
  onClose,
  comments,
  onAddComment,
  onResolveComment,
  onDeleteComment,
  onReplyToComment,
  currentUserEmail,
}: CommentsPanelProps) {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  const handleReply = (commentId: string) => {
    if (replyContent.trim()) {
      onReplyToComment(commentId, replyContent.trim());
      setReplyContent('');
      setReplyingTo(null);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getInitials = (email: string) => {
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  if (!open) return null;

  const unresolvedComments = comments.filter(c => !c.resolved);
  const resolvedComments = comments.filter(c => c.resolved);

  return (
    <div className="w-80 border-l bg-card flex flex-col h-full">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          <span className="font-medium">Comments</span>
          <span className="text-xs text-muted-foreground">
            ({unresolvedComments.length})
          </span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Add new comment */}
          <div className="space-y-2">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[80px] text-sm resize-none"
            />
            <Button
              size="sm"
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="w-full"
            >
              <Send className="h-3 w-3 mr-1" />
              Add Comment
            </Button>
          </div>

          {/* Unresolved comments */}
          {unresolvedComments.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-medium text-muted-foreground uppercase">
                Open
              </h4>
              {unresolvedComments.map((comment) => (
                <div
                  key={comment.id}
                  className="border rounded-lg p-3 space-y-2 bg-background"
                >
                  <div className="flex items-start gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-[10px] bg-primary text-primary-foreground">
                        {getInitials(comment.authorEmail)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium truncate">
                          {comment.author}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{comment.content}</p>
                    </div>
                  </div>

                  {/* Replies */}
                  {comment.replies.length > 0 && (
                    <div className="ml-6 space-y-2 border-l-2 pl-3">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="space-y-1">
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-medium">
                              {reply.author}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {formatDate(reply.createdAt)}
                            </span>
                          </div>
                          <p className="text-xs">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply input */}
                  {replyingTo === comment.id ? (
                    <div className="ml-6 space-y-2">
                      <Textarea
                        placeholder="Write a reply..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        className="min-h-[60px] text-xs resize-none"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyContent('');
                          }}
                          className="text-xs h-7"
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleReply(comment.id)}
                          disabled={!replyContent.trim()}
                          className="text-xs h-7"
                        >
                          Reply
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 ml-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setReplyingTo(comment.id)}
                        className="text-xs h-7"
                      >
                        Reply
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onResolveComment(comment.id)}
                        className="text-xs h-7 text-green-600"
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Resolve
                      </Button>
                      {comment.authorEmail === currentUserEmail && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteComment(comment.id)}
                          className="text-xs h-7 text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Resolved comments */}
          {resolvedComments.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-medium text-muted-foreground uppercase">
                Resolved ({resolvedComments.length})
              </h4>
              {resolvedComments.map((comment) => (
                <div
                  key={comment.id}
                  className="border rounded-lg p-3 bg-muted/30 opacity-70"
                >
                  <div className="flex items-start gap-2">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="text-[8px]">
                        {getInitials(comment.authorEmail)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <span className="text-xs text-muted-foreground line-through">
                        {comment.content}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {comments.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No comments yet</p>
              <p className="text-xs">Add a comment to start a discussion</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
