import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Note } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus, Trash2, StickyNote } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface NotesSidebarProps {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
  selectedText?: string;
  onCreateNote?: (noteContent: string) => void;
}

export function NotesSidebar({ postId, isOpen, onClose, selectedText, onCreateNote }: NotesSidebarProps) {
  const [newNoteContent, setNewNoteContent] = useState("");
  const { toast } = useToast();

  const { data: notes, isLoading } = useQuery<Note[]>({
    queryKey: ["/api/posts", postId, "notes"],
    enabled: !!postId && isOpen,
    staleTime: 1000 * 60 * 5,
  });

  const createNoteMutation = useMutation({
    mutationFn: async (noteData: { selectedText: string; noteContent: string; startOffset: string; endOffset: string }) => {
      const response = await fetch(`/api/posts/${postId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(noteData),
      });
      
      if (!response.ok) {
        throw new Error("Failed to create note");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts", postId, "notes"] });
      setNewNoteContent("");
      toast({
        title: "Note created!",
        description: "Your note has been saved successfully.",
      });
      if (onCreateNote) {
        onCreateNote(newNoteContent);
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create note. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: async (noteId: string) => {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete note");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts", postId, "notes"] });
      toast({
        title: "Note deleted",
        description: "Your note has been removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete note. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreateNote = () => {
    if (!newNoteContent.trim()) {
      toast({
        title: "Error", 
        description: "Please enter note content.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedText) {
      toast({
        title: "Error",
        description: "Please select text first to create a note.",
        variant: "destructive",
      });
      return;
    }

    createNoteMutation.mutate({
      selectedText,
      noteContent: newNoteContent,
      startOffset: "0", // These would be populated by text selection logic
      endOffset: "0",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 shadow-lg z-50 overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <StickyNote className="w-5 h-5" />
            Notes
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            data-testid="close-notes-sidebar"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Create New Note */}
        {selectedText && (
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Create Note</CardTitle>
              <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded italic">
                "{selectedText}"
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Write your note..."
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                className="mb-3"
                rows={3}
                data-testid="new-note-input"
              />
              <Button
                onClick={handleCreateNote}
                disabled={createNoteMutation.isPending}
                className="w-full"
                data-testid="create-note-button"
              >
                <Plus className="w-4 h-4 mr-2" />
                {createNoteMutation.isPending ? "Creating..." : "Create Note"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Existing Notes */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Existing Notes ({notes?.length || 0})
          </h3>
          
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : notes && notes.length > 0 ? (
            notes.map((note) => (
              <Card key={note.id} className="text-sm" data-testid={`note-${note.id}`}>
                <CardContent className="p-3">
                  <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded mb-2 italic">
                    "{note.selectedText}"
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    {note.noteContent}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(note.createdAt || new Date()).toLocaleDateString()}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteNoteMutation.mutate(note.id)}
                      disabled={deleteNoteMutation.isPending}
                      className="h-6 w-6 text-red-500 hover:text-red-700"
                      data-testid={`delete-note-${note.id}`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <StickyNote className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notes yet.</p>
              <p className="text-xs">Select text to create your first note.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}