import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { DocumentAssistantChat } from "./DocumentAssistantChat";

interface EditorWithChatProps {
  children: React.ReactNode;
  onSendMessage: (message: string) => Promise<string>;
  isLoading?: boolean;
  previewContent?: React.ReactNode;
  chatSuggestions?: string[];
}

export function EditorWithChat({
  children,
  onSendMessage,
  isLoading,
  previewContent,
  chatSuggestions
}: EditorWithChatProps) {
  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-[600px] rounded-lg">
      {/* Main Content Panel */}
      <ResizablePanel defaultSize={60} minSize={40}>
        <div className="h-full overflow-auto">
          {children}
        </div>
      </ResizablePanel>
      
      <ResizableHandle withHandle />
      
      {/* Chat Panel */}
      <ResizablePanel defaultSize={40} minSize={25}>
        <DocumentAssistantChat
          onSendMessage={onSendMessage}
          isLoading={isLoading}
          previewContent={previewContent}
          suggestions={chatSuggestions}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
